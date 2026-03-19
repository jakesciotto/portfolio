'use client'

import { useEffect, useState } from 'react'
import StatTile from './stat-tile'
import TileSkeleton from './tile-skeleton'
import Sparkline from './ui/sparkline'

export default function GitHubTile() {
  const [stats, setStats] = useState(null)

  const fetchStats = async () => {
    try {
      const cached = localStorage.getItem('gh_stats')
      const cacheTime = localStorage.getItem('gh_stats_time')

      if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 300000) {
        setStats(JSON.parse(cached))
        return
      }

      const res = await fetch('/api/github-stats')
      if (!res.ok) throw new Error('GitHub API error')

      const data = await res.json()
      const newStats = {
        commits7d: data.commits7d,
        prevCommits7d: data.prevCommits7d,
        daily: data.daily || [],
        isActive: data.isActive ?? false,
      }

      setStats(newStats)
      localStorage.setItem('gh_stats', JSON.stringify(newStats))
      localStorage.setItem('gh_stats_time', Date.now().toString())
    } catch (err) {
      const cached = localStorage.getItem('gh_stats')
      if (cached) setStats(JSON.parse(cached))
    }
  }

  useEffect(() => {
    fetchStats()

    const interval = setInterval(() => {
      if (!document.hidden) fetchStats()
    }, 300000)

    const handleVisibility = () => {
      if (!document.hidden) fetchStats()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  if (!stats) return <TileSkeleton accent="primary" />

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            stats.isActive
              ? 'bg-accent-secondary'
              : 'bg-muted-foreground'
          }`}
        />
        <span className="text-xs uppercase font-medium tracking-widest text-muted-foreground">
          github
        </span>
      </div>
      <StatTile
        value={stats.commits7d}
        label="commits this week"
        accent="primary"
        animate={typeof stats.commits7d === 'number'}
      >
        {stats.daily && stats.daily.length > 0 && (
          <Sparkline data={stats.daily} color="primary" />
        )}
      </StatTile>
    </div>
  )
}
