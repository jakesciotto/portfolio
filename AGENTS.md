# AGENTS.md

This document provides high-level context for AI agents working in this repository. Detailed rules live in `.claude/` — this file is an index, not a rule dump.

## Project Context

This is personal portfolio website. See `docs/project/ARCHITECTURE.md` for full system design.

## Where to Find Instructions

### Core Documentation

| What         | Where                          |
| ------------ | ------------------------------ |
| Architecture | `docs/project/ARCHITECTURE.md` |
| Capabilities | `docs/project/CAPABILITIES.md` |
| Changelog    | `docs/project/CHANGELOG.md`    |
| Plans/To-Dos | `docs/TODO.md`                 |

### Rules

| What       | Where                         |
| ---------- | ----------------------------- |
| Repository | `.claude/rules/repository.md` |

## Workflow Orchestration

### 1. Plan Node

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One tack per subagent for focused execution

### 3. Self-Improvement Loop

- After ANY correction from the user: update '/docs/projects/LESSONS.md" with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done

- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a principal engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to 'docs/TODO.md" with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to '/docs/TODO.md'
6. **Capture Lessons**: Update '/docs/project/LESSONS.md" after corrections
