'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import posthog from 'posthog-js'

function GitHubActivity({ username = 'jakesciotto' }) {
  const [isActive, setIsActive] = useState(null)
  const [commits7d, setCommits7d] = useState(null)

  useEffect(() => {
    // Check activity cache
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

    // Fetch weekly commits
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
      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-neutral-400'}`} />
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
      url: 'https://www.credly.com/users/jake-sciotto',
      badge_count: badges.length,
    })
  }

  return (
    <a
      href="https://www.credly.com/users/jake-sciotto"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-0.5 hover:opacity-80 transition-opacity"
      title="View certifications on Credly"
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
    </a>
  )
}

export default function StatsBar() {
  return (
    <div className="fixed top-0 left-0 right-0 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-neutral-200 dark:border-neutral-800 px-4 py-2 z-50">
      <div className="max-w-2xl mx-auto flex justify-between items-center text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex gap-3 md:gap-4 items-center flex-wrap">
          <GitHubActivity />
          <ExperienceCalculator />
        </div>
        <CertificationBadge />
      </div>
    </div>
  )
}
