import { getAccessToken } from '../../lib/spotify-auth'
import PostHogClient from '../../posthog'

const SPOTIFY_TOP_URL = 'https://api.spotify.com/v1/me/top'

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

export async function GET(request) {
  const posthog = PostHogClient()
  const distinctId =
    request.headers.get('x-posthog-distinct-id') || 'server_anonymous'

  try {
    const accessToken = await getAccessToken()

    const [shortArtists, shortTracks, longArtists, longTracks] =
      await Promise.all([
        fetchTop(accessToken, 'artists', 'short_term'),
        fetchTop(accessToken, 'tracks', 'short_term'),
        fetchTop(accessToken, 'artists', 'long_term'),
        fetchTop(accessToken, 'tracks', 'long_term'),
      ])

    const result = {
      shortTerm: (shortArtists || shortTracks) ? {
        artists: mapArtists(shortArtists),
        tracks: mapTracks(shortTracks),
      } : null,
      longTerm: (longArtists || longTracks) ? {
        artists: mapArtists(longArtists),
        tracks: mapTracks(longTracks),
      } : null,
    }

    posthog.capture({
      distinctId,
      event: 'spotify_top_items_fetched',
      properties: { source: 'api' },
    })

    return Response.json(result)
  } catch (error) {
    posthog.capture({
      distinctId,
      event: 'spotify_top_items_error',
      properties: { error_message: error?.message, source: 'api' },
    })

    return Response.json(
      { shortTerm: null, longTerm: null },
      { status: 500 }
    )
  }
}
