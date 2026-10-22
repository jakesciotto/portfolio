import { redis, parseValue } from './redis'

export const EMPTY_SPOTIFY_STATS = {
  overview: null,
  topArtists: [],
  topTracks: [],
  yearlyHours: [],
  funFacts: null,
}

export async function loadSpotifyStats() {
  if (!redis) throw new Error('Redis not configured')

  const [overview, topArtists, topTracks, yearlyHours, funFacts] =
    await Promise.all([
      redis.get('spotify:overview'),
      redis.get('spotify:top_artists'),
      redis.get('spotify:top_tracks'),
      redis.get('spotify:yearly_hours'),
      redis.get('spotify:fun_facts'),
    ])

  return {
    overview: parseValue(overview),
    topArtists: parseValue(topArtists) || [],
    topTracks: parseValue(topTracks) || [],
    yearlyHours: parseValue(yearlyHours) || [],
    funFacts: parseValue(funFacts),
  }
}
