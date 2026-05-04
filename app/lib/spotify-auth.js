import { Redis } from '@upstash/redis'

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

export async function getRefreshToken() {
  if (redis) {
    const stored = await redis.get('spotify_live_refresh_token').catch(() => null)
    if (stored) return stored
  }
  return process.env.SPOTIFY_LIVE_REFRESH_TOKEN
}

export async function getAccessToken() {
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
