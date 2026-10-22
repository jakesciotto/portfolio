'use client'

import { useEffect, useRef } from 'react'
import { loadMotion, prefersReducedMotion } from '../lib/motion.mjs'

export default function BentoGrid({ children }) {
  const gridRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    let ignore = false
    let context = null

    loadMotion().then(({ gsap, ScrollTrigger }) => {
      if (ignore || !gridRef.current) return

      const narrow = window.matchMedia('(max-width: 768px)').matches
      const below = Array.from(
        gridRef.current.querySelectorAll('.tile'),
      ).filter((tile) => tile.getBoundingClientRect().top > window.innerHeight)
      if (below.length === 0) return

      context = gsap.context(() => {
        gsap.set(
          below,
          narrow ? { opacity: 0, y: 16 } : { opacity: 0, y: 24, scale: 0.97 },
        )
        ScrollTrigger.batch(below, {
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: narrow ? 0.5 : 0.6,
              ease: 'power2.out',
              stagger: narrow ? 0.08 : 0.1,
            }),
          start: narrow ? 'top 95%' : 'top 92%',
          once: true,
        })
      }, gridRef)
    })

    return () => {
      ignore = true
      context?.revert()
    }
  }, [])

  return (
    <div ref={gridRef} className="bento-grid">
      {children}
    </div>
  )
}
