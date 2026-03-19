'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function StatTile({
  value,
  label,
  secondaryLabel,
  heading,
  accent = 'primary',
  animate = false,
  children,
}) {
  const valueRef = useRef(null)
  const [displayed, setDisplayed] = useState(
    animate ? 0 : value
  )

  useEffect(() => {
    if (!animate || typeof value !== 'number') return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReduced) {
      setDisplayed(value)
      return
    }

    const obj = { val: 0 }
    const tween = gsap.to(obj, {
      val: value,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: valueRef.current,
        start: 'top 90%',
        once: true,
      },
      onUpdate: () => {
        setDisplayed(Math.round(obj.val))
      },
    })

    return () => {
      tween.kill()
    }
  }, [value, animate])

  const accentColor = {
    primary: 'text-accent-primary',
    secondary: 'text-accent-secondary',
    tertiary: 'text-accent-tertiary',
  }

  return (
    <div className="flex flex-col h-full">
      {heading && (
        <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground mb-1">
          {heading}
        </h3>
      )}
      <span
        ref={valueRef}
        className={`text-4xl font-bold font-mono tracking-tighter ${accentColor[accent] || accentColor.primary}`}
      >
        {typeof value === 'number' ? displayed : value}
      </span>
      <span className="text-xs uppercase font-medium tracking-widest text-muted-foreground mt-1">
        {label}
      </span>
      {secondaryLabel && (
        <span className="text-[10px] text-muted-foreground mt-0.5">
          {secondaryLabel}
        </span>
      )}
      {children && <div className="mt-auto pt-2">{children}</div>}
    </div>
  )
}
