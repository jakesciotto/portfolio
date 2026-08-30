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

const EMPTY = { active: null, overdue: null, tiers: null, lastSync: null }
const CACHE = { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
const NO_CACHE = { 'Cache-Control': 'no-store' }

export async function GET() {
  if (!redis) return Response.json(EMPTY, { headers: NO_CACHE })

  try {
    const [stats, lastSync] = await Promise.all([
      redis.get('obsidian:stats'),
      redis.get('obsidian:last_sync'),
    ])

    if (!stats) {
      console.error('obsidian:stats missing in Redis - run scripts/import-obsidian-data.mjs')
      return Response.json(EMPTY, { headers: NO_CACHE })
    }

    const parsed = typeof stats === 'string' ? JSON.parse(stats) : stats
    parsed.lastSync = lastSync || null

    captureServer('obsidian_stats_fetched', {
      active: parsed.active,
      overdue: parsed.overdue,
      source: 'redis_snapshot',
    })

    return Response.json(parsed, { headers: CACHE })
  } catch (error) {
    captureServer('obsidian_stats_error', { error_message: error?.message, source: 'redis_snapshot' })
    return Response.json(EMPTY, { headers: NO_CACHE })
  }
}
