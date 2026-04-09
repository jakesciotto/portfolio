'use client'

import { useEffect, useState } from 'react'

export default function HeaderNowPlaying() {
  const [nowPlaying, setNowPlaying] = useState(null)

  const fetchNowPlaying = async () => {
    try {
      const res = await fetch('/api/spotify-now-playing')
      const data = await res.json()
      setNowPlaying(data)
    } catch {
      // Silent failure
    }
  }

  useEffect(() => {
    let ignore = false

    const load = async () => {
      await fetchNowPlaying()
    }
    load()

    const interval = setInterval(() => {
      if (!document.hidden) fetchNowPlaying()
    }, 30000)

    const handleVisibility = () => {
      if (!document.hidden) fetchNowPlaying()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      ignore = true
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  if (!nowPlaying?.isPlaying || !nowPlaying.track) return null

  const label = nowPlaying.artist
    ? `${nowPlaying.track} - ${nowPlaying.artist}`
    : nowPlaying.track

  return (
    <div className="hidden md:flex flex-1 items-center overflow-hidden mx-3">
      <span className="relative flex h-1.5 w-1.5 shrink-0 mr-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-secondary opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-secondary" />
      </span>
      <div className="overflow-hidden flex-1">
        <span className="inline-block whitespace-nowrap text-xs font-mono text-muted-foreground animate-marquee">
          {label}
        </span>
      </div>
    </div>
  )
}
