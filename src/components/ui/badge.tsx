import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "muted" | "outline"
}

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  const toneStyles: Record<Required<BadgeProps>["tone"], string> = {
    default: "bg-foreground text-background",
    muted: "bg-muted text-foreground",
    outline: "border border-border text-foreground",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  )
}
