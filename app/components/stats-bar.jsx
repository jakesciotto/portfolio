'use client'

import { useEffect, useState, useRef } from 'react'
import { cn } from '@/app/lib/utils'

function GitHubActivity() {
  const [isActive, setIsActive] = useState(null)
  const [commits7d, setCommits7d] = useState(null)
  const [prevCommits7d, setPrevCommits7d] = useState(null)

  useEffect(() => {
    const cached = localStorage.getItem('gh_stats')
    const cacheTime = localStorage.getItem('gh_stats_time')

    if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 300000) {
      const parsed = JSON.parse(cached)
      setCommits7d(parsed.commits7d)
      setPrevCommits7d(parsed.prevCommits7d ?? null)
      setIsActive(parsed.isActive ?? null)
    } else {
      fetch('/api/github-stats')
        .then((res) => res.json())
        .then((data) => {
          setCommits7d(data.commits7d)
          setPrevCommits7d(data.prevCommits7d ?? null)
          setIsActive(data.isActive ?? false)
        })
        .catch(() => {})
    }
  }, [])

  if (isActive === null) return null

  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap">
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-neon-green shadow-[0_0_6px_var(--neon-green)]' : 'bg-muted-foreground'}`}
      />
      {commits7d != null && (
        <span className="flex items-center gap-1">
          {commits7d} commits this week
          {typeof commits7d === 'number' &&
            typeof prevCommits7d === 'number' &&
            commits7d > prevCommits7d && (
              <span className="text-neon-green text-[15px] leading-none relative -top-[0.9 px] pb-1">
                &#8599;
              </span>
            )}
          {typeof commits7d === 'number' &&
            typeof prevCommits7d === 'number' &&
            commits7d < prevCommits7d && (
              <span className="text-neon-magenta text-[15px] leading-none relative -top-[0.9px] pb-1">
                &#8600;
              </span>
            )}
        </span>
      )}
    </span>
  )
}

function ExperienceCalculator({ startDate = '2016-01-01' }) {
  const start = new Date(startDate)
  const years = Math.floor(
    (Date.now() - start) / (365.25 * 24 * 60 * 60 * 1000),
  )

  return <span className="whitespace-nowrap">{years}+ years in tech</span>
}

function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      className="p-1 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
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
    <div
      className={cn(
        'fixed top-0 left-0 right-0 glass px-4 py-2 z-50 transition-transform duration-300',
        visible ? 'translate-y-0' : '-translate-y-full',
      )}
    >
      <div className="max-w-3xl mx-auto flex justify-between items-center text-xs text-muted-foreground">
        <GitHubActivity />
        <div className="flex gap-3 items-center">
          <ExperienceCalculator />
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
