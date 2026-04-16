'use client'

import { useEffect, useState, useRef } from 'react'

export default function AnimatedNumber({ value, className }) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)

  useEffect(() => {
    if (prevRef.current === value) return
    const from = prevRef.current || 0
    const to = value || 0
    prevRef.current = value

    if (typeof from !== 'number' || typeof to !== 'number') {
      setDisplay(value)
      return
    }

    const duration = 400
    const start = performance.now()

    function step(now) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (t < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [value])

  return <span className={className}>{typeof display === 'number' ? display.toLocaleString() : display}</span>
}
