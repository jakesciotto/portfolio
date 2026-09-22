import { Redis } from '@upstash/redis'
import { captureServer } from '../../posthog'

const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
    : null

const CACHE = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
}

export async function GET() {
  try {
    if (!redis) throw new Error('Redis not configured')
    const raw = await redis.get('spotify:live')
    const live = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (!(live?.minutes > 0) || !live?.year) {
      return Response.json(
        { live: null },
        { headers: { 'Cache-Control': 'no-store' } },
      )
    }
    return Response.json(
      {
        live: {
          year: live.year,
          minutes: Math.round(live.minutes),
          lastStream: live.lastStream ?? null,
        },
      },
      { headers: CACHE },
    )
  } catch (error) {
    captureServer('spotify_live_error', {
      error_message: error?.message,
      source: 'api',
    })
    return Response.json(
      { live: null },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
