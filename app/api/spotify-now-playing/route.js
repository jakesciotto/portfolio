import { Redis } from '@upstash/redis'
import PostHogClient from '../../posthog'

const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
    : null

// In-memory token cache
let cachedAccessToken = null
let tokenExpiresAt = 0

async function getRefreshToken() {
  if (redis) {
    const stored = await redis.get('spotify_live_refresh_token').catch(() => null)
    if (stored) return stored
  }
  return process.env.SPOTIFY_LIVE_REFRESH_TOKEN
}

async function getAccessToken() {
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedAccessToken
  }

  const refreshToken = await getRefreshToken()
  if (!refreshToken) throw new Error('No Spotify live refresh token available')

  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64')

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Spotify token refresh failed (${res.status}): ${body}`)
  }

  const data = await res.json()
  cachedAccessToken = data.access_token
  tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000

  // Persist rotated refresh token if returned
  if (data.refresh_token && redis) {
    await redis.set('spotify_live_refresh_token', data.refresh_token).catch(() => {})
  }

  return cachedAccessToken
}

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
