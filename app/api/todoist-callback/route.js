import { Redis } from '@upstash/redis'

export async function GET(request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return new Response('Missing code parameter', { status: 400 })
  }

  const res = await fetch('https://todoist.com/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.TODOIST_CLIENT_ID,
      client_secret: process.env.TODOIST_CLIENT_SECRET,
      code,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    return Response.json({ error: data }, { status: res.status })
  }

  // Todoist returns a non-expiring access_token (no refresh token)
  if (data.access_token && process.env.KV_REST_API_URL) {
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
    await redis.set('todoist_access_token', data.access_token)
  }

  return new Response(
    `<html><body style="background:#111;color:#0ff;font-family:monospace;padding:2rem">
      <h2>todoist authorized</h2>
      <p>access token saved to redis. you're all set.</p>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
