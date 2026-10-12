import tweets from '../lib/tweets.json'
import TweetBento from './tweet-bento'

export default function TweetsPage() {
  return (
    <div className="mt-12 max-w-[1152px] mx-auto px-4">
      <h1 className="font-sans font-bold text-7xl md:text-8xl mb-4 tracking-tighter text-foreground">
        when i was online
      </h1>
      <p className="text-sm font-medium text-muted-foreground mb-8">
        a collection of moments from the timeline
      </p>

      <TweetBento tweets={tweets} />

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
