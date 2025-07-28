"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { CloseIcon, MagnifyIcon } from "@/components/icons" // You need to have this icon

import { TextboxWrapper, type TextboxWrapperProps } from "./_components/TextboxWrapper"

export type SearchboxProps = Omit<TextboxWrapperProps, "multiline" | "autoResize" | "icon" | "iconSub"> & {
  onClear?: () => void
}

/**
 *
 * 주의: CloseIcon 이 보여야 할 경우
 * - Focused 상태일 때.
 * - Selected (Populated) 상태일 때
 */
export function Searchbox(props: SearchboxProps) {
  const [isFocused, setIsFocused] = useState(false)
  const isPopulated = !!props.value
  const iconSize = 14
  const handleClear: React.MouseEventHandler = (e) => {
    e.preventDefault()
    e.stopPropagation()
    props.onClear?.()
  }

  return (
    <TextboxWrapper
      {...props}
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
        <MagnifyIcon
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
