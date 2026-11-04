import { mapWakaStats } from '../wakatime-stats.mjs'

const BASE = 'https://api.wakatime.com/api/v1/users/current'

async function readJson(settled, label) {
  if (settled.status !== 'fulfilled') return null
  const res = settled.value
  if (res.ok) return res.json()
  if (res.status !== 202) {
    console.error(
      `WakaTime ${label} response:`,
      res.status,
      await res.text().catch(() => ''),
    )
  }
  return null
}

export const EMPTY_WAKA_STATS = mapWakaStats({})

export async function loadWakaStats() {
  const token = process.env.WAKATIME_ACCESS_TOKEN
  if (!token) return EMPTY_WAKA_STATS

  const headers = { Authorization: `Bearer ${token}` }
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

  return mapWakaStats({ allTime, stats, year, summaries })
}
