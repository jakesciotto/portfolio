<wizard-report>
# PostHog post-wizard report

The wizard completed a deep integration audit and extension of PostHog analytics on jakesciotto.com. The project already had strong foundational instrumentation (client-side init via `instrumentation-client.js`, server-side PostHog client via `app/posthog.js`, reverse proxy rewrites in `next.config.js`, and a solid set of existing events). The wizard preserved all existing code and added targeted new events in areas that were missing coverage.

## New files created

| File | Purpose |
|---|---|
| `app/certifications/certifications-list.jsx` | Client component extracted from certifications page to enable event tracking on cert clicks |
| `app/tweets/tweets-page-tracker.jsx` | Lightweight client component that fires `tweets_page_viewed` on page mount |

## Environment variables

The following keys were written to `.env.local` (values never committed to git):

| Key | Purpose |
|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | Client-side PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog ingestion host |
| `POSTHOG_SERVER_KEY` | Server-side PostHog project API key |

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `certification_clicked` | User clicks a certification card to view it on Credly, with cert name, issuer, and earned date as properties | `app/certifications/certifications-list.jsx` |
| `tweets_page_viewed` | User lands on the tweets archive page, with total tweet count as a property | `app/tweets/tweets-page-tracker.jsx` (used in `app/tweets/page.jsx`) |
| `project_link_clicked` | User clicks an external link on a personal project card, with project name and URL | `app/components/project-item.jsx` |
| `work_project_link_clicked` | User clicks an external link on a work project card, with project name and URL | `app/components/work-project-item.jsx` |

## Existing events preserved (no changes)

| Event Name | File |
|---|---|
| `nav_link_clicked` | `app/components/nav.jsx` |
| `external_link_clicked` | `app/components/footer.jsx` |
| `tweet_viewed` | `app/tweets/tweet-client.jsx` |
| `project_preview_viewed` | `app/components/project-item.jsx`, `app/components/work-project-item.jsx` |
| `info_tooltip_opened` | `app/components/info-tooltip.jsx` |
| `tweets_page_link_clicked` | `app/page.jsx` |
| `education_link_clicked` | `app/page.jsx` |
| `github_stats_fetched` / `github_stats_error` | `app/api/github-stats/route.js` |
| `oura_stats_fetched` / `oura_stats_error` | `app/api/oura-stats/route.js` |
| `spotify_stats_fetched` / `spotify_stats_error` | `app/api/spotify-stats/route.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: [Analytics basics](https://us.posthog.com/project/313269/dashboard/1327017)
- Insight: [Tweets Content Funnel](https://us.posthog.com/project/313269/insights/4tu8L3pQ) - ordered funnel from home page tweets link click through to actually reading a tweet
- Insight: [Project Discovery to Click Funnel](https://us.posthog.com/project/313269/insights/hchCqcIn) - project preview hovers vs actual link clicks (measures intent-to-action conversion)
- Insight: [Engagement Event Totals](https://us.posthog.com/project/313269/insights/ghgvGXdo) - bar chart of nav clicks, footer links, and tooltip opens (already shows real data: 538 nav clicks, 14 tooltip opens, 3 footer clicks in the last 30 days)
- Insight: [Certification & Tweets Content Engagement](https://us.posthog.com/project/313269/insights/lkC7ooug) - daily trend comparing cert clicks vs tweets page views
- Insight: [Project Clicks by Type](https://us.posthog.com/project/313269/insights/1yiSNkN9) - personal vs work project external link clicks over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
