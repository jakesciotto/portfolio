'use client'

import { useState, useId, useRef, useCallback } from 'react'
import gsap from 'gsap'
import posthog from 'posthog-js'

const roles = [
  {
    title: 'technical customer success manager',
    company: 'posthog',
    dates: 'mar 2026. - present',
    description: [''],
    accent: 'secondary',
  },
  {
    title: 'staff technical account manager',
    company: 'cloudzero',
    dates: 'jan 2026 - mar 2026',
    priorTitle: 'senior, dec 2024 - dec 2025',
    description: [
      'nicknamed "mr figure shit out"',
      'building bleeding edge finops solutions as the linchpin between' +
        ' business and technology (trademark pending on this phrase)',
    ],
    accent: 'primary',
  },
  {
    title: 'enterprise implementation manager',
    company: 'arcadia',
    dates: 'dec 2022 - dec 2024',
    description: [
      'implemented healthcare software, coordinated cross-functional' +
        ' teams, led training and change management at big boy scale' +
        " - what's the deal with healthcare",
    ],
    accent: 'secondary',
  },
  {
    title: 'senior implementation manager',
    company: 'carevalidate',
    dates: 'dec 2020 - dec 2022',
    description: [
      'led covid-19 solution implementations for hundreds of' +
        ' thousands of users, designed creative solutions for' +
        ' evolving requirements - should have invested in zoom',
    ],
    accent: 'secondary',
  },
  {
    title: 'faculty',
    company: 'kennesaw state university',
    dates: 'aug 2020 - dec 2022',
    description: [
      'taught computing infrastructure and networking, consulted' +
        ' for healthcare research - they gave me a podium and' +
        ' students showed up',
    ],
    accent: 'tertiary',
  },
  {
    title: 'senior data analyst',
    company: 'vestra logistics',
    dates: 'aug 2018 - dec 2019',
    description: [
      'built power bi dashboards, developed transparent pricing' +
        ' strategy, performed statistical analysis - made pretty' +
        ' charts so people felt informed',
    ],
    accent: 'tertiary',
  },
  {
    title: 'freelance web designer',
    company: 'rednax llc',
    dates: '2014 - 2017 (the before times)',
    description: [
      'helped 10 small businesses launch websites - if you are' +
        ' reading this i miss php',
    ],
    accent: 'primary',
  },
]

const accentDot = {
  primary: 'bg-accent-primary',
  secondary: 'bg-accent-secondary',
  tertiary: 'bg-accent-tertiary',
}

export default function WorkAccordion() {
  const [expandedIndex, setExpandedIndex] = useState(null)
  const id = useId()
  const panelRefs = useRef([])
  const contentRefs = useRef([])

  const setPanelRef = useCallback((el, index) => {
    panelRefs.current[index] = el
  }, [])

  const setContentRef = useCallback((el, index) => {
    contentRefs.current[index] = el
  }, [])

  const toggle = (index) => {
    const prevIndex = expandedIndex

    if (prevIndex === index) {
      setExpandedIndex(null)
      const panel = panelRefs.current[index]
      if (panel) {
        gsap.killTweensOf(panel)
        gsap.to(panel, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        })
      }
    } else {
      setExpandedIndex(index)

      if (prevIndex != null) {
        const prevPanel = panelRefs.current[prevIndex]
        if (prevPanel) {
          gsap.killTweensOf(prevPanel)
          gsap.to(prevPanel, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
          })
        }
      }

      const panel = panelRefs.current[index]
      const content = contentRefs.current[index]
      if (panel && content) {
        gsap.killTweensOf(panel)
        const measuredHeight = content.scrollHeight
        gsap.to(panel, {
          height: measuredHeight,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        })
      }

      if (typeof posthog?.capture === 'function') {
        posthog.capture('work_accordion_expand', {
          role: roles[index].title,
          company: roles[index].company,
        })
      }
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground mb-3">
        work
      </h3>
      <div className="space-y-1">
        {roles.map((role, index) => {
          const buttonId = `${id}-btn-${index}`
          const panelId = `${id}-panel-${index}`
          const isExpanded = expandedIndex === index

          return (
            <div key={`${role.company}-${role.title}`}>
              <button
                id={buttonId}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="w-full text-left flex items-start gap-2 py-2 px-1 rounded hover:bg-secondary/50 transition-colors"
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${accentDot[role.accent] || accentDot.primary}`}
                />
                <div className="min-w-0 flex flex-col">
                  <span className="text-sm font-semibold text-foreground leading-snug">
                    {role.title}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {role.company} &middot; {role.dates}
                  </span>
                </div>
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                ref={(el) => setPanelRef(el, index)}
                style={{ height: 0, opacity: 0, overflow: 'hidden' }}
              >
                <div
                  ref={(el) => setContentRef(el, index)}
                  className="pl-5 pb-2"
                >
                  {role.priorTitle && (
                    <p className="text-xs text-muted-foreground italic mb-1">
                      {role.priorTitle}
                    </p>
                  )}
                  {role.description.map((line, j) => (
                    <p key={j} className="text-xs text-muted-foreground">
                      {role.description.length > 1 ? `- ${line}` : line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
