import { readdirSync } from 'fs'
import { join } from 'path'
import TweetClient from './tweet-client'

export default function TweetsPage() {
  // Read all files from the public/img directory that start with 'tweet'
  const imgDir = join(process.cwd(), 'public', 'img')
  const allFiles = readdirSync(imgDir)
  const tweetImages = allFiles.filter((file) => file.toLowerCase().startsWith('tweet')).sort()

  return (
    <div className="mt-12 max-w-5xl mx-auto px-4">
      <h1 className="font-semibold text-5xl mb-4 tracking-tighter gradient-text">
        when i was online
      </h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
        a collection of moments from the timeline
      </p>

      <div className="grid grid-cols-1 gap-4">
        {tweetImages.map((image, index) => (
          <TweetClient key={image} image={image} index={index} />
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
