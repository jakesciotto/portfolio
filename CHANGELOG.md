# CHANGELOG.md

All notable changes to this project will be documented in this file.


## Change Categories

Use these standard categories for each version entry:

- **Added** — New features or capabilities
- **Changed** — Changes to existing functionality
- **Deprecated** — Soon-to-be removed features
- **Removed** — Removed features
- **Fixed** — Bug fixes
- **Security** — Security vulnerability fixes

---

## Template Entry

Copy and customize this template for new releases:

```
## [X.Y.Z] - YYYY-MM-DD

### Added

- New feature 1

### Changed

- Updated behavior of existing feature

### Fixed

- Bug fix 1

### Security

- Security fix 1
```

---

**Note:** Maintain this changelog by adding entries under `[Unreleased]` during development, then moving them to a versioned section at release time.

## [Unreleased]

## [1.10.0] - 2026-10-22

### Changed
- The home page HTML carries the github, wakatime, obsidian, spotify stats and strava (all) data, so those tiles paint with real numbers and no skeleton. The page stays static with a 5 minute revalidate; `app/lib/sources/tile-data.js` loads the five sources through `unstable_cache`, with a 3 s timeout per source, and only on Vercel.
- Each of those five routes is a thin wrapper over a loader in `app/lib/sources/`; payloads, headers and events are unchanged.
- `useCachedFetch` takes an `initial` seed and writes a fresh seed to localStorage, so the first load, the poll and a tab focus all skip the network while the seed is younger than the tile TTL.
- The GitHub heatmap ends on the latest date in the payload instead of the render clock, so server and client build the same grid.
- Trakt, spotify top, spotify recent, spotify live and now playing stay client-fetched, because their routes rotate an OAuth refresh token.

### Security
- dompurify 3.4.16 to 3.4.17 through posthog-js (GHSA-mrv2-3pqr-j5jr, GHSA-c6gr-qvv4-5v3f, and the SAFE_FOR_TEMPLATES and IN_PLACE advisories).

## [1.9.0] - 2026-10-22

### Changed
- Coherence moved from @danilocampos/coherence 0.37.1 to @posthog/coherence 1.8.0: specs rewritten in the 1.x bullet grammar, the why prose moved to docs/design.md, the 0.37 journal archived under .coherence/archive-0.37, CI runs spec --check and the chokepoint run, and jsconfig.json excludes the local data folder so the TypeScript server stays on.
- Home page first paint: tiles render visible instead of waiting on GSAP, and only tiles below the fold animate in on scroll.
- The hero name animates with CSS keyframes and ships no JavaScript.
- posthog-js loads at browser idle through a dynamic import; `app/lib/analytics.mjs` queues up to 50 events until it attaches.
- GSAP, ScrollTrigger and Lenis load through one dynamic import in `app/lib/motion.mjs`. The initial home page JS drops from 382 KB to 231 KB (gzip).

### Added
- easton mcp in the projects tile.

### Removed
- The `@gsap/react` dependency.

### Security
- next 16.4.0 to 16.4.2 (GHSA-2464-fhr4-w9xw image optimizer RCE, GHSA-p3m5-59mp-jv5r Server Actions DoS).

## [1.8.0] - 2026-10-13

### Changed
- Every data tile headline is one size: 40px Geist Mono bold with a 13px gray unit, from `HEADLINE` and `HEADLINE_UNIT` in `app/lib/accents.mjs`. Before, the sizes ran from 24px (strava) to 44px (spotify). A test fails if a tile sets its own large size.
- The about tile cards use mono headings and violet numerals at 13px. The coloured verdict badges stay in the bottom right corner.
- The strava tile lists all workout types in two columns (one under 640px), with no "Other" row. Hours is the one magenta headline; activities, miles and the type count move to a gray line. `breakdownColumns` in `app/lib/strava-view.mjs` does the split.

### Removed
- The Oura tile, `/api/oura-stats`, `/api/oura-callback`, `app/lib/flags.mjs` (`FEATURE_OURA`) and the half-width projects layout.

## [1.7.2] - 2026-10-13

### Changed
- In-range dependency updates: `next` 16.4.0, `radix-ui` 1.8.0, `lucide-react` 1.55.0, `posthog-js` 1.438.7, `posthog-node` 5.55.2, `@upstash/redis` 1.39.0, `postcss` 8.5.29, `react-parallax-tilt` 1.7.346, `prettier` 3.9.10.

## [1.7.1] - 2026-10-13

### Security
- `next` 16.3.5 to 16.3.8: fixes the critical `next/og` remote code execution, the image server-side request forgery, and five lower advisories. `sharp` 0.35.5, `source-map-js` 1.2.2 and `dompurify` 3.4.16 come with in-range updates.
- `pnpm audit` ignores GHSA-hp3w-g68c-fv3c (`sprintf-js`, moderate). No patched release exists, and `argparse` loads it only from the `js-yaml` command-line tool, which the site never runs.

## [1.7.0] - 2026-10-11

### Changed
- `/tweets` shows 32 tweets from the Twitter archive, ranked by likes plus retweets, from `app/lib/tweets.json`. The cut from the top 50 removes every quote tweet, every video tweet, and rank 24 (its only link is an unresolvable `t.co` link). Each card links to its post and uses the tweet text as alt text. The images are WebP cards rendered on fedora (`recall-work/tweets-site`).
- `/tweets` lays the cards out as a masonry bento (`app/tweets/tweet-bento.jsx`, `.tweet-bento` in `global.css`): six columns at 1152px, the first two tweets span three columns and the rest two; four columns under 1024px, one under 640px. A ResizeObserver sets each row span from the card height.
- The `tweet_viewed` event carries `tweet_id` and `tweet_rank` in place of `tweet_image` and `tweet_index`.

### Removed
- The nine old tweet screenshots in `public/img/`. All nine are in the archive set.

## [1.6.0] - 2026-09-24

### Added
- Coherence (`@danilocampos/coherence`): a config, a JavaScript adapter, five `*.spec.md` files with invariants anchored to the existing tests, the Claude lifecycle hook, and a generated block in `CLAUDE.md`. `npx coherence verify` is the gate.
- `CLAUDE.md` and `CHANGELOG.md` at the repository root, rebuilt from the retired `.claude` project files. That directory is archived on vinelab.

### Changed
- The about tile renders each fact as a card in a two column grid (one column under 640px): a mono numeral top right, the fact as a heading, the detail as a description, and a right-aligned chip badge. Each fact carries `badge` and `tone`, so a swap is one line. The wife review is card 08 with a violet "biased source" badge.
- New `.fact-card` surface in `global.css`: 3% fill, 6% hairline, 8px radius, the tile's violet hover rule.
- Fact copy rewritten (Jake).

### Removed
- The "in order of importance" line under the heading and the belt icon next to "bjj blue belt".

## [1.2.0] - 2026-09-22

### Added
- `services/spotify-collector`: a dependency-free Node 24 service on vinelab that polls Spotify recently played every 15 minutes into SQLite, imports an extended history export, and publishes the site's Redis keys. The five stats keys are written only once an archive is loaded, or with `publish --force`. A `spotify:live` key always carries the collected minutes.
- The recently played tile shows the collected minutes bottom right ("min live"), read through the recent route.

### Changed
- The current year renders as a dimmed partial column in the hours-per-year chart instead of being hidden until December.

### Removed
- `scripts/import-spotify-data.mjs`; its aggregation lives in the service.

## [Unreleased] - 2026-08-29

### Added
- Obsidian KPI row: a full-width row of seven glass cards (summary plus one per tier) replacing the obsidian tile (`app/components/obsidian-row.jsx`, `app/lib/obsidian-row.mjs`).
- `Columns` (div-based column chart) and `PeriodPills` (shared time-range control) under `app/components/ui/`.
- `app/lib/format.mjs` helpers and `node --test` coverage for every pure mapper (`pnpm test`).
- `/api/wakatime-stats` returns the week total, per-day totals, best day, languages over the last 12 months (noise buckets such as Other and Diff dropped), and the AI model breakdown (`stats/last_7_days`, `stats/last_year`, `summaries?range=last_7_days`).
- `/api/trakt-stats` returns the top five shows by plays and 30-day counts read from `X-Pagination-Item-Count` on two one-item history calls (Redis key `trakt_alltime_stats_v2`, 1h).
- `/api/spotify-stats` returns `funFacts` from the importer snapshot.
- `captureServer` in `app/posthog.js`: one PostHog client, flushed in Next's `after()` once the response is sent.
- `Cache-Control: public, s-maxage=...` on every API route (15s now-playing, 60s trakt, 300s snapshots / github / wakatime, 900s spotify top, 3600s spotify history).
- 15s in-memory cache in front of the Spotify now-playing call.
- `/api/spotify-recent` and a full-width ticker tile of the last 20 plays between the trakt and spotify rows.

### Fixed
- Obsidian KPI row kept stable `Tile` wrappers across the skeleton-to-data swap, so the GSAP once-only reveal still lands on the real cards.
- `useCachedFetch` resets on a cache-key change and never replaces good data with a payload that fails `shouldCache`.
- Sparkline guards its hover index when the trend shrinks between polls.
- `/api/spotify-top` and `/api/trakt-stats` answer `no-store` for empty or failed payloads; Trakt caches partial results for 2 minutes instead of an hour.

### Changed
- Single dark theme: neon on glass black. Six hue tokens (cyan, magenta, lime, amber, violet, red). No glow. Design record in `.claude/project/MEMORY.md`.
- Bento grid reflowed: obsidian row on row 6, trakt and programmin' at three columns each on row 7, projects and oura on the last row.
- Spotify, WakaTime, and Trakt tiles redesigned with two internal columns and richer data.
- Client polling: obsidian, spotify, and strava tiles poll hourly; github every 5 minutes; the strava tile uses `useCachedFetch`.
- `/api/spotify-top` fetches the short-term lists only; `longTerm` was never rendered.
- Shared `BarList`, `accents.mjs`, and `LABEL` replace four copies of the name / bar / value row and the accent maps.
- `Sparkline` is inline SVG. Badge default variant is `outline`.
- API routes no longer read the `x-posthog-distinct-id` header (the client never sent it) or await a PostHog flush inside the request.

### Removed
- Light theme, the theme toggle, and the first-paint theme script.
- `.tier-glow`, the tile hover shadow, and the hero tilt glare.
- `recharts` dependency and `app/components/ui/bar-spark.jsx`.
- The 52-week Spotify bar strip, `weeklyHours` from `/api/spotify-stats`, and the weekly aggregation in `scripts/import-spotify-data.mjs`.
- Badge variants `default`, `secondary`, `ghost`.
- Comments across `app/` and `next.config.js`.
- Unreferenced images: `public/img/eastonplus.png`, `strava-kimono.png`, `todoist-dashboard.png`, `public/img/ai/*`.

## [Unreleased] - 2026-07-05

### Added
- GitHub activity heatmap: the GitHub tile now renders a commit-activity heatmap grid (`app/components/ui/heatmap.jsx`, span-agnostic via a `weeks` prop) alongside the weekly commit count, replacing the sparkline.
- `scripts/import-github-activity.mjs` (+ tests): counts commits GitHub's contribution graph drops (non-default-branch and private-repo work). Two layers -- commit Search API for default-branch commits across every accessible repo (public + private, classic + fine-grained PAT), plus an all-branches walk of only the user's owned repos. Dedups by SHA, tallies per day, merges into the `github:activity` Redis snapshot (recent days recomputed, older frozen).
- `/api/github-activity` route reading the Redis snapshot.

### Changed
- GitHub tile data path is now a Redis snapshot (`github:activity`) fed by the homelab-cron importer, replacing the live GraphQL `contributionsCollection` query.

### Removed
- `/api/github-stats` route (GraphQL contribution calendar) -- superseded by `/api/github-activity`.

## [Unreleased] - 2026-06-24

### Added
- Obsidian task tile: active total, overdue, and per-tier counts (now/next/waiting/blocked/someday/backlog) rendered as little cards, sourced from the local vault.
- `scripts/import-obsidian-data.mjs` (+ tests): parses Dataview inline-field tasks under `areas/**` and `projects/**`, writes the `obsidian:stats` Redis snapshot.
- `/api/obsidian-stats` route reading the Redis snapshot.
- Strava import direct-API mode (token refresh + paginated activity fetch) so the snapshot refreshes without a Claude/MCP session.
- `scripts/strava-reauth.mjs`: one-time OAuth re-authorization helper for `activity:read_all`.
- Daily launchd refresh at 07:00 (`scripts/refresh-tiles.sh` + `scripts/com.jakesciotto.portfolio-tiles.plist`) for the Strava and Obsidian snapshots.

### Changed
- Strava tile data path is now a Redis snapshot fed by the local import (direct Strava API) rather than a manual MCP dump.
- Row 6 grid rebalanced: oura to 1 column, obsidian to 2 columns (was 2/1).

### Removed
- Todoist tile, `/api/todoist-stats`, `/api/todoist-callback`, stale Todoist Redis keys, and dead `TODOIST_*` / `STRAVA_ACCESS_TOKEN` entries in `.env.local`.

## [Unreleased] - 2026-03-19

### Added
- Bento grid layout: 4-column responsive CSS Grid with glassmorphism tiles
- Fixed header with theme toggle, replacing navbar and stats bar
- Hero tile with GSAP letter-stagger animation and tilt effect
- GitHub stats tile with sparkline (recharts)
- Experience tile with years counter
- Work history accordion with expand/collapse
- Oura health tile: hours slept, sleep score, readiness score, sleep trend sparkline
- WakaTime dev tile: total coding hours, daily average, horizontal bar chart of top 5 languages with percentage labels
- Spotify tile: total hours listened, top artist, years of data span
- Education tile: 3 degrees listed
- Certifications strip: horizontal scrollable badges with tooltips
- About tile: personality list
- Projects tile: 5 featured projects with status pills
- Fun stats tile: 8 personality stats in 2-column grid
- Tile entrance animations via GSAP ScrollTrigger
- Grain texture overlay on body
- `grid-auto-flow: dense` responsive breakpoints (4-col desktop, 2-col tablet, 1-col mobile)
- Matter.js physics simulation for skill tags with organize/jumble toggle
- Skills added: k8s, statistical analysis, predictive modeling, prompt engineering, genai, agentic ai
- Recharts sparkline component (`app/components/ui/sparkline.jsx`)
- StatTile reusable component with optional heading, animated counter, and secondary labels
- TileSkeleton loading placeholder component
- ThemeToggle extracted as standalone component
- `useLenis()` hook exposed from ScrollProvider

### Changed
- Consolidated multi-page site (stats, projects, certifications) into single-page bento dashboard
- Color palette evolved: mint `#3df0d0`, coral `#f05545`, violet `#a78bfa` (dark mode)
- Light mode accents: teal `#0d9e8a`, red `#d04535`, purple `#7c5cbf`
- Card surfaces use `--card-glass` with `backdrop-filter: blur(12px)`
- Header shows "js" initials instead of full name (avoids duplication with hero)
- Email updated to jake.sciotto@gmail.com across header and hero
- ScrollProvider fixed ticker cleanup bug (was passing wrong function reference to `gsap.ticker.remove`)
- Skills physics slowed down: gravity 0.3 -> 0.15, air friction 0.02 -> 0.05
- Technical capabilities heading font matched to other tile headers
- Footer wrapped in `max-w-6xl` container

### Removed
- Multi-page routes: `/stats`, `/projects`, `/certifications`
- Navbar component (`nav.jsx`)
- Stats bar component (`stats-bar.jsx`)
- Legacy components: `animated-section.jsx`, `section-title.jsx`, `github-stats.jsx`, `oura-sleep-stats.jsx`, `spotify-stats.jsx`, `wakatime-stats.jsx`, `employment-timeline.jsx`, `project-item.jsx`, `work-project-item.jsx`, `stat-card.jsx`, `info-tooltip.jsx`
- Data visualization components: `commit-texture.jsx`, `sleep-wave.jsx`, `spotify-gradient.jsx`
- `next-mdx-remote` dependency
- Resume link from hero
- Scroll-weight animation from hero name
