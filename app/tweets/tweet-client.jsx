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
      className="glass-card glow-purple overflow-hidden"
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
