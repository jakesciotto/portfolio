'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { capture } from '../lib/analytics.mjs'

export default function TweetClient({ tweet, priority }) {
  const ref = useRef(null)
  const hasTrackedRef = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTrackedRef.current) {
          capture('tweet_viewed', {
            tweet_id: tweet.id,
            tweet_rank: tweet.rank,
          })
          hasTrackedRef.current = true
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [tweet.id, tweet.rank])

  return (
    <a
      ref={ref}
      href={tweet.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card block w-full overflow-hidden"
    >
      <Image
        src={`/img/tweets/${tweet.image}`}
        alt={tweet.text || `Tweet from ${tweet.date}`}
        width={tweet.width}
        height={tweet.height}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 560px"
        priority={priority}
        className="w-full h-auto"
      />
    </a>
  )
}
