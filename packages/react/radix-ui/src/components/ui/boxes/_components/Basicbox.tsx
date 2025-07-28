import React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cloneWithClassName, cn } from "@/lib/utils"
import type { BasicboxMessageVariantsConfig } from "@/components/ui"

const messageVariantsConfig: BasicboxMessageVariantsConfig = {
  messageType: {
    default: "text-[var(--color-basic-box-message-default)]",
    emphasis: "text-[var(--color-basic-box-message-emphasis)]",
    danger: "text-[var(--color-basic-box-message-danger)]",
  },
}

const messageVariants = cva("", {
  variants: {
    ...messageVariantsConfig,
  },
  defaultVariants: {
    messageType: "default",
  },
})

export type BasicboxMessageType = VariantProps<typeof messageVariants>["messageType"]

export type BasicboxProps = {
  placeholder?: string
  messageType?: BasicboxMessageType
  message?: string
  /** 가장 오른쪽에 표시될 아이콘 */
  icon?: React.ReactNode
  /** 가장 오른쪽 아이콘 왼쪽에 표시될 아이콘 */
  iconSub?: React.ReactNode
  iconOnly?: boolean
  width?: number
  className?: string
  inputClassName?: string
  wrapperClassName?: string
  children?: React.ReactNode
}

export function Basicbox({
  className,
  width,
  children,
  iconOnly,
  placeholder,
  message,
  messageType = "default",
  icon,
  iconSub,
  ...props
}: BasicboxProps) {
  const defaultInputClassName = cn("placeholder:text-basic-box-text-hint flex-1 truncate w-full")
  const inputClassName = cn(defaultInputClassName, props.inputClassName)
  const wrapperClassName = cn(props.wrapperClassName || "pr-[4px] pl-[6px]")

  return (
    <div className={cn("box-basic flex flex-col gap-[var(--spacing-basicbox-gap)]", className)} style={{ width }}>
      {!iconOnly ? (
        <>
          <div className={cn("box-wrapper inline-flex items-center gap-[4px] bg-white", wrapperClassName)}>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return cloneWithClassName(child as React.ReactElement<{ className?: string }>, inputClassName)
              }
              return child
            }) || <div className={cn(defaultInputClassName, "typo-box-label-default py-[3px]")}>{placeholder}</div>}
            {(icon || iconSub) && (
              <div className="flex shrink-0 gap-[2px]">
                {iconSub}
                {icon}
              </div>
            )}
          </div>
          {message && (
            <div className="box-message flex min-h-[var(--spacing-basicbox-opt-message-min-h)] items-start justify-end overflow-hidden">
              <div
                title={message}
                className={cn("typo-basic-box-message line-clamp-2 break-all", messageVariants({ messageType }))}
              >
                {message}
              </div>
            </div>
          )}
        </>
      ) : (
        <button className={cn("box-basic icon-only", className, wrapperClassName)} style={{ width }}>
          {icon}
        </button>
      )}
    </div>
  )
}
