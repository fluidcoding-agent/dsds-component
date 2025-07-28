import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { BadgeNewIcon } from "@/components/icons"

function BadgeNotificationNew({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap",
        "typo-sok-footnote-11-400 h-[12px] min-w-[12px] rounded-[1px] border px-[1px] font-mono tabular-nums",
        "border-[var(--colors-oxygen-red-o-red-09)] bg-[var(--colors-oxygen-red-o-red-10)] text-[var(--colors-neutral-neutral-01)]",
        className
      )}
      {...props}
    >
      <BadgeNewIcon />
    </Comp>
  )
}

function BadgeNotificationCount({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(
        "flex items-center justify-center",
        "typo-sok-footnote-11-400 h-[12px] min-w-[12px] rounded-full border font-mono leading-none",
        "border-[#f73529] bg-[#e82c1f] text-[var(--colors-neutral-neutral-01)]",
        // 숫자의 자릿수에 따른 중앙 정렬을 위한 시각적 보정
        props.children?.toString().length == 1 ? "pl-[1px]" : "pr-[0.5px] pl-[1px]",
        className
      )}
      {...props}
    />
  )
}

function BadgeText({
  className,
  asChild = false,
  color,
  ...props
}: React.ComponentProps<"span"> & { asChild?: boolean; color?: string }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(
        "typo-sok-footnote-11-400 flex h-[16px] min-w-[20px] justify-center bg-[var(--colors-neutral-neutral-15)] px-[4px] py-[2px] font-mono text-[var(--colors-neutral-neutral-01)] tabular-nums",
        className,
        color == "default" && "bg-[var(--colors-neutral-neutral-15)]",
        color == "blue" && "bg-[var(--colors-wafer-blue-wafer-blue-09)]"
      )}
      {...props}
    />
  )
}

export { BadgeNotificationNew, BadgeNotificationCount, BadgeText }
