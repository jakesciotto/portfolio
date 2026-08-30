import { captureServer } from '../../posthog'

const GH_USER = 'jakesciotto'
const CACHE = { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }

function parseCalendar(html) {
  const dateById = {}
  for (const [tag] of html.matchAll(/<td[^>]*class="ContributionCalendar-day"[^>]*>/g)) {
    const date = tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1]
    const id = tag.match(/id="([^"]+)"/)?.[1]
    if (date && id) dateById[id] = date
  }

  const countByDate = {}
  for (const [, id, text] of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const date = dateById[id]
    if (!date) continue
    countByDate[date] = /^No contributions/i.test(text)
      ? 0
      : parseInt(text.replace(/,/g, '').match(/\d+/)?.[0] ?? '0', 10)
  }
  return countByDate
}

export async function GET() {
  try {
    const res = await fetch(`https://github.com/users/${GH_USER}/contributions`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (portfolio github-tile)' },
      next: { revalidate: 300 },
    })
    if (!res.ok) throw new Error(`GitHub contributions error: ${res.status}`)

    const countByDate = parseCalendar(await res.text())
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

    captureServer('github_stats_fetched', {
      activity_7d: activity7d,
      prev_activity_7d: prevActivity7d,
      source: 'public-calendar',
    })

    return Response.json({ activity7d, prevActivity7d, daily, isActive, days: countByDate }, { headers: CACHE })
  } catch (error) {
    captureServer('github_stats_error', {
      error_message: error?.message || 'Unknown error',
      source: 'public-calendar',
    })
    return Response.json(
      { activity7d: 0, prevActivity7d: 0, daily: [], isActive: false, days: {} },
      { status: 500 },
    )
  }
}
