export function mapTraktStats({ stats, watchedShows, last30 } = {}) {
  const movies = stats?.movies?.watched || 0
  const episodes = stats?.episodes?.watched || 0
  const minutes = (stats?.movies?.minutes || 0) + (stats?.episodes?.minutes || 0)

  const topShows = (Array.isArray(watchedShows) ? [...watchedShows] : [])
    .filter((w) => w?.show?.title)
    .sort((a, b) => (b.plays || 0) - (a.plays || 0))
    .slice(0, 5)
    .map((w) => ({ title: w.show.title, plays: w.plays || 0 }))

  return {
    movies,
    episodes,
    hours: Math.round(minutes / 60),
    topShows,
    last30: {
      episodes: Number(last30?.episodes) || 0,
      movies: Number(last30?.movies) || 0,
    },
  }
}
