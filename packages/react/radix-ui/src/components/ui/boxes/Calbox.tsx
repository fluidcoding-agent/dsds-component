"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { CalendarIcon, CloseIcon } from "@/components/icons"

import { TextboxWrapper, type TextboxWrapperProps } from "./_components/TextboxWrapper"

export type CalboxProps = Omit<TextboxWrapperProps, "multiline" | "autoResize" | "icon" | "iconSub"> & {
  onClear?: () => void
}

export function Calbox({ onClear, ...props }: CalboxProps) {
  const [isFocused, setIsFocused] = useState(false)
  const isPopulated = !!props.value
  const iconSize = 16
  const handleClear: React.MouseEventHandler = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onClear?.()
  }

  return (
    <TextboxWrapper
      {...props}
      placeholder="2025-01-01"
      width={props.width || 118}
      wrapperClassName={cn(props.size === "small" && "py-[2px]", props.wrapperClassName)}
      iconSub={
        (isFocused || isPopulated) && props.value ? (
          <CloseIcon
            className={cn(
              props.disabled
                ? "[&>svg]:hidden"
                : "hover:bg-icon-bg-hover hover:border-icon-hover cursor-pointer rounded-xs"
            )}
            size={iconSize}
            onMouseDown={handleClear}
          />
        ) : undefined
      }
      icon={
        <CalendarIcon
          size={iconSize}
          className={cn(
            props.disabled
              ? "[&>svg]:stroke-[var(--color-text-box-text-disabled)]"
              : "hover:bg-icon-bg-hover hover:border-icon-hover cursor-pointer rounded-xs"
          )}
        />
      }
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  )
}
