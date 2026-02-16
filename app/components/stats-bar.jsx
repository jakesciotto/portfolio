'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import posthog from 'posthog-js'
import { cn } from '@/app/lib/utils'

function GitHubActivity({ username = 'jakesciotto' }) {
  const [isActive, setIsActive] = useState(null)
  const [commits7d, setCommits7d] = useState(null)

  useEffect(() => {
    const cached = localStorage.getItem('gh_activity')
    const cacheTime = localStorage.getItem('gh_activity_time')

    if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 3600000) {
      setIsActive(cached === 'true')
    } else {
      fetch(`https://api.github.com/users/${username}/events`)
        .then(res => res.json())
        .then(events => {
          if (Array.isArray(events) && events.length > 0) {
            const lastEvent = new Date(events[0].created_at)
            const dayAgo = Date.now() - (24 * 60 * 60 * 1000)
            const active = lastEvent.getTime() > dayAgo

            setIsActive(active)
            localStorage.setItem('gh_activity', active.toString())
            localStorage.setItem('gh_activity_time', Date.now().toString())
          }
        })
        .catch(() => setIsActive(false))
    }

    const cachedStats = localStorage.getItem('gh_stats')
    const statsCacheTime = localStorage.getItem('gh_stats_time')

    if (cachedStats && statsCacheTime && Date.now() - parseInt(statsCacheTime) < 300000) {
      const parsed = JSON.parse(cachedStats)
      setCommits7d(parsed.commits7d)
    } else {
      fetch('/api/github-stats')
        .then(res => res.json())
        .then(data => setCommits7d(data.commits7d))
        .catch(() => {})
    }
  }, [username])

  if (isActive === null) return null

  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-neon-green shadow-[0_0_6px_var(--neon-green)]' : 'bg-muted-foreground'}`} />
      {commits7d != null && <span>{commits7d} commits this week</span>}
    </span>
  )
}

function ExperienceCalculator({ startDate = '2016-01-01' }) {
  const start = new Date(startDate)
  const years = Math.floor((Date.now() - start) / (365.25 * 24 * 60 * 60 * 1000))

  return <span>{years}+ years in tech</span>
}

function CertificationBadge() {
  const badges = [
    '/img/image1.png',
    '/img/image2.png',
    '/img/image3.png',
    '/img/image4.png',
    '/img/image5.png',
    '/img/image6.png',
  ]

  const handleBadgeClick = () => {
    posthog.capture('certification_badges_clicked', {
      destination: '/certifications',
      badge_count: badges.length,
    })
  }

  return (
    <Link
      href="/certifications"
      className="flex items-center gap-0.5 hover:opacity-80 transition-opacity"
      title="View certifications"
      onClick={handleBadgeClick}
    >
      {badges.map((badge, index) => (
        <Image
          key={index}
          src={badge}
          alt={`Certification badge ${index + 1}`}
          width={28}
          height={28}
          className="rounded-sm object-cover"
        />
      ))}
    </Link>
  )
}

export default function StatsBar() {
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY > lastScrollY.current && currentY > 60) {
        setVisible(false)
      } else {
        setVisible(true)
      }
      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 glass px-4 py-2 z-50 transition-transform duration-300",
      visible ? "translate-y-0" : "-translate-y-full"
    )}>
      <div className="max-w-2xl mx-auto flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex gap-3 md:gap-4 items-center flex-wrap">
          <GitHubActivity />
          <ExperienceCalculator />
        </div>
        <CertificationBadge />
      </div>
    </div>
  )
}
