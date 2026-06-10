'use client'

import { useEffect, useRef, useState } from 'react'

const skills = [
  { label: 'saying "great question"', weight: 5 },
  { label: 'statistics', weight: 5 },
  { label: 'wasting salad greens', weight: 4 },
  { label: 'building web apps', weight: 4 },
  { label: 'pretending to understand sql', weight: 4 },
  { label: 'finops', weight: 5 },
  { label: 'naming variables', weight: 3 },
  { label: 'databases', weight: 3 },
  { label: 'sleeping', weight: 2 },
  { label: 'being on time', weight: 2 },
  { label: 'martial arts', weight: 1 },
]

const TIER_LABELS = {
  5: 'expert',
  4: 'advanced',
  3: 'solid',
  2: 'learning',
  1: 'sucks',
}
const TIER_TEXT = {
  5: 'text-accent-primary',
  4: 'text-accent-secondary',
  3: 'text-accent-tertiary',
  2: 'text-muted-foreground/80',
  1: 'text-muted-foreground/50',
}

const TIER_BG = {
  5: 'bg-accent-primary',
  4: 'bg-accent-secondary',
  3: 'bg-accent-tertiary',
  2: 'bg-muted-foreground/70',
  1: 'bg-muted-foreground/40',
}

const sorted = [...skills].sort((a, b) => b.weight - a.weight)
const INITIAL_COUNT = 12

const SEGMENTS = {
  maskImage:
    'repeating-linear-gradient(90deg, #000 0 10px, transparent 10px 13px)',
  WebkitMaskImage:
    'repeating-linear-gradient(90deg, #000 0 10px, transparent 10px 13px)',
}

function Prompt() {
  return (
    <>
      <span className="text-accent-primary">jake@portfolio</span>
      <span className="text-muted-foreground">:</span>
      <span className="text-accent-tertiary">~</span>
      <span className="text-muted-foreground">$ </span>
    </>
  )
}

function SegmentBar({ weight }) {
  return (
    <div className="relative h-2.5 w-full">
      <div className="absolute inset-0 bg-muted-foreground/15" style={SEGMENTS} />
      <div
        className={`absolute inset-y-0 left-0 ${TIER_BG[weight]} transition-all duration-500 ease-out`}
        style={{ ...SEGMENTS, width: `${(weight / 5) * 100}%` }}
      />
    </div>
  )
}

export default function SkillTags() {
  const [expanded, setExpanded] = useState(false)
  const [typed, setTyped] = useState('')
  const [typing, setTyping] = useState(false)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(
    () => () => {
      clearInterval(intervalRef.current)
      clearTimeout(timeoutRef.current)
    },
    [],
  )

  const runCommand = () => {
    if (typing) return
    const cmd = expanded ? 'skills --top' : 'skills --all'
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
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
        timeoutRef.current = setTimeout(() => {
          setExpanded((e) => !e)
          setTyped('')
          setTyping(false)
        }, 180)
      }
    }, 35)
  }

  const visible = expanded ? sorted : sorted.slice(0, INITIAL_COUNT)

  return (
    <div className="flex flex-col h-full font-mono -m-6 max-md:-m-5">
      {/* window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-muted/40 rounded-t-[15px]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
      </div>

      <div className="flex flex-col flex-1 p-4 pt-3">
        <p className="text-xs mb-3">
          <Prompt />
          <span className="text-foreground">skills --sort=level</span>
        </p>

        <div className="flex flex-col gap-1.5">
          {visible.map((skill) => (
            <div
              key={skill.label}
              className="grid grid-cols-[minmax(0,11.5rem)_1fr_auto] items-center gap-3"
            >
              <span className="text-[12px] font-medium text-foreground">
                {skill.label}
              </span>
              <SegmentBar weight={skill.weight} />
              <span
                className={`text-[11px] font-semibold text-right ${TIER_TEXT[skill.weight]}`}
              >
                {TIER_LABELS[skill.weight]}
              </span>
            </div>
          ))}
        </div>

        {sorted.length > INITIAL_COUNT ? (
          <button
            onClick={runCommand}
            className="text-xs text-left mt-3 cursor-pointer group"
          >
            <Prompt />
            <span className="text-foreground">{typed}</span>
            <span className="terminal-cursor text-accent-primary">
              &#9613;
            </span>
            {!typing && (
              <span className="text-muted-foreground/50 ml-2 group-hover:text-muted-foreground transition-colors">
                # run:{' '}
                {expanded ? 'skills --top' : `skills --all (${skills.length})`}
              </span>
            )}
          </button>
        ) : (
          <p className="text-xs mt-3">
            <Prompt />
            <span className="terminal-cursor text-accent-primary">
              &#9613;
            </span>
          </p>
        )}
      </div>
    </div>
  )
}
