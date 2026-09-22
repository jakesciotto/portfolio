import { Redis } from '@upstash/redis'
import { getAccessToken } from '../../lib/spotify-auth'
import { captureServer } from '../../posthog'

const LIMIT = 20
const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
    : null

async function liveMinutes() {
  if (!redis) return null
  const raw = await redis.get('spotify:live').catch(() => null)
  const live = typeof raw === 'string' ? JSON.parse(raw) : raw
  if (!(live?.minutes > 0)) return null
  return { minutes: Math.round(live.minutes), year: live.year ?? null }
}
const CACHE = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
}

export async function GET() {
  try {
    const [accessToken, live] = await Promise.all([
      getAccessToken(),
      liveMinutes(),
    ])
    const res = await fetch(
      `https://api.spotify.com/v1/me/player/recently-played?limit=${LIMIT}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    )
    if (!res.ok) throw new Error(`Spotify recently-played error: ${res.status}`)

    const data = await res.json()
    const items = (data.items || []).map((it) => ({
      track: it.track?.name || '',
      artist: it.track?.artists?.map((a) => a.name).join(', ') || '',
      playedAt: it.played_at || null,
    }))

    captureServer('spotify_recent_fetched', {
      count: items.length,
      source: 'api',
    })

    return Response.json(
      { items, live },
      { headers: items.length ? CACHE : { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    captureServer('spotify_recent_error', {
      error_message: error?.message,
      source: 'api',
    })
    return Response.json({ items: [] }, { status: 500 })
  }
}
