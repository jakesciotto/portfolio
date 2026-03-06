'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function SectionTitle({ text, className = '' }) {
  const ref = useRef(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.to(ref.current, {
      y: -40,
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }, { scope: ref })

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`select-none pointer-events-none font-sans font-black tracking-tighter leading-none opacity-[0.04] dark:opacity-[0.06] relative z-0 ${className}`}
      style={{
        fontSize: 'clamp(60px, 12vw, 180px)',
        marginBottom: 'clamp(-50px, -10vw, -140px)',
      }}
    >
      {text}
    </div>
  )
}
