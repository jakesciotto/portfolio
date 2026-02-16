'use client'

import { useInView } from '../hooks/useInView'

export default function AnimatedSection({ children, delay = 0, className = '' }) {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <div
      ref={ref}
      className={`fade-in-section ${isInView ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
