import { Redis } from '@upstash/redis'
import { captureServer } from '../../posthog'

const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
    : null

const EMPTY = { overview: null, topArtists: [], topTracks: [], yearlyHours: [], funFacts: null }
const CACHE = { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' }

function parseValue(raw) {
  if (raw == null) return null
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }
  return raw
}

export async function GET() {
  try {
    if (!redis) throw new Error('Redis not configured')

    const [overview, topArtists, topTracks, yearlyHours, funFacts] = await Promise.all([
      redis.get('spotify:overview'),
      redis.get('spotify:top_artists'),
      redis.get('spotify:top_tracks'),
      redis.get('spotify:yearly_hours'),
      redis.get('spotify:fun_facts'),
    ])

    const result = {
      overview: parseValue(overview),
      topArtists: parseValue(topArtists) || [],
      topTracks: parseValue(topTracks) || [],
      yearlyHours: parseValue(yearlyHours) || [],
      funFacts: parseValue(funFacts),
    }

    captureServer('spotify_stats_fetched', { source: 'api' })

    return Response.json(result, { headers: CACHE })
  } catch (error) {
    captureServer('spotify_stats_error', { error_message: error?.message, source: 'api' })
    return Response.json(EMPTY, { headers: { 'Cache-Control': 'no-store' } })
  }
}
