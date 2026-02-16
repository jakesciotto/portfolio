import { cn } from "@/app/lib/utils"

const glowColorMap = {
  cyan: "glow-cyan",
  magenta: "glow-magenta",
  green: "glow-green",
  amber: "glow-amber",
  purple: "glow-purple",
}

export function GlassCard({ className, glowColor = "cyan", children, ...props }) {
  return (
    <div
      className={cn(
        "glass-card p-5 md:p-6",
        glowColorMap[glowColor] || glowColorMap.cyan,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function GlassCardTitle({ className, children, ...props }) {
  return (
    <h4
      className={cn("mb-3 text-card-foreground text-2xl font-semibold", className)}
      {...props}
    >
      {children}
    </h4>
  )
}
