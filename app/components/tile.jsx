'use client'

import { useRef } from 'react'
import Tilt from 'react-parallax-tilt'

const accentMap = {
  primary: 'var(--accent-primary)',
  secondary: 'var(--accent-secondary)',
  tertiary: 'var(--accent-tertiary)',
}

export default function Tile({
  children,
  className = '',
  accent = 'primary',
  tilt = false,
  gridClass = '',
}) {
  const ref = useRef(null)

  const inner = (
    <div
      ref={ref}
      className={`tile ${gridClass} ${className}`.trim()}
      style={{
        '--tile-accent': accentMap[accent] || accentMap.primary,
        opacity: 0,
      }}
    >
      {children}
    </div>
  )

  if (!tilt) return inner

  return (
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      glareEnable={true}
      glareMaxOpacity={0.08}
      glareColor="var(--accent-primary)"
      glareBorderRadius="16px"
      scale={1.01}
      perspective={800}
      transitionSpeed={400}
      className={gridClass}
      style={{ borderRadius: '16px' }}
    >
      <div
        ref={ref}
        className={`tile ${className}`.trim()}
        style={{
          '--tile-accent': accentMap[accent] || accentMap.primary,
          height: '100%',
          opacity: 0,
        }}
      >
        {children}
      </div>
    </Tilt>
  )
}
