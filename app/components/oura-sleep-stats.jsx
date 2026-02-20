'use client'

import { useEffect, useState } from 'react'
import StatCard from './stat-card'
import AnimatedSection from './animated-section'
import { Badge } from './ui/badge'

const verdictConfig = {
  WOOF: { variant: 'neonMagenta', subtitle: 'thoughts and prayers' },
  OK: { variant: 'neonAmber', subtitle: 'could be worse' },
  WOW: { variant: 'neonGreen', subtitle: 'well rested and dangerous' },
  'NO DATA': { variant: 'neonPurple', subtitle: 'ring is charging or i am dead' },
}

const emptyState = {
  sleep: { current: { hours: null, score: null, verdict: 'NO DATA' }, trend: { hours: [], scores: [] } },
  readiness: { current: null, trend: [] },
}

export default function OuraStats({ delayStart = 0, compact = false }) {
  const [stats, setStats] = useState({ ...emptyState, loading: true })

  const fetchStats = async () => {
    try {
      const cached = localStorage.getItem('oura_stats')
      const cacheTime = localStorage.getItem('oura_stats_time')

      if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 900000) {
        setStats({ ...JSON.parse(cached), loading: false })
        return
      }

      const res = await fetch('/api/oura-stats')
      const data = await res.json()
      const newStats = { ...data, loading: false }

      setStats(newStats)
      if (data.sleep.current.hours !== null) {
        localStorage.setItem('oura_stats', JSON.stringify(newStats))
        localStorage.setItem('oura_stats_time', Date.now().toString())
      }
    } catch (error) {
      console.error('Failed to fetch Oura stats:', error)

      const cached = localStorage.getItem('oura_stats')
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

  const { sleep, readiness } = stats
  const verdictCfg = verdictConfig[sleep.current.verdict] || verdictConfig['NO DATA']

  return (
    <>
      <AnimatedSection delay={delayStart}>
        <StatCard
          title="hours slept last night"
          value={sleep.current.hours ?? '---'}
          glowColor="cyan"
          animateNumber={typeof sleep.current.hours === 'number'}
          subtitle={verdictCfg.subtitle}
          sparklineData={sleep.trend.hours}
          sparklineColor="cyan"
          compact={compact}
          badge={
            <Badge variant={verdictCfg.variant}>
              {sleep.current.verdict}
            </Badge>
          }
        />
      </AnimatedSection>

      <AnimatedSection delay={delayStart + 50}>
        <StatCard
          title="sleep score"
          value={sleep.current.score ?? '---'}
          glowColor="purple"
          animateNumber={typeof sleep.current.score === 'number'}
          subtitle="out of 100"
          sparklineData={sleep.trend.scores}
          sparklineColor="purple"
          compact={compact}
        />
      </AnimatedSection>

      <AnimatedSection delay={delayStart + 100}>
        <StatCard
          title="readiness score"
          value={readiness.current ?? '---'}
          glowColor="green"
          animateNumber={typeof readiness.current === 'number'}
          subtitle="how ready i am to do stuff"
          sparklineData={readiness.trend}
          sparklineColor="green"
          compact={compact}
        />
      </AnimatedSection>

    </>
  )
}
