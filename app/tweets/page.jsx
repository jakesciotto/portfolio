import { readdirSync } from 'fs'
import { join } from 'path'
import TweetClient from './tweet-client'

export default function TweetsPage() {
  const imgDir = join(process.cwd(), 'public', 'img')
  const allFiles = readdirSync(imgDir)
  const tweetImages = allFiles
    .filter((file) => file.toLowerCase().startsWith('tweet'))
    .sort()

  return (
    <div className="mt-12 max-w-5xl mx-auto px-4">
      <h1 className="font-sans font-bold text-7xl md:text-8xl mb-4 tracking-tighter text-foreground">
        when i was online
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        a collection of moments from the timeline
      </p>

      <div className="grid grid-cols-1 gap-4">
        {tweetImages.map((image, index) => (
          <div
            key={image}
            className="animate-fade-in"
            style={{ animationDelay: `${100 + index * 100}ms` }}
          >
            <TweetClient image={image} index={index} />
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a
          href="/"
          className="text-sm text-muted-foreground hover:text-accent-primary transition-colors"
        >
          &larr; back to reality
        </a>
      </div>
    </div>
  )
}
