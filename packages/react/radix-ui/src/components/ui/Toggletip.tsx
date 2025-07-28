import * as React from "react"
import * as ToggletipPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

import { PaginationContent, PaginationDot } from "./Pagination"

function Toggletip({ ...props }: React.ComponentProps<typeof ToggletipPrimitive.Root>) {
  return <ToggletipPrimitive.Root data-slot="toggletip" {...props} />
}

function ToggletipTrigger({ ...props }: React.ComponentProps<typeof ToggletipPrimitive.Trigger>) {
  return <ToggletipPrimitive.Trigger data-slot="toggletip-trigger" {...props} />
}

export type ToggletipFrameProps = React.ComponentProps<typeof ToggletipPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  size?: "small" | "medium"
}

function ToggletipFrame({ align, side, size, ...props }: ToggletipFrameProps) {
  return (
    <ToggletipPrimitive.Portal>
      <ToggletipPrimitive.Content
        data-slot="toggletip-content"
        align={align}
        sideOffset={4}
        side={side}
        className={cn(
          /* 레이아웃 및 모양 */
          "z-50 origin-(--radix-toggletip-content-transform-origin) rounded-[var(--radius-sm)] px-[16px] py-[12px] outline-hidden",
          /* 애니메이션 및 전환 */
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-100",
          // 반대편에서 나타나는 transition
          // "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          // "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          /* 배경 및 텍스트 색상 */
          "bg-[var(--colors-neutral-neutral-01)] text-[var(--colors-neutral-neutral-15)]",
          /* 그림자 */
          "shadow-lg",
          /* 크기 */
          size == "small" ? "w-[256px]" : "w-[320px]"
        )}
        {...props}
      ></ToggletipPrimitive.Content>
    </ToggletipPrimitive.Portal>
  )
}

function ToggletipPages({ pages, currentPage }: { pages: React.ReactNode[]; currentPage: number }) {
  return <div>{pages[currentPage - 1]}</div>
}

function ToggletipPage({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

function ToggletipTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("flex min-h-[20px] place-content-between items-center break-all")}>
      <div className="typo-sok-h6-14-700">{children}</div>
    </div>
  )
}

function ToggletipContent({ children }: { children: React.ReactNode }) {
  return <div className="typo-sok-body-14-400 mt-[4px] mb-[8px] break-all">{children}</div>
}

function ToggletipFooter({
  page,
  currentPage,
  children,
}: {
  page?: number
  currentPage?: number
  children?: React.ReactNode
}) {
  return (
    <div className="item flex h-[32px] items-center justify-between">
      <PaginationContent isDot={true}>
        {page &&
          page > 1 &&
          Array.from({ length: page }, (_, i) => i + 1).map((p) => (
            <PaginationDot key={p} page={p} isSelected={p === currentPage} />
          ))}
      </PaginationContent>
      <div className="flex flex-row gap-[8px]">{children}</div>
    </div>
  )
}

export {
  Toggletip,
  ToggletipTrigger,
  ToggletipFrame,
  ToggletipPages,
  ToggletipPage,
  ToggletipTitle,
  ToggletipContent,
  ToggletipFooter,
}
