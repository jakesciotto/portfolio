'use client'

import { useEffect, useState } from 'react'
import StatCard from './stat-card'

export default function GitHubStats() {
  const [stats, setStats] = useState({
    commits7d: '---',
    prevCommits7d: null,
    loading: true,
  })

  const fetchGitHubStats = async () => {
    try {
      const cached = localStorage.getItem('gh_stats')
      const cacheTime = localStorage.getItem('gh_stats_time')

      if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 300000) {
        setStats({ ...JSON.parse(cached), loading: false })
        return
      }

      const response = await fetch('/api/github-stats')
      if (!response.ok) throw new Error('GitHub API error')

      const { commits7d, prevCommits7d } = await response.json()

      const newStats = {
        commits7d,
        prevCommits7d,
        loading: false,
      }

      setStats(newStats)
      localStorage.setItem('gh_stats', JSON.stringify(newStats))
      localStorage.setItem('gh_stats_time', Date.now().toString())
    } catch (error) {
      console.error('Failed to fetch GitHub stats:', error)

      const cached = localStorage.getItem('gh_stats')
      if (cached) {
        setStats({ ...JSON.parse(cached), loading: false })
      } else {
        setStats({ commits7d: '---', loading: false })
      }
    }
  }

  useEffect(() => {
    fetchGitHubStats()

    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchGitHubStats()
      }
    }, 300000)

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchGitHubStats()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const trend =
    typeof stats.commits7d === 'number' && typeof stats.prevCommits7d === 'number'
      ? stats.commits7d > stats.prevCommits7d
        ? 'up'
        : stats.commits7d < stats.prevCommits7d
          ? 'down'
          : null
      : null

  return (
    <StatCard
      title="commits (last 7 days)"
      value={stats.commits7d}
      glowColor="cyan"
      animateNumber={typeof stats.commits7d === 'number'}
      trend={trend}
    />
  )
}
