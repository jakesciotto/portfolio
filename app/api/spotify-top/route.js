import { getAccessToken } from '../../lib/spotify-auth'
import { captureServer } from '../../posthog'

const SPOTIFY_TOP_URL = 'https://api.spotify.com/v1/me/top'
const CACHE = { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600' }

async function fetchTop(accessToken, type, timeRange, limit = 3) {
  const url = `${SPOTIFY_TOP_URL}/${type}?time_range=${timeRange}&limit=${limit}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) return null
  return res.json()
}

function mapArtists(data) {
  return (data?.items || []).map((a) => ({ name: a.name }))
}

function mapTracks(data) {
  return (data?.items || []).map((t) => ({
    name: t.name,
    artist: t.artists?.map((a) => a.name).join(', ') || '',
  }))
}

function era(artists, tracks) {
  if (!artists && !tracks) return null
  return { artists: mapArtists(artists), tracks: mapTracks(tracks) }
}

export async function GET() {
  try {
    const accessToken = await getAccessToken()

    const [shortArtists, shortTracks, longArtists, longTracks] = await Promise.all([
      fetchTop(accessToken, 'artists', 'short_term'),
      fetchTop(accessToken, 'tracks', 'short_term'),
      fetchTop(accessToken, 'artists', 'long_term'),
      fetchTop(accessToken, 'tracks', 'long_term'),
    ])

    captureServer('spotify_top_items_fetched', { source: 'api' })

    return Response.json(
      { shortTerm: era(shortArtists, shortTracks), longTerm: era(longArtists, longTracks) },
      { headers: CACHE },
    )
  } catch (error) {
    captureServer('spotify_top_items_error', { error_message: error?.message, source: 'api' })
    return Response.json({ shortTerm: null, longTerm: null }, { status: 500 })
  }
}
