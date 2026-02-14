'use client'

import { useRef } from 'react'
import posthog from 'posthog-js'

const pillColors = {
  default: 'text-neutral-500 border-neutral-700',
  green: 'text-emerald-500 border-emerald-700',
  blue: 'text-blue-500 border-blue-700',
  yellow: 'text-amber-500 border-amber-700',
  red: 'text-red-500 border-red-700',
  purple: 'text-purple-500 border-purple-700',
}

export default function WorkProjectItem({ project }) {
  const hasTrackedRef = useRef(false)

  const handleMouseEnter = () => {
    if (!hasTrackedRef.current) {
      posthog.capture('project_preview_viewed', {
        project_name: project.name,
        type: 'work',
      })
      hasTrackedRef.current = true
    }
  }

  return (
    <li className="relative group" onMouseEnter={handleMouseEnter}>
      <h4 className="mb-3 text-neutral-900 dark:text-white text-l font-semibold cursor-default flex items-center gap-3">
        <span className="w-fit">{project.name}</span>
        {project.pill && (
          <span className={`ml-auto shrink-0 whitespace-nowrap text-[10px] font-medium uppercase tracking-widest border rounded-full px-2.5 py-0.5 ${pillColors[project.pillColor] || pillColors.default}`}>
            {project.pill}
          </span>
        )}
      </h4>
      {project.description && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 -mt-1 mb-3">
          {project.description}
        </p>
      )}
    </li>
  )
}
