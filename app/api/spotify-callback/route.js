import { Redis } from '@upstash/redis'

export async function GET(request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return new Response('Missing code parameter', { status: 400 })
  }

  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || `${url.origin}/api/spotify-callback`
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
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    return Response.json({ error: data }, { status: res.status })
  }

  if (data.refresh_token && process.env.KV_REST_API_URL) {
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
    await redis.set('spotify_live_refresh_token', data.refresh_token)
  }

  return new Response(
    `<html><body style="background:#111;color:#0ff;font-family:monospace;padding:2rem">
      <h2>spotify authorized</h2>
      <p>refresh token saved to redis. you're all set.</p>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
