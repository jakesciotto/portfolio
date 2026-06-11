'use client'

import { Mail, Calendar } from 'lucide-react'
import ThemeToggle from './theme-toggle'
import MagneticLink from './magnetic-link'
import HeaderNowPlaying from './header-now-playing'
import { useLenis } from './scroll-provider'

function InstagramIcon({ size = 16 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function GithubIcon({ size = 16 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

export default function FixedHeader() {
  const lenisRef = useLenis()

  const scrollToTop = () => {
    if (lenisRef?.current) {
      lenisRef.current.scrollTo(0)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-border"
      style={{
        background: 'var(--card-glass)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-12">
        <button
          onClick={scrollToTop}
          className="text-sm font-mono tracking-tighter text-foreground shrink-0"
        >
          <span className="sm:hidden">js</span>
          <span className="hidden sm:inline">jake sciotto dot com</span>
        </button>
        <HeaderNowPlaying />
        <div className="flex items-center gap-3">
          <MagneticLink
            href="https://instagram.com/jakesciotto"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon size={16} />
          </MagneticLink>
          <MagneticLink
            href="mailto:jake.sciotto@gmail.com"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <Mail size={16} />
          </MagneticLink>
          <MagneticLink
            href="https://meet.jakesciotto.com"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Calendar size={16} />
          </MagneticLink>
          <MagneticLink
            href="https://github.com/jakesciotto"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon size={16} />
          </MagneticLink>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
