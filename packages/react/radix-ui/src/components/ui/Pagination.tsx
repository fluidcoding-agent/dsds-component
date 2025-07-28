import * as React from "react"

import { cn } from "@/lib/utils"

import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "../icons"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

export type PaginationContentProps = React.ComponentProps<"ul"> & {
  isDot: boolean
}

function PaginationContent({ className, isDot, ...props }: PaginationContentProps) {
  return (
    <nav
      data-slot="pagination-content"
      className={cn(
        "flex flex-row items-center justify-center bg-[var(--colors-neutral-neutral-01)]",
        !isDot && "gap-xs",
        className
      )}
      {...props}
    />
  )
}

type PaginationNumberProps = {
  isSelected?: boolean
  page?: number
} & React.ComponentProps<"a"> & { chevron?: "left" | "right" | "first" | "last" }

function PaginationNumber({ className, isSelected, page, chevron, ...props }: PaginationNumberProps) {
  return (
    <a
      aria-current={isSelected ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isSelected}
      className={cn(
        "typo-button-label-medium flex h-[24px] w-[24px] items-center justify-center rounded-xs text-[var(--color-text-on-btn-ghost-on-ghost-default)] tabular-nums",
        // Page가 두자리 수 이상일 때 너비 조정
        page && page.toString().length > 1 && "w-[32px]",
        // 시각적 보정
        page && page.toString().length == 1 && "pl-[1.5px]",
        // Selected
        isSelected && "text-brand bg-[var(--color-bg-on-ghost-button-ghostbtn-activated)]",
        // Hover
        "not-[:disabled]:hover:bg-[var(--color-bg-on-ghost-button-ghostbtn-hover)]",
        // Focus
        "not-[:disabled]:focus-visible:outline-ring-0 not-[:disabled]:focus-visible:text-brand not-[:disabled]:focus-visible:bg-[var(--color-bg-on-ghost-button-ghostbtn-hover)]",
        // Disabled
        "disabled:cursor-not-allowed disabled:text-[var(--color-text-on-btn-ghost-on-ghost-disabled)]",
        chevron && chevron == "left" && "mr-[5.5px]",
        chevron && chevron == "right" && "ml-[5.5px]",
        className
      )}
      {...props}
    >
      {page}
      {chevron && chevron == "first" && <ChevronsLeftIcon />}
      {chevron && chevron == "last" && <ChevronsRightIcon />}
      {chevron && chevron == "left" && <ChevronLeftIcon />}
      {chevron && chevron == "right" && <ChevronRightIcon />}
    </a>
  )
}

function PaginationDot({ className, isSelected, ...props }: PaginationNumberProps) {
  return (
    <div className="flex h-[16px] w-[16px] items-center justify-center">
      <a
        aria-current={isSelected ? "page" : undefined}
        data-slot="pagination-link"
        data-active={isSelected}
        className={cn(
          "flex h-[8px] w-[8px] items-center justify-center rounded-full bg-[var(--colors-neutral-neutral-08)]",
          // Selected
          isSelected && "text-brand bg-brand",
          // Hover
          !isSelected && "not-[:disabled]:hover:border not-[:disabled]:hover:border-[var(--colors-neutral-neutral-11)]",
          // Focus
          "not-[:disabled]:focus-visible:outline-ring not-[:disabled]:focus-visible:bg-[var(--colors-neutral-neutral-08)]",
          // Disabled
          "disabled:cursor-not-allowed disabled:text-[var(--color-text-on-btn-ghost-on-ghost-disabled)]",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Pagination, PaginationContent, PaginationNumber, PaginationDot }
