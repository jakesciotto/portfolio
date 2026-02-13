'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import posthog from 'posthog-js'

export default function TweetClient({ image, index }) {
  const ref = useRef(null)
  const hasTrackedRef = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTrackedRef.current) {
          posthog.capture('tweet_viewed', {
            tweet_image: image,
            tweet_index: index + 1,
          })
          hasTrackedRef.current = true
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [image, index])

  return (
    <div
      ref={ref}
      className="relative flex flex-col bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-600"
    >
      <div className="relative w-full aspect-auto">
        <Image
          src={`/img/${image}`}
          alt={`Tweet ${index + 1}`}
          width={600}
          height={400}
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  )
}
