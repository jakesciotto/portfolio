'use client'

import { useEffect, useState } from 'react'

export default function StatCard({
  title,
  value,
  subtitle,
  variant = 'standard',
  animateNumber = false
}) {
  const [displayValue, setDisplayValue] = useState(animateNumber ? 0 : value)

  useEffect(() => {
    if (!animateNumber || typeof value !== 'number') {
      setDisplayValue(value)
      return
    }

    const duration = 1000 // 1 second animation
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

  const variants = {
    primary: 'bg-slate-800 border border-slate-700 text-white shadow-md hover:shadow-xl hover:border-slate-600',
    standard: 'bg-transparent border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600',
    accent: 'border-l-4 border-slate-300 dark:border-slate-600 pl-4 md:pl-6 hover:border-slate-400 dark:hover:border-slate-500 hover:pl-5 md:hover:pl-7'
  }

  const variantClasses = variants[variant] || variants.standard

  return (
    <div className={`relative flex flex-col h-full rounded-lg p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 ${variantClasses}`}>
      <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
        {displayValue}
      </div>
      <div className="text-sm md:text-base font-medium text-neutral-700 dark:text-neutral-300 break-words">
        {title}
      </div>
      {subtitle && (
        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          {subtitle}
        </div>
      )}
    </div>
  )
}
