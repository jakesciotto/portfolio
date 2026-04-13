'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import TileSkeleton from './tile-skeleton'

const barColors = [
  'var(--accent-primary)',
  'var(--accent-secondary)',
  'var(--accent-tertiary)',
  'var(--muted-foreground)',
  'var(--muted-foreground)',
]

export default function WakaTimeTile() {
  const [stats, setStats] = useState(null)

  const fetchStats = async () => {
    try {
      const cached = localStorage.getItem('wakatime_stats')
      const cacheTime = localStorage.getItem('wakatime_stats_time')

      if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 900000) {
        setStats(JSON.parse(cached))
        return
      }

      const res = await fetch('/api/wakatime-stats')
      const data = await res.json()

      setStats(data)
      if (data.totalHours != null) {
        localStorage.setItem('wakatime_stats', JSON.stringify(data))
        localStorage.setItem('wakatime_stats_time', Date.now().toString())
      }
    } catch (err) {
      const cached = localStorage.getItem('wakatime_stats')
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

  const languages = (stats.languages?.slice(0, 5) || []).map((lang) => ({
    name: lang.name,
    percent: lang.percent,
  }))

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground mb-1">
        programmin'
      </h3>
      <span className="text-3xl font-bold font-mono tracking-tighter text-accent-primary">
        {stats.totalHours != null ? stats.totalHours.toLocaleString() : '---'}
      </span>
      <span className="text-[12px] text-muted-foreground mt-1">
        coding hrs &middot; {stats.dailyAverage || '---'}/day avg &middot; all
        time
      </span>

      {languages.length > 0 && (
        <div className="mt-auto pt-3">
          <div style={{ width: '100%', height: languages.length * 24 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={languages}
                layout="vertical"
                margin={{ top: 0, right: 36, bottom: 0, left: 0 }}
                barCategoryGap={4}
              >
                <XAxis type="number" hide domain={[0, 'auto']} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={70}
                  tick={{
                    fontSize: 10,
                    fill: 'var(--muted-foreground)',
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar
                  dataKey="percent"
                  radius={[0, 3, 3, 0]}
                  isAnimationActive={false}
                  label={{
                    position: 'right',
                    fontSize: 10,
                    fill: 'var(--muted-foreground)',
                    formatter: (v) => `${v}%`,
                  }}
                >
                  {languages.map((_, i) => (
                    <Cell key={i} fill={barColors[i] || barColors[4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
