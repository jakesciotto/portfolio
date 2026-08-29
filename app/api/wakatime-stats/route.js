import PostHogClient from '../../posthog'
import { mapWakaStats } from '../../lib/wakatime-stats.mjs'

const BASE = 'https://wakatime.com/api/v1/users/current'

async function readJson(settled, label) {
  if (settled.status !== 'fulfilled') return null
  const res = settled.value
  if (res.ok) return res.json()
  if (res.status !== 202) {
    console.error(`WakaTime ${label} response:`, res.status, await res.text().catch(() => ''))
  }
  return null
}

export async function GET(request) {
  const empty = mapWakaStats({})
  try {
    if (!process.env.WAKATIME_API_KEY) return Response.json(empty)

    const headers = {
      Authorization: `Basic ${Buffer.from(process.env.WAKATIME_API_KEY).toString('base64')}`,
    }
    const opts = { headers, next: { revalidate: 300 } }

    const [allTimeRes, statsRes, summariesRes] = await Promise.allSettled([
      fetch(`${BASE}/all_time_since_today`, opts),
      fetch(`${BASE}/stats/last_7_days`, opts),
      fetch(`${BASE}/summaries?range=last_7_days`, opts),
    ])

    const [allTime, stats, summaries] = await Promise.all([
      readJson(allTimeRes, 'all_time'),
      readJson(statsRes, 'stats'),
      readJson(summariesRes, 'summaries'),
    ])

    const result = mapWakaStats({ allTime, stats, summaries })

    const posthog = PostHogClient()
    const distinctId = request.headers.get('x-posthog-distinct-id') || 'server_anonymous'
    posthog.capture({
      distinctId,
      event: 'wakatime_stats_fetched',
      properties: { totalHours: result.totalHours },
    })
    await posthog.flush()

    return Response.json(result)
  } catch (error) {
    console.error('WakaTime API error:', error)
    return Response.json(empty)
  }
}
