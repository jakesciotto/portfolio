import { captureServer } from '../../posthog'
import {
  STRAVA_PERIODS,
  emptyStravaStats,
  loadStravaStats,
} from '../../lib/sources/strava'

export const dynamic = 'force-dynamic'

const CACHE = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}
const NO_CACHE = { 'Cache-Control': 'no-store' }

export async function GET(request) {
  const url = new URL(request.url)
  const requested = url.searchParams.get('period') || 'all'
  const period = STRAVA_PERIODS.has(requested) ? requested : 'all'

  try {
    const result = await loadStravaStats(period)
    if (!result) {
      return Response.json(emptyStravaStats(period), { headers: NO_CACHE })
    }

    captureServer('strava_stats_fetched', {
      period,
      total_miles: result.distance,
      total_activities: result.count,
      source: 'redis_snapshot',
    })

    return Response.json(result, { headers: CACHE })
  } catch (error) {
    captureServer('strava_stats_error', {
      error_message: error?.message,
      period,
      source: 'redis_snapshot',
    })
    return Response.json(emptyStravaStats(period), { headers: NO_CACHE })
  }
}
