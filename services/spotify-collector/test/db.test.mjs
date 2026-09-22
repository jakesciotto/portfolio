import { test } from 'node:test'
import assert from 'node:assert/strict'
import { openDb } from '../src/db.mjs'

const play = (ts, track, source = 'api', ms = 1000) => ({
  ts,
  track_uri: `spotify:track:${track}`,
  track,
  artist: 'A',
  album: null,
  ms_played: ms,
  duration_ms: ms,
  source,
})

test('insertPlays ignores duplicates and lastTs reads the newest row', () => {
  const db = openDb(':memory:')
  assert.equal(
    db.insertPlays([play('2026-01-01T00:00:00Z', 'a', 'archive')]),
    1,
  )
  assert.equal(
    db.insertPlays([
      play('2026-01-01T00:00:00.500Z', 'a'),
      play('2026-01-02T00:00:00.000Z', 'b'),
    ]),
    1,
  )
  assert.equal(db.lastTs(), '2026-01-02T00:00:00.000Z')
  assert.equal(db.lastTs('archive'), '2026-01-01T00:00:00Z')
  assert.equal(db.allEntries().length, 2)
  assert.deepEqual(
    db.counts().map((c) => [c.source, c.n]),
    [
      ['api', 1],
      ['archive', 1],
    ],
  )
  db.recordRun('collect', true, 1, 'x')
  assert.equal(db.lastRun('collect').inserted, 1)
  assert.equal(db.lastRun('publish'), null)
  db.close()
})
