import { cn } from "@/lib/utils"

import { DummyIcon } from "./DummyIcon"

type Props = { className?: string; iconClassName?: string }

export function SpinnerIcon({ className, iconClassName }: Props) {
  return (
    <DummyIcon>
      <div className={cn("h-4 w-4", className)}>
        <svg className={cn("dsds-spinner", iconClassName)}>
          <circle className="path" cx="8" cy="8" r="6" fill="none" strokeWidth="2"></circle>
        </svg>
      </div>
    </DummyIcon>
  )
}
