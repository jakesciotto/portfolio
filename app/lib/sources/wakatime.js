import { unstable_cache } from 'next/cache'
import { mapWakaStats } from '../wakatime-stats.mjs'
import { responseTime } from '../snapshot-time.mjs'

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

class PartialWakaStats extends Error {
  constructor(payload) {
    super('WakaTime answered in part')
    this.payload = payload
  }
}

async function fetchWakaStats() {
  const token = process.env.WAKATIME_ACCESS_TOKEN
  if (!token) return EMPTY_WAKA_STATS

  const opts = { headers: { Authorization: `Bearer ${token}` } }

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

  const fetchedAt = responseTime(
    settled.filter((s) => s.status === 'fulfilled').map((s) => s.value),
  )
  const payload = {
    ...mapWakaStats({ allTime, stats, year, summaries }),
    fetchedAt,
  }
  if ([allTime, stats, year, summaries].some((part) => part == null)) {
    throw new PartialWakaStats(payload)
  }
  return payload
}

const cachedWakaStats = unstable_cache(fetchWakaStats, ['wakatime-stats-v1'], {
  revalidate: 300,
})

export async function loadWakaStats() {
  try {
    return await cachedWakaStats()
  } catch (error) {
    if (error instanceof PartialWakaStats) return error.payload
    throw error
  }
}
