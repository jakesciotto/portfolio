import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/app/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest w-fit whitespace-nowrap shrink-0 transition-colors",
  {
    variants: {
      variant: {
        destructive: "bg-destructive text-white border-transparent",
        outline: "border-border-strong text-foreground",
        primary: "text-accent-primary border-accent-primary/40 bg-accent-primary/10",
        secondaryAccent: "text-accent-secondary border-accent-secondary/40 bg-accent-secondary/10",
        tertiary: "text-accent-tertiary border-accent-tertiary/40 bg-accent-tertiary/10",
        amber: "text-accent-amber border-accent-amber/40 bg-accent-amber/10",
        violet: "text-accent-violet border-accent-violet/40 bg-accent-violet/10",
        red: "text-accent-red border-accent-red/40 bg-accent-red/10",
        muted: "text-muted-foreground border-border-strong bg-secondary font-medium",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  }
)

function Badge({
  className,
  variant = "outline",
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

export { Badge }
