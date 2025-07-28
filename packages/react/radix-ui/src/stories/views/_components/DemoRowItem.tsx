import { cn } from "@/lib/utils"

import type { DemoRowProps } from "./DemoRow"

type DemoRowItemProps<T> = DemoRowProps<T, string> & {
  showSpinnerButton?: boolean
  disabled?: boolean
  label?: string
}

export function DemoRowItem<T>({ children, label, className }: DemoRowItemProps<T>) {
  return (
    <li className={cn("demo-row-item flex flex-col gap-2 overflow-clip", className)}>
      {label && <label className="min-w-[110px] text-sm text-[#be00ca] capitalize">{label}</label>}
      <div className="variants flex flex-col gap-2">
        <div className="row flex gap-2">{children}</div>
      </div>
    </li>
  )
}
