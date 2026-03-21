'use client'

import ThemeToggle from './theme-toggle'
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
          className="text-sm font-mono tracking-tight text-foreground"
        >
          jake sciotto dot com
        </button>
        <div className="flex items-center gap-3">
          <a
            href="mailto:jake.sciotto@gmail.com"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            get in touch
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
