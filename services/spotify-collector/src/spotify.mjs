const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const RECENT_URL = 'https://api.spotify.com/v1/me/player/recently-played'
const REFRESH_TOKEN_KEY = 'spotify_live_refresh_token'

export function createSpotify({
  clientId,
  clientSecret,
  refreshToken,
  redis,
  fetchImpl = fetch,
}) {
  let accessToken = null
  let expiresAt = 0

  async function currentRefreshToken() {
    const stored = await redis.get(REFRESH_TOKEN_KEY).catch(() => null)
    return stored || refreshToken
  }

  async function getAccessToken() {
    if (accessToken && Date.now() < expiresAt - 60_000) return accessToken
    const refresh = await currentRefreshToken()
    if (!refresh) throw new Error('No Spotify refresh token available')
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    )
    const res = await fetchImpl(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh,
      }),
    })
    if (!res.ok) throw new Error(`Spotify token refresh failed (${res.status})`)
    const data = await res.json()
    accessToken = data.access_token
    expiresAt = Date.now() + (data.expires_in || 3600) * 1000
    if (data.refresh_token) {
      await redis.set(REFRESH_TOKEN_KEY, data.refresh_token).catch(() => {})
    }
    return accessToken
  }

  async function recentlyPlayed(afterTs) {
    const params = new URLSearchParams({ limit: '50' })
    if (afterTs) params.set('after', String(Date.parse(afterTs)))
    const token = await getAccessToken()
    const res = await fetchImpl(`${RECENT_URL}?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok)
      throw new Error(`Spotify recently-played failed (${res.status})`)
    const data = await res.json()
    return data.items || []
  }

  return { getAccessToken, recentlyPlayed }
}
