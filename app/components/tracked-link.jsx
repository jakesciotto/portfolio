'use client'

import posthog from 'posthog-js'

export default function TrackedLink({
  href,
  eventName,
  eventProperties = {},
  children,
  className,
  target,
  rel,
}) {
  const handleClick = () => {
    posthog.capture(eventName, {
      url: href,
      ...eventProperties,
    })
  }

  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
