import { unstable_cache } from 'next/cache'
import { settleLoaders } from '../settle-loaders.mjs'
import { loadGithubStats } from './github'
import { loadWakaStats } from './wakatime'
import { loadObsidianStats } from './obsidian'
import { loadSpotifyStats } from './spotify-stats'
import { loadStravaStats } from './strava'

const snapshot = (key, load) =>
  unstable_cache(load, [`tile-${key}-v2`], { revalidate: 300 })

const LOADERS = {
  github: loadGithubStats,
  wakatime: loadWakaStats,
  obsidian: snapshot('obsidian', loadObsidianStats),
  spotifyStats: snapshot('spotify-stats', loadSpotifyStats),
  strava: snapshot('strava-all', () => loadStravaStats('all')),
}

const TIMEOUTS = { github: 10000 }

export async function loadTileData() {
  if (!process.env.VERCEL) return {}
  return settleLoaders(LOADERS, {
    timeouts: TIMEOUTS,
    onError: (key, error) =>
      console.error(`tile data ${key} failed:`, error?.message),
  })
}
