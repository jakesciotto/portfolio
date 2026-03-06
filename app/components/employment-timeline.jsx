'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const roles = [
  {
    title: 'staff technical account manager',
    company: 'cloudzero',
    dates: 'jan 2026 - present',
    priorTitle: 'senior, dec 2024 - dec 2025',
    description: [
      'nicknamed "mr figure shit out"',
      'building bleeding edge finops solutions as the linchpin between business and technology (trademark pending on this phrase)',
    ],
    accent: 'primary',
  },
  {
    title: 'enterprise implementation manager',
    company: 'arcadia',
    dates: 'dec 2022 - dec 2024',
    description: [
      "implemented healthcare software, coordinated cross-functional teams, led training and change management at big boy scale - what's the deal with healthcare",
    ],
    accent: 'secondary',
  },
  {
    title: 'senior implementation manager',
    company: 'carevalidate',
    dates: 'dec 2020 - dec 2022',
    description: [
      'led covid-19 solution implementations for hundreds of thousands of users, designed creative solutions for evolving requirements - should have invested in zoom',
    ],
    accent: 'secondary',
  },
  {
    title: 'faculty',
    company: 'kennesaw state university',
    dates: 'aug 2020 - dec 2022',
    description: [
      'taught computing infrastructure and networking, consulted for healthcare research - they gave me a podium and students showed up',
    ],
    accent: 'tertiary',
  },
  {
    title: 'senior data analyst',
    company: 'vestra logistics',
    dates: 'aug 2018 - dec 2019',
    description: [
      'built power bi dashboards, developed transparent pricing strategy, performed statistical analysis - made pretty charts so people felt informed',
    ],
    accent: 'tertiary',
  },
  {
    title: 'freelance web designer',
    company: 'rednax llc',
    dates: '2014 - 2017 (the before times)',
    description: [
      'helped 10 small businesses launch websites - if you are reading this i miss php',
    ],
    accent: 'primary',
  },
]

const accentBorder = {
  primary: 'border-l-accent-primary',
  secondary: 'border-l-accent-secondary',
  tertiary: 'border-l-accent-tertiary',
}

const accentDot = {
  primary: 'bg-accent-primary',
  secondary: 'bg-accent-secondary',
  tertiary: 'bg-accent-tertiary',
}

export default function EmploymentTimeline() {
  const containerRef = useRef(null)
  const progressRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || isMobile) return

    const cards = containerRef.current.querySelectorAll('[data-timeline-card]')

    // Animate progress line
    if (progressRef.current) {
      gsap.fromTo(
        progressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
          },
        }
      )
    }

    // Stagger card entrances
    cards.forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        x: -30,
        duration: 0.5,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          once: true,
        },
      })
    })
  }, { scope: containerRef, dependencies: [isMobile] })

  return (
    <div ref={containerRef} className="relative">
      {/* Timeline line */}
      <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border hidden md:block">
        <div
          ref={progressRef}
          className="w-full h-full bg-accent-primary origin-top"
        />
      </div>

      <div className="space-y-4 md:pl-8">
        {roles.map((role, i) => (
          <div
            key={`${role.company}-${role.title}`}
            data-timeline-card
            className={`card border-l-2 ${accentBorder[role.accent]} p-4 space-y-1 relative`}
            style={{ opacity: isMobile ? 1 : undefined }}
          >
            {/* Timeline dot */}
            <div className={`absolute -left-[calc(2rem+6px)] top-5 w-3 h-3 rounded-full ${accentDot[role.accent]} hidden md:block`} />

            <p className="font-semibold text-card-foreground">
              {role.title} | {role.company}
            </p>
            <p className="text-xs text-muted-foreground italic">
              {role.dates}
            </p>
            {role.priorTitle && (
              <p className="text-xs text-muted-foreground italic">
                {role.priorTitle}
              </p>
            )}
            {role.description.map((line, j) => (
              <p key={j} className="mt-1 text-card-foreground/80 text-sm">
                {role.description.length > 1 ? `- ${line}` : line}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
