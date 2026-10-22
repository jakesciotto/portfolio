import { redis } from './redis'

export const STRAVA_PERIODS = new Set(['week', 'month', 'year', 'all'])

export const emptyStravaStats = (period) => ({
  distance: null,
  count: null,
  movingTime: null,
  breakdown: [],
  period,
  lastSync: null,
})

export async function loadStravaStats(period) {
  if (!redis) return null

  const [stats, lastSync] = await Promise.all([
    redis.get(`strava:stats:${period}`),
    redis.get('strava:last_sync'),
  ])
  if (!stats) {
    console.error(
      `strava:stats:${period} missing in Redis - run scripts/import-strava-data.mjs`,
    )
    return null
  }

  const parsed = typeof stats === 'string' ? JSON.parse(stats) : stats
  return { ...parsed, lastSync: lastSync || null }
}
