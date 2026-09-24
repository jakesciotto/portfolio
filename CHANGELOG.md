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
