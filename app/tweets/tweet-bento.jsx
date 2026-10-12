'use client'

import { useLayoutEffect, useRef } from 'react'
import TweetClient from './tweet-client'

export default function TweetBento({ tweets }) {
  const gridRef = useRef(null)

  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const layout = () => {
      const style = getComputedStyle(grid)
      const row = parseFloat(style.gridAutoRows)
      const gap = parseFloat(style.columnGap)
      for (const item of grid.children) {
        const height = item.firstElementChild.getBoundingClientRect().height
        item.style.gridRowEnd = `span ${Math.ceil((height + gap) / row)}`
      }
    }

    grid.classList.add('is-masonry')
    layout()

    const observer = new ResizeObserver(layout)
    for (const item of grid.children) observer.observe(item.firstElementChild)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={gridRef} className="tweet-bento">
      {tweets.map((tweet, index) => (
        <div
          key={tweet.id}
          className="animate-fade-in"
          style={{
            '--span': index < 2 ? 3 : 2,
            animationDelay: `${100 + Math.min(index, 8) * 100}ms`,
          }}
        >
          <TweetClient tweet={tweet} priority={index < 2} />
        </div>
      ))}
    </div>
  )
}
