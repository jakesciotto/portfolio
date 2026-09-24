# jakesciotto.com
A personal site that shows live numbers about Jake's life on a neon-on-glass bento grid.

## works when
- app/global.css exists at root
- next.config.js exists at root
- app/posthog.js exists at root

## why
The site exists to lead with the number that surprises. Every data tile shows a
live or snapshot figure first and says when the data is stale. A tile with no
number is a broken tile, so every tile renders a skeleton until data arrives and
keeps stale cached data over an empty response.

One theme only: neon on glass black, dark, no glow, no light mode. Each tile owns
one of six hues. Only numbers and identity marks wear colour. Restyle decisions go
through an HTML mockup before code. The design record is the design section
of `CLAUDE.md`.

Logic and rendering are split on purpose. Anything worth a test is a pure `.mjs`
module under `app/lib` with fixture tests, and the `.jsx` tile stays a thin
renderer. Fixtures use invented values shaped like the live payloads and never a
real credential or a real third-party id.

A visitor must never hit an upstream API. Every route sets `Cache-Control` with
`s-maxage` so Vercel's edge serves repeat visitors, snapshots feed the expensive
tiles from Redis, and the client hook caches in localStorage and polls only while
the tab is visible. Empty or failed payloads go out `no-store` so a bad response
never gets cached.

Integration branch is `staging`. Releases carry semantic version tags. Secrets
never enter git, fixtures, or `public/`.
