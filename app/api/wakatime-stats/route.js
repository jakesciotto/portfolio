import { captureServer } from '../../posthog'
import { mapWakaStats } from '../../lib/wakatime-stats.mjs'

const BASE = 'https://wakatime.com/api/v1/users/current'
const CACHE = { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' }

async function readJson(settled, label) {
  if (settled.status !== 'fulfilled') return null
  const res = settled.value
  if (res.ok) return res.json()
  if (res.status !== 202) {
    console.error(`WakaTime ${label} response:`, res.status, await res.text().catch(() => ''))
  }
  return null
}

export async function GET() {
  const empty = mapWakaStats({})
  try {
    if (!process.env.WAKATIME_API_KEY) return Response.json(empty)

    const headers = {
      Authorization: `Basic ${Buffer.from(process.env.WAKATIME_API_KEY).toString('base64')}`,
    }
    const opts = { headers, next: { revalidate: 300 } }

    const settled = await Promise.allSettled([
      fetch(`${BASE}/all_time_since_today`, opts),
      fetch(`${BASE}/stats/last_7_days`, opts),
      fetch(`${BASE}/stats/last_year`, opts),
      fetch(`${BASE}/summaries?range=last_7_days`, opts),
    ])

    const [allTime, stats, year, summaries] = await Promise.all([
      readJson(settled[0], 'all_time'),
      readJson(settled[1], 'stats'),
      readJson(settled[2], 'last_year'),
      readJson(settled[3], 'summaries'),
    ])

    const result = mapWakaStats({ allTime, stats, year, summaries })
    captureServer('wakatime_stats_fetched', { totalHours: result.totalHours })

    return Response.json(result, { headers: CACHE })
  } catch (error) {
    console.error('WakaTime API error:', error)
    return Response.json(empty)
  }
}
