# CLAUDE.md

Context for agents working in this repository. The durable truth about the
code lives in the `*.spec.md` files. This file carries the rules and the
design record that the specs cannot hold. History before
2026-09-24 sits in `~/backups/claude-project-dirs/portfolio` on vinelab.

## Start here

1. Run `npx --no -- coherence spec --check` and `npx --no -- coherence run`
   before you offer a branch for merge.
2. Record a choice with `npx --no -- coherence decide` at the moment you make
   it.
3. Read `docs/design.md` for the rationale behind the rules.
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
  `npx --no -- coherence decide`.
- Update `CHANGELOG.md` under `[Unreleased]` when work is confirmed finished.

## Testing

`pnpm test` runs `node --test` over `app/lib/**/*.test.mjs`,
`scripts/**/*.test.mjs`, and `services/**/*.test.mjs`. Anything with logic
worth a test lives in a pure `.mjs` module and the `.jsx` tile stays a thin
renderer. Fixtures use invented values shaped like the live payloads. Never put
a real credential or a real third-party id in a fixture.

`pnpm format:check`, `pnpm test` and `pnpm build` must pass before a branch
is offered for merge; CI runs all three. Tailwind v4 fails
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
- Every data headline is 40px Geist Mono bold with a 13px gray unit, from
  `HEADLINE` and `HEADLINE_UNIT` in `app/lib/accents.mjs`. One headline per tile,
  in the tile hue; secondary counts go on a gray mono line under it.
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

None. The Oura tile and its routes were deleted on 2026-10-13; do not bring
them back.

## Coherence

The project runs `@posthog/coherence` 1.x. The grammar is in `node_modules/@posthog/coherence/docs/spec.md` and the config keys are in `docs/config.md` beside it.

1. Every spec bullet is one invariant. A totality oracle names a `node:test` title in `via:`. A chokepoint names the protected symbol in `protects:` and the one symbol every reference passes through in `chokepoint:`.
2. Append a whole bullet after another bullet's last line. A bullet inserted between a bullet and its `refuted:`, `kinds:` or `checklist:` lines takes them.
3. Witness a totality oracle with `npx --no -- coherence refute <folder>/<name> --broke "<what you changed>"` while the break is staged. Then restore the code and run `npx --no -- coherence run`.
4. Record a choice with `npx --no -- coherence decide "<chose>" --over "<rejected>" --because "<why>" --session <id> --agent <name>`.
5. The rationale that the 0.37 specs carried in prose lives in `docs/design.md` under Rationale by component.
6. The 0.37 journal is kept under `.coherence/archive-0.37` as history. Coherence 1.x does not read it.
7. Jake runs `npx --no -- coherence hooks install --host claude` once on this branch. The tracked hooks still name the deleted 0.37 script.
