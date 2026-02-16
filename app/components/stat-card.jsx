'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/app/lib/utils'

const glowColorMap = {
  cyan: 'glow-cyan',
  magenta: 'glow-magenta',
  green: 'glow-green',
  amber: 'glow-amber',
  purple: 'glow-purple',
}

const neonTextMap = {
  cyan: 'text-neon-cyan',
  magenta: 'text-neon-magenta',
  green: 'text-neon-green',
  amber: 'text-neon-amber',
  purple: 'text-neon-purple',
}

export default function StatCard({
  title,
  value,
  subtitle,
  glowColor = 'cyan',
  animateNumber = false,
}) {
  const [displayValue, setDisplayValue] = useState(animateNumber ? 0 : value)

  useEffect(() => {
    if (!animateNumber || typeof value !== 'number') {
      setDisplayValue(value)
      return
    }

    const duration = 1000
    const steps = 30
    const increment = value / steps
    const stepDuration = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [value, animateNumber])

  return (
    <div
      className={cn(
        'glass-card relative flex flex-col h-full p-5 md:p-6',
        glowColorMap[glowColor] || glowColorMap.cyan,
      )}
    >
      <div
        className={cn(
          'text-4xl md:text-5xl font-bold mb-2 tracking-tighter',
          neonTextMap[glowColor] || 'text-card-foreground',
        )}
      >
        {displayValue}
      </div>
      <div className="text-sm tracking-tight font-semibold md:text-base text-muted-foreground break-word">
        {title}
      </div>
      {subtitle && (
        <div className="text-xs text-muted-foreground/70 mt-1">{subtitle}</div>
      )}
    </div>
  )
}
