'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import posthog from 'posthog-js'
import { cn } from '@/app/lib/utils'

const navItems = {
  '/': { name: 'home' },
  '/stats': { name: 'stats' },
  '/projects': { name: 'projects' },
  '/certifications': { name: 'certs' },
}

export function Navbar() {
  const pathname = usePathname()

  const handleNavClick = (path, name) => {
    posthog.capture('nav_link_clicked', {
      destination_path: path,
      link_name: name,
    })
  }

  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row space-x-0 pr-10">
            {Object.entries(navItems).map(([path, { name, disabled }]) => {
              const isActive = pathname === path

              if (disabled) {
                return (
                  <span
                    key={path}
                    className="flex align-middle relative py-1 px-2 m-1 text-muted-foreground cursor-not-allowed"
                  >
                    {name}
                  </span>
                )
              }
              return (
                <Link
                  key={path}
                  href={path}
                  className={cn(
                    "relative flex align-middle py-1 px-2 m-1 transition-all",
                    isActive
                      ? "text-neon-cyan"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => handleNavClick(path, name)}
                >
                  {name}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-px bg-neon-cyan" />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </aside>
  )
}
