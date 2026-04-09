'use client'

import { useEffect, useState } from 'react'
import TileSkeleton from './tile-skeleton'

export default function TodoistTile() {
  const [stats, setStats] = useState(null)

  const fetchStats = async () => {
    try {
      const cached = localStorage.getItem('todoist_stats')
      const cacheTime = localStorage.getItem('todoist_stats_time')

      if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 900000) {
        setStats(JSON.parse(cached))
        return
      }

      const res = await fetch('/api/todoist-stats')
      const data = await res.json()

      setStats(data)
      if (data.active !== null) {
        localStorage.setItem('todoist_stats', JSON.stringify(data))
        localStorage.setItem('todoist_stats_time', Date.now().toString())
      }
    } catch {
      const cached = localStorage.getItem('todoist_stats')
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

  if (!stats) return <TileSkeleton accent="primary" />

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground mb-1">
        todoist
      </h3>
      <span className="text-3xl font-bold font-mono tracking-tighter text-accent-primary">
        {stats.active ?? '---'}
      </span>
      <p className="text-[10px] uppercase font-medium tracking-widest text-muted-foreground">
        active tasks
      </p>
      <div className="flex gap-4 mt-auto">
        <div>
          <span className="text-2xl font-bold font-mono tracking-tighter text-accent-secondary">
            {stats.overdue ?? '---'}
          </span>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            overdue
          </p>
        </div>
        <div>
          <span className="text-2xl font-bold font-mono tracking-tighter text-accent-tertiary">
            {stats.completedToday ?? '---'}
          </span>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            today
          </p>
        </div>
        <div>
          <span className="text-2xl font-bold font-mono tracking-tighter text-accent-primary">
            {stats.completedThisWeek ?? '---'}
          </span>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            this week
          </p>
        </div>
      </div>
    </div>
  )
}
