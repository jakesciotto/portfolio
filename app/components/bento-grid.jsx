'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function BentoGrid({ children }) {
  const gridRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.tile', { opacity: 1 })
      })

      mm.add(
        '(prefers-reduced-motion: no-preference) and (min-width: 769px)',
        () => {
          ScrollTrigger.batch('.tile', {
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: 'power2.out',
                stagger: 0.1,
              }),
            start: 'top 92%',
            once: true,
          })

          gsap.set('.tile', { y: 24, scale: 0.97 })
        },
      )

      mm.add(
        '(prefers-reduced-motion: no-preference) and (max-width: 768px)',
        () => {
          ScrollTrigger.batch('.tile', {
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out',
                stagger: 0.08,
              }),
            start: 'top 95%',
            once: true,
          })

          gsap.set('.tile', { y: 16 })
        },
      )
    },
    { scope: gridRef },
  )

  return (
    <div ref={gridRef} className="bento-grid">
      {children}
    </div>
  )
}
