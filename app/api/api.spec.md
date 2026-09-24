# API routes
Server routes that read tokens and snapshots, call upstreams, shape a payload, and set edge caching.

## works when
- github-stats/route.js exists at this node
- spotify-stats/route.js exists at this node
- wakatime-stats/route.js exists at this node
- trakt-stats/route.js exists at this node
- strava-stats/route.js exists at this node
- obsidian-stats/route.js exists at this node

## why
Every route follows one pattern: an in-memory token cache with a sixty second
buffer plus Redis for refresh-token rotation, parallel upstream calls, a pure
mapper from `app/lib`, JSON with null fallbacks, and a `Cache-Control` header
with `s-maxage` and `stale-while-revalidate`. A failed or empty payload goes out
`no-store`, because the edge would otherwise serve the failure for the full TTL.

Server analytics go through `captureServer` in `app/posthog.js`, which flushes in
`after()` so the request path never waits on PostHog. One page load emits about a
dozen `*_fetched` events with no human involved. That asymmetry is by design.

Snapshot routes (Strava, Obsidian, Spotify history) only read Redis. Local
importers write the snapshots. A route never pages an expensive upstream on a
visitor's request.

Never refresh a production OAuth token from a local probe. Trakt and Spotify
rotate the refresh token and the route persists it in Redis, so a local refresh
invalidates production.

These routes have no unit tests today. The invariants above are rules, not
oracles. The verification is the manual curl check in the testing section of
`CLAUDE.md`.
