"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"
import { CloseIconGhost } from "@/components/icons"

export type PopoverContentProps = React.ComponentProps<typeof PopoverPrimitive.Content> & {
  index: number
  className?: string
  title?: React.ReactNode
  titleClassName?: string
  childrenClassName?: string
  isOpen: boolean
  children?: React.ReactNode
  display: (e: boolean, index: number) => void
}

function Popover({
  index,
  className,
  title,
  titleClassName,
  childrenClassName,
  isOpen,
  children,
  display,
  ...props
}: PopoverContentProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(isOpen)
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      setIsAnimating(true)
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => setShouldRender(false), 100)
      return () => clearTimeout(timer)
    }
  }, [index, isOpen])

  if (!shouldRender) return null
  return (
    <div
      className={cn(
        /* 레이아웃 및 모양 */
        "fixed z-100 min-h-[320px] w-[380px] origin-(--radix-popover-content-transform-origin) rounded-sm pt-4 pr-[18px] pb-5 pl-5 outline-hidden",
        /* 애니메이션 및 전환 */
        isAnimating ? "animate-in fade-in-0 duration-100" : "animate-out fade-out-0 duration-100",
        /* 배경 및 텍스트 색상 */
        "bg-background text-[16px] tracking-[0.8px] text-[var(--colors-neutral-neutral-17)]",
        /* 그림자 */
        "shadow-md",
        open,
        className
      )}
      {...props}
    >
      <div className={cn("mb-[14px] flex h-[22px] place-content-between items-center", titleClassName)}>
        <div className="h-[22px] overflow-hidden text-ellipsis whitespace-nowrap">{title}</div>
        <button
          className={cn(
            "focus-visible:outline-ring rounded-[2px] p-[2px] hover:bg-[var(--color-bg-on-ghost-button-ghostbtn-hover)] focus:bg-[var(--color-bg-on-ghost-button-ghostbtn-hover)]"
          )}
        >
          <CloseIconGhost onClick={() => display(false, index)} />
        </button>
      </div>
      <div className="mr-[-16px] ml-[-20px] border-t border-[var(--color-border-border-3-inner)]" />
      <div className={cn("mt-4 max-h-[226px] overflow-auto", childrenClassName)}>{children}</div>
    </div>
  )
}

export { Popover }
