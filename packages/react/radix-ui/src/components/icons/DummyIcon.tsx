import type React from "react"

import { cn } from "@/lib/utils"

type Props = { className?: string; children?: React.ReactNode }

export function DummyIcon({ className, children }: Props) {
  return (
    <div
      className={cn(
        "block min-h-4 min-w-4 text-sm",

        className
      )}
    >
      {children ? (
        children
      ) : (
        <div
          className={cn(
            "h-4 w-4",
            "border-1 border-[var(--color-border-on-button-on-icon-dummy-default)]",
            "bg-[var(--color-bg-on-button-on-icon-dummy-default)]"
          )}
        />
      )}
    </div>
  )
}
