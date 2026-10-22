import { redis } from './redis'

export const EMPTY_OBSIDIAN_STATS = {
  active: null,
  overdue: null,
  tiers: null,
  lastSync: null,
}

export async function loadObsidianStats() {
  if (!redis) return null

  const [stats, lastSync] = await Promise.all([
    redis.get('obsidian:stats'),
    redis.get('obsidian:last_sync'),
  ])
  if (!stats) {
    console.error(
      'obsidian:stats missing in Redis - run scripts/import-obsidian-data.mjs',
    )
    return null
  }

  const parsed = typeof stats === 'string' ? JSON.parse(stats) : stats
  return { ...parsed, lastSync: lastSync || null }
}
