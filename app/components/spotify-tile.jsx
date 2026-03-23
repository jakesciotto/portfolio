'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from 'recharts'
import TileSkeleton from './tile-skeleton'

const barColors = [
  'var(--accent-secondary)',
  'var(--accent-primary)',
  'var(--accent-tertiary)',
  'var(--muted-foreground)',
]

export default function SpotifyTile() {
  const [stats, setStats] = useState(null)

  const fetchStats = async () => {
    try {
      const cached = localStorage.getItem('spotify_stats')
      const cacheTime = localStorage.getItem('spotify_stats_time')

      if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 900000) {
        setStats(JSON.parse(cached))
        return
      }

      const res = await fetch('/api/spotify-stats')
      const data = await res.json()

      setStats(data)
      if (data.overview) {
        localStorage.setItem('spotify_stats', JSON.stringify(data))
        localStorage.setItem('spotify_stats_time', Date.now().toString())
      }
    } catch (err) {
      const cached = localStorage.getItem('spotify_stats')
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

  if (!stats) return <TileSkeleton accent="secondary" />

  const hours = stats.overview?.totalHours
    ? Math.round(stats.overview.totalHours).toLocaleString()
    : '---'
  const topArtist = stats.topArtists?.[0]?.name

  const currentYear = String(new Date().getFullYear())
  const yearlyData = (stats.yearlyHours || [])
    .filter((entry) => String(entry.year) !== currentYear)
    .map((entry) => ({
      year: String(entry.year),
      hours: Math.round(entry.hours || entry.totalHours || 0),
    }))
    .sort((a, b) => a.year.localeCompare(b.year))

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground mb-1">
        spotify
      </h3>
      <span className="text-4xl font-bold font-mono tracking-tighter text-accent-secondary">
        {hours}
      </span>
      <span className="text-[10px] uppercase font-medium tracking-widest text-muted-foreground mt-0.5">
        hours listened{topArtist ? ` · top: ${topArtist}` : ''}
      </span>

      {yearlyData.length > 0 && (
        <div className="mt-auto pt-3">
          <div style={{ width: '100%', height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={yearlyData}
                margin={{ top: 16, right: 4, bottom: 0, left: 4 }}
                barCategoryGap="20%"
              >
                <XAxis
                  dataKey="year"
                  tick={{
                    fontSize: 10,
                    fill: 'var(--muted-foreground)',
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    return (
                      <div className="bg-card border border-border rounded px-2 py-1 text-xs text-foreground font-mono shadow-md">
                        {payload[0].value.toLocaleString()} hrs
                      </div>
                    )
                  }}
                />
                <Bar
                  dataKey="hours"
                  radius={[3, 3, 0, 0]}
                  isAnimationActive={false}
                  label={{
                    position: 'top',
                    fontSize: 9,
                    fill: 'var(--muted-foreground)',
                    formatter: (v) => v.toLocaleString(),
                  }}
                >
                  {yearlyData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={barColors[i % barColors.length]}
                    />
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
