import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/app/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest w-fit whitespace-nowrap shrink-0 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-transparent",
        secondary: "bg-secondary text-secondary-foreground border-transparent",
        destructive: "bg-destructive text-white border-transparent",
        outline: "border-border text-foreground",
        ghost: "border-transparent text-muted-foreground",
        neonCyan: "text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10",
        neonMagenta: "text-neon-magenta border-neon-magenta/40 bg-neon-magenta/10",
        neonGreen: "text-neon-green border-neon-green/40 bg-neon-green/10",
        neonAmber: "text-neon-amber border-neon-amber/40 bg-neon-amber/10",
        neonPurple: "text-neon-purple border-neon-purple/40 bg-neon-purple/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props} />
  );
}

export { Badge, badgeVariants }
