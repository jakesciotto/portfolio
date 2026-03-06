'use client'

import { useMemo } from 'react'

// Map yearly listening hours to gradient color stops
function buildGradientStops(yearlyHours) {
  if (!yearlyHours || yearlyHours.length === 0) return null

  const hours = yearlyHours.map((y) => y.hours)
  const max = Math.max(...hours)
  const min = Math.min(...hours)
  const range = max - min || 1

  return yearlyHours.map((entry, i) => {
    const intensity = (entry.hours - min) / range
    const offset = yearlyHours.length === 1
      ? '50%'
      : `${(i / (yearlyHours.length - 1)) * 100}%`

    return { offset, intensity }
  })
}

export default function SpotifyGradient({ yearlyHours }) {
  const hasData = Array.isArray(yearlyHours) && yearlyHours.length > 0

  const stops = useMemo(() => {
    return hasData ? buildGradientStops(yearlyHours) : null
  }, [yearlyHours, hasData])

  const gradientId = 'spotify-intensity-grad'

  if (!hasData) {
    // Fallback: neutral static gradient
    return (
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          opacity: 0.12,
          background: `linear-gradient(to right, var(--accent-secondary), var(--accent-tertiary))`,
          pointerEvents: 'none',
        }}
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        opacity: 0.12,
        pointerEvents: 'none',
      }}
    >
      <svg
        style={{ width: '100%', height: '100%', display: 'block' }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            {stops.map((stop, i) => (
              <stop
                key={i}
                offset={stop.offset}
                stopColor={
                  stop.intensity > 0.5
                    ? 'var(--accent-tertiary)'
                    : 'var(--accent-secondary)'
                }
                stopOpacity={0.3 + stop.intensity * 0.7}
              />
            ))}
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill={`url(#${gradientId})`}
        />
      </svg>
    </div>
  )
}
