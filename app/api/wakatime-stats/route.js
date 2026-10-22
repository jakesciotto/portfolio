import { captureServer } from '../../posthog'
import { EMPTY_WAKA_STATS, loadWakaStats } from '../../lib/sources/wakatime'

const CACHE = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}

export async function GET() {
  try {
    if (!process.env.WAKATIME_API_KEY) return Response.json(EMPTY_WAKA_STATS)

    const result = await loadWakaStats()
    captureServer('wakatime_stats_fetched', { totalHours: result.totalHours })

    return Response.json(result, { headers: CACHE })
  } catch (error) {
    console.error('WakaTime API error:', error)
    return Response.json(EMPTY_WAKA_STATS)
  }
}
