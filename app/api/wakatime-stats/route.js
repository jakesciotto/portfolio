import { NextResponse } from 'next/server'
import PostHogClient from '../../posthog'

export async function GET(request) {
  try {
    if (!process.env.WAKATIME_API_KEY) {
      return NextResponse.json({
        totalHours: null, dailyAverage: null, languages: [], editors: []
      })
    }

    const auth = `Basic ${Buffer.from(process.env.WAKATIME_API_KEY).toString('base64')}`
    const headers = { Authorization: auth }

    const [allTimeRes, statsRes] = await Promise.allSettled([
      fetch('https://wakatime.com/api/v1/users/current/all_time_since_today', {
        headers,
        next: { revalidate: 300 },
      }),
      fetch('https://wakatime.com/api/v1/users/current/stats/last_7_days', {
        headers,
        next: { revalidate: 300 },
      }),
    ])

    let allTime = null
    let stats = null

    if (allTimeRes.status === 'fulfilled' && allTimeRes.value.ok) {
      allTime = await allTimeRes.value.json()
    } else if (allTimeRes.status === 'fulfilled') {
      console.error('WakaTime all_time response:', allTimeRes.value.status, await allTimeRes.value.text().catch(() => ''))
    }

    if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
      stats = await statsRes.value.json()
    } else if (statsRes.status === 'fulfilled') {
      const statusCode = statsRes.value.status
      // 202 means WakaTime is still computing stats -- not an error
      if (statusCode !== 202) {
        console.error('WakaTime stats response:', statusCode, await statsRes.value.text().catch(() => ''))
      }
    }

    const totalSeconds = allTime?.data?.total_seconds || 0
    const totalHours = totalSeconds > 0 ? Math.round(totalSeconds / 3600) : null

    // Try multiple field names for daily average
    const dailyAvg = stats?.data?.human_readable_daily_average
      || stats?.data?.human_readable_daily_average_including_other_language
      || null

    const languages = (stats?.data?.languages || []).slice(0, 8).map(l => ({
      name: l.name,
      percent: l.percent,
      hours: Math.round((l.total_seconds || 0) / 3600 * 10) / 10,
    }))

    const editors = (stats?.data?.editors || []).slice(0, 4).map(e => ({
      name: e.name,
      percent: e.percent,
    }))

    const posthog = PostHogClient()
    const distinctId = request.headers.get('x-forwarded-for') || 'server'
    posthog.capture({ distinctId, event: 'wakatime_stats_fetched', properties: { totalHours } })
    await posthog.flush()

    return NextResponse.json({ totalHours, dailyAverage: dailyAvg, languages, editors })
  } catch (error) {
    console.error('WakaTime API error:', error)
    return NextResponse.json({ totalHours: null, dailyAverage: null, languages: [], editors: [] })
  }
}
