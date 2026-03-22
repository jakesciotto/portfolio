'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'

const skills = [
  { label: 'python', weight: 5 },
  { label: 'sql', weight: 5 },
  { label: 'javascript', weight: 4 },
  { label: 'java', weight: 3 },
  { label: 'c++', weight: 2 },
  { label: 'r', weight: 2 },
  { label: 'next.js', weight: 4 },
  { label: 'react', weight: 4 },
  { label: 'node.js', weight: 4 },
  { label: 'terraform', weight: 3 },
  { label: 'docker', weight: 3 },
  { label: 'graphql', weight: 3 },
  { label: 'postgres', weight: 3 },
  { label: 'redis', weight: 3 },
  { label: 'snowflake', weight: 3 },
  { label: 'bigquery', weight: 2 },
  { label: 'pytorch', weight: 2 },
  { label: 'scikit-learn', weight: 3 },
  { label: 'xgboost', weight: 2 },
  { label: 'tailwind', weight: 4 },
  { label: 'aws', weight: 3 },
  { label: 'finops', weight: 5 },
  { label: 'rag/cag', weight: 3 },
  { label: 'vercel', weight: 3 },
  { label: 'k8s', weight: 3 },
  { label: 'statistical analysis', weight: 4 },
  { label: 'predictive modeling', weight: 3 },
  { label: 'prompt engineering', weight: 4 },
  { label: 'genai', weight: 4 },
  { label: 'agentic ai', weight: 4 },
]

function StaticGrid() {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill.label}
          className="card px-3 py-1.5 text-sm text-card-foreground font-medium select-none"
        >
          {skill.label}
        </span>
      ))}
    </div>
  )
}

function PhysicsCanvas() {
  const containerRef = useRef(null)
  const engineRef = useRef(null)
  const runnerRef = useRef(null)
  const bodiesRef = useRef([])
  const elementsRef = useRef([])
  const mouseConstraintRef = useRef(null)
  const rafRef = useRef(null)
  const [ready, setReady] = useState(false)

  const syncDOM = useCallback(() => {
    const bodies = bodiesRef.current
    const elements = elementsRef.current

    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i]
      const el = elements[i]
      if (!el) continue
      el.style.transform = `translate(${body.position.x - body.render.width / 2}px, ${body.position.y - body.render.height / 2}px) rotate(${body.angle}rad)`
    }

    rafRef.current = requestAnimationFrame(syncDOM)
  }, [])

  useEffect(() => {
    let Matter
    let cleanup = () => {}

    const init = async () => {
      Matter = (await import('matter-js')).default
      const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint } =
        Matter

      const container = containerRef.current
      if (!container) return

      const width = container.offsetWidth
      const height = 320

      const engine = Engine.create({ gravity: { x: 0, y: 0.15 } })
      const runner = Runner.create()
      engineRef.current = engine
      runnerRef.current = runner

      const wallOpts = { isStatic: true, render: { visible: false } }
      const walls = [
        Bodies.rectangle(width / 2, height + 25, width, 50, wallOpts),
        Bodies.rectangle(width / 2, -25, width, 50, wallOpts),
        Bodies.rectangle(-25, height / 2, 50, height, wallOpts),
        Bodies.rectangle(width + 25, height / 2, 50, height, wallOpts),
      ]
      Composite.add(engine.world, walls)

      const bodies = []
      const els = []

      skills.forEach((skill, i) => {
        const el = container.querySelector(`[data-skill="${i}"]`)
        if (!el) return

        const rect = el.getBoundingClientRect()
        const w = rect.width
        const h = rect.height

        const x = Math.random() * (width - w) + w / 2
        const y = Math.random() * (height * 0.6) + h / 2

        const body = Bodies.rectangle(x, y, w, h, {
          mass: skill.weight * 0.8,
          restitution: 0.3,
          friction: 0.15,
          frictionAir: 0.05,
          render: { width: w, height: h },
        })

        bodies.push(body)
        els.push(el)
      })

      bodiesRef.current = bodies
      elementsRef.current = els
      Composite.add(engine.world, bodies)

      const mouse = Mouse.create(container)
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      })
      mouseConstraintRef.current = mouseConstraint
      Composite.add(engine.world, mouseConstraint)

      mouse.element.removeEventListener('mousewheel', mouse.mousewheel)
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)

      Runner.run(runner, engine)
      rafRef.current = requestAnimationFrame(syncDOM)
      setReady(true)

      const handleVisibility = () => {
        if (document.hidden) {
          Runner.stop(runner)
          cancelAnimationFrame(rafRef.current)
        } else {
          Runner.run(runner, engine)
          rafRef.current = requestAnimationFrame(syncDOM)
        }
      }
      document.addEventListener('visibilitychange', handleVisibility)

      cleanup = () => {
        document.removeEventListener('visibilitychange', handleVisibility)
        cancelAnimationFrame(rafRef.current)
        Runner.stop(runner)
        Engine.clear(engine)
      }
    }

    init()
    return () => cleanup()
  }, [syncDOM])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none"
      style={{ height: 320, touchAction: 'pan-y' }}
    >
      {skills.map((skill, i) => (
        <div
          key={skill.label}
          data-skill={i}
          className="card px-3 py-1.5 text-sm text-card-foreground font-medium absolute top-0 left-0 cursor-grab active:cursor-grabbing whitespace-nowrap"
          style={{
            opacity: ready ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        >
          {skill.label}
        </div>
      ))}
    </div>
  )
}

export default function SkillTags() {
  const [canPhysics, setCanPhysics] = useState(false)
  const [showJumble, setShowJumble] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const lowPerf =
      navigator.hardwareConcurrency != null && navigator.hardwareConcurrency < 4
    setCanPhysics(!prefersReduced && !lowPerf)
  }, [])

  const handleToggle = () => {
    const container = containerRef.current
    if (!container) {
      setShowJumble((v) => !v)
      return
    }

    gsap.to(container, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        setShowJumble((v) => !v)
        gsap.to(container, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        })
      },
    })
  }

  if (!canPhysics) return <StaticGrid />

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-lg font-semibold font-mono tracking-tight text-foreground transition-opacity duration-300"
          style={{ opacity: showJumble ? 0 : 1 }}
        >
          technical skillz
        </h3>
        <button
          onClick={handleToggle}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border"
        >
          {showJumble ? 'organize' : 'jumble'}
        </button>
      </div>
      <div ref={containerRef}>
        {showJumble ? (
          <PhysicsCanvas key="physics" />
        ) : (
          <StaticGrid key="grid" />
        )}
      </div>
    </div>
  )
}
