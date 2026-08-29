import { Redis } from '@upstash/redis'
import PostHogClient from '../../posthog'
import { mapTraktStats } from '../../lib/trakt-stats.mjs'

const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
    : null

// In-memory token cache
let cachedAccessToken = null
let tokenExpiresAt = 0

async function getRefreshToken() {
  if (redis) {
    const stored = await redis.get('trakt_refresh_token').catch(() => null)
    if (stored) return stored
  }
  return process.env.TRAKT_REFRESH_TOKEN
}

async function getAccessToken() {
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedAccessToken
  }

  const refreshToken = await getRefreshToken()
  if (!refreshToken) throw new Error('No Trakt refresh token available')

  const res = await fetch('https://api.trakt.tv/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'jakesciotto-portfolio/1.0',
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
      client_id: process.env.TRAKT_CLIENT_ID,
      client_secret: process.env.TRAKT_CLIENT_SECRET,
      redirect_uri: process.env.TRAKT_REDIRECT_URI || 'https://jakesciotto.com/api/trakt-callback',
      grant_type: 'refresh_token',
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Trakt token refresh failed (${res.status}): ${body}`)
  }

  const data = await res.json()
  cachedAccessToken = data.access_token
  tokenExpiresAt = Date.now() + (data.expires_in || 7776000) * 1000

  // Persist rotated refresh token
  if (data.refresh_token && redis) {
    await redis.set('trakt_refresh_token', data.refresh_token).catch(() => {})
  }

  return cachedAccessToken
}

function traktFetch(path, accessToken) {
  return fetch(`https://api.trakt.tv${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'jakesciotto-portfolio/1.0',
      'trakt-api-version': '2',
      'trakt-api-key': process.env.TRAKT_CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

function formatItem(item) {
  if (item.type === 'episode' && item.show && item.episode) {
    const ep = item.episode
    const season = String(ep.season).padStart(2, '0')
    const number = String(ep.number).padStart(2, '0')
    return {
      type: 'episode',
      title: item.show.title,
      episodeTitle: `S${season}E${number} - ${ep.title}`,
    }
  }
  if (item.type === 'movie' && item.movie) {
    return {
      type: 'movie',
      title: item.movie.title,
      episodeTitle: null,
    }
  }
  return null
}

export async function GET(request) {
  const posthog = PostHogClient()
  const distinctId =
    request.headers.get('x-posthog-distinct-id') || 'server_anonymous'

  try {
    const accessToken = await getAccessToken()

    // Fetch now-watching and last-watched live, stats from cache if available
    const [watchingRes, historyRes, stats] = await Promise.all([
      traktFetch('/users/me/watching', accessToken),
      traktFetch('/users/me/history?limit=1', accessToken),
      getCachedStats(accessToken),
    ])

    // Now watching: 204 means nothing playing
    let nowWatching = null
    if (watchingRes.status === 200) {
      const watchingData = await watchingRes.json()
      nowWatching = formatItem(watchingData)
    }

    // Last watched
    let lastWatched = null
    if (historyRes.ok) {
      const historyData = await historyRes.json()
      if (historyData.length > 0) {
        const item = historyData[0]
        const formatted = formatItem(item)
        if (formatted) {
          lastWatched = { ...formatted, watchedAt: item.watched_at }
        }
      }
    }

    const result = { nowWatching, lastWatched, stats }

    posthog.capture({
      distinctId,
      event: 'trakt_stats_fetched',
      properties: {
        now_watching: !!nowWatching,
        stats_movies: stats?.movies,
        stats_episodes: stats?.episodes,
        source: 'api',
      },
    })

    return Response.json(result)
  } catch (error) {
    posthog.capture({
      distinctId,
      event: 'trakt_stats_error',
      properties: { error_message: error?.message, source: 'api' },
    })

    return Response.json({
      nowWatching: null,
      lastWatched: null,
      stats: null,
    })
  }
}

const STATS_KEY = 'trakt_alltime_stats_v2'
const MAX_HISTORY_PAGES = 5

async function fetchHistorySince(accessToken, sinceIso) {
  const items = []
  let page = 1
  let pages = 1
  do {
    const res = await traktFetch(
      `/users/me/history?start_at=${encodeURIComponent(sinceIso)}&limit=1000&page=${page}`,
      accessToken,
    )
    if (!res.ok) break
    pages = Number(res.headers.get('x-pagination-page-count') || 1)
    items.push(...(await res.json()))
    page++
  } while (page <= pages && page <= MAX_HISTORY_PAGES)
  return items
}

async function getCachedStats(accessToken) {
  if (redis) {
    const cached = await redis.get(STATS_KEY).catch(() => null)
    if (cached) {
      return typeof cached === 'string' ? JSON.parse(cached) : cached
    }
  }

  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
  const [statsRes, watchedRes, history] = await Promise.all([
    traktFetch('/users/me/stats', accessToken),
    traktFetch('/users/me/watched/shows?extended=noseasons', accessToken),
    fetchHistorySince(accessToken, since),
  ])

  if (!statsRes.ok) return null

  const stats = mapTraktStats({
    stats: await statsRes.json(),
    watchedShows: watchedRes.ok ? await watchedRes.json() : [],
    history,
  })

  if (redis) {
    await redis.set(STATS_KEY, JSON.stringify(stats), { ex: 3600 }).catch(() => {})
  }

  return stats
}
