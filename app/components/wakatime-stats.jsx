'use client'

import { useEffect, useState } from 'react'
import StatCard from './stat-card'
import AnimatedSection from './animated-section'
import { Card } from './ui/card'
import { cn } from '@/app/lib/utils'

const emptyState = {
  totalHours: null,
  dailyAverage: null,
  languages: [],
  editors: [],
}

export default function WakaTimeStats({ delayStart = 0, compact = false }) {
  const [stats, setStats] = useState({ ...emptyState, loading: true })

  const fetchStats = async () => {
    try {
      const cached = localStorage.getItem('wakatime_stats')
      const cacheTime = localStorage.getItem('wakatime_stats_time')

      if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 900000) {
        setStats({ ...JSON.parse(cached), loading: false })
        return
      }

      const res = await fetch('/api/wakatime-stats')
      const data = await res.json()
      const newStats = { ...data, loading: false }

      setStats(newStats)
      if (data.totalHours != null) {
        localStorage.setItem('wakatime_stats', JSON.stringify(newStats))
        localStorage.setItem('wakatime_stats_time', Date.now().toString())
      }
    } catch (error) {
      console.error('Failed to fetch WakaTime stats:', error)
      const cached = localStorage.getItem('wakatime_stats')
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

  const { totalHours, dailyAverage, languages } = stats

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <AnimatedSection delay={delayStart}>
          <StatCard
            title="total coding hours"
            value={totalHours != null ? totalHours.toLocaleString() : '---'}
            accent="primary"
            subtitle="all time via wakatime"
            compact={compact}
          />
        </AnimatedSection>

        <AnimatedSection delay={delayStart + 50}>
          <StatCard
            title="daily average"
            value={dailyAverage || '---'}
            accent="secondary"
            subtitle="last 7 days"
            compact={compact}
          />
        </AnimatedSection>

        <AnimatedSection delay={delayStart + 100}>
          <Card accent="tertiary" className={compact ? '!p-3 md:!p-4' : ''}>
            <h4 className={cn(
              'font-semibold tracking-tight text-muted-foreground mb-3',
              compact ? 'text-xs md:text-sm' : 'text-sm'
            )}>
              top languages
            </h4>
            <div className="space-y-2">
              {languages.length > 0 ? (
                languages.slice(0, 5).map((lang, i) => (
                  <div key={lang.name} className="flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className="text-accent-tertiary font-semibold text-sm shrink-0">
                        {i + 1}.
                      </span>
                      <span className="text-foreground text-sm truncate">
                        {lang.name}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs shrink-0">
                      {lang.percent}%
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">---</span>
              )}
            </div>
          </Card>
        </AnimatedSection>
      </div>
    </>
  )
}
