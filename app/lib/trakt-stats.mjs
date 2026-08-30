export function mapTraktStats({ stats, watchedShows, history } = {}) {
  const movies = stats?.movies?.watched || 0
  const episodes = stats?.episodes?.watched || 0
  const minutes = (stats?.movies?.minutes || 0) + (stats?.episodes?.minutes || 0)

  const topShows = [...(watchedShows || [])]
    .filter((w) => w?.show?.title)
    .sort((a, b) => (b.plays || 0) - (a.plays || 0))
    .slice(0, 5)
    .map((w) => ({ title: w.show.title, plays: w.plays || 0 }))

  const last30 = { episodes: 0, movies: 0 }
  for (const item of history || []) {
    if (item.type === 'episode') last30.episodes++
    else if (item.type === 'movie') last30.movies++
  }

  return { movies, episodes, hours: Math.round(minutes / 60), topShows, last30 }
}
