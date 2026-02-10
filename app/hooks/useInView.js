'use client'

import { useEffect, useRef, useState } from 'react'

export function useInView({ threshold = 0.1 } = {}) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting)
    }, { threshold })

    observer.observe(node)

    return () => {
      observer.unobserve(node)
    }
  }, [threshold])

  return { ref, isInView }
}
