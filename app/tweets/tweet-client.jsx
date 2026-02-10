'use client'

import Image from 'next/image'

export default function TweetClient({ image, index }) {
  return (
    <div className="relative flex flex-col bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-600">
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
