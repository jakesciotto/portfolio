import { test } from 'node:test'
import assert from 'node:assert/strict'
import { openDb } from '../src/db.mjs'
import { collect, publish } from '../src/jobs.mjs'
import { serve } from '../src/serve.mjs'
import { createNotifier } from '../src/notify.mjs'

const NOW = new Date('2026-09-22T12:00:00Z')

const quiet = { log() {}, error() {} }
const item = (played_at, name) => ({
  played_at,
  track: {
    uri: `spotify:track:${name}`,
    name,
    duration_ms: 60_000,
    artists: [{ name: 'A' }],
  },
})

function fakeRedis() {
  const store = new Map()
  return {
    store,
    get: async (k) => store.get(k) ?? null,
    set: async (k, v) => (store.set(k, v), 'OK'),
  }
}

test('collect asks for plays after the newest stored one and publish writes five keys', async () => {
  const db = openDb(':memory:')
  db.insertPlays([
    {
      ts: '2026-01-02T00:00:00Z',
      track_uri: 'u',
      track: 't',
      artist: 'A',
      album: null,
      ms_played: 1,
      duration_ms: 1,
      source: 'archive',
    },
  ])
  const asked = []
  const spotify = {
    async recentlyPlayed(after) {
      asked.push(after)
      return [
        item('2026-01-02T00:02:00.000Z', 'x'),
        item('2026-01-02T00:01:00.000Z', 'y'),
      ]
    },
  }
  const r1 = await collect({ db, spotify, log: quiet })
  assert.deepEqual(r1, { fetched: 2, inserted: 2 })
  assert.deepEqual(asked, ['2026-01-02T00:00:00Z'])
  const r2 = await collect({ db, spotify, log: quiet })
  assert.deepEqual(r2, { fetched: 2, inserted: 0 })
  assert.equal(asked[1], '2026-01-02T00:02:00.000Z')

  const redis = fakeRedis()
  const { stats, live } = await publish({ db, redis, log: quiet, now: NOW })
  assert.equal(stats.overview.totalStreams, 3)
  assert.deepEqual(live, {
    year: 2026,
    minutes: 2,
    streams: 3,
    since: '2026-01-02T00:00:00Z',
    lastStream: '2026-01-02T00:02:00.000Z',
  })
  assert.deepEqual([...redis.store.keys()].sort(), [
    'spotify:fun_facts',
    'spotify:live',
    'spotify:overview',
    'spotify:top_artists',
    'spotify:top_tracks',
    'spotify:yearly_hours',
  ])
  assert.equal(JSON.parse(redis.store.get('spotify:overview')).totalStreams, 3)
  db.close()
})

test('the live key counts only the current year', async () => {
  const db = openDb(':memory:')
  const play = (ts, ms_played, source) => ({
    ts,
    track_uri: `u${ts}`,
    track: 't',
    artist: 'A',
    album: null,
    ms_played,
    duration_ms: 1,
    source,
  })
  db.insertPlays([
    play('2025-06-01T12:00:00Z', 600_000, 'archive'),
    play('2026-02-01T12:00:00Z', 1_200_000, 'archive'),
    play('2026-09-20T12:00:00Z', 180_000, 'api'),
  ])
  const redis = fakeRedis()
  const { stats, live } = await publish({ db, redis, log: quiet, now: NOW })
  assert.equal(stats.overview.totalStreams, 3)
  assert.equal(live.year, 2026)
  assert.equal(live.minutes, 23)
  assert.equal(live.streams, 2)
  assert.equal(live.since, '2026-02-01T12:00:00Z')
  db.close()
})

test('publish writes only the live key until the archive is loaded', async () => {
  const db = openDb(':memory:')
  db.insertPlays([
    {
      ts: '2026-01-02T00:00:00Z',
      track_uri: 'u',
      track: 't',
      artist: 'A',
      album: null,
      ms_played: 90_000,
      duration_ms: 1,
      source: 'api',
    },
  ])
  const redis = fakeRedis()
  const { stats, live } = await publish({ db, redis, log: quiet, now: NOW })
  assert.equal(stats, null)
  assert.equal(live.minutes, 2)
  assert.deepEqual([...redis.store.keys()], ['spotify:live'])
  assert.equal(db.lastRun('publish').detail, 'live only, streams 1')
  const forced = await publish({ db, redis, log: quiet, force: true })
  assert.equal(forced.stats.overview.totalStreams, 1)
  assert.equal(redis.store.size, 6)
  db.close()
})

test('serve records a failed run and notifies once until recovery', async () => {
  const db = openDb(':memory:')
  const posts = []
  const notifier = createNotifier({
    topic: 't',
    log: quiet,
    fetchImpl: async (url, init) => (
      posts.push(init.headers.Title),
      { ok: true }
    ),
  })
  let fail = true
  const spotify = {
    async recentlyPlayed() {
      if (fail) throw new Error('boom')
      return [item('2026-01-02T00:00:00.000Z', 'x')]
    },
  }
  const redis = fakeRedis()
  const opts = {
    db,
    spotify,
    redis,
    notifier,
    intervalMs: 0,
    log: quiet,
    once: true,
  }
  await serve(opts)
  await serve(opts)
  assert.equal(db.lastRun('collect').ok, 0)
  assert.equal(db.lastRun('collect').detail, 'boom')
  fail = false
  await serve(opts)
  assert.deepEqual(posts, [
    'spotify-collector: collect failed',
    'spotify-collector: collect recovered',
  ])
  assert.equal(redis.store.size, 1)
  db.close()
})
