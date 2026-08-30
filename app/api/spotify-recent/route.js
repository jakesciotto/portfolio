import { getAccessToken } from '../../lib/spotify-auth'
import { captureServer } from '../../posthog'

const LIMIT = 20
const CACHE = { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }

export async function GET() {
  try {
    const accessToken = await getAccessToken()
    const res = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${LIMIT}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) throw new Error(`Spotify recently-played error: ${res.status}`)

    const data = await res.json()
    const items = (data.items || []).map((it) => ({
      track: it.track?.name || '',
      artist: it.track?.artists?.map((a) => a.name).join(', ') || '',
      playedAt: it.played_at || null,
    }))

    captureServer('spotify_recent_fetched', { count: items.length, source: 'api' })

    return Response.json({ items }, { headers: items.length ? CACHE : { 'Cache-Control': 'no-store' } })
  } catch (error) {
    captureServer('spotify_recent_error', { error_message: error?.message, source: 'api' })
    return Response.json({ items: [] }, { status: 500 })
  }
}
