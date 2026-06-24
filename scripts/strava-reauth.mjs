/**
 * strava-reauth.mjs
 *
 * One-time (re-)authorization helper for the Strava API. Strava refresh tokens
 * are scoped at grant time; the snapshot-era token only had `read`, which cannot
 * list activities. This walks the OAuth code flow with `activity:read_all`,
 * captures the redirect on a local listener, exchanges the code, and persists
 * the new refresh token to Redis (`strava:refresh_token`, what import-strava-data
 * reads) and to `.env.local` (`STRAVA_REFRESH_TOKEN`).
 *
 * Usage:   node scripts/strava-reauth.mjs
 * Reads:   .env.local (STRAVA_CLIENT_ID, STRAVA_SECRET, KV_REST_API_URL, KV_REST_API_TOKEN)
 *
 * If the authorize page errors on the redirect, add `localhost` to the app's
 * Authorization Callback Domain at https://www.strava.com/settings/api.
 */

import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { Redis } from '@upstash/redis'

const PORT = 8723
const REDIRECT = `http://localhost:${PORT}/exchange_token`

function parseEnvFile(text) {
  const out = {}
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!m) continue
    let v = m[2].trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    out[m[1]] = v
  }
  return out
}

const fileEnv = parseEnvFile(await readFile('.env.local', 'utf8').catch(() => ''))
const env = { ...fileEnv, ...process.env }

const CLIENT_ID = env.STRAVA_CLIENT_ID
const CLIENT_SECRET = env.STRAVA_SECRET
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing STRAVA_CLIENT_ID / STRAVA_SECRET in .env.local.')
  process.exit(1)
}

const authUrl =
  'https://www.strava.com/oauth/authorize?' +
  new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT,
    approval_prompt: 'force',
    scope: 'read,activity:read_all',
  }).toString()

async function persistRefreshToken(token, scope) {
  // Redis (primary source for import-strava-data.mjs)
  if (env.KV_REST_API_URL && env.KV_REST_API_TOKEN) {
    const redis = new Redis({ url: env.KV_REST_API_URL, token: env.KV_REST_API_TOKEN })
    await redis.set('strava:refresh_token', token)
    console.log('  stored -> Redis strava:refresh_token')
  } else {
    console.log('  (no KV creds; skipped Redis)')
  }
  // .env.local backup
  let text = await readFile('.env.local', 'utf8').catch(() => '')
  if (/^STRAVA_REFRESH_TOKEN=.*$/m.test(text)) {
    text = text.replace(/^STRAVA_REFRESH_TOKEN=.*$/m, `STRAVA_REFRESH_TOKEN=${token}`)
  } else {
    text += `${text.endsWith('\n') ? '' : '\n'}STRAVA_REFRESH_TOKEN=${token}\n`
  }
  await writeFile('.env.local', text)
  console.log('  stored -> .env.local STRAVA_REFRESH_TOKEN')
  console.log(`  granted scope: ${scope}`)
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  if (url.pathname !== '/exchange_token') {
    res.writeHead(404).end('not found')
    return
  }
  const code = url.searchParams.get('code')
  const grantedScope = url.searchParams.get('scope') || ''
  if (!code) {
    res.writeHead(400).end('no code in redirect')
    return
  }
  try {
    const r = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    })
    const data = await r.json()
    if (!r.ok || !data.refresh_token) {
      throw new Error(`token exchange failed (${r.status}): ${JSON.stringify(data)}`)
    }
    await persistRefreshToken(data.refresh_token, grantedScope)
    const ok = grantedScope.includes('activity:read_all')
    res.writeHead(200, { 'Content-Type': 'text/html' }).end(
      `<body style="background:#111;color:#0ff;font-family:monospace;padding:2rem">` +
        `<h2>strava authorized</h2><p>scope: ${grantedScope}</p>` +
        `<p>${ok ? 'activity:read_all granted. close this tab.' : 'WARNING: activity:read_all NOT granted.'}</p></body>`,
    )
    console.log(ok ? '\nDone. Re-run the import.' : '\nWARNING: activity:read_all not granted; re-run and approve all boxes.')
    setTimeout(() => process.exit(ok ? 0 : 1), 250)
  } catch (err) {
    res.writeHead(500).end(String(err))
    console.error('\n' + err.message)
    setTimeout(() => process.exit(1), 250)
  }
})

server.listen(PORT, () => {
  console.log('Open this URL and click Authorize (approve ALL boxes):\n')
  console.log('  ' + authUrl + '\n')
  console.log(`Listening on ${REDIRECT} for the redirect...`)
  spawn('open', [authUrl]).on('error', () => {
    console.log('(could not auto-open; paste the URL above into your browser)')
  })
})
