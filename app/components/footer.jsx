'use client'

import posthog from 'posthog-js'

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Footer() {
  const handleExternalLinkClick = (url, linkName) => {
    posthog.capture('external_link_clicked', {
      url: url,
      link_name: linkName,
      location: 'footer',
    })
  }

  return (
    <footer className="mt-auto mb-8">
      <div className="font-sm mt-8 flex items-center text-muted-foreground">
        <a
          className="flex items-center transition-all hover:text-neon-cyan"
          rel="noopener noreferrer"
          target="_blank"
          href="https://github.com/jakesciotto"
          onClick={() =>
            handleExternalLinkClick(
              'https://github.com/jakesciotto',
              'github'
            )
          }
        >
          <ArrowIcon />
          <p className="ml-2 h-7">github</p>
        </a>
        <a
          className="ml-auto transition-all hover:text-neon-cyan"
          href="mailto:jake.sciotto@gmail.com"
          onClick={() =>
            handleExternalLinkClick(
              'mailto:jake.sciotto@gmail.com',
              'email'
            )
          }
        >
          jake.sciotto@gmail.com
        </a>
      </div>
      <p className="mt-8 text-muted-foreground">
        &copy; {new Date().getFullYear()} MIT Licensed
      </p>
    </footer>
  )
}
