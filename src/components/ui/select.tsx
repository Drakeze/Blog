import * as React from "react"

import { cn } from "@/lib/utils"

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "block w-full appearance-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
        "[background-image:linear-gradient(45deg,transparent_50%,currentColor_50%),linear-gradient(135deg,currentColor_50%,transparent_50%)] [background-position:calc(100%-22px)_50%,calc(100%-14px)_50%] [background-size:8px_8px,8px_8px] [background-repeat:no-repeat]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
})

Select.displayName = "Select"
