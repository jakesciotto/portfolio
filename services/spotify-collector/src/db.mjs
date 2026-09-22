import { DatabaseSync } from 'node:sqlite'
import { dedupeKey } from './plays.mjs'

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS plays (
    id INTEGER PRIMARY KEY,
    dedupe_key TEXT NOT NULL UNIQUE,
    ts TEXT NOT NULL,
    track_uri TEXT,
    track TEXT,
    artist TEXT,
    album TEXT,
    ms_played INTEGER NOT NULL,
    duration_ms INTEGER,
    source TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS plays_ts ON plays (ts);
  CREATE TABLE IF NOT EXISTS runs (
    id INTEGER PRIMARY KEY,
    kind TEXT NOT NULL,
    at TEXT NOT NULL,
    ok INTEGER NOT NULL,
    inserted INTEGER NOT NULL DEFAULT 0,
    detail TEXT
  );
`

export function openDb(path) {
  const db = new DatabaseSync(path)
  db.exec('PRAGMA journal_mode = WAL')
  db.exec(SCHEMA)

  const insert = db.prepare(`
    INSERT OR IGNORE INTO plays
      (dedupe_key, ts, track_uri, track, artist, album, ms_played, duration_ms, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const lastTsStmt = db.prepare(
    'SELECT ts FROM plays WHERE source = ? ORDER BY ts DESC LIMIT 1',
  )
  const lastAnyTsStmt = db.prepare(
    'SELECT ts FROM plays ORDER BY ts DESC LIMIT 1',
  )
  const allStmt = db.prepare(
    'SELECT ts, track, artist, ms_played FROM plays ORDER BY ts',
  )
  const countStmt = db.prepare(
    'SELECT source, COUNT(*) AS n, MIN(ts) AS first, MAX(ts) AS last FROM plays GROUP BY source',
  )
  const runStmt = db.prepare(
    'INSERT INTO runs (kind, at, ok, inserted, detail) VALUES (?, ?, ?, ?, ?)',
  )
  const lastRunStmt = db.prepare(
    'SELECT kind, at, ok, inserted, detail FROM runs WHERE kind = ? ORDER BY id DESC LIMIT 1',
  )

  return {
    insertPlays(plays) {
      let inserted = 0
      db.exec('BEGIN')
      try {
        for (const p of plays) {
          const r = insert.run(
            dedupeKey(p),
            p.ts,
            p.track_uri,
            p.track,
            p.artist,
            p.album,
            p.ms_played,
            p.duration_ms,
            p.source,
          )
          inserted += r.changes
        }
        db.exec('COMMIT')
      } catch (err) {
        db.exec('ROLLBACK')
        throw err
      }
      return inserted
    },
    lastTs(source) {
      const row = source ? lastTsStmt.get(source) : lastAnyTsStmt.get()
      return row?.ts || null
    },
    allEntries() {
      return allStmt.all()
    },
    counts() {
      return countStmt.all()
    },
    recordRun(kind, ok, inserted = 0, detail = null) {
      runStmt.run(kind, new Date().toISOString(), ok ? 1 : 0, inserted, detail)
    },
    lastRun(kind) {
      return lastRunStmt.get(kind) || null
    },
    close() {
      db.close()
    },
  }
}
