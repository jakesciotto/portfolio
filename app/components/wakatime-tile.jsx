'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useCachedFetch } from '../lib/use-cached-fetch'
import TileSkeleton from './tile-skeleton'

const barColors = [
  'var(--accent-primary)',
  'var(--accent-secondary)',
  'var(--accent-tertiary)',
  'var(--muted-foreground)',
  'var(--muted-foreground)',
]

export default function WakaTimeTile() {
  const stats = useCachedFetch('/api/wakatime-stats', 'wakatime_stats', {
    shouldCache: (data) => data.totalHours != null,
  })

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
        <div className="mt-auto pt-1">
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
                    fontSize: 11,
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
