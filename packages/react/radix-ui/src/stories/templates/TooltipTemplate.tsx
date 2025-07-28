import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import {
  Button,
  showOnlyPlaces,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type TooltipAlign,
  type TooltipPlace,
  type TooltipProps,
  type TooltipSide,
} from "@/components/ui"

export type TooltipTemplateProps = {
  /** 시작시 툴팁 바로 표시 */
  defaultOpen?: boolean
  content?: ReactNode
  showOnly?: TooltipPlace[]
  className?: string
  rowClassName?: string
  tooltipClassName?: string
  defaultSide?: TooltipSide
  defaultAlign?: TooltipAlign
}

export type { TooltipPlace } from "@/components/ui"

const TooltipContentSample = () => (
  <div className="flex flex-col gap-1">
    <p className="font-bold">Tooltip Title</p>
    <p>TooltipBody</p>
  </div>
)

export function TooltipTemplate({
  showOnly,
  className,
  rowClassName,
  tooltipClassName,
  ...props
}: TooltipTemplateProps) {
  const tooltipProps = {
    ...props,
    className: tooltipClassName,
  }

  const showOnlySet = showOnly
    ? new Set(showOnly)
    : showOnlyPlaces.reduce((acc, place) => acc.add(place), new Set<TooltipPlace>())

  return (
    <div className={cn("flex h-full w-full flex-col items-start justify-between py-20", className)}>
      {(["top-start", "top", "top-end"] as TooltipPlace[]).some((it) => showOnlySet.has(it)) && (
        <div className={cn("flex w-full items-start justify-between px-64", rowClassName)}>
          {showOnlySet.has("top-start") && <TooltipButton {...tooltipProps} place="top-start" />}
          {showOnlySet.has("top") && <TooltipButton {...tooltipProps} place="top" />}
          {showOnlySet.has("top-end") && <TooltipButton {...tooltipProps} place="top-end" />}
        </div>
      )}
      {(["left-start", "auto-start", "right-start"] as TooltipPlace[]).some((it) => showOnlySet.has(it)) && (
        <div className={cn("flex w-full items-start justify-between px-40", rowClassName)}>
          {showOnlySet.has("left-start") && (
            <TooltipButton {...tooltipProps} place="left-start" tooltipContent={<TooltipContentSample />} />
          )}
          {showOnlySet.has("auto-start") && (
            <TooltipButton {...tooltipProps} place="auto-start" tooltipContent={<TooltipContentSample />} />
          )}
          {showOnlySet.has("right-start") && (
            <TooltipButton {...tooltipProps} place="right-start" tooltipContent={<TooltipContentSample />} />
          )}
        </div>
      )}
      {(["left", "auto", "right"] as TooltipPlace[]).some((it) => showOnlySet.has(it)) && (
        <div className={cn("flex w-full items-start justify-between px-40", rowClassName)}>
          {showOnlySet.has("left") && (
            <TooltipButton {...tooltipProps} place="left" tooltipContent={<TooltipContentSample />} />
          )}
          {showOnlySet.has("auto") && (
            <TooltipButton {...tooltipProps} place="auto" tooltipContent={<TooltipContentSample />} />
          )}
          {showOnlySet.has("right") && (
            <TooltipButton {...tooltipProps} place="right" tooltipContent={<TooltipContentSample />} />
          )}
        </div>
      )}
      {(["left-end", "auto-end", "right-end"] as TooltipPlace[]).some((it) => showOnlySet.has(it)) && (
        <div className={cn("flex w-full items-start justify-between px-40", rowClassName)}>
          {showOnlySet.has("left-end") && (
            <TooltipButton {...tooltipProps} place="left-end" tooltipContent={<TooltipContentSample />} />
          )}
          {showOnlySet.has("auto-end") && (
            <TooltipButton {...tooltipProps} place="auto-end" tooltipContent={<TooltipContentSample />} />
          )}
          {showOnlySet.has("right-end") && (
            <TooltipButton {...tooltipProps} place="right-end" tooltipContent={<TooltipContentSample />} />
          )}
        </div>
      )}
      {(["bottom-start", "bottom", "bottom-end"] as TooltipPlace[]).some((it) => showOnlySet.has(it)) && (
        <div className={cn("flex w-full items-start justify-between px-64", rowClassName)}>
          {showOnlySet.has("bottom-start") && <TooltipButton {...tooltipProps} place="bottom-start" />}
          {showOnlySet.has("bottom") && <TooltipButton {...tooltipProps} place="bottom" />}
          {showOnlySet.has("bottom-end") && <TooltipButton {...tooltipProps} place="bottom-end" />}
        </div>
      )}
    </div>
  )
}

type TooltipButtonProps = TooltipTemplateProps &
  Pick<TooltipProps, "place"> & {
    tooltipContent?: React.ReactNode
    className?: string
    defaultSide?: TooltipSide
    defaultAlign?: TooltipAlign
  }

export function TooltipButton({
  className,
  content,
  tooltipContent = <span className="font-bold">Tooltip</span>,
  ...props
}: TooltipButtonProps) {
  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild>
        <Button size="small" variant="secondary" className={cn("min-w-20", className)}>
          {content || props.place}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  )
}
