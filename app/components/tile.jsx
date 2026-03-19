'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const accentMap = {
  primary: 'var(--accent-primary)',
  secondary: 'var(--accent-secondary)',
  tertiary: 'var(--accent-tertiary)',
}

export default function Tile({
  children,
  className = '',
  accent = 'primary',
  tilt = false,
  gridClass = '',
}) {
  const ref = useRef(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) {
      gsap.set(ref.current, { opacity: 1 })
      return
    }

    gsap.from(ref.current, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 90%',
        once: true,
      },
    })
  }, { scope: ref })

  const handleMouseMove = (e) => {
    if (!tilt) return
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) return

    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    ref.current.style.transform =
      `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`
  }

  const handleMouseLeave = () => {
    if (!tilt) return
    ref.current.style.transform = ''
  }

  return (
    <div
      ref={ref}
      className={`tile ${gridClass} ${className}`.trim()}
      style={{ '--tile-accent': accentMap[accent] || accentMap.primary }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
