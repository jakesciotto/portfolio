'use client'

import { useEffect, useState, useRef } from 'react'
import TileSkeleton from './tile-skeleton'

const PERIODS = [
  { key: 'week', label: '7d' },
  { key: 'month', label: '30d' },
  { key: 'year', label: 'ytd' },
  { key: 'all', label: 'all' },
]

function formatHours(seconds) {
  if (!seconds) return '---'
  const hrs = Math.floor(seconds / 3600)
  return hrs.toLocaleString()
}

function cacheKey(period) {
  return `strava_stats_${period}`
}

function cacheTimeKey(period) {
  return `strava_stats_time_${period}`
}

function AnimatedNumber({ value, className }) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)

  useEffect(() => {
    if (prevRef.current === value) return
    const from = prevRef.current || 0
    const to = value || 0
    prevRef.current = value

    if (typeof from !== 'number' || typeof to !== 'number') {
      setDisplay(value)
      return
    }

    const duration = 400
    const start = performance.now()

    function step(now) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (t < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [value])

  return <span className={className}>{typeof display === 'number' ? display.toLocaleString() : display}</span>
}

export default function StravaTile() {
  const [stats, setStats] = useState(null)
  const [period, setPeriod] = useState('all')
  const [loading, setLoading] = useState(false)
  const [transitioning, setTransitioning] = useState(false)

  const fetchStats = async (p) => {
    try {
      const cached = localStorage.getItem(cacheKey(p))
      const cacheTime = localStorage.getItem(cacheTimeKey(p))

      if (
        cached &&
        cacheTime &&
        Date.now() - parseInt(cacheTime) < 900000
      ) {
        setStats(JSON.parse(cached))
        return
      }

      setLoading(true)
      const res = await fetch(`/api/strava-stats?period=${p}`, { cache: 'no-store' })
      const data = await res.json()

      setStats(data)
      if (data.count != null) {
        localStorage.setItem(cacheKey(p), JSON.stringify(data))
        localStorage.setItem(cacheTimeKey(p), Date.now().toString())
      }
    } catch (err) {
      const cached = localStorage.getItem(cacheKey(p))
      if (cached) setStats(JSON.parse(cached))
    } finally {
      setLoading(false)
    }
  }

  const handlePeriodChange = (p) => {
    if (p === period) return
    setTransitioning(true)
    setTimeout(() => {
      setPeriod(p)
      setTransitioning(false)
    }, 200)
  }

  useEffect(() => {
    fetchStats(period)
  }, [period])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) fetchStats(period)
    }, 900000)

    const handleVisibility = () => {
      if (!document.hidden) fetchStats(period)
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
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
    <div className="flex flex-col justify-between h-full gap-3">
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground">
        strava
      </h3>

      <div className="flex gap-1">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => handlePeriodChange(p.key)}
            className={`px-2 py-0.5 text-[10px] uppercase font-mono font-medium tracking-widest rounded transition-all duration-200 ${
              period === p.key
                ? 'bg-accent-secondary/20 text-accent-secondary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={`transition-opacity duration-200 ease-in-out ${contentOpacity}`}>
        <div>
          <AnimatedNumber
            value={totalHours}
            className="text-3xl font-bold font-mono tracking-tighter text-accent-secondary"
          />
          <p className="text-[10px] uppercase font-medium tracking-widest text-muted-foreground">
            hours active
          </p>
        </div>

        <div className="flex gap-4 mt-2">
          <div>
            <AnimatedNumber
              value={totalActivities}
              className="text-2xl font-bold font-mono tracking-tighter text-accent-primary"
            />
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              activities
            </p>
          </div>
          {totalMiles > 0 && (
            <div>
              <AnimatedNumber
                value={Math.round(totalMiles)}
                className="text-2xl font-bold font-mono tracking-tighter text-accent-tertiary"
              />
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                miles
              </p>
            </div>
          )}
        </div>

        {breakdown.length > 0 && (
          <div className="flex flex-col gap-1.5 mt-3">
            {breakdown.map((t) => (
              <div key={t.type} className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground w-24 shrink-0 truncate" title={t.type}>
                  {t.type}
                </span>
                <div className="flex-1 h-2 rounded-full bg-muted/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent-secondary/60 transition-all duration-500 ease-out"
                    style={{ width: `${(t.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-medium text-accent-secondary w-8 text-right">
                  {t.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
