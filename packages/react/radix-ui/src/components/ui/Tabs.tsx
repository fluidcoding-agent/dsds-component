import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import type { TabsVariantsConfig } from "./types"

const tabsVariantsConfig: TabsVariantsConfig = {
  variant: {
    default: "tab-underline",
    button: "tab-button",
  },
  size: {
    small: "[&>div>button]:typo-bold-small",
    medium: "[&>div>button]:typo-bold-medium",
  },
}

const tabsVariants = cva("flex flex-col gap-2", {
  variants: {
    ...tabsVariantsConfig,
  },
  defaultVariants: {
    variant: "default",
    size: "medium",
  },
  compoundVariants: [
    {
      variant: "default",
      size: "small",
      className: "tab-underline-small",
    },
    {
      variant: "default",
      size: "medium",
      className: "tab-underline-medium",
    },
    {
      variant: "button",
      size: "small",
      className: "tab-button-small",
    },
    {
      variant: "button",
      size: "medium",
      className: "tab-button-medium",
    },
  ],
})

type TabsVariantProps = VariantProps<typeof tabsVariants>
type TabsProps = TabsVariantProps &
  React.ComponentProps<typeof TabsPrimitive.Root> & {
    width?: number | string
  }

/**
 * TODO (Sprint 2) Tabs 컴포넌트 추가시 개발 필요 사항
 * - [ ] (난이도: 상) Overflow 스타일 적용 - 전체 탭이 차지하는 너비에 대한 동적 계산 필요.
 */
function Tabs({ variant = "default", size = "medium", className, width, ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn(tabsVariants({ variant, size }), className)}
      style={{ width }}
      {...props}
    />
  )
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn("relative inline-flex w-full items-center justify-start", className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, children, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn("relative inline-flex items-center", className)}
      {...props}
    >
      <div className="label">{children}</div>
      <div className="line"></div>
      {<u className="absolute bottom-[1px] h-[3px]"></u>}
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("flex-1 outline-none", className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
