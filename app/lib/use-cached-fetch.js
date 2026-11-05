'use client'

import { useEffect, useRef, useState } from 'react'
import { newerEntry, snapshotAt } from './snapshot-time.mjs'

function parseStored(raw) {
  try {
    return { ok: true, value: JSON.parse(raw) }
  } catch {
    return { ok: false }
  }
}

function readEntry(cacheKey, ttl) {
  const raw = localStorage.getItem(cacheKey)
  if (!raw) return null
  const parsed = parseStored(raw)
  if (!parsed.ok) return null
  const checkedAt = parseInt(localStorage.getItem(`${cacheKey}_time`), 10)
  const at = parseInt(localStorage.getItem(`${cacheKey}_at`), 10)
  return {
    value: parsed.value,
    at: Number.isFinite(at) ? at : null,
    checkedAt: Number.isFinite(checkedAt) ? checkedAt : 0,
    fresh: Number.isFinite(checkedAt) && Date.now() - checkedAt < ttl,
  }
}

function writeEntry(cacheKey, entry, checkedAt) {
  localStorage.setItem(cacheKey, JSON.stringify(entry.value))
  localStorage.setItem(`${cacheKey}_time`, String(checkedAt))
  if (Number.isFinite(entry.at)) {
    localStorage.setItem(`${cacheKey}_at`, String(entry.at))
  } else {
    localStorage.removeItem(`${cacheKey}_at`)
  }
}

function seedEntry(initial, transform, shouldCache) {
  if (!initial) return null
  const value = transform ? transform(initial.data) : initial.data
  if (shouldCache && !shouldCache(value)) return null
  return { value, at: snapshotAt(initial.data, initial.fetchedAt) }
}

export function useCachedFetch(
  endpoint,
  cacheKey,
  { ttl = 900000, shouldCache, transform, initial } = {},
) {
  const [shown, setShown] = useState(() =>
    seedEntry(initial, transform, shouldCache),
  )
  const shownRef = useRef(shown)
  const seedRef = useRef(shown)
  const keyRef = useRef(cacheKey)

  useEffect(() => {
    let ignore = false
    if (keyRef.current !== cacheKey) {
      keyRef.current = cacheKey
      seedRef.current = null
      shownRef.current = null
      setShown(null)
    }

    const show = (candidate) => {
      const winner = newerEntry(shownRef.current, candidate)
      if (winner !== shownRef.current) {
        shownRef.current = winner
        setShown(winner)
      }
      return winner
    }

    const fetchData = async () => {
      try {
        const stored = readEntry(cacheKey, ttl)
        if (stored?.fresh) {
          if (ignore) return
          const winner = show(stored)
          if (winner !== stored) writeEntry(cacheKey, winner, stored.checkedAt)
          return
        }

        const res = await fetch(endpoint)
        if (ignore) return
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)

        const json = await res.json()
        if (ignore) return

        const value = transform ? transform(json) : json
        if (!shouldCache || shouldCache(value)) {
          const winner = show({ value, at: snapshotAt(json) })
          writeEntry(cacheKey, winner, Date.now())
        } else if (!shownRef.current) {
          show(stored ?? { value, at: null })
        }
      } catch {
        if (ignore) return
        const stored = readEntry(cacheKey, ttl)
        if (stored) show(stored)
      }
    }

    const seeded = seedRef.current
    if (seeded && Date.now() - seeded.at < ttl) {
      const stored = readEntry(cacheKey, ttl)
      if (newerEntry(stored, seeded) === seeded) {
        writeEntry(
          cacheKey,
          seeded,
          Math.max(stored?.checkedAt ?? 0, seeded.at),
        )
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

  return shown ? shown.value : null
}
