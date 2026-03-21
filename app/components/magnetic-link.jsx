'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function MagneticLink({ href, children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) return

    const xTo = gsap.quickTo(el, 'x', {
      duration: 0.6,
      ease: 'elastic.out(1, 0.3)',
    })
    const yTo = gsap.quickTo(el, 'y', {
      duration: 0.6,
      ease: 'elastic.out(1, 0.3)',
    })

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      xTo(dx * 0.35)
      yTo(dy * 0.35)
    }

    const handleLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)

    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <a ref={ref} href={href} className={className} style={{ display: 'inline-block' }}>
      {children}
    </a>
  )
}
