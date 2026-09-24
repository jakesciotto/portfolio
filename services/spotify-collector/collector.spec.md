# Spotify collector
A dependency-free Node service on vinelab that stores every play in SQLite and publishes yearly stats to Redis.

## invariants
- a play is stored once
- stats publish only after the archive is loaded
- the live key counts only the current year
- a failed run notifies once until recovery

## works when
- boundary "a play is stored once" at dedupeKey via test "an archive row and an api row for the same play share a dedupe key"
- boundary "stats publish only after the archive is loaded" at publish via test "publish writes only the live key until the archive is loaded"
- boundary "the live key counts only the current year" at liveSummary via test "the live key counts only the current year"
- boundary "a failed run notifies once until recovery" at serve via test "serve records a failed run and notifies once until recovery"
- passes test "insertPlays ignores duplicates and lastTs reads the newest row"
- passes test "ms_played is the gap to the previous play, capped at the duration"
- passes test "collect asks for plays after the newest stored one and publish writes five keys"
- passes test "importArchive loads every history file once"

## why
Spotify's recently-played endpoint holds fifty plays and the archive export
arrives months later, so the same play reaches the database from both. "A play is
stored once" keeps the yearly hours honest: the dedupe key is the timestamp
truncated to the second plus the track URI, which both sources share.

"Stats publish only after the archive is loaded" protects the site. Fifty live
plays cannot describe a year, and a publish from a fresh database would replace
the real yearly hours on the site with near zero. `publish --force` is the
deliberate override.

"The live key counts only the current year" in America/New_York, because the
site shows the current year as a growing column and the archive buckets use the
same local year. A UTC bucket disagreed with the counter by about three hours.

"A failed run notifies once until recovery" because the loop runs every fifteen
minutes and a repeated alert for one outage is noise that trains the reader to
ignore the real one.
