'use client'

import { useEffect, useRef, useState } from 'react'
import { useCachedFetch } from '../lib/use-cached-fetch'
import { agoLabel } from '../lib/format.mjs'
import TileSkeleton from './tile-skeleton'
import AnimatedNumber from './animated-number'
import PeriodPills from './ui/period-pills'
import BarList from './ui/bar-list'

const PERIODS = [
  { key: 'week', label: '7d' },
  { key: 'month', label: '30d' },
  { key: 'year', label: 'ytd' },
  { key: 'all', label: 'all' },
]

export default function StravaTile() {
  const [period, setPeriod] = useState('all')
  const [transitioning, setTransitioning] = useState(false)
  const transitionRef = useRef(null)

  const stats = useCachedFetch(`/api/strava-stats?period=${period}`, `strava_stats_${period}`, {
    ttl: 3600000,
    shouldCache: (data) => data.count != null && !!data.lastSync,
  })

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

  if (!stats) return <TileSkeleton accent="secondary" lines={4} />

  const totalHours = stats.movingTime ? Math.floor(stats.movingTime / 3600) : null
  const totalMiles = stats.distance
  const sorted = [...(stats.breakdown || [])].sort((a, b) => b.count - a.count)
  const top8 = sorted.slice(0, 8)
  const rest = sorted.slice(8)
  const breakdown = rest.length > 0
    ? [...top8, { type: 'Other', count: rest.reduce((sum, t) => sum + t.count, 0) }]
    : top8
  const maxCount = breakdown.length > 0 ? Math.max(...breakdown.map((t) => t.count)) : 0

  return (
    <div className="flex flex-col h-full gap-3">
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground">
        strava
      </h3>

      <PeriodPills options={PERIODS} value={period} onChange={handlePeriodChange} accent="secondary" label="Strava period" />

      <div className={`transition-opacity duration-200 ease-in-out ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
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
              value={stats.count}
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
          <BarList
            rows={breakdown.map((t) => ({ name: t.type, width: (t.count / maxCount) * 100, value: t.count, opacity: 0.7 }))}
            accent="secondary"
            nameWidth={104}
            className="mt-5"
          />
        )}
      </div>

      {stats.lastSync && (
        <p className="text-[10px] font-mono text-muted-foreground font-medium mt-auto">
          {agoLabel(stats.lastSync, 'synced')}
        </p>
      )}
    </div>
  )
}
