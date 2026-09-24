# Tiles and chart primitives
Thin React renderers over the view objects from app/lib, styled by the neon-on-glass tokens.

## works when
- tile.jsx exists at this node
- bento-grid.jsx exists at this node
- ui/columns.jsx exists at this node
- ui/badge.jsx exists at this node
- ui/period-pills.jsx exists at this node
- bento-grid.jsx imports gsap

## why
A tile renders. It does not compute. Every number a tile shows comes from a
pure module under `app/lib` or from the route payload, so a tile has no logic
worth a test and the tests live next to the math.

One theme. Each tile owns one of six hues through `--tile-accent`, and only the
numbers and the identity marks wear it. No text-shadow, no box-shadow, no glow,
no light mode. The full record is the design section of `CLAUDE.md`.

Charts are hand-built: div columns, an inline SVG sparkline, and a heatmap grid.
No chart library. `Columns` fills 0.8 of each column, captions the peak or the
last column, and dims a partial bar.

Every tile starts at `opacity: 0` and the bento grid reveals it through a GSAP
ScrollTrigger batch. Reduce-motion must still show every tile.

The obsidian cell is a KPI row of seven cards, not a tile.
