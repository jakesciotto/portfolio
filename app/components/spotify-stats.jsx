'use client'

import { useEffect, useState } from 'react'
import StatCard from './stat-card'
import AnimatedSection from './animated-section'
import { GlassCard } from './ui/glass-card'
import { cn } from '@/app/lib/utils'

const emptyState = {
  overview: null,
  topArtists: [],
  topTracks: [],
  yearlyHours: [],
  funFacts: null,
}

export default function SpotifyStats({ delayStart = 0, compact = false }) {
  const [stats, setStats] = useState({ ...emptyState, loading: true })

  const fetchStats = async () => {
    try {
      const cached = localStorage.getItem('spotify_stats')
      const cacheTime = localStorage.getItem('spotify_stats_time')

      if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 900000) {
        setStats({ ...JSON.parse(cached), loading: false })
        return
      }

      const res = await fetch('/api/spotify-stats')
      const data = await res.json()
      const newStats = { ...data, loading: false }

      setStats(newStats)
      if (data.overview) {
        localStorage.setItem('spotify_stats', JSON.stringify(newStats))
        localStorage.setItem('spotify_stats_time', Date.now().toString())
      }
    } catch (error) {
      console.error('Failed to fetch Spotify stats:', error)
      const cached = localStorage.getItem('spotify_stats')
      if (cached) {
        setStats({ ...JSON.parse(cached), loading: false })
      } else {
        setStats({ ...emptyState, loading: false })
      }
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

  const { overview, topArtists, topTracks, yearlyHours, funFacts } = stats

  const yearlySparkline = yearlyHours.map((y) => y.hours)

  return (
    <>
      {/* Row 1: 3-col overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <AnimatedSection delay={delayStart}>
          <StatCard
            title="hours listened"
            value={overview?.totalHours ? Math.round(overview.totalHours).toLocaleString() : '---'}
            glowColor="purple"
            subtitle={overview ? `since ${overview.firstStream?.slice(0, 4)}` : undefined}
            sparklineData={yearlySparkline.length >= 2 ? yearlySparkline : null}
            sparklineColor="purple"
            compact={compact}
          />
        </AnimatedSection>

        <AnimatedSection delay={delayStart + 50}>
          <StatCard
            title="total streams"
            value={overview?.totalStreams ? overview.totalStreams.toLocaleString() : '---'}
            glowColor="green"
            compact={compact}
          />
        </AnimatedSection>

        <AnimatedSection delay={delayStart + 100}>
          <StatCard
            title="unique artists"
            value={overview?.uniqueArtists ? overview.uniqueArtists.toLocaleString() : '---'}
            glowColor="cyan"
            compact={compact}
          />
        </AnimatedSection>
      </div>

      {/* Row 2: 2-col top lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-3 md:mt-4">
        <AnimatedSection delay={delayStart + 150}>
          <GlassCard glowColor="purple" className={compact ? '!p-3 md:!p-4' : ''}>
            <h4 className={cn(
              'font-semibold tracking-tight text-muted-foreground mb-3',
              compact ? 'text-xs md:text-sm' : 'text-sm'
            )}>
              top artists
            </h4>
            <div className="space-y-2">
              {topArtists.slice(0, 5).map((artist, i) => (
                <div key={artist.name} className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="text-neon-purple font-semibold text-sm shrink-0">
                      {i + 1}.
                    </span>
                    <span className="text-foreground text-sm truncate">
                      {artist.name}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs shrink-0">
                    {Math.round(artist.hours).toLocaleString()} hrs
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </AnimatedSection>

        <AnimatedSection delay={delayStart + 200}>
          <GlassCard glowColor="green" className={compact ? '!p-3 md:!p-4' : ''}>
            <h4 className={cn(
              'font-semibold tracking-tight text-muted-foreground mb-3',
              compact ? 'text-xs md:text-sm' : 'text-sm'
            )}>
              top tracks
            </h4>
            <div className="space-y-2">
              {topTracks.slice(0, 5).map((track, i) => (
                <div key={`${track.name}-${track.artist}`} className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="text-neon-green font-semibold text-sm shrink-0">
                      {i + 1}.
                    </span>
                    <span className="text-foreground text-sm truncate">
                      {track.name}
                    </span>
                    <span className="text-muted-foreground text-xs truncate hidden md:inline">
                      {track.artist}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs shrink-0">
                    {Math.round(track.minutes).toLocaleString()} min
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </AnimatedSection>
      </div>

      {/* Row 3: 3-col fun facts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-3 md:mt-4">
        <AnimatedSection delay={delayStart + 250}>
          <StatCard
            title={`#1 track: ${funFacts?.mostPlayedTrack || '---'}`}
            value={funFacts?.mostPlayedTrackPlays ? `${funFacts.mostPlayedTrackPlays.toLocaleString()} plays` : '---'}
            glowColor="magenta"
            compact={compact}
          />
        </AnimatedSection>

        <AnimatedSection delay={delayStart + 300}>
          <StatCard
            title={`top artist: ${funFacts?.topArtistName || '---'}`}
            value={funFacts?.topArtistPercent ? `${funFacts.topArtistPercent}%` : '---'}
            subtitle="of all listening time"
            glowColor="amber"
            compact={compact}
          />
        </AnimatedSection>

        <AnimatedSection delay={delayStart + 350}>
          <StatCard
            title="peak listening day"
            value={funFacts?.peakDayHours ? `${funFacts.peakDayHours} hrs` : '---'}
            subtitle={funFacts?.peakDay || undefined}
            glowColor="cyan"
            compact={compact}
          />
        </AnimatedSection>
      </div>
    </>
  )
}
