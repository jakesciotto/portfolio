import { captureServer } from '../../posthog'
import {
  EMPTY_OBSIDIAN_STATS,
  loadObsidianStats,
} from '../../lib/sources/obsidian'

export const dynamic = 'force-dynamic'

const CACHE = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}
const NO_CACHE = { 'Cache-Control': 'no-store' }

export async function GET() {
  try {
    const result = await loadObsidianStats()
    if (!result)
      return Response.json(EMPTY_OBSIDIAN_STATS, { headers: NO_CACHE })

    captureServer('obsidian_stats_fetched', {
      active: result.active,
      overdue: result.overdue,
      source: 'redis_snapshot',
    })

    return Response.json(result, { headers: CACHE })
  } catch (error) {
    captureServer('obsidian_stats_error', {
      error_message: error?.message,
      source: 'redis_snapshot',
    })
    return Response.json(EMPTY_OBSIDIAN_STATS, { headers: NO_CACHE })
  }
}
