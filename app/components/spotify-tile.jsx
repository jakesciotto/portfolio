'use client'

import { useEffect, useState } from 'react'
import StatTile from './stat-tile'
import TileSkeleton from './tile-skeleton'

export default function SpotifyTile() {
  const [stats, setStats] = useState(null)

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
    />
  )
}
