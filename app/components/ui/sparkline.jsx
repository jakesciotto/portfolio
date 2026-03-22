'use client'

import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'

const colorMap = {
  primary: 'var(--accent-primary)',
  secondary: 'var(--accent-secondary)',
  tertiary: 'var(--accent-tertiary)',
  muted: 'var(--muted-foreground)',
}

export default function Sparkline({
  data = [],
  color = 'primary',
  height = 40,
}) {
  if (!data || data.length < 2) return null

  const chartData = data.map((value, i) => ({ i, v: value }))
  const strokeColor = colorMap[color] || colorMap.primary

  return (
    <div style={{ width: '100%', height }} className="mt-2 opacity-70">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
        >
          <defs>
            <linearGradient
              id={`sparkGrad-${color}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Tooltip
            cursor={false}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              return (
                <div className="bg-card border border-border rounded px-2 py-1 text-xs text-foreground font-mono shadow-md">
                  {payload[0].value} {payload[0].value === 1 ? 'commit' : 'commits'}
                </div>
              )
            }}
          />
          <Area
            type="monotone"
            dataKey="v"
            stroke={strokeColor}
            strokeWidth={1.5}
            fill={`url(#sparkGrad-${color})`}
            dot={false}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
