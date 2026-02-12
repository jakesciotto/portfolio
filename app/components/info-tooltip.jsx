'use client'

import { useState, useRef, useEffect } from 'react'

export default function InfoTooltip({ children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [open])

  return (
    <span ref={ref} className="relative inline-block align-middle ml-1">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center w-4 h-4 text-[10px] rounded-full bg-neutral-700 text-neutral-300 cursor-pointer hover:bg-neutral-600 transition-colors"
        aria-label="More info"
      >
        i
      </button>
      {open && (
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-10 text-xs text-neutral-400 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 w-72 leading-relaxed animate-in">
          {children}
        </span>
      )}
    </span>
  )
}
