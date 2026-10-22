import { captureServer } from '../../posthog'
import {
  EMPTY_SPOTIFY_STATS,
  loadSpotifyStats,
} from '../../lib/sources/spotify-stats'

const CACHE = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
}

export async function GET() {
  try {
    const result = await loadSpotifyStats()

    captureServer('spotify_stats_fetched', { source: 'api' })

    return Response.json(result, { headers: CACHE })
  } catch (error) {
    captureServer('spotify_stats_error', {
      error_message: error?.message,
      source: 'api',
    })
    return Response.json(EMPTY_SPOTIFY_STATS, {
      headers: { 'Cache-Control': 'no-store' },
    })
  }
}
