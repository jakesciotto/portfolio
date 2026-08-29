'use client'

import Tilt from 'react-parallax-tilt'

const accentMap = {
  primary: 'var(--accent-primary)',
  secondary: 'var(--accent-secondary)',
  tertiary: 'var(--accent-tertiary)',
  amber: 'var(--accent-amber)',
  violet: 'var(--accent-violet)',
  red: 'var(--accent-red)',
}

export default function Tile({
  children,
  className = '',
  accent = 'primary',
  tilt = false,
  gridClass = '',
}) {
  const inner = (
    <div
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
      glareEnable={false}
      scale={1.01}
      perspective={800}
      transitionSpeed={400}
      className={gridClass}
      style={{ borderRadius: '14px' }}
    >
      <div
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
