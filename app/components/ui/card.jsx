import { cn } from "@/app/lib/utils"

const accentMap = {
  primary: "card-accent-left",
  secondary: "card-accent-secondary",
  tertiary: "card-accent-tertiary",
}

export function Card({ className, accent, children, ...props }) {
  return (
    <div
      className={cn(
        "card p-5 md:p-6",
        accent && accentMap[accent],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h4
      className={cn("mb-3 text-card-foreground text-2xl font-semibold", className)}
      {...props}
    >
      {children}
    </h4>
  )
}