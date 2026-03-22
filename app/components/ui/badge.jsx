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
        primary: "text-accent-primary border-accent-primary/40 bg-accent-primary/10",
        secondaryAccent: "text-accent-secondary border-accent-secondary/40 bg-accent-secondary/10",
        tertiary: "text-accent-tertiary border-accent-tertiary/40 bg-accent-tertiary/10",
        muted: "text-muted-foreground border-border bg-muted",
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
