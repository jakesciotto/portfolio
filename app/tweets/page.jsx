import tweets from '../lib/tweets.json'
import TweetClient from './tweet-client'

export default function TweetsPage() {
  return (
    <div className="mt-12 max-w-5xl mx-auto px-4">
      <h1 className="font-sans font-bold text-7xl md:text-8xl mb-4 tracking-tighter text-foreground">
        when i was online
      </h1>
      <p className="text-sm font-medium text-muted-foreground mb-8">
        a collection of moments from the timeline
      </p>

      <div className="grid grid-cols-1 gap-4">
        {tweets.map((tweet, index) => (
          <div
            key={tweet.id}
            className="animate-fade-in min-w-0"
            style={{ animationDelay: `${100 + Math.min(index, 8) * 100}ms` }}
          >
            <TweetClient tweet={tweet} priority={index < 2} />
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a
          href="/"
          className="text-sm font-medium text-muted-foreground hover:text-accent-primary transition-colors"
        >
          &larr; back to reality
        </a>
      </div>
    </div>
  )
}
