import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRedis } from '../src/redis.mjs'
import { createSpotify } from '../src/spotify.mjs'
import { openDb } from '../src/db.mjs'
import { importArchive } from '../src/import-archive.mjs'

const json = (body, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => body,
})

test('redis speaks the Upstash REST command form', async () => {
  const calls = []
  const redis = createRedis({
    url: 'https://kv.example',
    token: 'tok',
    fetchImpl: async (url, init) => {
      calls.push([url, init.headers.Authorization, JSON.parse(init.body)])
      return json({ result: 'OK' })
    },
  })
  assert.equal(await redis.set('k', 'v'), 'OK')
  assert.deepEqual(calls[0], [
    'https://kv.example',
    'Bearer tok',
    ['SET', 'k', 'v'],
  ])
  const failing = createRedis({
    url: 'u',
    token: 't',
    fetchImpl: async () => json({ error: 'nope' }),
  })
  await assert.rejects(failing.get('k'), /nope/)
})

test('spotify refreshes once, prefers the Redis refresh token and passes the after cursor', async () => {
  const calls = []
  const spotify = createSpotify({
    clientId: 'id',
    clientSecret: 'secret',
    refreshToken: 'env-token',
    redis: { get: async () => 'redis-token', set: async () => 'OK' },
    fetchImpl: async (url, init) => {
      calls.push([url, init])
      if (url.startsWith('https://accounts.spotify.com')) {
        return json({ access_token: 'acc', expires_in: 3600 })
      }
      return json({ items: [{ played_at: 'x' }] })
    },
  })
  const items = await spotify.recentlyPlayed('2026-01-01T00:00:00.000Z')
  await spotify.recentlyPlayed(null)
  assert.equal(items.length, 1)
  assert.equal(
    calls.filter(([u]) => u.startsWith('https://accounts')).length,
    1,
  )
  assert.equal(
    String(calls[0][1].body),
    'grant_type=refresh_token&refresh_token=redis-token',
  )
  assert.equal(
    calls[1][0],
    'https://api.spotify.com/v1/me/player/recently-played?limit=50&after=1767225600000',
  )
  assert.equal(calls[1][1].headers.Authorization, 'Bearer acc')
  assert.equal(
    calls[2][0],
    'https://api.spotify.com/v1/me/player/recently-played?limit=50',
  )
})

test('importArchive loads every history file once', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'spotify-archive-'))
  const row = (ts, name) => ({
    ts,
    ms_played: 1000,
    master_metadata_track_name: name,
    master_metadata_album_artist_name: 'A',
    spotify_track_uri: `spotify:track:${name}`,
  })
  await writeFile(
    join(dir, 'Streaming_History_Audio_2024.json'),
    JSON.stringify([row('2024-01-01T00:00:00Z', 'a')]),
  )
  await writeFile(
    join(dir, 'Streaming_History_Audio_2025.json'),
    JSON.stringify([
      row('2025-01-01T00:00:00Z', 'b'),
      row('2024-01-01T00:00:00Z', 'a'),
    ]),
  )
  await writeFile(join(dir, 'Streaming_History_Video_2025.json'), '[]')
  const db = openDb(':memory:')
  const quiet = { log() {} }
  assert.deepEqual(await importArchive({ db, folder: dir, log: quiet }), {
    read: 3,
    inserted: 2,
  })
  assert.deepEqual(await importArchive({ db, folder: dir, log: quiet }), {
    read: 3,
    inserted: 0,
  })
  await assert.rejects(
    importArchive({ db, folder: tmpdir(), log: quiet }),
    /No Streaming_History_Audio/,
  )
  db.close()
})
