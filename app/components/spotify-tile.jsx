'use client'

import { useEffect, useState } from 'react'
import StatTile from './stat-tile'
import TileSkeleton from './tile-skeleton'

export default function SpotifyTile() {
  const [stats, setStats] = useState(null)
  const [nowPlaying, setNowPlaying] = useState(null)

  const fetchStats = async () => {
    try {
      const cached = localStorage.getItem('spotify_stats')
      const cacheTime = localStorage.getItem('spotify_stats_time')

      if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 900000) {
        setStats(JSON.parse(cached))
        return
      }

      const res = await fetch('/api/spotify-stats')
      const data = await res.json()

      setStats(data)
      if (data.overview) {
        localStorage.setItem('spotify_stats', JSON.stringify(data))
        localStorage.setItem('spotify_stats_time', Date.now().toString())
      }
    } catch {
      const cached = localStorage.getItem('spotify_stats')
      if (cached) setStats(JSON.parse(cached))
    }
  }

  const fetchNowPlaying = async () => {
    try {
      const res = await fetch('/api/spotify-now-playing')
      const data = await res.json()
      setNowPlaying(data)
    } catch {
      // Silent failure -- don't affect archive stats display
    }
  }

  useEffect(() => {
    fetchStats()

    const interval = setInterval(() => {
      if (!document.hidden) fetchStats()
    }, 900000)

    const handleVisibility = () => {
      if (!document.hidden) fetchStats()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  useEffect(() => {
    fetchNowPlaying()

    const interval = setInterval(() => {
      if (!document.hidden) fetchNowPlaying()
    }, 30000)

    const handleVisibility = () => {
      if (!document.hidden) fetchNowPlaying()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  if (!stats) return <TileSkeleton accent="secondary" />

  const hours = stats.overview?.totalHours
    ? Math.round(stats.overview.totalHours).toLocaleString()
    : '---'
  const topArtist = stats.topArtists?.[0]?.name
  const firstYear = stats.overview?.firstStream?.slice(0, 4)
  const currentYear = new Date().getFullYear()
  const span = firstYear
    ? `${currentYear - parseInt(firstYear)} years of data`
    : undefined

  const isPlaying = nowPlaying?.isPlaying && nowPlaying.track

  return (
    <StatTile
      heading="spotify"
      value={hours}
      label="hours listened"
      secondaryLabel={
        [topArtist ? `top: ${topArtist}` : null, span]
          .filter(Boolean)
          .join(' | ') || undefined
      }
      accent="secondary"
    >
      {isPlaying && (
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-secondary" />
          </span>
          <p className="text-xs text-foreground truncate">
            {nowPlaying.track}
            {nowPlaying.artist && (
              <span className="text-muted-foreground"> - {nowPlaying.artist}</span>
            )}
          </p>
        </div>
      )}
    </StatTile>
  )
}
