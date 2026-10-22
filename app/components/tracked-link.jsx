'use client'

import { capture } from '../lib/analytics.mjs'

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
    capture(eventName, {
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
