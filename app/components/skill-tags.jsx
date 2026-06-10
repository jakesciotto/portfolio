'use client'

import { useEffect, useRef, useState } from 'react'

const skills = [
  { label: 'programming', weight: 5 },
  { label: 'statistics', weight: 5 },
  { label: 'wasting salad greens', weight: 4 },
  { label: 'building web apps', weight: 4 },
  { label: 'ai agents', weight: 4 },
  { label: 'docker', weight: 3 },
  { label: 'graphql', weight: 3 },
  { label: 'postgres', weight: 3 },
  { label: 'redis', weight: 3 },
  { label: 'snowflake', weight: 3 },
  { label: 'bigquery', weight: 2 },
  { label: 'pytorch', weight: 2 },
  { label: 'xgboost', weight: 2 },
  { label: 'tailwind', weight: 4 },
  { label: 'finops', weight: 5 },
  { label: 'rag/cag', weight: 3 },
  { label: 'vercel', weight: 3 },
  { label: 'predictive modeling', weight: 3 },
  { label: 'prompt engineering', weight: 4 },
  { label: 'genai', weight: 4 },
  { label: 'agentic ai', weight: 4 },
]

const TIER_LABELS = { 5: 'expert', 4: 'advanced', 3: 'solid', 2: 'learning' }
const TIER_COLORS = {
  5: 'bg-accent-primary',
  4: 'bg-accent-secondary',
  3: 'bg-accent-tertiary',
  2: 'bg-muted-foreground/60',
}

const sorted = [...skills].sort((a, b) => b.weight - a.weight)
const INITIAL_COUNT = 10

function Prompt() {
  return (
    <>
      <span className="text-accent-primary">jake@portfolio</span>
      <span className="text-muted-foreground"> ~ % </span>
    </>
  )
}

export default function SkillTags() {
  const [expanded, setExpanded] = useState(false)
  const [typed, setTyped] = useState('')
  const [typing, setTyping] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const runCommand = () => {
    if (typing) return
    const cmd = expanded ? 'skills --top' : 'skills --all'
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setExpanded((e) => !e)
      return
    }
    setTyping(true)
    let i = 0
    intervalRef.current = setInterval(() => {
      i++
      setTyped(cmd.slice(0, i))
      if (i >= cmd.length) {
        clearInterval(intervalRef.current)
        setTimeout(() => {
          setExpanded((e) => !e)
          setTyped('')
          setTyping(false)
        }, 180)
      }
    }, 35)
  }

  const visible = expanded ? sorted : sorted.slice(0, INITIAL_COUNT)

  return (
    <div className="flex flex-col h-full font-mono">
      <p className="text-xs mb-3">
        <Prompt />
        <span className="text-foreground">skills --sort=level</span>
      </p>

      <div className="flex flex-col gap-1.5">
        {visible.map((skill) => (
          <div
            key={skill.label}
            className="grid grid-cols-[10rem_1fr_3.5rem] items-center gap-2"
          >
            <span className="text-[11px] text-foreground">{skill.label}</span>
            <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
              <div
                className={`h-full rounded-full ${TIER_COLORS[skill.weight]} transition-all duration-500 ease-out`}
                style={{ width: `${(skill.weight / 5) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground text-right">
              {TIER_LABELS[skill.weight]}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={runCommand}
        className="text-xs text-left mt-3 cursor-pointer group"
      >
        <Prompt />
        <span className="text-foreground">{typed}</span>
        <span className="terminal-cursor text-accent-primary">&#9613;</span>
        {!typing && (
          <span className="text-muted-foreground/50 ml-2 group-hover:text-muted-foreground transition-colors">
            # run: {expanded ? 'skills --top' : `skills --all (${skills.length})`}
          </span>
        )}
      </button>
    </div>
  )
}
