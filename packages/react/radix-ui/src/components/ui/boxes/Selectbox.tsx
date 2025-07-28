import type React from "react"

import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "@/components/icons" // You need to have this icon

import { TextboxWrapper, type TextboxWrapperProps } from "./_components/TextboxWrapper"

export type SelectboxProps = Omit<
  TextboxWrapperProps,
  "multiline" | "autoResize" | "icon" | "iconSub" | "onChange" | "ref"
> & {
  selected?: boolean
  /** 선택된 항목을 파란색으로 강조할지 여부 */
  highlightSelected?: boolean
  ref?: React.RefObject<HTMLButtonElement | null>
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export function Selectbox({ selected, highlightSelected, ref, ...props }: SelectboxProps) {
  const iconSize = 14

  return (
    <TextboxWrapper
      {...props}
      ref={ref}
      wrapperClassName={cn(
        props.size === "small" && "py-[2px]",
        selected
          ? highlightSelected
            ? "[&>button]:text-brand"
            : "[&>button]:text-basic-box-text-value"
          : "[&>button]:text-basic-box-text-hint",
        props.wrapperClassName
      )}
      onChange={props.onChange as React.ChangeEventHandler}
      readOnly
      icon={
        <ChevronDownIcon
          className={cn("p-[1px]", props.disabled && "[&>svg]:stroke-[var(--color-text-box-text-disabled)]")}
          size={iconSize}
        />
      }
      asButton
    />
  )
}
