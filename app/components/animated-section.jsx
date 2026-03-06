'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function AnimatedSection({ children, delay = 0, className = '' }) {
  const containerRef = useRef(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.set(containerRef.current, { opacity: 0, y: 24 })

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(containerRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: delay / 1000,
          ease: 'power2.out',
        })
      },
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
