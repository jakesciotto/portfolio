# View math
Pure modules that turn API payloads into the view objects the tiles render.

## invariants
- a live value never lowers a stored value
- a zero bar keeps a visible floor
- a missing source yields a null view, not a crash
- a zero total never divides

## works when
- boundary "a live value never lowers a stored value" at withLive via test "withLive never lowers a value and ignores a missing live key"
- boundary "a zero bar keeps a visible floor" at layoutColumns via test "layoutColumns renders zero as a stub and enforces a 3% floor"
- boundary "a missing source yields a null view, not a crash" at spotifyView via test "spotifyView returns null without an overview"
- boundary "a zero total never divides" at tierCards via test "tierCards guards missing data and a zero total"
- passes test "mapWakaStats tolerates missing sources"
- passes test "mapTraktStats tolerates missing or malformed sources"
- passes test "TIERS run hot to cold with one hue each"
- passes test "spotifyView captions hours and marks the unfinished last year so far"
- passes test "pct rounds and guards a zero total"
- passes test "layoutColumns with all zeros has no peak"

## why
The Spotify tile merges a live counter into a snapshot, and the merge honours "a
live value never lowers a stored value" because the snapshot is the archive and
the live key is an estimate that runs about two percent low. A merge that could
lower a value would make the headline flicker between refreshes.

Column charts honour "a zero bar keeps a visible floor" because a bar that
disappears at zero reads as missing data, and the tile must tell a zero from a
gap.

Every mapper honours "a missing source yields a null view, not a crash" because
the routes call upstreams in parallel and any one of them can fail. The tile
shows a skeleton or stale cache on null. A thrown error would blank the tile.

Share calculations honour "a zero total never divides" because the Obsidian KPI
row and the percentage helpers run on days when the active count is zero, and
NaN in a badge is the visible symptom.
