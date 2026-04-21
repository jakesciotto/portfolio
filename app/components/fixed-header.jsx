'use client'

import { Instagram, Mail, Github } from 'lucide-react'
import ThemeToggle from './theme-toggle'
import MagneticLink from './magnetic-link'
import HeaderNowPlaying from './header-now-playing'
import { useLenis } from './scroll-provider'

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
            className="text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={16} />
          </MagneticLink>
          <MagneticLink
            href="mailto:jake.sciotto@gmail.com"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail size={16} />
          </MagneticLink>
          <MagneticLink
            href="https://github.com/jakesciotto"
            className="text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={16} />
          </MagneticLink>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
