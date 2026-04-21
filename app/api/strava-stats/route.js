import { Redis } from '@upstash/redis'
import PostHogClient from '../../posthog'

export const dynamic = 'force-dynamic'

const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
    : null

let cachedAccessToken = null
let tokenExpiresAt = 0

async function getRefreshToken() {
  if (redis) {
    const stored = await redis.get('strava_refresh_token').catch(() => null)
    if (stored) return stored
  }
  return process.env.STRAVA_REFRESH_TOKEN
}

async function getAccessToken() {
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedAccessToken
  }

  const refreshToken = await getRefreshToken()
  if (!refreshToken) throw new Error('STRAVA_REFRESH_TOKEN not set')

  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_SECRET,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Strava token refresh failed (${res.status}): ${body}`)
  }

  const data = await res.json()
  cachedAccessToken = data.access_token
  tokenExpiresAt = data.expires_at
    ? data.expires_at * 1000
    : Date.now() + 21600000

  if (data.refresh_token && redis) {
    await redis.set('strava_refresh_token', data.refresh_token).catch(() => {})
  }

  return cachedAccessToken
}

function metersToMiles(m) {
  return +(m * 0.000621371).toFixed(1)
}

// Redis cache TTLs per period (seconds)
const CACHE_TTL = {
  week: 900,    // 15 min
  month: 1800,  // 30 min
  year: 3600,   // 1 hour
  all: 3600,    // 1 hour
}

function redisCacheKey(period) {
  return `strava_stats:${period}`
}

async function getCachedResult(period) {
  if (!redis) return null
  const cached = await redis.get(redisCacheKey(period)).catch(() => null)
  return cached
}

async function setCachedResult(period, result) {
  if (!redis) return
  await redis
    .set(redisCacheKey(period), JSON.stringify(result), {
      ex: CACHE_TTL[period] || 1800,
    })
    .catch(() => {})
}

function getPeriodStart(period) {
  const now = new Date()
  switch (period) {
    case 'week':
      return Math.floor(new Date(now - 7 * 86400000).getTime() / 1000)
    case 'month':
      return Math.floor(new Date(now - 30 * 86400000).getTime() / 1000)
    case 'year':
      return Math.floor(
        new Date(now.getFullYear(), 0, 1).getTime() / 1000
      )
    default:
      return 0
  }
}

async function fetchAllActivities(accessToken, after, maxPages = 15) {
  const activities = []
  let page = 1
  const perPage = 200

  while (page <= maxPages) {
    const url = new URL('https://www.strava.com/api/v3/athlete/activities')
    url.searchParams.set('per_page', perPage)
    url.searchParams.set('page', page)
    if (after) url.searchParams.set('after', after)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })

    if (!res.ok) {
      if (res.status === 401) throw new Error('activity:read scope required')
      throw new Error(`Activities fetch failed: ${res.status}`)
    }

    const batch = await res.json()
    if (!batch.length) break

    activities.push(...batch)
    if (batch.length < perPage) break
    page++
  }

  return activities
}

const TYPE_LABELS = {
  WeightTraining: 'Weights',
  VirtualRide: 'Virtual Ride',
  VirtualRun: 'Virtual Run',
  TrailRun: 'Trail Run',
  MountainBikeRide: 'MTB',
  GravelRide: 'Gravel Ride',
  EBikeRide: 'E-Bike',
  StairStepper: 'Stairs',
  RockClimbing: 'Climbing',
  NordicSki: 'Nordic Ski',
  AlpineSki: 'Alpine Ski',
  BackcountrySki: 'Backcountry',
  IceSkate: 'Ice Skate',
  InlineSkate: 'Inline Skate',
  StandUpPaddling: 'SUP',
}

function displayType(raw) {
  if (TYPE_LABELS[raw]) return TYPE_LABELS[raw]
  return raw.replace(/([a-z])([A-Z])/g, '$1 $2')
}

function aggregateActivities(activities) {
  let totalDistance = 0
  let totalMovingTime = 0
  const byType = {}

  for (const a of activities) {
    const type = a.sport_type || a.type || 'Other'
    totalDistance += a.distance || 0
    totalMovingTime += a.moving_time || 0

    if (!byType[type]) {
      byType[type] = { count: 0, distance: 0, movingTime: 0 }
    }
    byType[type].count++
    byType[type].distance += a.distance || 0
    byType[type].movingTime += a.moving_time || 0
  }

  const breakdown = Object.entries(byType)
    .map(([type, data]) => ({
      type: displayType(type),
      count: data.count,
      distance: metersToMiles(data.distance),
      movingTime: data.movingTime,
    }))
    .sort((a, b) => b.count - a.count)

  return {
    distance: metersToMiles(totalDistance),
    count: activities.length,
    movingTime: totalMovingTime,
    breakdown,
  }
}

export async function GET(request) {
  const posthog = PostHogClient()
  const distinctId =
    request.headers.get('x-posthog-distinct-id') || 'server_anonymous'

  const url = new URL(request.url)
  const period = url.searchParams.get('period') || 'all'

  try {
    // Check Redis cache first
    const cached = await getCachedResult(period)
    if (cached) {
      const parsed = typeof cached === 'string' ? JSON.parse(cached) : cached
      return Response.json(parsed, {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      })
    }

    const accessToken = await getAccessToken()

    const after = period !== 'all' ? getPeriodStart(period) : 0
    const activities = await fetchAllActivities(accessToken, after || null)
    const result = aggregateActivities(activities)
    result.period = period

    // Cache the result in Redis
    await setCachedResult(period, result)

    posthog.capture({
      distinctId,
      event: 'strava_stats_fetched',
      properties: {
        period,
        total_miles: result.distance,
        total_activities: result.count,
        source: 'api',
      },
    })

    return Response.json(result, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch (error) {
    // Fallback: if activity:read scope missing, use athlete stats endpoint
    if (error.message?.includes('scope required') || error.message?.includes('401')) {
      try {
        return await fallbackToAthleteStats(request, posthog, distinctId, period)
      } catch (fallbackError) {
        // Fall through to error response
      }
    }

    posthog.capture({
      distinctId,
      event: 'strava_stats_error',
      properties: { error_message: error?.message, period, source: 'api' },
    })

    return Response.json({
      distance: null,
      count: null,
      movingTime: null,
      breakdown: [],
      period,
      fallback: true,
    })
  }
}

async function fallbackToAthleteStats(request, posthog, distinctId, period) {
  const accessToken = await getAccessToken()

  const athleteRes = await fetch('https://www.strava.com/api/v3/athlete', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!athleteRes.ok) throw new Error(`Athlete fetch failed: ${athleteRes.status}`)
  const athlete = await athleteRes.json()

  const statsRes = await fetch(
    `https://www.strava.com/api/v3/athletes/${athlete.id}/stats`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  if (!statsRes.ok) throw new Error(`Stats fetch failed: ${statsRes.status}`)
  const stats = await statsRes.json()

  const prefix = period === 'year' ? 'ytd' : period === 'month' ? 'recent' : 'all'
  const rideKey = `${prefix}_ride_totals`
  const runKey = `${prefix}_run_totals`
  const swimKey = `${prefix}_swim_totals`

  const ride = stats[rideKey] || stats.all_ride_totals || {}
  const run = stats[runKey] || stats.all_run_totals || {}
  const swim = stats[swimKey] || stats.all_swim_totals || {}

  const totalDistance = (ride.distance || 0) + (run.distance || 0) + (swim.distance || 0)
  const totalCount = (ride.count || 0) + (run.count || 0) + (swim.count || 0)
  const totalTime = (ride.moving_time || 0) + (run.moving_time || 0) + (swim.moving_time || 0)

  const breakdown = [
    { type: 'Ride', count: ride.count || 0, distance: metersToMiles(ride.distance || 0) },
    { type: 'Run', count: run.count || 0, distance: metersToMiles(run.distance || 0) },
    { type: 'Swim', count: swim.count || 0, distance: metersToMiles(swim.distance || 0) },
  ]
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count)

  posthog.capture({
    distinctId,
    event: 'strava_stats_fetched',
    properties: {
      period,
      total_miles: metersToMiles(totalDistance),
      total_activities: totalCount,
      source: 'api_fallback',
    },
  })

  return Response.json({
    distance: metersToMiles(totalDistance),
    count: totalCount,
    movingTime: totalTime,
    breakdown,
    period,
    fallback: true,
  })
}
