import { unstable_cache } from 'next/cache'
import { githubView } from '../github-view.mjs'
import { responseTime } from '../snapshot-time.mjs'

const GH_USER = 'jakesciotto'

function parseCalendar(html) {
  const dateById = {}
  for (const [tag] of html.matchAll(
    /<td[^>]*class="ContributionCalendar-day"[^>]*>/g,
  )) {
    const date = tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1]
    const id = tag.match(/id="([^"]+)"/)?.[1]
    if (date && id) dateById[id] = date
  }

  const countByDate = {}
  for (const [, id, text] of html.matchAll(
    /<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g,
  )) {
    const date = dateById[id]
    if (!date) continue
    countByDate[date] = /^No contributions/i.test(text)
      ? 0
      : parseInt(text.replace(/,/g, '').match(/\d+/)?.[0] ?? '0', 10)
  }
  return countByDate
}

export const EMPTY_GITHUB_STATS = {
  activity7d: 0,
  prevActivity7d: 0,
  daily: [],
  isActive: false,
  days: {},
}

async function fetchGithubStats() {
  const res = await fetch(`https://github.com/users/${GH_USER}/contributions`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (portfolio github-tile)' },
  })
  if (!res.ok) throw new Error(`GitHub contributions error: ${res.status}`)

  const fetchedAt = responseTime([res])
  const view = githubView(parseCalendar(await res.text()), new Date(fetchedAt))
  return { ...view, fetchedAt }
}

export const loadGithubStats = unstable_cache(
  fetchGithubStats,
  ['github-stats-v1'],
  { revalidate: 300 },
)
