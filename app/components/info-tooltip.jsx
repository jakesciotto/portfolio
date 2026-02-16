'use client'

import { useState } from 'react'
import posthog from 'posthog-js'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/app/components/ui/tooltip'

export default function InfoTooltip({ children }) {
  const [open, setOpen] = useState(false)

  const handleToggle = (isOpen) => {
    setOpen(isOpen)
    if (isOpen) {
      posthog.capture('info_tooltip_opened', {
        section: 'technical_capabilities',
      })
    }
  }

  return (
    <Tooltip open={open} onOpenChange={handleToggle}>
      <TooltipTrigger asChild>
        <button
          onClick={() => handleToggle(!open)}
          className="inline-flex items-center justify-center w-4 h-4 text-[10px] rounded-full bg-muted text-muted-foreground cursor-pointer hover:bg-neon-cyan/20 hover:text-neon-cyan transition-colors ml-1 align-middle"
          aria-label="More info"
        >
          i
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        sideOffset={4}
        className="bg-[#1e1e24] dark:bg-[#1e1e24] text-neutral-200 border border-neon-cyan/20 shadow-[0_0_12px_rgba(0,240,255,0.1)] text-xs rounded-lg px-3 py-2 w-72 leading-relaxed"
      >
        {children}
      </TooltipContent>
    </Tooltip>
  )
}
