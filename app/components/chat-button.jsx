'use client'

import { useState } from 'react'
import Chat from './chat'

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Chat isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-4 md:right-6 z-50
          w-12 h-12 rounded-full
          bg-neon-cyan/20 border border-neon-cyan/40
          text-neon-cyan hover:bg-neon-cyan/30
          shadow-[0_0_20px_var(--neon-cyan-glow,rgba(0,255,255,0.15))]
          transition-all duration-300 hover:scale-105
          flex items-center justify-center"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {isOpen ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <>
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </>
          )}
        </svg>
      </button>
    </>
  )
}
