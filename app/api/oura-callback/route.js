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

  return new Response(
    `<html><body style="background:#111;color:#0ff;font-family:monospace;padding:2rem">
      <h2>oura authorized</h2>
      <p><strong>refresh_token:</strong></p>
      <pre style="background:#222;padding:1rem;word-break:break-all">${data.refresh_token}</pre>
      <p>Copy this into your .env as OURA_REFRESH_TOKEN, then delete this callback route.</p>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
