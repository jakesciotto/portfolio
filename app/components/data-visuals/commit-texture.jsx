'use client'

import { useMemo } from 'react'

const HEIGHT = 60
const VIEWBOX_W = 700
const VIEWBOX_H = 60
const ROWS = 3
const MAX_DOT_RADIUS = 3.5
const MIN_DOT_RADIUS = 1.0
const FALLBACK_DOT_RADIUS = 1.2
const MAX_OPACITY = 0.15
const MIN_OPACITY = 0.04
const FALLBACK_OPACITY = 0.08

function buildDots(dailyCommits) {
  const hasData = Array.isArray(dailyCommits) && dailyCommits.length > 0
  const cols = hasData ? dailyCommits.length : 7

  const max = hasData ? Math.max(...dailyCommits) : 0
  const range = max || 1

  const dots = []
  const colSpacing = VIEWBOX_W / (cols + 1)
  const rowSpacing = VIEWBOX_H / (ROWS + 1)

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < ROWS; row++) {
      const cx = colSpacing * (col + 1)
      const cy = rowSpacing * (row + 1)

      let r, opacity

      if (hasData) {
        const intensity = dailyCommits[col] / range
        r = MIN_DOT_RADIUS + intensity * (MAX_DOT_RADIUS - MIN_DOT_RADIUS)
        opacity = MIN_OPACITY + intensity * (MAX_OPACITY - MIN_OPACITY)
      } else {
        r = FALLBACK_DOT_RADIUS
        opacity = FALLBACK_OPACITY
      }

      dots.push({ cx, cy, r, opacity })
    }
  }

  return dots
}

export default function CommitTexture({ dailyCommits }) {
  const dots = useMemo(() => buildDots(dailyCommits), [dailyCommits])

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
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.cx.toFixed(1)}
            cy={dot.cy.toFixed(1)}
            r={dot.r.toFixed(2)}
            fill="currentColor"
            opacity={dot.opacity.toFixed(3)}
          />
        ))}
      </svg>
    </div>
  )
}
