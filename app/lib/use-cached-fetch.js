'use client'

import { useEffect, useRef, useState } from 'react'

function readCache(cacheKey, ttl) {
  const cached = localStorage.getItem(cacheKey)
  const cacheTime = localStorage.getItem(`${cacheKey}_time`)
  if (!cached) return { value: null, fresh: false }
  const fresh = !!cacheTime && Date.now() - parseInt(cacheTime) < ttl
  return { value: JSON.parse(cached), fresh }
}

function acceptInitial(initial, transform, shouldCache) {
  if (!initial) return null
  const result = transform ? transform(initial.data) : initial.data
  if (shouldCache && !shouldCache(result)) return null
  return result
}

export function useCachedFetch(
  endpoint,
  cacheKey,
  { ttl = 900000, shouldCache, transform, initial } = {},
) {
  const [data, setData] = useState(() =>
    acceptInitial(initial, transform, shouldCache),
  )
  const keyRef = useRef(cacheKey)
  const initialRef = useRef(data ? initial : null)

  useEffect(() => {
    let ignore = false
    if (keyRef.current !== cacheKey) {
      keyRef.current = cacheKey
      initialRef.current = null
      setData(null)
    }

    const fetchData = async () => {
      try {
        const cache = readCache(cacheKey, ttl)
        if (cache.fresh) {
          if (!ignore) setData(cache.value)
          return
        }

        const res = await fetch(endpoint)
        if (ignore) return
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)

        const json = await res.json()
        if (ignore) return

        const result = transform ? transform(json) : json
        if (!shouldCache || shouldCache(result)) {
          setData(result)
          localStorage.setItem(cacheKey, JSON.stringify(result))
          localStorage.setItem(`${cacheKey}_time`, Date.now().toString())
        } else {
          setData((prev) => prev ?? cache.value ?? result)
        }
      } catch {
        if (ignore) return
        const cache = readCache(cacheKey, ttl)
        if (cache.value) setData(cache.value)
      }
    }

    const seeded = initialRef.current
    if (seeded && Date.now() - seeded.fetchedAt < ttl) {
      const storedAt = parseInt(localStorage.getItem(`${cacheKey}_time`)) || 0
      if (storedAt < seeded.fetchedAt) {
        localStorage.setItem(cacheKey, JSON.stringify(data))
        localStorage.setItem(`${cacheKey}_time`, String(seeded.fetchedAt))
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
