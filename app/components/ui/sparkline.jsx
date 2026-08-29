'use client'

import { useId, useState } from 'react'

const colorMap = {
  primary: 'var(--accent-primary)',
  secondary: 'var(--accent-secondary)',
  tertiary: 'var(--accent-tertiary)',
  amber: 'var(--accent-amber)',
  violet: 'var(--accent-violet)',
  red: 'var(--accent-red)',
  muted: 'var(--muted-foreground)',
}

const TOP = 10
const BOTTOM = 92

export default function Sparkline({
  data = [],
  color = 'primary',
  height = 40,
  tooltipLabel = '',
}) {
  const id = useId()
  const [hover, setHover] = useState(null)

  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const span = Math.max(...data) - min || 1
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: TOP + (1 - (v - min) / span) * (BOTTOM - TOP),
  }))
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')
  const area = `${line} L100 100 L0 100 Z`
  const stroke = colorMap[color] || colorMap.primary
  const last = points[points.length - 1]
  const slot = 100 / (data.length - 1)

  return (
    <div className="relative mt-2 w-full opacity-80" style={{ height }} aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={stroke} stopOpacity="0.25" />
            <stop offset="1" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${id})`} />
        <path
          d={line}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card"
        style={{ left: `${last.x}%`, top: `${last.y}%`, background: stroke }}
      />
      {points.map((p, i) => (
        <span
          key={i}
          className="absolute inset-y-0"
          style={{ left: `calc(${p.x}% - ${slot / 2}%)`, width: `${slot}%` }}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
        />
      ))}
      {hover != null && (
        <span
          className="pointer-events-none absolute -top-1 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded border border-border-strong bg-card px-1.5 py-0.5 font-mono text-[10px] text-foreground"
          style={{ left: `${points[hover].x}%` }}
        >
          {data[hover]}
          {tooltipLabel && ` ${tooltipLabel}`}
        </span>
      )}
    </div>
  )
}
