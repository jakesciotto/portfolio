'use client'

import Image from 'next/image'
import { useRef } from 'react'
import posthog from 'posthog-js'

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
    <li className="relative group" onMouseEnter={handleMouseEnter}>
      <h4 className="mb-3 text-neutral-900 dark:text-white text-2xl font-semibold cursor-default flex items-center gap-3">
        <span className="w-fit">
          {project.name}
          <span className="ml-2 text-xs font-normal text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            preview
          </span>
        </span>
        <span className="ml-auto shrink-0 whitespace-nowrap text-[10px] font-medium uppercase tracking-widest text-neutral-500 border border-neutral-700 rounded-full px-2.5 py-0.5">
          coming soon
        </span>
      </h4>
      <div className="absolute left-0 top-full z-10 pointer-events-none opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 ease-out">
        <Image
          src={project.preview}
          alt={`${project.name} preview`}
          width={320}
          height={200}
          className="rounded-lg shadow-2xl border border-neutral-800"
        />
      </div>
    </li>
  )
}
