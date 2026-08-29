import { Redis } from '@upstash/redis'
import { captureServer } from '../../posthog'

export const dynamic = 'force-dynamic'

const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
    : null

const PERIODS = new Set(['week', 'month', 'year', 'all'])

const CACHE = { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' }
const NO_CACHE = { 'Cache-Control': 'no-store' }

const EMPTY = (period) => ({
  distance: null,
  count: null,
  movingTime: null,
  breakdown: [],
  period,
  lastSync: null,
})

export async function GET(request) {
  const url = new URL(request.url)
  const requested = url.searchParams.get('period') || 'all'
  const period = PERIODS.has(requested) ? requested : 'all'

  if (!redis) return Response.json(EMPTY(period), { headers: NO_CACHE })

  try {
    const [stats, lastSync] = await Promise.all([
      redis.get(`strava:stats:${period}`),
      redis.get('strava:last_sync'),
    ])

    if (!stats) {
      console.error(`strava:stats:${period} missing in Redis - run scripts/import-strava-data.mjs`)
      return Response.json(EMPTY(period), { headers: NO_CACHE })
    }

    const parsed = typeof stats === 'string' ? JSON.parse(stats) : stats
    parsed.lastSync = lastSync || null

    captureServer('strava_stats_fetched', {
      period,
      total_miles: parsed.distance,
      total_activities: parsed.count,
      source: 'redis_snapshot',
    })

    return Response.json(parsed, { headers: CACHE })
  } catch (error) {
    captureServer('strava_stats_error', { error_message: error?.message, period, source: 'redis_snapshot' })
    return Response.json(EMPTY(period), { headers: NO_CACHE })
  }
}
