import { Redis } from '@upstash/redis'
import PostHogClient from '../../posthog'

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

// In-memory token cache (persists across requests in the same serverless instance)
let cachedAccessToken = null
let tokenExpiresAt = 0

async function getRefreshToken() {
  if (redis) {
    const stored = await redis.get('oura_refresh_token').catch(() => null)
    if (stored) return stored
  }
  return process.env.OURA_REFRESH_TOKEN
}

async function getAccessToken() {
  // Return cached token if still valid (with 60s buffer)
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedAccessToken
  }

  const refreshToken = await getRefreshToken()
  if (!refreshToken) throw new Error('OURA_REFRESH_TOKEN not set')

  const res = await fetch('https://api.ouraring.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.OURA_CLIENT_ID,
      client_secret: process.env.OURA_CLIENT_SECRET,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Token refresh failed (${res.status}): ${body}`)
  }

  const data = await res.json()
  cachedAccessToken = data.access_token
  tokenExpiresAt = Date.now() + (data.expires_in || 86400) * 1000

  // Persist rotated refresh token to Redis
  if (data.refresh_token && redis) {
    await redis.set('oura_refresh_token', data.refresh_token).catch(() => {})
  }

  return cachedAccessToken
}

function ouraFetch(endpoint, accessToken, startDate, endDate) {
  return fetch(
    `https://api.ouraring.com/v2/usercollection/${endpoint}?start_date=${startDate}&end_date=${endDate}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  ).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${endpoint}: ${r.status}`))))
}

function getSleepVerdict(hours) {
  if (hours === null) return 'NO DATA'
  if (hours < 4) return 'WOOF'
  if (hours < 6) return 'OK'
  return 'WOW'
}

export async function GET(request) {
  const posthog = PostHogClient()
  const distinctId =
    request.headers.get('x-posthog-distinct-id') || 'server_anonymous'

  try {
    const accessToken = await getAccessToken()

    const today = new Date().toISOString().split('T')[0]
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]

    // Fetch all endpoints in parallel
    const [sleepData, dailySleepData, readinessData] =
      await Promise.all([
        ouraFetch('sleep', accessToken, sevenDaysAgo, today),
        ouraFetch('daily_sleep', accessToken, sevenDaysAgo, today),
        ouraFetch('daily_readiness', accessToken, sevenDaysAgo, today),
      ])

    // Process sleep sessions — group by day, pick longest per day
    const sleepByDay = {}
    for (const session of sleepData.data || []) {
      const day = session.day
      if (
        !sleepByDay[day] ||
        session.is_longest ||
        (session.total_sleep_duration || 0) >
          (sleepByDay[day].total_sleep_duration || 0)
      ) {
        sleepByDay[day] = session
      }
    }

    const sleepTrend = Object.entries(sleepByDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, s]) => ({
        day,
        hours: s.total_sleep_duration
          ? +(s.total_sleep_duration / 3600).toFixed(1)
          : null,
      }))

    const latestSleep = sleepTrend[sleepTrend.length - 1]
    const currentHours = latestSleep?.hours ?? null

    // Process daily sleep scores
    const sleepScoreTrend = (dailySleepData.data || [])
      .sort((a, b) => a.day.localeCompare(b.day))
      .map((d) => ({ day: d.day, score: d.score }))

    const latestSleepScore =
      sleepScoreTrend[sleepScoreTrend.length - 1]?.score ?? null

    // Process readiness
    const readinessTrend = (readinessData.data || [])
      .sort((a, b) => a.day.localeCompare(b.day))
      .map((d) => ({ day: d.day, score: d.score }))

    const currentReadiness =
      readinessTrend[readinessTrend.length - 1]?.score ?? null

    const result = {
      sleep: {
        current: {
          hours: currentHours,
          score: latestSleepScore,
          verdict: getSleepVerdict(currentHours),
        },
        trend: {
          hours: sleepTrend.map((d) => d.hours).filter((h) => h !== null),
          scores: sleepScoreTrend.map((d) => d.score).filter((s) => s !== null),
        },
      },
      readiness: {
        current: currentReadiness,
        trend: readinessTrend.map((d) => d.score).filter((s) => s !== null),
      },
    }

    posthog.capture({
      distinctId,
      event: 'oura_stats_fetched',
      properties: {
        sleep_hours: currentHours,
        sleep_score: latestSleepScore,
        readiness: currentReadiness,
        source: 'api',
      },
    })

    return Response.json(result)
  } catch (error) {
    posthog.capture({
      distinctId,
      event: 'oura_stats_error',
      properties: { error_message: error?.message, source: 'api' },
    })

    return Response.json({
      sleep: { current: { hours: null, score: null, verdict: 'NO DATA' }, trend: { hours: [], scores: [] } },
      readiness: { current: null, trend: [] },
    })
  }
}
