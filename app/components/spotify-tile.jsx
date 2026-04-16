'use client'

import { useEffect, useState } from 'react'
import TileSkeleton from './tile-skeleton'
import AnimatedNumber from './animated-number'

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

  if (!stats) return <TileSkeleton accent="tertiary" lines={4} />

  const totalHours = stats.overview?.totalHours
    ? Math.round(stats.overview.totalHours)
    : null
  const topArtist = stats.topArtists?.[0]?.name
  const topTrack = stats.topTracks?.[0]?.name
  const yearlyHours = Array.isArray(stats.yearlyHours) ? stats.yearlyHours : []
  const maxHours = yearlyHours.length > 0
    ? Math.max(...yearlyHours.map((y) => y.hours || 0))
    : 0

  const firstYear = stats.overview?.firstStream?.slice(0, 4)
  const currentYear = new Date().getFullYear()
  const span = firstYear
    ? `${currentYear - parseInt(firstYear)} years of data`
    : null

  return (
    <div className="flex flex-col justify-between h-full gap-3">
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground">
        spotify
      </h3>

      <div>
        <AnimatedNumber
          value={totalHours}
          className="text-3xl font-bold font-mono tracking-tighter text-accent-tertiary"
        />
        <p className="text-[10px] uppercase font-medium tracking-widest text-muted-foreground">
          hours listened
        </p>
      </div>

      {(topArtist || topTrack) && (
        <div className="flex gap-4">
          {topArtist && (
            <div>
              <p className="text-sm font-semibold text-foreground truncate">{topArtist}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                top artist
              </p>
            </div>
          )}
          {topTrack && (
            <div>
              <p className="text-sm font-semibold text-foreground truncate">{topTrack}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                top track
              </p>
            </div>
          )}
        </div>
      )}

      {yearlyHours.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {yearlyHours.map((y) => (
            <div key={y.year} className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground w-10 shrink-0">
                {y.year}
              </span>
              <div className="flex-1 h-2 rounded-full bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent-tertiary/60 transition-all duration-500 ease-out"
                  style={{ width: maxHours > 0 ? `${((y.hours || 0) / maxHours) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-xs font-mono font-medium text-accent-tertiary w-10 text-right">
                {Math.round(y.hours || 0)}
              </span>
            </div>
          ))}
        </div>
      )}

      {span && (
        <p className="text-[10px] text-muted-foreground mt-auto">{span}</p>
      )}
    </div>
  )
}
