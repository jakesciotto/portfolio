'use client'

import { useMemo } from 'react'

const HEIGHT = 80
const VIEWBOX_W = 1000
const VIEWBOX_H = 80

// Generate a gentle static sine wave as fallback
function buildFallbackPath() {
  const points = 60
  const segments = []
  segments.push(`M 0 ${VIEWBOX_H / 2}`)
  for (let i = 1; i <= points; i++) {
    const x = (i / points) * VIEWBOX_W
    const y = VIEWBOX_H / 2 + Math.sin((i / points) * Math.PI * 4) * 12
    segments.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return segments.join(' ')
}

// Build a smooth bezier curve using sleep hours as control point heights
function buildDataPath(data) {
  if (!data || data.length === 0) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  // Normalize data to SVG Y coordinates (inverted: higher value = lower Y)
  const padding = 10
  const usableHeight = VIEWBOX_H - padding * 2
  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * VIEWBOX_W,
    y: padding + usableHeight - ((val - min) / range) * usableHeight,
  }))

  if (points.length === 1) {
    const y = points[0].y
    return `M 0 ${y} L ${VIEWBOX_W} ${y}`
  }

  // Build smooth cubic bezier through all points
  const segments = [`M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`]

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]

    // Catmull-Rom to cubic bezier conversion
    const tension = 0.3
    const cp1x = p1.x + (p2.x - p0.x) * tension
    const cp1y = p1.y + (p2.y - p0.y) * tension
    const cp2x = p2.x - (p3.x - p1.x) * tension
    const cp2y = p2.y - (p3.y - p1.y) * tension

    segments.push(
      `C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    )
  }

  return segments.join(' ')
}

export default function SleepWave({ data }) {
  const hasData = Array.isArray(data) && data.length > 0

  const pathD = useMemo(() => {
    return hasData ? buildDataPath(data) : buildFallbackPath()
  }, [data, hasData])

  return (
    <div
      style={{ height: HEIGHT, width: '100%', overflow: 'hidden' }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <path
          d={pathD}
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.15"
        />
      </svg>
    </div>
  )
}
