'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import { loadMotion, prefersReducedMotion } from '../lib/motion.mjs'

const LenisContext = createContext(null)

export function useLenis() {
  return useContext(LenisContext)
}

export default function ScrollProvider({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    let ignore = false
    let teardown = null

    Promise.all([loadMotion(), import('lenis')]).then(
      ([{ gsap, ScrollTrigger }, { default: Lenis }]) => {
        if (ignore) return

        const lenis = new Lenis({
          duration: 0.8,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          touchMultiplier: 2,
        })
        lenisRef.current = lenis

        lenis.on('scroll', ScrollTrigger.update)

        const tickerCallback = (time) => {
          lenis.raf(time * 1000)
        }
        gsap.ticker.add(tickerCallback)
        gsap.ticker.lagSmoothing(0)

        teardown = () => {
          lenis.destroy()
          lenisRef.current = null
          gsap.ticker.remove(tickerCallback)
          ScrollTrigger.getAll().forEach((t) => t.kill())
        }
      },
    )

    return () => {
      ignore = true
      teardown?.()
    }
  }, [])

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  )
}
