'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const letters = 'jake sciotto'.split('')

export default function HeroName() {
  const containerRef = useRef(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const spans = containerRef.current.querySelectorAll(
      'span[data-letter]'
    )

    if (!prefersReduced) {
      gsap.from(spans, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.04,
        ease: 'power2.out',
      })
    }
  }, { scope: containerRef })

  return (
    <h1
      ref={containerRef}
      className="font-sans font-bold text-7xl md:text-8xl mb-2 tracking-tighter text-foreground relative"
    >
      {letters.map((char, i) => (
        <span
          key={i}
          data-letter
          className="inline-block"
          style={char === ' ' ? { width: '0.3em' } : undefined}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h1>
  )
}
