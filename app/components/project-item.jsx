'use client'

import Image from 'next/image'
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

export default function ProjectItem({ project }) {
  const hasTrackedRef = useRef(false)

  const handleMouseEnter = () => {
    if (!hasTrackedRef.current) {
      posthog.capture('project_preview_viewed', {
        project_name: project.name,
        preview_image: project.preview,
      })
      hasTrackedRef.current = true
    }
  }

  return (
    <li
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
      {!project.link && project.preview && (
        <div className="absolute left-0 top-full z-10 pointer-events-none opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 ease-out">
          <Image
            src={project.preview}
            alt={`${project.name} preview`}
            width={320}
            height={200}
            className="rounded-lg shadow-2xl border border-border"
          />
        </div>
      )}
    </li>
  )
}
