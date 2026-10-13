'use client'

import { useEffect, useRef, useState } from 'react'
import { useCachedFetch } from '../lib/use-cached-fetch'
import { agoLabel } from '../lib/format.mjs'
import TileSkeleton from './tile-skeleton'
import AnimatedNumber from './animated-number'
import PeriodPills from './ui/period-pills'
import BarList from './ui/bar-list'
import { breakdownColumns } from '../lib/strava-view.mjs'
import { HEADLINE, HEADLINE_UNIT } from '../lib/accents.mjs'

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

  const stats = useCachedFetch(
    `/api/strava-stats?period=${period}`,
    `strava_stats_${period}`,
    {
      ttl: 3600000,
      shouldCache: (data) => data.count != null && !!data.lastSync,
    },
  )

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

  const totalHours = stats.movingTime
    ? Math.floor(stats.movingTime / 3600)
    : null
  const { max, columns } = breakdownColumns(stats.breakdown)
  const facts = [
    stats.count != null && `${stats.count.toLocaleString('en-US')} activities`,
    stats.distance > 0 &&
      `${Math.round(stats.distance).toLocaleString('en-US')} miles`,
    max > 0 && `${columns.flat().length} types`,
  ].filter(Boolean)

  return (
    <div className="flex flex-col h-full gap-3">
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground">
        strava
      </h3>

      <PeriodPills
        options={PERIODS}
        value={period}
        onChange={handlePeriodChange}
        accent="secondary"
        label="Strava period"
      />

      <div
        className={`transition-opacity duration-200 ease-in-out ${transitioning ? 'opacity-0' : 'opacity-100'}`}
      >
        <span className={`${HEADLINE} text-accent-secondary`}>
          <AnimatedNumber value={totalHours} />
          <span className={HEADLINE_UNIT}>hours</span>
        </span>
        {facts.length > 0 && (
          <p className="mt-2 font-mono text-[10.5px] text-muted-foreground/70">
            {facts.join(' · ')}
          </p>
        )}

        {max > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {columns
              .filter((column) => column.length > 0)
              .map((column, i) => (
                <BarList
                  key={i}
                  rows={column.map((t) => ({
                    name: t.type,
                    width: Math.max(2, (t.count / max) * 100),
                    value: t.count,
                    opacity: 0.7,
                  }))}
                  accent="secondary"
                  nameWidth={84}
                />
              ))}
          </div>
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
