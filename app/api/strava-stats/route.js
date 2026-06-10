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

const PERIODS = new Set(['week', 'month', 'year', 'all'])

const EMPTY = (period) => ({
  distance: null,
  count: null,
  movingTime: null,
  breakdown: [],
  period,
  lastSync: null,
})

export async function GET(request) {
  const posthog = PostHogClient()
  const distinctId =
    request.headers.get('x-posthog-distinct-id') || 'server_anonymous'

  const url = new URL(request.url)
  const requested = url.searchParams.get('period') || 'all'
  const period = PERIODS.has(requested) ? requested : 'all'

  if (!redis) {
    return Response.json(EMPTY(period), {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  }

  try {
    const [stats, lastSync] = await Promise.all([
      redis.get(`strava:stats:${period}`),
      redis.get('strava:last_sync'),
    ])

    if (!stats) {
      console.error(`strava:stats:${period} missing in Redis - run scripts/import-strava-data.mjs`)
      return Response.json(EMPTY(period), {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      })
    }

    const parsed = typeof stats === 'string' ? JSON.parse(stats) : stats
    parsed.lastSync = lastSync || null

    posthog.capture({
      distinctId,
      event: 'strava_stats_fetched',
      properties: {
        period,
        total_miles: parsed.distance,
        total_activities: parsed.count,
        source: 'redis_snapshot',
      },
    })

    return Response.json(parsed, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch (error) {
    posthog.capture({
      distinctId,
      event: 'strava_stats_error',
      properties: { error_message: error?.message, period, source: 'redis_snapshot' },
    })
    return Response.json(EMPTY(period), {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  }
}
