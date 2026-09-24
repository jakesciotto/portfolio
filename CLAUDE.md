# CLAUDE.md

Context for agents working in this repository. The durable truth about the
code lives in the `*.spec.md` files and the coherence graph. This file carries
the rules and the design record that the graph cannot derive. History before
2026-09-24 sits in `~/backups/claude-project-dirs/portfolio` on vinelab.

## Start here

1. Run `npx coherence orient` for the one next action.
2. Run `npx coherence verify` before you offer a branch for merge.
3. Record a choice with `npx coherence decide` at the moment you make it.
4. Read the spec of the component you change: `portfolio.spec.md`,
   `app/lib/lib.spec.md`, `app/api/api.spec.md`,
   `app/components/components.spec.md`,
   `services/spotify-collector/collector.spec.md`.

## Repository rules

1. Never publish a password, an API key, or a token to git, npm, or Docker.
2. Never commit without explicit approval. Verify that no secret is included.
3. Never commit `.env`. Verify that `.env` is in `.gitignore`.
4. The integration branch is `staging`. Branch from `staging` and target
   `staging` in a PR. Do not target `main` directly.
5. Read the specs and `CHANGELOG.md` before you read the whole codebase.
6. No emoji in a commit message, a comment, or a planning document.
7. Release tags use semantic versioning: MAJOR for an incompatible change,
   MINOR for a compatible feature, PATCH for a compatible fix.
8. Do not create files in temporary directories for scripting or testing
   without explicit approval.

## Workflow

- Plan before a task with three or more steps. Write the plan in chat and
  wait for a yes.
- Never mark a task complete without proof. Run the tests, run the build,
  read the output.
- After a correction from the user, record the pattern with
  `npx coherence decide` or `npx coherence defect`.
- Update `CHANGELOG.md` under `[Unreleased]` when work is confirmed finished.

## Testing

`pnpm test` runs `node --test` over `app/lib/**/*.test.mjs`,
`scripts/**/*.test.mjs`, and `services/**/*.test.mjs`. Anything with logic
worth a test lives in a pure `.mjs` module and the `.jsx` tile stays a thin
renderer. Fixtures use invented values shaped like the live payloads. Never put
a real credential or a real third-party id in a fixture.

`pnpm build` must pass before a branch is offered for merge. Tailwind v4 fails
the build on an unknown token.

Manual checks after a visual change:

1. `pnpm dev`, then open the home page at 1152px, 900px, and 390px. No
   horizontal scroll. The KPI row wraps 7, then 4 plus 3, then 2 per line.
   Tile hover tints the border. No shadow anywhere.
2. Curl each API route and check the `Cache-Control` header and the top-level
   keys, for example `curl -sD - -o /dev/null http://localhost:3000/api/trakt-stats`.
3. Turn on reduce-motion in the OS and reload. Every tile is visible without
   scroll animation.
4. Open `/blog` and one post. The tokens carry the page, no white surface.

Only one `next dev` can run per checkout.

## Design record (approved 2026-08-29)

Direction: neon on glass black. Cyberpunk but elegant. Colour pops through
contrast between hues, never through glow.

- One theme, dark only. Do not reintroduce a light mode or a theme toggle.
- Ground `#050508`. Cards are glass: `rgba(12,12,18,0.55)` with
  `backdrop-filter: blur(18px)` over a dim four-hue radial field. Hairlines
  `rgba(255,255,255,0.075)`, stronger `0.13`. Radius 14px.
- Six hues, one notch below full neon: cyan `#3dd1e4`, magenta `#df41d2`,
  lime `#b7e84e`, amber `#e3a54c`, violet `#9161dc`, red `#dd4962`. Red
  means overdue only. Do not go brighter. The first set was "a little loud".
- Each tile owns one hue. Only numbers and identity marks wear colour. Titles,
  labels, and body copy stay ink `#f4f4f7`, gray `#9a9aa9`, faint `#5b5b6a`.
  No text-shadow, no box-shadow.
- Geist Sans for prose and the hero name, Geist Mono for numbers, titles, and
  labels.
- One time-range control style: 10px mono uppercase pills with a 1px hairline.
- Obsidian is a KPI row, not a tile: a summary card plus six tier cards, hot to
  cold (now magenta, next cyan, waiting amber, blocked red, someday violet,
  backlog lime).
- Data tiles lead with the number that surprises and say when data is stale.
- Restyle decisions go through an HTML mockup artifact first, several rounds.
  Jake reacts to rendered pages, not descriptions. A bare "yes" after a
  multi-option mockup is not a pick. Ask which option.

## Lessons that cost a run

- WakaTime reports only editors with a WakaTime plugin. `ai_model_breakdown`
  on `stats/<range>` gives lines per model.
- `stats/last_30_days` and `stats/last_6_months` return `is_up_to_date: false`
  with empty arrays on the first call.
- Never refresh a production OAuth token from a local probe. Trakt and Spotify
  rotate the refresh token and the route persists it in Redis.
- PostHog volume is asymmetric by design: every route emits `*_fetched` server
  events, the five client events need a click. Client and server write to the
  same project. Prove the client pipeline from the network requests, not the
  console.
- Scroll feel has two causes. Latency is the Lenis `duration` (0.8). Jank is
  23 tiles with `will-change: transform` plus a blur. Revisit only with a
  measurement on a slower machine than an M4 Max.
- The tiles cache stats in localStorage for up to an hour. A stale headline
  after a deploy is the cache, not a bug. Clear localStorage before you judge.

## Open items

- The about tile does not fully fit the theme.
- The WakaTime number is slightly larger than the neighbouring tiles.
- The Strava tile should show the entire workout.
- The Oura tile sits behind `FEATURE_OURA` (off). The oura-stats route can
  rotate the refresh token with no lock, and a fail-fast `Promise.all` nulls
  all three metrics.

## Coherence

The block below is owned by `npx coherence claude`. Do not edit it by hand.

<!-- coherence:begin -->
<!-- GENERATED by `coherence claude` from the spec+code graph. Do not edit by hand —
     edit the *.spec.md files and re-run. Everything OUTSIDE these markers is authored prose. -->

_Derived from 5 components · 94 files · 91 symbols · 8 boundary claims._

## Component map (derived)

> Each component directory, its spec intent (one line), and its files. Per-file
> roles are authored elsewhere — the graph only knows component-level intent.

### jakesciotto.com `/`
A personal site that shows live numbers about Jake's life on a neon-on-glass bento grid.

_files:_
- `page.jsx`
- `page.jsx`
- `layout.jsx`
- `page.jsx`
- `posthog.js`
- `page.jsx`
- `page.jsx`
- `page.jsx`
- `tweet-client.jsx`
- `instrumentation-client.js`
- `next.config.js` — @type {import('next').NextConfig}
- `postcss.config.js`

### API routes `app/api`
Server routes that read tokens and snapshots, call upstreams, shape a payload, and set edge caching.

_files:_ `route.js`, `route.js`, `route.js`, `route.js`, `route.js`, `route.js`, `route.js`, `route.js`, `route.js`, `route.js`, `route.js`, `route.js`, `route.js`, `route.js`

### Tiles and chart primitives `app/components`
Thin React renderers over the view objects from app/lib, styled by the neon-on-glass tokens.

_files:_ `about-tile.jsx`, `animated-number.jsx`, `bento-grid.jsx`, `cert-strip.jsx`, `education-tile.jsx`, `experience-tile.jsx`, `fixed-header.jsx`, `footer.jsx`, `github-tile.jsx`, `header-now-playing.jsx`, `hero-name.jsx`, `hero-tile.jsx`, `magnetic-link.jsx`, `mdx-components.jsx`, `obsidian-row.jsx`, `oura-tile.jsx`, `project-tile.jsx`, `scroll-provider.jsx`, `skill-tags.jsx`, `spotify-recent-tile.jsx`, `spotify-tile.jsx`, `stat-tile.jsx`, `strava-tile.jsx`, `tile-skeleton.jsx`, `tile.jsx`, `tracked-link.jsx`, `trakt-tile.jsx`, `badge.jsx`, `bar-list.jsx`, `columns.jsx`, `heatmap.jsx`, `period-pills.jsx`, `sparkline.jsx`, `tooltip.jsx`, `wakatime-tile.jsx`, `work-accordion.jsx`

### View math `app/lib`
Pure modules that turn API payloads into the view objects the tiles render.

_files:_
- `accents.mjs`
- `columns.mjs`
- `columns.test.mjs`
- `flags.mjs` — Read at build time: the home page is prerendered, so a change needs a redeploy.
- `format.mjs`
- `format.test.mjs`
- `obsidian-row.mjs`
- `obsidian-row.test.mjs`
- `posts.js`
- `spotify-auth.js`
- `spotify-view.mjs`
- `spotify-view.test.mjs`
- `trakt-stats.mjs`
- `trakt-stats.test.mjs`
- `use-cached-fetch.js`
- `utils.js`
- `wakatime-stats.mjs`
- `wakatime-stats.test.mjs`

### Spotify collector `services/spotify-collector`
A dependency-free Node service on vinelab that stores every play in SQLite and publishes yearly stats to Redis.

_files:_ `aggregate.mjs`, `cli.mjs`, `db.mjs`, `import-archive.mjs`, `jobs.mjs`, `notify.mjs`, `plays.mjs`, `redis.mjs`, `serve.mjs`, `spotify.mjs`, `clients.test.mjs`, `db.test.mjs`, `jobs.test.mjs`, `plays.test.mjs`

## Invariants → chokepoint → oracle (derived)

> Each named invariant, the chokepoint symbol that enforces it, and the oracle
> (test or guard) that asserts it holds. Parsed from the `boundary` claims in the specs.

| Invariant | Component | Chokepoint | Oracle |
| --- | --- | --- | --- |
| a live value never lowers a stored value | View math | `withLive` | `withLive never lowers a value and ignores a missing live key` |
| a zero bar keeps a visible floor | View math | `layoutColumns` | `layoutColumns renders zero as a stub and enforces a 3% floor` |
| a missing source yields a null view, not a crash | View math | `spotifyView` | `spotifyView returns null without an overview` |
| a zero total never divides | View math | `tierCards` | `tierCards guards missing data and a zero total` |
| a play is stored once | Spotify collector | `dedupeKey` | `an archive row and an api row for the same play share a dedupe key` |
| stats publish only after the archive is loaded | Spotify collector | `publish` | `publish writes only the live key until the archive is loaded` |
| the live key counts only the current year | Spotify collector | `liveSummary` | `the live key counts only the current year` |
| a failed run notifies once until recovery | Spotify collector | `serve` | `serve records a failed run and notifies once until recovery` |

<sub>Generated at 2026-09-24 17:11Z.</sub>
<!-- coherence:end -->
