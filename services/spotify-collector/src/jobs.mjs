import { aggregate, liveSummary, LIVE_KEY, REDIS_KEYS } from './aggregate.mjs'
import { fromRecentlyPlayed } from './plays.mjs'

export async function collect({ db, spotify, log = console }) {
  const after = db.lastTs()
  const items = await spotify.recentlyPlayed(after)
  const plays = fromRecentlyPlayed(items, after)
  const inserted = db.insertPlays(plays)
  db.recordRun('collect', true, inserted, `fetched ${items.length}`)
  log.log(`collect: fetched ${items.length}, inserted ${inserted}`)
  return { fetched: items.length, inserted }
}

// The five stats keys hold the full history the site shows. They are
// overwritten only once the archive is loaded, or on an explicit force,
// so a fresh collector cannot replace years of history with a day of plays.
export async function publish({ db, redis, log = console, force = false }) {
  const entries = db.allEntries()
  const live = liveSummary(entries)
  await redis.set(LIVE_KEY, JSON.stringify(live))
  const hasArchive = db.counts().some((c) => c.source === 'archive')
  let stats = null
  if (hasArchive || force) {
    stats = aggregate(entries)
    for (const [field, key] of Object.entries(REDIS_KEYS)) {
      await redis.set(key, JSON.stringify(stats[field]))
    }
  }
  const scope = stats ? 'stats and live' : 'live only'
  db.recordRun('publish', true, 0, `${scope}, streams ${live.streams}`)
  log.log(
    `publish: ${scope}, ${live.streams} streams, ${live.minutes} min, last ${live.lastStream}`,
  )
  return { stats, live }
}
