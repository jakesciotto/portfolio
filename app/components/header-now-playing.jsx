'use client'

import { useEffect, useState } from 'react'

export default function HeaderNowPlaying() {
  const [nowPlaying, setNowPlaying] = useState(null)

  useEffect(() => {
    let ignore = false

    const fetchNowPlaying = async () => {
      try {
        const res = await fetch('/api/spotify-now-playing')
        if (ignore) return
        const data = await res.json()
        if (ignore) return
        setNowPlaying(data)
      } catch {
        // Network failure -- keep previous state
      }
    }

    fetchNowPlaying()

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

  const isPlaying = nowPlaying?.isPlaying && nowPlaying.track
  const label = isPlaying
    ? nowPlaying.artist
      ? `${nowPlaying.track} - ${nowPlaying.artist}`
      : nowPlaying.track
    : ''

  return (
    <div
      className={`flex items-center overflow-hidden transition-all duration-500 ease-in-out ${
        isPlaying ? 'opacity-100 flex-1 mx-3' : 'opacity-0 w-0 mx-0'
      }`}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0 mr-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-secondary opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-secondary" />
      </span>
      <div className="overflow-hidden flex-1 items-stretch">
        <span className="inline-block min-w-full whitespace-nowrap text-xs font-mono text-muted-foreground animate-marquee">
          {label}
        </span>
      </div>
    </div>
  )
}
