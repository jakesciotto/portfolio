'use client'

import { useEffect, useState } from 'react'
import StatCard from './stat-card'

export default function GitHubStats({ username = 'jakesciotto' }) {
  const [stats, setStats] = useState({
    commits7d: '---',
    commits30d: '---',
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

      const response = await fetch(`https://api.github.com/users/${username}/events`)
      if (!response.ok) throw new Error('GitHub API error')

      const events = await response.json()

      if (!Array.isArray(events)) {
        throw new Error('Invalid response format')
      }

      const now = Date.now()
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000

      // Count push events (GitHub API doesn't always include commits array)
      const pushEvents = events.filter((e) => e.type === 'PushEvent')

      const commits7d = pushEvents.filter(
        (e) => new Date(e.created_at).getTime() > sevenDaysAgo
      ).length

      const commits30d = pushEvents.filter(
        (e) => new Date(e.created_at).getTime() > thirtyDaysAgo
      ).length

      const newStats = {
        commits7d,
        commits30d,
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
        setStats({ commits7d: '---', commits30d: '---', loading: false })
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
  }, [username])

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
