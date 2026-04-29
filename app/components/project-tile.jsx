'use client'

import { Badge } from './ui/badge'
import posthog from 'posthog-js'

const projects = [
  {
    name: 'ok-peter',
    description: 'when your friend asks you to work in webflow you say no',
    pill: 'live',
    pillVariant: 'primary',
    link: 'https://www.ok-peter.com',
  },
  {
    name: 'easton leaderboard',
    description:
      'kids bjj program leaderboard and dashboarding tool (admins only)',
    pill: 'live',
    pillVariant: 'primary',
    link: 'https://eastonpodium.com',
  },
  {
    name: 'cloudzero-date-filter',
    description:
      'chrome extension for product functionality we did not have at the time',
    pill: 'live',
    pillVariant: 'primary',
    link: 'https://chromewebstore.google.com/detail/gejpbillcbkknkgbpjdglcjallnhjloh',
  },
  {
    name: 'aidatasucks.com',
    description:
      'vendor comparison site grading AI providers on financial data transparency',
    pill: 'live',
    pillVariant: 'primary',
    link: 'https://aidatasucks.com',
  },
  {
    name: 'easton mat lab',
    description: 'internal video review platform for jiu jitsu coaches',
    pill: 'in beta',
    pillVariant: 'tertiary',
  },
  {
    name: 'easton+',
    description: 'drag and drop jiu jitsu curriculum builder',
    pill: 'in beta',
    pillVariant: 'tertiary',
  },
]

export default function ProjectTile() {
  const handleClick = (name) => {
    if (typeof posthog?.capture === 'function') {
      posthog.capture('tile_click', { project: name })
    }
  }

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground mb-3">
        projects
      </h3>
      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.name}
            className="flex items-start justify-between gap-2"
          >
            <div className="min-w-0">
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleClick(project.name)}
                  className="text-sm font-semibold text-foreground hover:text-accent-primary transition-colors"
                >
                  {project.name}
                </a>
              ) : (
                <span className="text-sm font-semibold text-foreground">
                  {project.name}
                </span>
              )}
              <p className="text-xs text-muted-foreground">
                {project.description}
              </p>
            </div>
            <Badge variant={project.pillVariant} className="shrink-0">
              {project.pill}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
