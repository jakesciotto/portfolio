'use client'

import { useState, useEffect, useRef } from 'react'
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts'

const colorMap = {
  primary: 'var(--accent-primary)',
  secondary: 'var(--accent-secondary)',
  tertiary: 'var(--accent-tertiary)',
  muted: 'var(--muted-foreground)',
}

export default function BarSpark({
  data = [],
  labels = [],
  color = 'primary',
  height = 72,
  tooltipLabel = 'hours',
}) {
  const containerRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    const { width } = containerRef.current.getBoundingClientRect()
    if (width > 0) setReady(true)
  }, [])

  if (!data || data.length < 2) return null

  const chartData = data.map((value, i) => ({ i, v: value, label: labels[i] }))
  const fillColor = colorMap[color] || colorMap.primary

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height }}
      className="mt-2 opacity-80"
    >
      {ready && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
            barCategoryGap="18%"
          >
            <defs>
              <linearGradient
                id={`barGrad-${color}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={fillColor} stopOpacity={0.9} />
                <stop offset="100%" stopColor={fillColor} stopOpacity={0.35} />
              </linearGradient>
            </defs>
            <Tooltip
              cursor={{
                fill: 'color-mix(in srgb, var(--muted-foreground) 14%, transparent)',
              }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const point = payload[0].payload
                return (
                  <div className="bg-card border border-border rounded px-2 py-1 text-xs text-foreground font-mono shadow-md">
                    {point.label ? `${point.label} · ` : ''}
                    {payload[0].value} {tooltipLabel}
                  </div>
                )
              }}
            />
            <Bar
              dataKey="v"
              radius={[2, 2, 0, 0]}
              fill={`url(#barGrad-${color})`}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
