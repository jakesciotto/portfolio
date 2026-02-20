'use client'

import { AreaChart, Area, ResponsiveContainer } from 'recharts'

const colorMap = {
  cyan: 'var(--neon-cyan)',
  magenta: 'var(--neon-magenta)',
  green: 'var(--neon-green)',
  amber: 'var(--neon-amber)',
  purple: 'var(--neon-purple)',
}

export default function Sparkline({ data = [], color = 'cyan', height = 40 }) {
  if (!data || data.length < 2) return null

  const chartData = data.map((value, i) => ({ i, v: value }))
  const strokeColor = colorMap[color] || colorMap.cyan

  return (
    <div style={{ width: '100%', height }} className="mt-2 opacity-70">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <defs>
            <linearGradient id={`sparkGrad-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={strokeColor}
            strokeWidth={1.5}
            fill={`url(#sparkGrad-${color})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
