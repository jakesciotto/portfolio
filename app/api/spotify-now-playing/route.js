import { getAccessToken } from '../../lib/spotify-auth'
import PostHogClient from '../../posthog'

export async function GET(request) {
  const posthog = PostHogClient()
  const distinctId =
    request.headers.get('x-posthog-distinct-id') || 'server_anonymous'

  try {
    const accessToken = await getAccessToken()

    const nowRes = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    // 204 = nothing playing, or check is_playing
    if (nowRes.status === 200) {
      const data = await nowRes.json()
      if (data.is_playing && data.item) {
        const result = {
          isPlaying: true,
          track: data.item.name,
          artist: data.item.artists?.map((a) => a.name).join(', ') || null,
        }

        posthog.capture({
          distinctId,
          event: 'spotify_now_playing_fetched',
          properties: { is_playing: true, source: 'api' },
        })

        return Response.json(result)
      }
    }

    // Nothing playing -- try recently played
    const recentRes = await fetch(
      'https://api.spotify.com/v1/me/player/recently-played?limit=1',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    if (recentRes.ok) {
      const recentData = await recentRes.json()
      const item = recentData.items?.[0]?.track
      if (item) {
        return Response.json({
          isPlaying: false,
          track: item.name,
          artist: item.artists?.map((a) => a.name).join(', ') || null,
        })
      }
    }

    return Response.json({ isPlaying: false, track: null, artist: null })
  } catch (error) {
    posthog.capture({
      distinctId,
      event: 'spotify_now_playing_error',
      properties: { error_message: error?.message, source: 'api' },
    })

    return Response.json({ isPlaying: false, track: null, artist: null })
  }
}
