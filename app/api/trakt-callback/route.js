import { Redis } from '@upstash/redis'

export async function GET(request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return new Response('Missing code parameter', { status: 400 })
  }

  const redirectUri = process.env.TRAKT_REDIRECT_URI || `${url.origin}/api/trakt-callback`

  const res = await fetch('https://api.trakt.tv/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'jakesciotto-portfolio/1.0',
    },
    body: JSON.stringify({
      code,
      client_id: process.env.TRAKT_CLIENT_ID,
      client_secret: process.env.TRAKT_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  const text = await res.text()

  if (!res.ok) {
    return new Response(
      `<html><body style="background:#111;color:#f55;font-family:monospace;padding:2rem">
        <h2>trakt auth failed (${res.status})</h2>
        <pre>${text}</pre>
      </body></html>`,
      { status: res.status, headers: { 'Content-Type': 'text/html' } }
    )
  }

  const data = JSON.parse(text)

  if (data.refresh_token && process.env.KV_REST_API_URL) {
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
    await redis.set('trakt_refresh_token', data.refresh_token)
  }

  return new Response(
    `<html><body style="background:#111;color:#0ff;font-family:monospace;padding:2rem">
      <h2>trakt authorized</h2>
      <p>refresh token saved to redis. you're all set.</p>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
