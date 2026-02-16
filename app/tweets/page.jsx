import { readdirSync } from 'fs'
import { join } from 'path'
import TweetClient from './tweet-client'
import AnimatedSection from '../components/animated-section'

export default function TweetsPage() {
  const imgDir = join(process.cwd(), 'public', 'img')
  const allFiles = readdirSync(imgDir)
  const tweetImages = allFiles
    .filter((file) => file.toLowerCase().startsWith('tweet'))
    .sort()

  return (
    <div className="mt-12 max-w-5xl mx-auto px-4">
      <h1 className="font-semibold text-6xl mb-4 tracking-tighter gradient-text">
        when i was online
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        a collection of moments from the timeline
      </p>

      <div className="grid grid-cols-1 gap-4">
        {tweetImages.map((image, index) => (
          <AnimatedSection key={image} delay={100 + index * 100}>
            <TweetClient image={image} index={index} />
          </AnimatedSection>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a
          href="/"
          className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors"
        >
          &larr; back to reality
        </a>
      </div>
    </div>
  )
}
