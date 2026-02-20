# Enriched Stat Cards Design

## Summary

Add tiny recharts sparklines to stat cards with time-series data (sleep, GitHub commits) and introduce new Oura data cards (readiness score, resting heart rate). No database — API-with-caching using 7-day date range queries.

## Data Layer

### `/api/oura-stats` (replaces `/api/oura-sleep`)

Single endpoint fetching 7 days of data from 4 Oura endpoints in parallel:
- `GET /v2/usercollection/sleep` — sleep sessions (total_sleep_duration, is_longest)
- `GET /v2/usercollection/daily_sleep` — daily sleep scores
- `GET /v2/usercollection/daily_readiness` — readiness scores
- `GET /v2/usercollection/heartrate` — resting heart rate

Response shape:
```json
{
  "sleep": {
    "current": { "hours": 7.2, "score": 82, "verdict": "WOW" },
    "trend": [{ "day": "2026-02-14", "hours": 6.1, "score": 74 }]
  },
  "readiness": {
    "current": 85,
    "trend": [{ "day": "2026-02-14", "score": 78 }]
  },
  "heartRate": {
    "current": 58,
    "trend": [{ "day": "2026-02-14", "bpm": 61 }]
  }
}
```

15-minute revalidation cache. Uses refresh token flow for access tokens.

### `/api/github-stats` (modified)

Add daily commit breakdown via GitHub GraphQL `contributionCalendar`:
```json
{
  "commits7d": 23,
  "prevCommits7d": 18,
  "daily": [{ "day": "2026-02-14", "commits": 5 }]
}
```

## Components

### New: `<Sparkline>` (`app/components/ui/sparkline.jsx`)

Recharts `<AreaChart>` wrapper. Props: `data` (number[]), `color` (neon color name), `height` (default 40). No axes, labels, or grid — line + gradient fill only. Transparent background.

### Modified: `<StatCard>`

New optional props: `sparklineData`, `sparklineColor`. When present, renders sparkline below title/subtitle. Fully backward compatible.

### Modified: `<OuraSleepStats>`

Fetches from `/api/oura-stats`. Renders 5 cards:
1. Hours slept (cyan) + sparkline
2. Sleep verdict (dynamic color) — no sparkline
3. Sleep score (purple) + sparkline
4. Readiness score (green) + sparkline (new)
5. Resting heart rate (amber) + sparkline (new)

### Modified: `<GitHubStats>`

Passes daily breakdown as sparkline data to StatCard.

## Grid Layout

14 total cards in `lg:grid-cols-3`: 4 full rows + 1 row of 2. Last row left-aligns.

## Dependencies

- `recharts` — new dependency for sparkline charts
