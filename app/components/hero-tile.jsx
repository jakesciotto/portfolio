import HeroName from './hero-name'
import TrackedLink from './tracked-link'

export default function HeroTile() {
  return (
    <div className="flex flex-col justify-center h-full">
      <HeroName />
      <p className="text-sm font-semibold tracking-tighter">
        boulder, co
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        engineer by training, problem solver by trade,{' '}
        <TrackedLink
          href="/tweets"
          eventName="tweets_page_link_clicked"
          eventProperties={{
            link_text: 'terminally online millenial',
            location: 'header',
          }}
          className="underline decoration-accent-primary/40 hover:decoration-accent-primary transition-colors cursor-pointer"
        >
          terminally online millenial
        </TrackedLink>{' '}
        by choice
      </p>
      <div className="flex items-center gap-4 mt-3">
        <a
          href="mailto:jake.sciotto@gmail.com"
          className="text-xs font-mono text-accent-primary hover:underline"
        >
          get in touch
        </a>
      </div>
    </div>
  )
}
