'use client'

import { useEffect, useState } from 'react'

export function useCachedFetch(endpoint, cacheKey, { ttl = 900000, shouldCache, transform } = {}) {
  const [data, setData] = useState(null)

  useEffect(() => {
    let ignore = false

    const fetchData = async () => {
      try {
        const cached = localStorage.getItem(cacheKey)
        const cacheTime = localStorage.getItem(`${cacheKey}_time`)

        if (cached && cacheTime && Date.now() - parseInt(cacheTime) < ttl) {
          if (!ignore) setData(JSON.parse(cached))
          return
        }

        const res = await fetch(endpoint)
        if (ignore) return
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)

        const json = await res.json()
        if (ignore) return

        const result = transform ? transform(json) : json
        setData(result)

        if (!shouldCache || shouldCache(result)) {
          localStorage.setItem(cacheKey, JSON.stringify(result))
          localStorage.setItem(`${cacheKey}_time`, Date.now().toString())
        }
      } catch {
        if (!ignore) {
          const cached = localStorage.getItem(cacheKey)
          if (cached) setData(JSON.parse(cached))
        }
      }
    }

    fetchData()

    const interval = setInterval(() => {
      if (!document.hidden) fetchData()
    }, ttl)

    const handleVisibility = () => {
      if (!document.hidden) fetchData()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      ignore = true
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [endpoint, cacheKey, ttl])

  return data
}
