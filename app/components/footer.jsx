'use client'

import Link from 'next/link'
import posthog from 'posthog-js'

export default function Footer() {
  const handleExternalLinkClick = (url, linkName) => {
    posthog.capture('external_link_clicked', {
      url: url,
      link_name: linkName,
      location: 'footer',
    })
  }

  return (
    <footer className="mt-auto mb-8">
      <div className="max-w-6xl mx-auto w-full px-4 mt-8 flex items-center gap-3 text-xs text-muted-foreground">
        <a
          className="transition-all hover:text-accent-primary"
          rel="noopener noreferrer"
          target="_blank"
          href="https://github.com/jakesciotto"
          onClick={() =>
            handleExternalLinkClick(
              'https://github.com/jakesciotto',
              'github'
            )
          }
        >
          github
        </a>
        <span className="text-muted-foreground/40">|</span>
        <a
          className="transition-all hover:text-accent-primary"
          href="mailto:jake.sciotto@gmail.com"
          onClick={() =>
            handleExternalLinkClick(
              'mailto:jake.sciotto@gmail.com',
              'contact'
            )
          }
        >
          contact
        </a>
        <span className="text-muted-foreground/40">|</span>
        <Link
          href="/privacy"
          className="transition-all hover:text-accent-primary"
        >
          privacy
        </Link>
        <span className="text-muted-foreground/40">|</span>
        <Link
          href="/terms"
          className="transition-all hover:text-accent-primary"
        >
          terms
        </Link>
        <span className="ml-auto text-xs">
          &copy; {new Date().getFullYear()} MIT Licensed
        </span>
      </div>
    </footer>
  )
}
