'use client'

import { useRef } from 'react'
import posthog from 'posthog-js'
import { Badge } from '@/app/components/ui/badge'

const pillVariantMap = {
  green: 'neonGreen',
  blue: 'neonCyan',
  yellow: 'neonAmber',
  red: 'neonMagenta',
  purple: 'neonPurple',
  default: 'outline',
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
    <div
      className="relative group glass-card glow-cyan p-4"
      onMouseEnter={handleMouseEnter}
    >
      <h4 className="mb-2 text-card-foreground text-l font-semibold cursor-default flex items-center gap-3">
        <span className="w-fit">
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neon-cyan transition-colors"
            >
              {project.name}
            </a>
          ) : (
            project.name
          )}
          <span className="ml-2 text-xs font-normal text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {project.link ? '↗' : project.preview ? 'preview' : ''}
          </span>
        </span>
        {project.pill && (
          <Badge
            variant={
              pillVariantMap[project.pillColor] || pillVariantMap.default
            }
            className="ml-auto"
          >
            {project.pill}
          </Badge>
        )}
      </h4>
      {project.description && (
        <p className="text-xs text-muted-foreground -mt-1 mb-1">
          {project.description}
        </p>
      )}
    </div>
  )
}
