# Spotify collector
A dependency-free Node service on vinelab that stores every play in SQLite and publishes yearly stats to Redis.

## entrances
- script collector: the serve loop on vinelab, and the collect, publish, import and status commands Jake runs by hand
  handler: src/cli.mjs
  trust: operator

## invariants
- play stored once: An archive row and an API row for the same play share one dedupe key.
  over: one archive row and one API row for the same track URI whose timestamps differ below the second
  via: an archive row and an api row for the same play share a dedupe key
  because: the recently played endpoint and the archive export both deliver the same play, and the key is the timestamp truncated to the second plus the track URI, which both sources carry, so the yearly hours count each play once
  refuted: dedupeKey keeps the full timestamp instead of the second -> the test an archive row and an api row for the same play share a dedupe key went red (2026-10-21)
  kinds: identity
  checklist: capability-authorization dismissed: a dedupe key grants no access to anything
  checklist: canonical-encoding declared as play stored once
  checklist: identity-continuity dismissed: a play key is computed from the row and never reassigned
- archive gate: publish writes only the live key until the archive is loaded.
  over: a database with one API play and no archive row, then the same database published with force
  via: publish writes only the live key until the archive is loaded
  because: fifty live plays cannot describe a year, and a publish from a fresh database would replace the yearly hours on the site with near zero; publish --force is the deliberate override
  refuted: publish writes the stats keys whenever any play exists -> the test publish writes only the live key until the archive is loaded went red (2026-10-21)
  kinds: state
  checklist: revalidated-permission dismissed: publish runs as the collector and checks no actor permission
  checklist: separation-of-duties dismissed: no approval policy exists on a publish
  checklist: legal-state-succession declared as archive gate
  checklist: supersession-safety dismissed: the serve loop publishes in sequence, and a hand-run publish at the same moment is not guarded
  checklist: worker-fencing dismissed: one collector process owns the database and ownership never moves
  checklist: commit-ordered-effects dismissed: publish reads committed rows before it writes any Redis key
  checklist: resumption-coverage dismissed: every publish recomputes every key from the whole table, so the next publish repairs an interrupted one
- current year live key: The live key counts only plays in the current calendar year.
  over: one archive play in the previous year, and one archive play and one API play in the current year, all at midday UTC and bucketed in the runner's zone; the test does not exercise the America/New_York rule or the year boundary
  via: the live key counts only the current year
  because: the site shows the current year as a growing column, and the live key must not count plays from the previous year
  refuted: liveSummary starts the year one year early -> the test the live key counts only the current year went red (2026-10-21)
  kinds: none
- notify once: A failed run records its error and notifies once until a run recovers.
  over: two failed serve passes followed by one clean pass
  via: serve records a failed run and notifies once until recovery
  because: the loop runs every fifteen minutes, and a repeated alert for one outage trains the reader to ignore the real one
  refuted: the notifier posts on every failure -> the test serve records a failed run and notifies once until recovery went red (2026-10-21)
  kinds: output
  checklist: destination-confinement dismissed: the notifier posts only to the ntfy.sh topic from its configuration
  checklist: redaction dismissed: the body is the error message, and collector errors carry status codes and Redis error text, never a token
  checklist: commit-ordered-effects dismissed: serve records the failed run in SQLite before it posts, and a lost post loses only the alert
  checklist: circuit-breaker-policy dismissed: the collector never bypasses a failing dependency, it tries again on the next interval
  checklist: declared-target-coverage dismissed: one topic receives each post
- duplicate insert: insertPlays ignores a duplicate play and lastTs reads the newest row.
  over: an archive row, then an API row for the same play half a second later beside a new play, with lastTs over every source and over the archive
  via: insertPlays ignores duplicates and lastTs reads the newest row
  because: the unique dedupe key column is what makes play stored once hold in the table, and lastTs is where collect resumes
  refuted: insertPlays replaces a duplicate instead of ignoring it -> the test insertPlays ignores duplicates and lastTs reads the newest row went red (2026-10-21)
  kinds: identity
  checklist: capability-authorization dismissed: a dedupe key grants no access to anything
  checklist: canonical-encoding declared as play stored once
  checklist: identity-continuity dismissed: a play key is computed from the row and never reassigned
- played gap: ms_played is the gap to the previous play, capped at the track duration.
  over: three plays out of order after a stored play, a first play with no previous play, and a play forty seconds after the previous one
  via: ms_played is the gap to the previous play, capped at the duration
  because: played_at marks the end of a play, so the gap bounds how long the play could have run and a skip counts at its real length
  refuted: ms_played drops the cap at the duration -> the test ms_played is the gap to the previous play, capped at the duration went red (2026-10-21)
  kinds: none
- publish keys: collect asks for plays after the newest stored one, and publish writes the five stats keys and the live key.
  over: two collects over the same answer, then one publish over a database that holds an archive row
  via: collect asks for plays after the newest stored one and publish writes five keys
  because: the site reads all five stats keys and the live key, and a collect that asked from the start would refetch the same fifty plays
  refuted: publish skips the overview key -> the test collect asks for plays after the newest stored one and publish writes five keys went red (2026-10-21)
  kinds: output
  checklist: destination-confinement dismissed: publish writes only to the Redis client it is given
  checklist: redaction dismissed: the keys hold aggregate listening numbers the site shows in public
  checklist: commit-ordered-effects dismissed: publish reads committed rows before it writes any Redis key
  checklist: circuit-breaker-policy dismissed: a failed write throws and serve records the failure
  checklist: declared-target-coverage declared as publish keys
- archive import: importArchive reads every audio history file, and a second import inserts nothing.
  over: two audio history files that share one row and one video history file, imported twice, and a folder with no audio history file
  via: importArchive loads every history file once
  because: the archive export arrives months after the plays, and an import run twice must not double the yearly hours
  refuted: importArchive skips the first audio history file -> the test importArchive loads every history file once went red (2026-10-21)
  kinds: identity
  checklist: capability-authorization dismissed: an import grants no access to anything
  checklist: canonical-encoding declared as play stored once
  checklist: identity-continuity dismissed: a play key is computed from the row and never reassigned
