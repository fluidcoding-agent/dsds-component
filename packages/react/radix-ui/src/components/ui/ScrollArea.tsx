import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

/**
 * ScrollArea 컴포넌트는 커스텀 스크롤바를 제공하는 스크롤 가능한 영역입니다.
 *
 * ### 주요 특징
 * - **플로팅 스크롤바**: 네이티브 스크롤바와 달리 콘텐츠 영역을 차지하지 않고 overlay 형태로 표시됩니다.
 * - **크로스 플랫폼**: 모든 브라우저와 OS에서 일관된 스크롤바 스타일을 제공합니다.
 * - **접근성**: 키보드 네비게이션과 스크린 리더를 완벽 지원합니다.
 * - **커스터마이징**: 디자인 토큰을 통한 스타일 커스터마이징이 가능합니다.
 * - **양방향 지원**: 수직 및 수평 스크롤바를 모두 지원합니다.
 *
 * ### 사용법
 * ```tsx
 * <ScrollArea className="h-[200px] w-[350px]">
 *   <div className="p-4">
 *     // 스크롤할 긴 콘텐츠
 *   </div>
 * </ScrollArea>
 * ```
 *
 * ### Horizontal Scroll
 * ```tsx
 * <ScrollArea className="w-[300px]">
 *   <div className="w-[600px] p-4">
 *     // 가로로 긴 콘텐츠
 *   </div>
 * </ScrollArea>
 * ```
 *
 * @param className - 추가 CSS 클래스
 * @param children - 스크롤할 콘텐츠
 */
const ScrollArea = ({ className, children, ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) => {
  return (
    <ScrollAreaPrimitive.Root data-slot="scroll-area" className={cn("relative", className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:outline-ring size-full rounded-[inherit] transition-[color,box-shadow] outline-none"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollBar orientation="horizontal" />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

ScrollArea.displayName = "ScrollArea"

/**
 * ScrollBar 컴포넌트는 ScrollArea 내부에서 사용되는 커스텀 스크롤바입니다.
 *
 * @param className - 추가 CSS 클래스
 * @param orientation - 스크롤바 방향 ("vertical" | "horizontal")
 */
const ScrollBar = ({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) => {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-[1px] transition-colors select-none",
        orientation === "vertical" && "h-full w-[10px] border-l border-l-transparent",
        orientation === "horizontal" && "h-[10px] flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-scrollbar hover:bg-scrollbar-hover relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }
