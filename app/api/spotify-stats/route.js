import { Redis } from '@upstash/redis'
import PostHogClient from '../../posthog'

const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
    : null

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

export async function GET(request) {
  const posthog = PostHogClient()
  const distinctId =
    request.headers.get('x-posthog-distinct-id') || 'server_anonymous'

  try {
    if (!redis) throw new Error('Redis not configured')

    const [overview, topArtists, topTracks, yearlyHours] =
      await Promise.all([
        redis.get('spotify:overview'),
        redis.get('spotify:top_artists'),
        redis.get('spotify:top_tracks'),
        redis.get('spotify:yearly_hours'),
      ])

    const result = {
      overview: parseValue(overview),
      topArtists: parseValue(topArtists) || [],
      topTracks: parseValue(topTracks) || [],
      yearlyHours: parseValue(yearlyHours) || [],
    }

    posthog.capture({
      distinctId,
      event: 'spotify_stats_fetched',
      properties: { source: 'api' },
    })

    return Response.json(result)
  } catch (error) {
    posthog.capture({
      distinctId,
      event: 'spotify_stats_error',
      properties: { error_message: error?.message, source: 'api' },
    })

    return Response.json({
      overview: null,
      topArtists: [],
      topTracks: [],
      yearlyHours: [],
    })
  }
}
