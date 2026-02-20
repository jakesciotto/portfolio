import { Redis } from '@upstash/redis'

export async function GET(request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return new Response('Missing code parameter', { status: 400 })
  }

  const redirectUri = `${url.origin}/api/oura-callback`

  const res = await fetch('https://api.ouraring.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: process.env.OURA_CLIENT_ID,
      client_secret: process.env.OURA_CLIENT_SECRET,
      redirect_uri: redirectUri,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    return Response.json({ error: data }, { status: res.status })
  }

  // Store refresh token in Redis so it survives rotation
  if (data.refresh_token && process.env.KV_REST_API_URL) {
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
    await redis.set('oura_refresh_token', data.refresh_token)
  }

  return new Response(
    `<html><body style="background:#111;color:#0ff;font-family:monospace;padding:2rem">
      <h2>oura authorized</h2>
      <p>refresh token saved to redis. you're all set.</p>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
