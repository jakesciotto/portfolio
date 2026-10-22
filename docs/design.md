# Design

The visual design record is the "Design record" section of `CLAUDE.md`. This file keeps the reasoning behind the rules in the coherence specs.

## Rationale by component

The coherence 0.37 specs carried this prose in a `## why` section. Coherence 1.x keeps rationale on the invariant as a `because:` line, so the longer account lives here.

### jakesciotto.com

The site exists to lead with the number that surprises. Every data tile shows a live or snapshot figure first and says when the data is stale. A tile with no number is a broken tile, so every tile renders a skeleton until data arrives and keeps stale cached data over an empty response.

One theme only: neon on glass black, dark, no glow, no light mode. Each tile owns one of six hues. Only numbers and identity marks wear colour. Restyle decisions go through an HTML mockup before code.

Logic and rendering are split on purpose. Anything worth a test is a pure `.mjs` module under `app/lib` with fixture tests, and the `.jsx` tile stays a thin renderer. Fixtures use invented values shaped like the live payloads and never a real credential or a real third-party id.

Visitor requests are served from the edge or Redis where possible. Routes call upstreams only on an edge miss. Every data route sets `Cache-Control` with `s-maxage` on a good payload, so the Vercel edge serves repeat visitors. The two OAuth callbacks (`spotify-callback`, `trakt-callback`) are exempt: they answer HTML or an error and set no `Cache-Control`. Snapshots feed the expensive tiles from Redis. The client hook caches in localStorage and polls only while the tab is visible. Most routes send an empty or failed payload as `no-store`, so the edge never caches a bad response. Five routes have a failure path that sets neither `no-store` nor `s-maxage`: the catch paths of `wakatime-stats` (and its missing-key path), `trakt-stats`, `github-stats`, `spotify-recent` and `spotify-top`. The last three answer a 500.

The 0.37 spec also checked that `app/global.css`, `next.config.js` and `app/posthog.js` exist. Coherence 1.x has no existence check, so those three checks are dropped.

The integration branch is `staging`. Releases carry semantic version tags. Secrets never enter git, fixtures, or `public/`.

### API routes

Every route follows one pattern: an in-memory token cache with a sixty second buffer plus Redis for refresh-token rotation, parallel upstream calls where a route has more than one, a pure mapper from `app/lib`, JSON with null fallbacks, and a `Cache-Control` header with `s-maxage` and `stale-while-revalidate`. A failed or empty payload goes out `no-store` on most routes, because the edge would otherwise serve the failure for the full TTL. The exceptions are listed under jakesciotto.com.

Server analytics go through `captureServer` in `app/posthog.js`, which flushes in `after()` so the request path never waits on PostHog. One page load emits about a dozen `*_fetched` events with no human involved. That asymmetry is by design.

Snapshot routes (Strava, Obsidian, Spotify history) only read Redis. Local importers write the snapshots. A route never pages an expensive upstream on a visitor's request.

Never refresh a production OAuth token from a local probe. Trakt and Spotify rotate the refresh token and the route persists it in Redis, so a local refresh invalidates production.

The 0.37 spec checked that the six data routes (`github-stats`, `spotify-stats`, `wakatime-stats`, `trakt-stats`, `strava-stats`, `obsidian-stats`) exist. That check is dropped.

The routes have no unit tests. Their spec declares the entrances and no invariant. The verification is the manual curl check in the testing section of `CLAUDE.md`.

### Tiles and chart primitives

A tile renders. It does not compute. Every number a tile shows comes from a pure module under `app/lib` or from the route payload, so a tile has no logic worth a test and the tests live next to the math.

One theme. Each tile owns one of six hues through `--tile-accent`, and only the numbers and the identity marks wear it. No text-shadow, no box-shadow, no glow, no light mode.

Charts are hand-built: div columns, an inline SVG sparkline, and a heatmap grid. No chart library. `Columns` fills 0.8 of each column, captions the peak or the last column, and dims a partial bar.

Every tile starts at `opacity: 0` and the bento grid reveals it through a GSAP ScrollTrigger batch. Reduce-motion must still show every tile.

The obsidian cell is a KPI row of seven cards, not a tile.

The 0.37 spec checked that `tile.jsx`, `bento-grid.jsx`, `ui/columns.jsx`, `ui/badge.jsx` and `ui/period-pills.jsx` exist, and that `bento-grid.jsx` imports `gsap`. Coherence 1.x has no existence or import check, so these six checks are dropped. Nothing now fails if the GSAP reveal is removed.

### View math

The Spotify tile merges a live counter into a snapshot. The merge never lowers a stored value, because the snapshot is the archive and the live key is an estimate that runs about two percent low. A merge that could lower a value would make the headline flicker between refreshes.

A zero bar keeps a visible stub, because a bar that disappears at zero reads as missing data, and the tile must tell a zero from a gap.

Every mapper answers a null or empty view for a missing source. The Trakt and WakaTime routes call upstreams in parallel and any one of them can fail. The Spotify stats route reads five Redis snapshot keys and answers an overview of null on a missing key or a Redis failure. The tile shows a skeleton or stale cache on null. A thrown error would blank the tile.

Share calculations never divide by a zero total, because the Obsidian KPI row and the percentage helpers run on days when the active count is zero, and NaN in a badge is the visible symptom.

Every data tile headline has one size, because the headline is the number that surprises, and five sizes made neighbouring tiles compete. The size lives in `HEADLINE` in accents.mjs; a tile never sets its own.

The Strava tile lists every workout type, because a folded "Other" row hid ten types and 141 activities.

The Spotify access token is refreshed in one place, `getAccessToken`, which caches the access token and writes a rotated refresh token back to Redis.

### Spotify collector

Spotify's recently-played endpoint holds fifty plays and the archive export arrives months later, so the same play reaches the database from both. A play is stored once: the dedupe key is the timestamp truncated to the second plus the track URI, which both sources share. That keeps the yearly hours honest.

Stats publish only after the archive is loaded. Fifty live plays cannot describe a year, and a publish from a fresh database would replace the real yearly hours on the site with near zero. `publish --force` is the deliberate override.

The live key counts only the current year in the process time zone, which the collector env sets to America/New_York. The site shows the current year as a growing column and the archive buckets use the same local year. A UTC bucket disagreed with the counter by about three hours.

The 0.37 spec named the America/New_York rule. The 1.x spec drops it. The test uses mid-February and mid-September dates in the runner's zone, so neither the zone rule nor the year boundary has an oracle.

A failed run notifies once until recovery, because the loop runs every fifteen minutes and a repeated alert for one outage is noise that trains the reader to ignore the real one.
