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

const EMPTY = { active: null, overdue: null, tiers: null, lastSync: null }

export async function GET(request) {
  const posthog = PostHogClient()
  const distinctId =
    request.headers.get('x-posthog-distinct-id') || 'server_anonymous'

  if (!redis) {
    return Response.json(EMPTY, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  }

  try {
    const [stats, lastSync] = await Promise.all([
      redis.get('obsidian:stats'),
      redis.get('obsidian:last_sync'),
    ])

    if (!stats) {
      console.error('obsidian:stats missing in Redis - run scripts/import-obsidian-data.mjs')
      return Response.json(EMPTY, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
    }

    const parsed = typeof stats === 'string' ? JSON.parse(stats) : stats
    parsed.lastSync = lastSync || null

    posthog.capture({
      distinctId,
      event: 'obsidian_stats_fetched',
      properties: {
        active: parsed.active,
        overdue: parsed.overdue,
        source: 'redis_snapshot',
      },
    })
    await posthog.flush().catch(() => {})

    return Response.json(parsed, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  } catch (error) {
    posthog.capture({
      distinctId,
      event: 'obsidian_stats_error',
      properties: { error_message: error?.message, source: 'redis_snapshot' },
    })
    await posthog.flush().catch(() => {})
    return Response.json(EMPTY, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  }
}
