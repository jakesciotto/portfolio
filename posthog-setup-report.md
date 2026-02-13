# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js portfolio project with PostHog analytics. The integration includes client-side tracking via the `instrumentation-client.js` approach (recommended for Next.js 15.3+), server-side tracking using `posthog-node`, and a reverse proxy configuration to improve tracking reliability. Exception capture is enabled by default for automatic error tracking.

## Integration Summary

### Files Created
- `instrumentation-client.js` - Client-side PostHog initialization
- `app/posthog.js` - Server-side PostHog client
- `next.config.js` - Reverse proxy rewrites for PostHog ingestion
- `app/components/tracked-link.jsx` - Reusable tracked link component
- `app/components/project-item.jsx` - Project card with preview tracking
- `.env.local` - PostHog environment variables

### Files Modified
- `app/components/footer.jsx` - Added external link click tracking
- `app/components/stats-bar.jsx` - Added certification badge click tracking
- `app/components/info-tooltip.jsx` - Added tooltip open tracking
- `app/components/nav.jsx` - Added navigation click tracking
- `app/projects/page.jsx` - Refactored to use ProjectItem component
- `app/tweets/tweet-client.jsx` - Added tweet view tracking with IntersectionObserver
- `app/page.jsx` - Added tracked links for tweets page and education easter egg
- `app/api/github-stats/route.js` - Added server-side event tracking

## Events Tracked

| Event Name | Description | File |
|------------|-------------|------|
| `external_link_clicked` | Visitor clicks on external link (GitHub profile in footer) | `app/components/footer.jsx` |
| `certification_badges_clicked` | Visitor clicks on certification badges to view Credly profile | `app/components/stats-bar.jsx` |
| `info_tooltip_opened` | Visitor clicks info tooltip to reveal skill details | `app/components/info-tooltip.jsx` |
| `nav_link_clicked` | Visitor clicks a navigation link | `app/components/nav.jsx` |
| `project_preview_viewed` | Visitor hovers on a project to view preview image | `app/components/project-item.jsx` |
| `tweet_viewed` | Visitor views a tweet image in the gallery (via IntersectionObserver) | `app/tweets/tweet-client.jsx` |
| `tweets_page_link_clicked` | Visitor clicks "terminally online" link to tweets page | `app/page.jsx` |
| `education_link_clicked` | Visitor clicks Johns Hopkins easter egg link | `app/page.jsx` |
| `github_stats_fetched` | Server-side event when GitHub stats API succeeds | `app/api/github-stats/route.js` |
| `github_stats_error` | Server-side event when GitHub stats API fails | `app/api/github-stats/route.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/313269/dashboard/1277578) - Main analytics dashboard

### Insights
- [User Engagement - Click Activity](https://us.posthog.com/project/313269/insights/GWoZh2zg) - Tracks navigation, external links, and certification badge clicks
- [Content Engagement Funnel](https://us.posthog.com/project/313269/insights/5AkeVDpw) - Funnel from pageview to content interaction
- [Project Interest](https://us.posthog.com/project/313269/insights/NQsxcXaL) - Tracks project preview interactions by project name
- [Tweet Gallery Engagement](https://us.posthog.com/project/313269/insights/EDvqXSTb) - Tracks tweet viewing activity
- [GitHub API Performance](https://us.posthog.com/project/313269/insights/oP5IVom3) - Server-side API success and error tracking

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
