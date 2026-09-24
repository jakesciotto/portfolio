# portfolio — map for agents

> Generated from the spec tree by the coherence harness. Do not edit by hand.

A personal site that shows live numbers about Jake's life on a neon-on-glass bento grid.

## Components

### jakesciotto.com  `.`
A personal site that shows live numbers about Jake's life on a neon-on-glass bento grid.

_why:_ The site exists to lead with the number that surprises. Every data tile shows a live or snapshot figure first and says when the data is stale. A tile with no number is a broken tile, so every tile renders a skeleton until data arrives and keeps stale cached data over an empty response. One theme only: neon on glass black, dark, no glow, no light mode. Each tile owns one of six hues. Only numbers and identity marks wear colour. Restyle decisions go through an HTML mockup before code. The design record is the design section of `CLAUDE.md`. Logic and rendering are split on purpose. Anything worth a test is a pure `.mjs` module under `app/lib` with fixture tests, and the `.jsx` tile stays a thin renderer. Fixtures use invented values shaped like the live payloads and never a real credential or a real third-party id. A visitor must never hit an upstream API. Every route sets `Cache-Control` with `s-maxage` so Vercel's edge serves repeat visitors, snapshots feed the expensive tiles from Redis, and the client hook caches in localStorage and polls only while the tab is visible. Empty or failed payloads go out `no-store` so a bad response never gets cached. Integration branch is `staging`. Releases carry semantic version tags. Secrets never enter git, fixtures, or `public/`.

_works when:_
- app/global.css exists at root
- next.config.js exists at root
- app/posthog.js exists at root

_files:_ `page.jsx`, `page.jsx`, `layout.jsx`, `page.jsx`, `posthog.js`, `page.jsx`, `page.jsx`, `page.jsx`, `tweet-client.jsx`, `instrumentation-client.js`, `next.config.js`, `postcss.config.js`

### API routes  `app/api`
Server routes that read tokens and snapshots, call upstreams, shape a payload, and set edge caching.

_why:_ Every route follows one pattern: an in-memory token cache with a sixty second buffer plus Redis for refresh-token rotation, parallel upstream calls, a pure mapper from `app/lib`, JSON with null fallbacks, and a `Cache-Control` header with `s-maxage` and `stale-while-revalidate`. A failed or empty payload goes out `no-store`, because the edge would otherwise serve the failure for the full TTL. Server analytics go through `captureServer` in `app/posthog.js`, which flushes in `after()` so the request path never waits on PostHog. One page load emits about a dozen `*_fetched` events with no human involved. That asymmetry is by design. Snapshot routes (Strava, Obsidian, Spotify history) only read Redis. Local importers write the snapshots. A route never pages an expensive upstream on a visitor's request. Never refresh a production OAuth token from a local probe. Trakt and Spotify rotate the refresh token and the route persists it in Redis, so a local refresh invalidates production. These routes have no unit tests today. The invariants above are rules, not oracles. The verification is the manual curl check in the testing section of `CLAUDE.md`.

_works when:_
- github-stats/route.js exists at this node
- spotify-stats/route.js exists at this node
- wakatime-stats/route.js exists at this node
- trakt-stats/route.js exists at this node
- strava-stats/route.js exists at this node
- obsidian-stats/route.js exists at this node

_files:_ `route.js`, `route.js`, `route.js`, `route.js`, `route.js`, `route.js`, `route.js`, `route.js`, `route.js`, `route.js`, `route.js`, `route.js`, `route.js`, `route.js`

### Tiles and chart primitives  `app/components`
Thin React renderers over the view objects from app/lib, styled by the neon-on-glass tokens.

_why:_ A tile renders. It does not compute. Every number a tile shows comes from a pure module under `app/lib` or from the route payload, so a tile has no logic worth a test and the tests live next to the math. One theme. Each tile owns one of six hues through `--tile-accent`, and only the numbers and the identity marks wear it. No text-shadow, no box-shadow, no glow, no light mode. The full record is the design section of `CLAUDE.md`. Charts are hand-built: div columns, an inline SVG sparkline, and a heatmap grid. No chart library. `Columns` fills 0.8 of each column, captions the peak or the last column, and dims a partial bar. Every tile starts at `opacity: 0` and the bento grid reveals it through a GSAP ScrollTrigger batch. Reduce-motion must still show every tile. The obsidian cell is a KPI row of seven cards, not a tile.

_works when:_
- tile.jsx exists at this node
- bento-grid.jsx exists at this node
- ui/columns.jsx exists at this node
- ui/badge.jsx exists at this node
- ui/period-pills.jsx exists at this node
- bento-grid.jsx imports gsap

_files:_ `about-tile.jsx`, `animated-number.jsx`, `bento-grid.jsx`, `cert-strip.jsx`, `education-tile.jsx`, `experience-tile.jsx`, `fixed-header.jsx`, `footer.jsx`, `github-tile.jsx`, `header-now-playing.jsx`, `hero-name.jsx`, `hero-tile.jsx`, `magnetic-link.jsx`, `mdx-components.jsx`, `obsidian-row.jsx`, `oura-tile.jsx`, `project-tile.jsx`, `scroll-provider.jsx`, `skill-tags.jsx`, `spotify-recent-tile.jsx`, `spotify-tile.jsx`, `stat-tile.jsx`, `strava-tile.jsx`, `tile-skeleton.jsx`, `tile.jsx`, `tracked-link.jsx`, `trakt-tile.jsx`, `badge.jsx`, `bar-list.jsx`, `columns.jsx`, `heatmap.jsx`, `period-pills.jsx`, `sparkline.jsx`, `tooltip.jsx`, `wakatime-tile.jsx`, `work-accordion.jsx`

### View math  `app/lib`
Pure modules that turn API payloads into the view objects the tiles render.

_why:_ The Spotify tile merges a live counter into a snapshot, and the merge honours "a live value never lowers a stored value" because the snapshot is the archive and the live key is an estimate that runs about two percent low. A merge that could lower a value would make the headline flicker between refreshes. Column charts honour "a zero bar keeps a visible floor" because a bar that disappears at zero reads as missing data, and the tile must tell a zero from a gap. Every mapper honours "a missing source yields a null view, not a crash" because the routes call upstreams in parallel and any one of them can fail. The tile shows a skeleton or stale cache on null. A thrown error would blank the tile. Share calculations honour "a zero total never divides" because the Obsidian KPI row and the percentage helpers run on days when the active count is zero, and NaN in a badge is the visible symptom.

_works when:_
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

_files:_ `accents.mjs`, `columns.mjs`, `columns.test.mjs`, `flags.mjs`, `format.mjs`, `format.test.mjs`, `obsidian-row.mjs`, `obsidian-row.test.mjs`, `posts.js`, `spotify-auth.js`, `spotify-view.mjs`, `spotify-view.test.mjs`, `trakt-stats.mjs`, `trakt-stats.test.mjs`, `use-cached-fetch.js`, `utils.js`, `wakatime-stats.mjs`, `wakatime-stats.test.mjs`

### Spotify collector  `services/spotify-collector`
A dependency-free Node service on vinelab that stores every play in SQLite and publishes yearly stats to Redis.

_why:_ Spotify's recently-played endpoint holds fifty plays and the archive export arrives months later, so the same play reaches the database from both. "A play is stored once" keeps the yearly hours honest: the dedupe key is the timestamp truncated to the second plus the track URI, which both sources share. "Stats publish only after the archive is loaded" protects the site. Fifty live plays cannot describe a year, and a publish from a fresh database would replace the real yearly hours on the site with near zero. `publish --force` is the deliberate override. "The live key counts only the current year" in America/New_York, because the site shows the current year as a growing column and the archive buckets use the same local year. A UTC bucket disagreed with the counter by about three hours. "A failed run notifies once until recovery" because the loop runs every fifteen minutes and a repeated alert for one outage is noise that trains the reader to ignore the real one.

_works when:_
- boundary "a play is stored once" at dedupeKey via test "an archive row and an api row for the same play share a dedupe key"
- boundary "stats publish only after the archive is loaded" at publish via test "publish writes only the live key until the archive is loaded"
- boundary "the live key counts only the current year" at liveSummary via test "the live key counts only the current year"
- boundary "a failed run notifies once until recovery" at serve via test "serve records a failed run and notifies once until recovery"
- passes test "insertPlays ignores duplicates and lastTs reads the newest row"
- passes test "ms_played is the gap to the previous play, capped at the duration"
- passes test "collect asks for plays after the newest stored one and publish writes five keys"
- passes test "importArchive loads every history file once"

_files:_ `aggregate.mjs`, `cli.mjs`, `db.mjs`, `import-archive.mjs`, `jobs.mjs`, `notify.mjs`, `plays.mjs`, `redis.mjs`, `serve.mjs`, `spotify.mjs`, `clients.test.mjs`, `db.test.mjs`, `jobs.test.mjs`, `plays.test.mjs`

## Structure

```
portfolio/
├─ app/
│  ├─ api/  ●
│  │  ├─ github-stats/
│  │  │  └─ route.js
│  │  ├─ obsidian-stats/
│  │  │  └─ route.js
│  │  ├─ oura-callback/
│  │  │  └─ route.js
│  │  ├─ oura-stats/
│  │  │  └─ route.js
│  │  ├─ spotify-callback/
│  │  │  └─ route.js
│  │  ├─ spotify-live/
│  │  │  └─ route.js
│  │  ├─ spotify-now-playing/
│  │  │  └─ route.js
│  │  ├─ spotify-recent/
│  │  │  └─ route.js
│  │  ├─ spotify-stats/
│  │  │  └─ route.js
│  │  ├─ spotify-top/
│  │  │  └─ route.js
│  │  ├─ strava-stats/
│  │  │  └─ route.js
│  │  ├─ trakt-callback/
│  │  │  └─ route.js
│  │  ├─ trakt-stats/
│  │  │  └─ route.js
│  │  └─ wakatime-stats/
│  │     └─ route.js
│  ├─ blog/
│  │  ├─ [slug]/
│  │  │  └─ page.jsx
│  │  └─ page.jsx
│  ├─ components/  ●
│  │  ├─ ui/
│  │  │  ├─ badge.jsx
│  │  │  ├─ bar-list.jsx
│  │  │  ├─ columns.jsx
│  │  │  ├─ heatmap.jsx
│  │  │  ├─ period-pills.jsx
│  │  │  ├─ sparkline.jsx
│  │  │  └─ tooltip.jsx
│  │  ├─ about-tile.jsx
│  │  ├─ animated-number.jsx
│  │  ├─ bento-grid.jsx
│  │  ├─ cert-strip.jsx
│  │  ├─ education-tile.jsx
│  │  ├─ experience-tile.jsx
│  │  ├─ fixed-header.jsx
│  │  ├─ footer.jsx
│  │  ├─ github-tile.jsx
│  │  ├─ header-now-playing.jsx
│  │  ├─ hero-name.jsx
│  │  ├─ hero-tile.jsx
│  │  ├─ magnetic-link.jsx
│  │  ├─ mdx-components.jsx
│  │  ├─ obsidian-row.jsx
│  │  ├─ oura-tile.jsx
│  │  ├─ project-tile.jsx
│  │  ├─ scroll-provider.jsx
│  │  ├─ skill-tags.jsx
│  │  ├─ spotify-recent-tile.jsx
│  │  ├─ spotify-tile.jsx
│  │  ├─ stat-tile.jsx
│  │  ├─ strava-tile.jsx
│  │  ├─ tile-skeleton.jsx
│  │  ├─ tile.jsx
│  │  ├─ tracked-link.jsx
│  │  ├─ trakt-tile.jsx
│  │  ├─ wakatime-tile.jsx
│  │  └─ work-accordion.jsx
│  ├─ lib/  ●
│  │  ├─ accents.mjs
│  │  ├─ columns.mjs
│  │  ├─ columns.test.mjs
│  │  ├─ flags.mjs
│  │  ├─ format.mjs
│  │  ├─ format.test.mjs
│  │  ├─ obsidian-row.mjs
│  │  ├─ obsidian-row.test.mjs
│  │  ├─ posts.js
│  │  ├─ spotify-auth.js
│  │  ├─ spotify-view.mjs
│  │  ├─ spotify-view.test.mjs
│  │  ├─ trakt-stats.mjs
│  │  ├─ trakt-stats.test.mjs
│  │  ├─ use-cached-fetch.js
│  │  ├─ utils.js
│  │  ├─ wakatime-stats.mjs
│  │  └─ wakatime-stats.test.mjs
│  ├─ privacy/
│  │  └─ page.jsx
│  ├─ terms/
│  │  └─ page.jsx
│  ├─ tweets/
│  │  ├─ page.jsx
│  │  └─ tweet-client.jsx
│  ├─ layout.jsx
│  ├─ page.jsx
│  └─ posthog.js
├─ services/
│  └─ spotify-collector/  ●
│     ├─ src/
│     │  ├─ aggregate.mjs
│     │  ├─ cli.mjs
│     │  ├─ db.mjs
│     │  ├─ import-archive.mjs
│     │  ├─ jobs.mjs
│     │  ├─ notify.mjs
│     │  ├─ plays.mjs
│     │  ├─ redis.mjs
│     │  ├─ serve.mjs
│     │  └─ spotify.mjs
│     └─ test/
│        ├─ clients.test.mjs
│        ├─ db.test.mjs
│        ├─ jobs.test.mjs
│        └─ plays.test.mjs
├─ instrumentation-client.js
├─ next.config.js
└─ postcss.config.js
```

