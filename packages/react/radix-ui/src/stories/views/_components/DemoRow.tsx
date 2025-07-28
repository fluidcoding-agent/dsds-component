import { cn } from "@/lib/utils"

export interface DemoRowProps<T, S extends string> {
  size?: S
  title?: string
  hideTitle?: boolean
  comment?: string
  variant?: T
  children: React.ReactNode
  showExtraState?: boolean // activate, activate:hover, selected 상태 표시
  className?: string
  labelClassName?: string
}

export function DemoRow<T, S extends string>({
  className,
  labelClassName,
  comment,
  size,
  title,
  hideTitle,
  children,
}: DemoRowProps<T, S>) {
  return (
    <li className={cn("boxes-demo-row flex items-start gap-2 [&>ul]:gap-5", className)}>
      {!hideTitle && (
        <label className={cn("flex min-w-[110px] flex-col font-bold capitalize", labelClassName)}>
          <span>{title || size || "N/A"}</span>
          {comment && <small className="text-gray-500">({comment})</small>}
        </label>
      )}
      <ul className="flex">{children}</ul>
    </li>
  )
}
