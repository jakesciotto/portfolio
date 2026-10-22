'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { loadMotion, prefersReducedMotion } from '../lib/motion.mjs'

export default function MagneticLink({
  href,
  children,
  className = '',
  ...props
}) {
  const ref = useRef(null)
  const isInternal = typeof href === 'string' && href.startsWith('/')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) return

    let ignore = false
    let detach = null

    loadMotion().then(({ gsap }) => {
      if (ignore) return

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

      detach = () => {
        el.removeEventListener('mousemove', handleMove)
        el.removeEventListener('mouseleave', handleLeave)
      }
    })

    return () => {
      ignore = true
      detach?.()
    }
  }, [])

  const style = { display: 'inline-block' }

  if (isInternal) {
    return (
      <Link
        ref={ref}
        href={href}
        className={className}
        style={style}
        {...props}
      >
        {children}
      </Link>
    )
  }

  return (
    <a ref={ref} href={href} className={className} style={style} {...props}>
      {children}
    </a>
  )
}
