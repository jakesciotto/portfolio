import { getAccessToken } from '../../lib/spotify-auth'
import { captureServer } from '../../posthog'

const IDLE = { isPlaying: false, track: null, artist: null }
const TTL_MS = 15000
const CACHE = { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30' }

let cached = null
let cachedAt = 0

async function fetchNowPlaying() {
  const accessToken = await getAccessToken()
  const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (res.status !== 200) return IDLE

  const data = await res.json()
  if (!data.is_playing || !data.item) return IDLE

  return {
    isPlaying: true,
    track: data.item.name,
    artist: data.item.artists?.map((a) => a.name).join(', ') || null,
  }
}

export async function GET() {
  const now = Date.now()
  if (cached && now - cachedAt < TTL_MS) {
    return Response.json(cached, { headers: CACHE })
  }

  try {
    cached = await fetchNowPlaying()
    cachedAt = now
    if (cached.isPlaying) {
      captureServer('spotify_now_playing_fetched', { is_playing: true, source: 'api' })
    }
    return Response.json(cached, { headers: CACHE })
  } catch (error) {
    captureServer('spotify_now_playing_error', { error_message: error?.message, source: 'api' })
    return Response.json(IDLE, { headers: { 'Cache-Control': 'no-store' } })
  }
}
