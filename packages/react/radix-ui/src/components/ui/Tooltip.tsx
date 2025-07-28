import React, { useContext } from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

import { TooltipAlign, TooltipPlace, TooltipSide } from "./types"

function TooltipProvider({ delayDuration = 0, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />
}

export type TooltipProps = React.ComponentProps<typeof TooltipPrimitive.Root> & {
  place?: TooltipPlace
}

function Tooltip({ place = "top", ...props }: TooltipProps) {
  return (
    <TooltipProvider>
      <TooltipPlaceContext.Provider value={place}>
        <TooltipPrimitive.Root data-slot="tooltip" {...props} />
      </TooltipPlaceContext.Provider>
    </TooltipProvider>
  )
}

function mapPlaceToSideAlign(place: TooltipPlace = "top"): {
  side?: TooltipSide
  align?: TooltipAlign
} {
  if (!place) return { side: "auto", align: "auto" }
  const [sidePart] = place.split("-")
  const side = sidePart as TooltipSide
  if (place.endsWith("-start")) return { side, align: "start" }
  if (place.endsWith("-end")) return { side, align: "end" }
  return { side, align: "center" }
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({ className, children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  const place = useContext(TooltipPlaceContext)
  const { side, align } = mapPlaceToSideAlign(place)

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        side={side === "auto" ? undefined : side}
        align={align === "auto" ? undefined : align}
        sideOffset={side === "top" ? -2 : side === "bottom" ? 4 : side === "left" ? 4 : side === "right" ? 4 : 0}
        alignOffset={side === "left" ? -8 : side === "right" ? -8 : 0}
        className={cn(
          // Color & elevation
          "bg-tooltip-bg text-tooltip-text shadow-sm",
          // Animation
          "animate-in fade-in-0 zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "!duration-100",
          /*
          "data-[side=top]:slide-in-from-top-2",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          */
          "data-[side=top]:data-[align=start]:[&>span:first-child]:left-[13px]!",
          "data-[side=bottom]:data-[align=start]:[&>span:first-child]:left-[13px]!",
          "data-[side=top]:data-[align=end]:[&>span:first-child]:left-[calc(100%-27px)]!",
          "data-[side=bottom]:data-[align=end]:[&>span:first-child]:left-[calc(100%-27px)]!",
          "data-[side=left]:data-[align=end]:[&>span:first-child]:ml-[13px]!",
          // Layout & shape
          "z-50 w-fit origin-(--radix-tooltip-content-transform-origin)",
          "rounded-[6px] px-4 py-[14px]",
          // Typography
          "text-xs text-balance",
          className
        )}
        {...props}
      >
        <TooltipPrimitive.Arrow asChild>
          <svg
            className="fill-tooltip-bg visible z-50 block h-[7px] w-[14px]"
            width="10"
            height="5"
            viewBox="0 0 30 10"
            preserveAspectRatio="none"
          >
            <polygon points="0,0 30,0 15,10"></polygon>
          </svg>
        </TooltipPrimitive.Arrow>
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

const TooltipPlaceContext = React.createContext<TooltipPlace | undefined>(undefined)

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
