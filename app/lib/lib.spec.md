# View math
Pure modules that turn API payloads into the view objects the tiles render.

## invariants
- live merge: A live value never lowers a stored value.
  over: a live key below the stored year, no live key, a live key without a year, and no stored stats
  via: withLive never lowers a value and ignores a missing live key
  because: the snapshot is the archive and the live key is an estimate that runs about two percent low, so a merge that could lower a value would make the headline flicker between refreshes
  refuted: withLive drops its Math.max floor, so a live key below the stored year lowers it -> the test withLive never lowers a value and ignores a missing live key went red (2026-10-21)
  kinds: none
- zero bar floor: layoutColumns flags a zero value and gives it no height, and gives a nonzero bar at least 3 percent of the height.
  over: one zero value, one value below 3 percent of the peak, and the peak; the test reads the zero and heightPct fields and does not render
  via: layoutColumns renders zero as a stub and enforces a 3% floor
  because: a bar that disappears at zero reads as missing data, and the tile must tell a zero from a gap; Columns in components/ui/columns.jsx draws the zero flag as a 2px stub, and no test reads that rendering
  refuted: layoutColumns drops the 3 percent floor -> the test layoutColumns renders zero as a stub and enforces a 3% floor went red (2026-10-21)
  kinds: none
- null spotify view: spotifyView answers null when the overview is missing.
  over: stats with a null overview, which is what the route answers for a missing snapshot key or a Redis failure, and null stats
  via: spotifyView returns null without an overview
  because: the spotify-stats route reads five Redis snapshot keys and answers an overview of null when a key is missing or Redis fails; the tile shows a skeleton or stale cache on null, and a thrown error would blank the tile
  refuted: spotifyView answers an empty view instead of null without an overview -> the test spotifyView returns null without an overview went red (2026-10-21)
  kinds: none
- zero total: tierCards answers zero shares for missing data and for a zero active count.
  over: null stats, and stats with zero active tasks and one tier count
  via: tierCards guards missing data and a zero total
  because: the Obsidian KPI row runs on days when the active count is zero, and NaN in a badge is the visible symptom
  refuted: tierCards divides by the active count directly instead of through pct -> the test tierCards guards missing data and a zero total went red (2026-10-21)
  kinds: none
- one headline size: Every data tile headline takes its size from HEADLINE.
  over: every -tile.jsx file and obsidian-row.jsx in app/components, searched for a raw text size of 24px or more
  via: every data tile headline takes its size from HEADLINE
  because: the headline is the number that surprises, and five sizes made neighbouring tiles compete; the size lives in HEADLINE in accents.mjs and a tile never sets its own
  refuted: the trakt-tile.jsx headline adds a raw text-4xl -> the test every data tile headline takes its size from HEADLINE went red (2026-10-21)
  kinds: none
- every workout type: The Strava breakdown lists every workout type once, in count order.
  over: a breakdown of five workout types split into two columns
  via: breakdownColumns keeps every workout type once, in count order
  because: a folded Other row once hid ten types and 141 activities
  refuted: the second column drops its last row -> the test breakdownColumns keeps every workout type once, in count order went red (2026-10-21)
  kinds: none
- empty breakdown: breakdownColumns answers two empty columns for an empty or absent breakdown.
  over: an empty array and no argument
  via: breakdownColumns handles an empty breakdown
  because: the Strava snapshot can be missing, and the tile must render an empty chart, not throw
  refuted: breakdownColumns reads the first row count without a guard -> the test breakdownColumns handles an empty breakdown went red (2026-10-21)
  kinds: none
- waka missing sources: mapWakaStats answers nulls and empty lists when every source is missing.
  over: an input object with no source
  via: mapWakaStats tolerates missing sources
  because: the WakaTime route calls four endpoints in parallel and any one can fail or answer empty
  refuted: mapWakaStats answers 0 hours instead of null when all time is missing -> the test mapWakaStats tolerates missing sources went red (2026-10-21)
  kinds: none
- trakt missing sources: mapTraktStats answers zeros and empty lists for missing or malformed sources.
  over: an empty input, and a watched shows answer that is an error object
  via: mapTraktStats tolerates missing or malformed sources
  because: the Trakt route makes four Trakt calls in parallel (stats, watched shows, episode history, movie history) and maps them into three sources, and an error body must not reach the tile as data
  refuted: mapTraktStats spreads the watched shows answer without an array check -> the test mapTraktStats tolerates missing or malformed sources went red (2026-10-21)
  kinds: none
- tier order: TIERS run hot to cold with one hue each.
  over: the six tier keys and their six accents
  via: TIERS run hot to cold with one hue each
  because: the Obsidian KPI row reads hot to cold, and the design record assigns each tier its own hue
  refuted: the now tier takes the primary accent -> the test TIERS run hot to cold with one hue each went red (2026-10-21)
  kinds: none
- year captions: The Spotify year columns carry an hours caption, and the last year reads so far until its last stream falls in December.
  over: three yearly rows with a last stream in February, and the same rows with a last stream in December
  via: spotifyView captions hours and marks the unfinished last year so far
  because: the current year is still growing, and its column must not read as a finished year
  refuted: the last year reads so far in December too -> the test spotifyView captions hours and marks the unfinished last year so far went red (2026-10-21)
  kinds: none
- zero percent: pct rounds to a whole percent and answers 0 for a zero total.
  over: two shares of 139 and one share of a zero total
  via: pct rounds and guards a zero total
  because: the percentage helpers run on days when a total is zero, and NaN in a badge is the visible symptom
  refuted: pct drops its zero total guard -> the test pct rounds and guards a zero total went red (2026-10-21)
  kinds: none
- no zero peak: layoutColumns marks no peak when every value is zero.
  over: one column whose value is zero
  via: layoutColumns with all zeros has no peak
  because: a peak caption on a zero column would label nothing
  refuted: layoutColumns marks the first zero column as the peak -> the test layoutColumns with all zeros has no peak went red (2026-10-21)
  kinds: none
- github local week: githubView drops every calendar day after the local date in America/Denver, so the week and the heatmap end on that date.
  over: a fifteen day calendar whose last day is a UTC tomorrow, read at 17:43 and at 08:00 local time
  via: githubView ends the week on the local date, not a later UTC calendar day
  because: GitHub ends the anonymous calendar on the UTC date but dates each commit in its own time zone, so each evening the week held an empty tomorrow and lost its oldest day
  refuted: githubView keeps every calendar day, so a UTC tomorrow stays in the week -> the test githubView ends the week on the local date, not a later UTC calendar day went red (2026-11-03)
  kinds: none
- spotify token refresh: Only getAccessToken calls getRefreshToken in spotify-auth.js.
  protects: getRefreshToken in app/lib/spotify-auth.js
  chokepoint: getAccessToken in app/lib/spotify-auth.js
  from: anywhere
  because: getAccessToken caches the access token and writes a rotated refresh token back to Redis, but only when Spotify returns one; app/api/spotify-callback/route.js writes the Redis key directly, and the collector (services/spotify-collector/src/spotify.mjs) reads and rotates the same key, so the rule covers the calls inside spotify-auth.js only
  crossing: redis -> upstream
  kinds: credential
  checklist: capability-authorization dismissed: Spotify, not the site, accepts the refresh token and bounds its scope
  checklist: revalidated-permission dismissed: no deferred work runs under the token, and each refresh asks Spotify again
  checklist: message-authenticity dismissed: no signed message is accepted here
  checklist: encrypted-storage dismissed: the site stores the token in Redis as plain text behind the KV REST token and adds no encryption of its own
  checklist: key-rotation-compatibility dismissed: the site encrypts nothing it retains
  checklist: separation-of-duties dismissed: no approval policy exists on a token refresh
- newest snapshot: newerEntry keeps a dated snapshot that a tile shows when the candidate is older or undated, and takes the candidate otherwise.
  over: a dated shown snapshot against an older, an undated, an equal and a newer candidate, and an undated or absent shown snapshot against a dated candidate; useCachedFetch passes the seed, the localStorage entry and the network answer through newerEntry, and no test runs the hook
  via: newerEntry never replaces a dated snapshot with an older or undated one
  because: the page seed, the localStorage entry and the API answer can each hold a different snapshot age; on 2026-11-05 a route answer from a 30 hour old cache replaced a seed of 180 with 138
  refuted: newerEntry drops the time comparison, so an older dated candidate replaces the shown snapshot -> the test newerEntry never replaces a dated snapshot with an older or undated one went red (2026-11-05)
  kinds: none
- oldest answer: responseTime dates a payload by its oldest upstream Date header, and by the clock when no Date header parses.
  over: two responses with different Date headers, one response without a Date header beside one with it, one response without it, and no responses
  via: responseTime takes the oldest Date header and falls back to the clock
  because: a payload is only as fresh as its oldest part, and the Next data cache keeps the upstream headers, so a cached answer keeps its true age
  refuted: responseTime takes the newest Date header instead of the oldest -> the test responseTime takes the oldest Date header and falls back to the clock went red (2026-11-05)
  kinds: none
- source timeout: settleLoaders drops a source that does not answer within its own timeout, or within the shared timeout when it has none.
  over: loaders that throw, reject, answer null, answer after the shared timeout, and answer after the shared timeout but inside their own timeout
  via: settleLoaders drops a loader that throws, rejects, returns null or times out
  because: on 2026-11-05 GitHub's public calendar answered in about 7 seconds, and the single 3 second limit dropped the GitHub seed from two page renders
  refuted: settleLoaders applies the shared timeout to every source and ignores the per-source timeout -> the test settleLoaders drops a loader that throws, rejects, returns null or times out went red (2026-11-05)
  kinds: none
