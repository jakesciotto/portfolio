import PostHogClient from '../../posthog'

const GH_USER = 'jakesciotto'

export async function GET(request) {
  const posthog = PostHogClient()
  const distinctId =
    request.headers.get('x-posthog-distinct-id') || 'server_anonymous'

  try {
    // Public contribution calendar - no token, so it isn't subject to org PAT
    // policy (PostHog forbids classic PATs). Includes private contributions as
    // anonymized daily counts, matching what the profile graph shows.
    const res = await fetch(`https://github.com/users/${GH_USER}/contributions`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (portfolio github-tile)' },
      next: { revalidate: 300 },
    })
    if (!res.ok) throw new Error(`GitHub contributions error: ${res.status}`)
    const html = await res.text()

    // Join each day cell (id -> date) to its tooltip (id -> "N contributions on ...").
    const dateById = {}
    for (const [tag] of html.matchAll(
      /<td[^>]*class="ContributionCalendar-day"[^>]*>/g
    )) {
      const date = tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1]
      const id = tag.match(/id="([^"]+)"/)?.[1]
      if (date && id) dateById[id] = date
    }

    const countByDate = {}
    for (const [, id, text] of html.matchAll(
      /<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g
    )) {
      const date = dateById[id]
      if (!date) continue
      countByDate[date] = /^No contributions/i.test(text)
        ? 0
        : parseInt(text.replace(/,/g, '').match(/\d+/)?.[0] ?? '0', 10)
    }

    const series = Object.keys(countByDate)
      .sort()
      .map((date) => ({ date, count: countByDate[date] }))
    const recent = series.slice(-14)
    const last7 = recent.slice(-7)
    const prev7 = recent.slice(0, recent.length - 7)

    const sum = (arr) => arr.reduce((s, d) => s + d.count, 0)
    const activity7d = sum(last7)
    const prevActivity7d = sum(prev7)
    const daily = last7.map((d) => d.count)
    const isActive = daily.slice(-2).some((c) => c > 0)

    posthog.capture({
      distinctId,
      event: 'github_stats_fetched',
      properties: {
        activity_7d: activity7d,
        prev_activity_7d: prevActivity7d,
        source: 'public-calendar',
      },
    })

    return Response.json({ activity7d, prevActivity7d, daily, isActive })
  } catch (error) {
    posthog.capture({
      distinctId,
      event: 'github_stats_error',
      properties: {
        error_message: error?.message || 'Unknown error',
        source: 'public-calendar',
      },
    })

    return Response.json(
      { activity7d: 0, prevActivity7d: 0, daily: [], isActive: false },
      { status: 500 }
    )
  }
}
