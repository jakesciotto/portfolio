import { unstable_cache } from 'next/cache'
import { settleLoaders } from '../settle-loaders.mjs'
import { loadGithubStats } from './github'
import { loadWakaStats } from './wakatime'
import { loadObsidianStats } from './obsidian'
import { loadSpotifyStats } from './spotify-stats'
import { loadStravaStats } from './strava'

const LOADERS = {
  github: loadGithubStats,
  wakatime: loadWakaStats,
  obsidian: loadObsidianStats,
  spotifyStats: loadSpotifyStats,
  strava: () => loadStravaStats('all'),
}

const settleTileData = unstable_cache(
  () =>
    settleLoaders(LOADERS, {
      onError: (key, error) =>
        console.error(`tile data ${key} failed:`, error?.message),
    }),
  ['tile-data-v1'],
  { revalidate: 300 },
)

export async function loadTileData() {
  if (!process.env.VERCEL) return {}
  return settleTileData()
}
