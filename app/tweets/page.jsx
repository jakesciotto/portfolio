'use client'

import { useEffect, useState } from 'react'
import AnimatedSection from '../components/animated-section'

export default function TweetsPage() {
  const [tweetImages, setTweetImages] = useState([])

  useEffect(() => {
    // Dynamically find all tweet images
    const images = ['tweet1.PNG', 'tweet2.PNG']
    setTweetImages(images)
  }, [])

  return (
    <div className="mt-12 max-w-4xl mx-auto px-4">
      <h1 className="font-semibold text-5xl mb-4 tracking-tighter gradient-text">when i was online</h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">a collection of moments from the timeline</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tweetImages.map((image, index) => (
          <AnimatedSection key={image} delay={index * 100}>
            <div className="relative flex flex-col bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-600">
              <div className="relative w-full aspect-auto">
                <img
                  src={`/img/${image}`}
                  alt={`Tweet ${index + 1}`}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a
          href="/"
          className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
        >
          ← back to reality
        </a>
      </div>
    </div>
  )
}
