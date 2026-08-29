'use client'

import { useEffect, useRef, useState } from 'react'
import TileSkeleton from './tile-skeleton'
import AnimatedNumber from './animated-number'
import PeriodPills from './ui/period-pills'
import { agoLabel } from '../lib/format.mjs'

const PERIODS = [
  { key: 'week', label: '7d' },
  { key: 'month', label: '30d' },
  { key: 'year', label: 'ytd' },
  { key: 'all', label: 'all' },
]

function cacheKey(period) {
  return `strava_stats_${period}`
}

function cacheTimeKey(period) {
  return `strava_stats_time_${period}`
}

export default function StravaTile() {
  const [stats, setStats] = useState(null)
  const [period, setPeriod] = useState('all')
  const [loading, setLoading] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const transitionRef = useRef(null)

  const fetchStats = async (p, isStale = () => false) => {
    try {
      const cached = localStorage.getItem(cacheKey(p))
      const cacheTime = localStorage.getItem(cacheTimeKey(p))

      if (
        cached &&
        cacheTime &&
        Date.now() - parseInt(cacheTime) < 900000
      ) {
        const parsed = JSON.parse(cached)
        // payloads from the pre-snapshot API era lack lastSync; refetch
        if (parsed.lastSync) {
          if (!isStale()) setStats(parsed)
          return
        }
      }

      setLoading(true)
      const res = await fetch(`/api/strava-stats?period=${p}`, { cache: 'no-store' })
      const data = await res.json()
      if (isStale()) return

      setStats(data)
      if (data.count != null) {
        localStorage.setItem(cacheKey(p), JSON.stringify(data))
        localStorage.setItem(cacheTimeKey(p), Date.now().toString())
      }
    } catch (err) {
      if (isStale()) return
      const cached = localStorage.getItem(cacheKey(p))
      if (cached) setStats(JSON.parse(cached))
    } finally {
      if (!isStale()) setLoading(false)
    }
  }

  const handlePeriodChange = (p) => {
    if (p === period) return
    setTransitioning(true)
    clearTimeout(transitionRef.current)
    transitionRef.current = setTimeout(() => {
      setPeriod(p)
      setTransitioning(false)
    }, 200)
  }

  useEffect(() => () => clearTimeout(transitionRef.current), [])

  useEffect(() => {
    let ignore = false
    fetchStats(period, () => ignore)
    return () => {
      ignore = true
    }
  }, [period])

  useEffect(() => {
    let ignore = false
    const interval = setInterval(() => {
      if (!document.hidden) fetchStats(period, () => ignore)
    }, 900000)

    const handleVisibility = () => {
      if (!document.hidden) fetchStats(period, () => ignore)
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      ignore = true
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [period])

  if (!stats && !loading) return <TileSkeleton accent="secondary" lines={4} />

  const totalHours = stats?.movingTime ? Math.floor(stats.movingTime / 3600) : null
  const totalActivities = stats?.count
  const totalMiles = stats?.distance
  const rawBreakdown = stats?.breakdown || []
  const sorted = [...rawBreakdown].sort((a, b) => b.count - a.count)
  const top8 = sorted.slice(0, 8)
  const rest = sorted.slice(8)
  const breakdown = rest.length > 0
    ? [...top8, { type: 'Other', count: rest.reduce((sum, t) => sum + t.count, 0) }]
    : top8
  const maxCount = breakdown.length > 0 ? Math.max(...breakdown.map((t) => t.count)) : 0

  const contentOpacity = transitioning || loading ? 'opacity-0' : 'opacity-100'

  return (
    <div className="flex flex-col h-full gap-3">
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground">
        strava
      </h3>

      <PeriodPills options={PERIODS} value={period} onChange={handlePeriodChange} accent="secondary" label="Strava period" />

      <div className={`transition-opacity duration-200 ease-in-out ${contentOpacity}`}>
        <div className="flex gap-4">
          <div>
            <AnimatedNumber
              value={totalHours}
              className="text-2xl font-bold font-mono tracking-tighter text-accent-secondary"
            />
            <p className="text-[10px] uppercase font-medium tracking-widest text-muted-foreground">
              hours
            </p>
          </div>
          <div>
            <AnimatedNumber
              value={totalActivities}
              className="text-2xl font-bold font-mono tracking-tighter text-accent-primary"
            />
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
              activities
            </p>
          </div>
          {totalMiles > 0 && (
            <div>
              <AnimatedNumber
                value={Math.round(totalMiles)}
                className="text-2xl font-bold font-mono tracking-tighter text-accent-tertiary"
              />
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                miles
              </p>
            </div>
          )}
        </div>

        {breakdown.length > 0 && (
          <div className="flex flex-col gap-1.5 mt-3">
            {breakdown.map((t) => (
              <div key={t.type} className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium w-24 shrink-0 truncate" title={t.type}>
                  {t.type}
                </span>
                <div className="flex-1 h-2 rounded-full bg-border-strong overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent-secondary/70 transition-all duration-500 ease-out"
                    style={{ width: `${(t.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-medium text-muted-foreground w-8 text-right">
                  {t.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {stats?.lastSync && (
        <p className="text-[10px] font-mono text-muted-foreground font-medium mt-auto">
          {agoLabel(stats.lastSync, 'synced')}
        </p>
      )}
    </div>
  )
}
