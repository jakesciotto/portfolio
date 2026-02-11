'use client'

import { useEffect, useState } from 'react'
import StatCard from './stat-card'

export default function GitHubStats() {
  const [stats, setStats] = useState({
    commits7d: '---',
    loading: true,
  })

  const fetchGitHubStats = async () => {
    try {
      // Check cache first
      const cached = localStorage.getItem('gh_stats')
      const cacheTime = localStorage.getItem('gh_stats_time')

      if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 300000) {
        // Cache valid for 5 minutes
        setStats({ ...JSON.parse(cached), loading: false })
        return
      }

      const response = await fetch('/api/github-stats')
      if (!response.ok) throw new Error('GitHub API error')

      const { commits7d } = await response.json()

      const newStats = {
        commits7d,
        loading: false,
      }

      setStats(newStats)
      localStorage.setItem('gh_stats', JSON.stringify(newStats))
      localStorage.setItem('gh_stats_time', Date.now().toString())
    } catch (error) {
      console.error('Failed to fetch GitHub stats:', error)

      // Try to use cached data even if expired
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

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchGitHubStats()
      }
    }, 300000) // 5 minutes

    // Pause when tab hidden
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

  return (
    <>
      <StatCard
        title="commits (last 7 days)"
        value={stats.commits7d}
        variant="standard"
        animateNumber={typeof stats.commits7d === 'number'}
      />
    </>
  )
}
