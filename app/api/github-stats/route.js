import { captureServer } from '../../posthog'
import { EMPTY_GITHUB_STATS, loadGithubStats } from '../../lib/sources/github'

const CACHE = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}

export async function GET() {
  try {
    const result = await loadGithubStats()

    captureServer('github_stats_fetched', {
      activity_7d: result.activity7d,
      prev_activity_7d: result.prevActivity7d,
      source: 'public-calendar',
    })

    return Response.json(result, { headers: CACHE })
  } catch (error) {
    captureServer('github_stats_error', {
      error_message: error?.message || 'Unknown error',
      source: 'public-calendar',
    })
    return Response.json(EMPTY_GITHUB_STATS, { status: 500 })
  }
}
