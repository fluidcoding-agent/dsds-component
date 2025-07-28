import React, { useEffect, useRef, useState } from "react"
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"

import { cn } from "@/lib/utils"
import { BreadcrumbSelectboxDisabledIcon, BreadcrumbSelectboxIcon, BreadcrumbSlashIcon } from "@/components/icons"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui"

const disabledStyle = "pointer-events-none text-[var(--color-text-on-btn-ghost-on-ghost-disabled)]"

function Breadcrumb({ children, ellipsis, ...props }: { children: React.ReactNode; ellipsis?: boolean }) {
  const childrenArray = React.Children.toArray(children)
  const commonStyle =
    "typo-caption flex flex-row items-center gap-[3px] text-[var(--color-text-on-btn-ghost-on-ghost-default)]"

  // 마지막 Element에 Separator를 추가하지 않도록 수정
  const modifiedChildren = childrenArray.map((child, index) =>
    React.isValidElement(child) && index === childrenArray.length - 1
      ? React.cloneElement(child as React.ReactElement<{ isLast?: boolean }>, { isLast: true })
      : child
  )
  // 총 개수가 5개 미만이거나 Ellipsis를 설정하지 않은 경우 전체를 보여줌
  if (modifiedChildren.length <= 5 || !ellipsis) {
    return (
      <div className={commonStyle} {...props}>
        {modifiedChildren}
      </div>
    )
  }
  // 총 개수가 5개 이상이고 Ellipsis가 설정된 경우 Ellipsis를 적용하여 중간 부분을 생략
  else {
    const first = modifiedChildren[0]
    const lastThree = modifiedChildren.slice(-3)
    const ellipsis = (
      <BreadcrumbElement>
        <div className="pointer-events-none px-[6px] pl-0">...</div>
      </BreadcrumbElement>
    )
    return (
      <div className={commonStyle} {...props}>
        {first}
        {ellipsis}
        {lastThree}
      </div>
    )
  }
}

function BreadcrumbElement({ children, isLast, ...props }: { children: React.ReactNode; isLast?: boolean }) {
  return (
    <div className="flex h-[20px] flex-row items-center" {...props}>
      {children}
      {!isLast && <BreadcrumbSlashIcon />}
    </div>
  )
}

function BreadcrumbText({
  href,
  children,
  selected,
  disabled,
  ...props
}: {
  href?: string
  children: string
  selected?: boolean
  disabled?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    if (ref.current) {
      setShowTooltip(ref.current.scrollWidth > ref.current.clientWidth)
    }
  }, [children])

  return (
    <div className={cn(disabled && "cursor-not-allowed")}>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            tabIndex={0}
            href={href}
            className={cn(
              "flex h-[18px] max-w-[110px] flex-row items-center rounded-xs px-[6px]",
              "hover:cursor-pointer hover:bg-[var(--color-bg-on-ghost-box-ghost-box-hover)]",
              !disabled && "focus-visible:outline-ring",
              selected && !disabled && "bg-[var(--color-bg-on-ghost-box-ghost-box-hover)]",
              disabled && disabledStyle
            )}
            {...props}
          >
            <span ref={ref} className="truncate">
              {children}
            </span>
          </a>
        </TooltipTrigger>
        {showTooltip && <TooltipContent>{children}</TooltipContent>}
      </Tooltip>
    </div>
  )
}

function BreadcrumbSelect({
  children,
  selected,
  disabled,
  dropdownMenu,
  ...props
}: {
  children: string
  selected?: boolean
  disabled?: boolean
  dropdownMenu?: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    if (ref.current) {
      setShowTooltip(ref.current.scrollWidth > ref.current.clientWidth)
    }
  }, [children])

  return (
    <div className={cn("flex h-[20px] flex-row items-center", disabled && "cursor-not-allowed")} {...props}>
      <Tooltip {...props}>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex h-[20px] max-w-[110px] flex-row items-center rounded-xs px-[6px]",
                  "hover:cursor-pointer hover:bg-[var(--color-bg-on-ghost-box-ghost-box-hover)]",
                  selected && !disabled && "bg-[var(--color-bg-on-ghost-box-ghost-box-hover)]",
                  disabled && "pointer-events-none text-[var(--color-text-on-btn-ghost-on-ghost-disabled)]",
                  !disabled && "focus-visible:outline-ring"
                )}
              >
                <span ref={ref} className={cn("truncate pr-[5px]", disabled && disabledStyle)}>
                  {children}
                </span>
                {disabled ? <BreadcrumbSelectboxDisabledIcon /> : <BreadcrumbSelectboxIcon />}
              </button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          {dropdownMenu}
        </DropdownMenu>
        {showTooltip && !disabled && <TooltipContent>{children}</TooltipContent>}
      </Tooltip>
    </div>
  )
}
export { Breadcrumb, BreadcrumbElement, BreadcrumbText, BreadcrumbSelect }
