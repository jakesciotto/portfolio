'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/app/lib/utils'
import Sparkline from './ui/sparkline'

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
  sparklineData = null,
  sparklineColor = null,
  compact = false,
  badge = null,
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
        'glass-card relative flex flex-col h-full',
        compact ? 'p-3 md:p-4' : 'p-5 md:p-6',
        glowColorMap[glowColor] || glowColorMap.cyan,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            'font-semibold mb-1 tracking-tighter opacity-85',
            compact ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl mb-2',
            neonTextMap[glowColor] || 'text-card-foreground',
          )}
        >
          {displayValue}
        </div>
        {badge && <div className="shrink-0 mt-1 **:data-[slot=badge]:text-[8px] **:data-[slot=badge]:px-1.5 **:data-[slot=badge]:py-0">{badge}</div>}
      </div>
      <div className={cn(
        'tracking-tight font-semibold text-muted-foreground break-word',
        compact ? 'text-xs md:text-sm' : 'text-sm md:text-base',
      )}>
        {title}
      </div>
      {subtitle && (
        <div className={cn(
          'text-muted-foreground/70 mt-1',
          compact ? 'text-[10px]' : 'text-xs',
        )}>{subtitle}</div>
      )}
      {sparklineData && sparklineData.length >= 2 && (
        <Sparkline data={sparklineData} color={sparklineColor || glowColor} height={compact ? 32 : 40} />
      )}
    </div>
  )
}
