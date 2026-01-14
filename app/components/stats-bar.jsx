'use client'

import { useEffect, useState } from 'react'

function GitHubActivity({ username = 'jakesciotto' }) {
  const [isActive, setIsActive] = useState(null)

  useEffect(() => {
    // Check cache first
    const cached = localStorage.getItem('gh_activity')
    const cacheTime = localStorage.getItem('gh_activity_time')

    if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 3600000) {
      setIsActive(cached === 'true')
      return
    }

    // Fetch from GitHub API
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
      .catch(() => {
        // Fail gracefully - don't show indicator if API fails
        setIsActive(false)
      })
  }, [username])

  if (isActive === null) return null

  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-neutral-400'}`} />
      <span>{isActive ? 'Active on GitHub' : 'GitHub'}</span>
    </span>
  )
}

function ExperienceCalculator({ startDate = '2016-01-01' }) {
  const start = new Date(startDate)
  const years = Math.floor((Date.now() - start) / (365.25 * 24 * 60 * 60 * 1000))

  return <span>{years}+ years in tech</span>
}

function CertificationBadge() {
  return (
    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <span className="text-[10px] font-medium">6 certs (2025)</span>
    </span>
  )
}

function LastUpdated() {
  // This will be static for now - could pull from git commit later
  const buildDate = new Date()
  const daysAgo = Math.floor((Date.now() - buildDate) / (24 * 60 * 60 * 1000))

  return <span>Updated {daysAgo === 0 ? 'today' : `${daysAgo} days ago`}</span>
}

export default function StatsBar() {
  return (
    <div className="fixed top-0 left-0 right-0 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-neutral-200 dark:border-neutral-800 px-4 py-2 z-50">
      <div className="max-w-4xl mx-auto flex justify-between items-center text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex gap-3 md:gap-4 items-center flex-wrap">
          <GitHubActivity />
          <ExperienceCalculator />
          <CertificationBadge />
        </div>
        <div className="hidden md:block">
          <LastUpdated />
        </div>
      </div>
    </div>
  )
}
