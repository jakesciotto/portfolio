import { test } from 'node:test'
import assert from 'node:assert/strict'
import { dedupeKey, fromArchive, fromRecentlyPlayed } from '../src/plays.mjs'

const item = (played_at, name, duration_ms, uri = `spotify:track:${name}`) => ({
  played_at,
  track: {
    uri,
    name,
    duration_ms,
    artists: [{ name: 'Artist' }],
    album: { name: 'Album' },
  },
})

test('an archive row and an api row for the same play share a dedupe key', () => {
  const archive = fromArchive({
    ts: '2026-03-01T12:00:05Z',
    spotify_track_uri: 'spotify:track:abc',
    master_metadata_track_name: 'Song',
    master_metadata_album_artist_name: 'Artist',
    ms_played: 1000,
  })
  const [api] = fromRecentlyPlayed(
    [item('2026-03-01T12:00:05.731Z', 'Song', 200_000, 'spotify:track:abc')],
    null,
  )
  assert.equal(dedupeKey(archive), dedupeKey(api))
  assert.equal(archive.source, 'archive')
  assert.equal(api.source, 'api')
})

test('a local file with no uri keys on track and artist', () => {
  const p = fromArchive({
    ts: '2020-01-01T00:00:00Z',
    master_metadata_track_name: 'T',
    master_metadata_album_artist_name: 'A',
    ms_played: 5,
  })
  assert.equal(dedupeKey(p), '2020-01-01T00:00:00Z|T|||A')
})

test('ms_played is the gap to the previous play, capped at the duration', () => {
  const plays = fromRecentlyPlayed(
    [
      item('2026-03-01T12:10:00.000Z', 'skipped', 240_000),
      item('2026-03-01T12:03:00.000Z', 'full', 180_000),
      item('2026-03-01T12:30:00.000Z', 'after-pause', 200_000),
    ],
    '2026-03-01T12:00:00.000Z',
  )
  assert.deepEqual(
    plays.map((p) => [p.track, p.ms_played]),
    [
      ['full', 180_000],
      ['skipped', 240_000],
      ['after-pause', 200_000],
    ],
  )
  const [first] = fromRecentlyPlayed(
    [item('2026-03-01T12:00:40.000Z', 'x', 100_000)],
    null,
  )
  assert.equal(first.ms_played, 100_000)
  const [skip] = fromRecentlyPlayed(
    [item('2026-03-01T12:00:40.000Z', 'x', 100_000)],
    '2026-03-01T12:00:00.000Z',
  )
  assert.equal(skip.ms_played, 40_000)
})

test('items without a track or a timestamp are dropped', () => {
  assert.equal(
    fromRecentlyPlayed([{ played_at: 'x' }, { track: {} }], null).length,
    0,
  )
})
