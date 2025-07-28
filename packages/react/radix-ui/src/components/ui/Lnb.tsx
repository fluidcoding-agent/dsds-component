import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import * as LnbPrimitive from "@radix-ui/react-accordion"

import { cn } from "@/lib/utils"

import { LnbBulletIcon, LnbChevronUpIcon, LnbTriangleLeftIcon, LnbTriangleRightIcon } from "../icons/LnbIcon"

// LNB 관련 모든 타입 정의
export type LNBItemType = "accordion" | "tree" | "item"

export interface BaseLNBItem {
  type?: string
  id: string
  content: string
  disabled?: boolean
  depth?: number
}

export interface LNBAccordionItem extends BaseLNBItem {
  items?: LNBTreeItem[] | LNBContentItem[]
}

export interface LNBTreeItem extends BaseLNBItem {
  items: LNBTreeItem[] | LNBContentItem[]
}

export interface LNBContentItem extends BaseLNBItem {
  selected?: boolean
  items?: never | undefined
  id: string
}

export interface LNBContainerItem {
  type: string
  icon?: React.ReactNode
  title: string | React.ReactNode
  items: LNBAccordionItem[]
}

export interface LNBInputItem {
  icon?: React.ReactNode
  title: string | React.ReactNode
  items: LNBAccordionItem[]
}

type LNBItem = LNBAccordionItem | LNBTreeItem | LNBContentItem

const MIN_WIDTH = 200
const MAX_WIDTH = 240

function findSelectedItemPaths(items: LNBItem[]): string[] {
  const selectedPaths: string[] = []

  function traverse(items: LNBItem[], currentPath: string[] = []): void {
    items.forEach((item, index) => {
      const itemPath = [...currentPath, item.id || `${index}`]
      function isLNBContentItem(item: LNBItem): item is LNBContentItem {
        return item.type === "item"
      }
      // 선택된 항목을 찾은 경우
      if (isLNBContentItem(item) && item.selected) {
        // 루트부터 선택된 항목의 부모까지 각 id를 개별적으로 추가
        for (let i = 0; i < itemPath.length - 1; i++) {
          const parentId = itemPath[i]
          if (!selectedPaths.includes(parentId)) {
            selectedPaths.push(parentId)
          }
        }
      }

      // 하위 아이템이 있는 경우 재귀 호출
      if (item.items && item.items.length > 0) {
        traverse(item.items, itemPath)
      }
    })
  }

  traverse(items)
  return selectedPaths
}

function addTypeAndDepthToHierarchy(
  items: LNBItem[],
  currentDepth: number = 0,
  withoutAccordion: boolean = false
): LNBAccordionItem[] | LNBTreeItem[] {
  return items.map((item, index) =>
    addTypeAndDepthToNode(item, currentDepth, index === 0 && currentDepth === 0, withoutAccordion)
  )
}

function addTypeAndDepthToNode(
  item: LNBItem,
  depth: number,
  isRoot: boolean = false,
  withoutAccordion: boolean = false
): LNBAccordionItem | LNBTreeItem | LNBContentItem {
  const hasChildren = item.items

  let type: "accordion" | "tree" | "item"

  if (!hasChildren) {
    type = "item" // 말단 노드
  } else if (isRoot || depth === 0) {
    if (withoutAccordion) {
      type = "tree"
    } else {
      type = "accordion"
    }
  } else {
    type = "tree" // 중간 노드
  }

  // 타입 가드 함수
  function hasSelected(item: LNBItem): item is LNBContentItem {
    return "selected" in item
  }

  // 말단 노드 처리
  if (type === "item") {
    return {
      type: "item",
      content: item.content,
      depth: depth,
      id: item.id,
      disabled: item.disabled || false,
      selected: hasSelected(item) ? item.selected || false : false,
    } as LNBContentItem
  }

  // 부모 노드 처리 (accordion 또는 tree)
  const childItems = hasChildren ? addTypeAndDepthToHierarchy(item.items!, depth + 1, withoutAccordion) : []

  const baseResult = {
    content: item.content,
    depth: depth,
    disabled: item.disabled || false,
    items: childItems,
    id: item.id,
  }

  if (type === "accordion") {
    return {
      ...baseResult,
      type: "accordion" as const,
    } as LNBAccordionItem
  }

  // tree 타입
  return {
    ...baseResult,
    type: "tree" as const,
  } as LNBTreeItem
}

// function getMaxDepthFromInput(item: LNBItem, currentDepth: number = 0): number {
//   if (!item.items || item.items.length === 0) {
//     return currentDepth
//   }

//   let maxDepth = currentDepth
//   for (const child of item.items) {
//     maxDepth = Math.max(maxDepth, getMaxDepthFromInput(child, currentDepth + 1))
//   }

//   return maxDepth
// }

function getMaxDepth(items: LNBItem[]): number {
  if (!items || items.length === 0) {
    return 0
  }

  let maxDepth = 1

  for (const item of items) {
    if (item.items && item.items.length > 0) {
      const childDepth = 1 + getMaxDepth(item.items)
      maxDepth = Math.max(maxDepth, childDepth)
    }
  }
  return maxDepth
}

interface TreeContextType {
  maxDepth: number | null
  setMaxDepth: (value: number | null) => void
  selectedItemId: string | null
  setSelectedItemId: (value: string | null) => void
  openPath: string[] | undefined
  setOpenPath: (value: string[]) => void
  onlyTree: boolean | undefined
}

const TreeContext = createContext<TreeContextType | undefined>(undefined)

const useTreeContext = () => {
  const context = useContext(TreeContext)
  if (!context) {
    // Provider 외부에서 사용하면 에러를 발생시켜 실수를 방지합니다.
    throw new Error("useTreeContext는 Tree 컴포넌트 내부에서만 사용할 수 있습니다.")
  }
  return context
}

function Lnb({
  data,
  className,
  onValueChange,
  hide = false,
  withoutAccordion = false,
  ...props
}: React.ComponentProps<"div"> & {
  data: LNBInputItem
  onValueChange?: (value: string) => void
  hide?: boolean
  withoutAccordion?: boolean
}) {
  const [width, setWidth] = useState(MIN_WIDTH)
  const [isDragging, setIsDragging] = useState(false)
  const resizing = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(width)

  const itemsWithTypeAndDepth = addTypeAndDepthToHierarchy(data.items, 0, withoutAccordion)
  // console.log(JSON.stringify(itemsWithTypeAndDepth))

  const [maxDepth, setMaxDepth] = useState<number | null>(0)
  const [selectedItemId, setSelectedItemId] = useState<string | null>("")
  const onlyTree = withoutAccordion

  useEffect(() => {
    if (selectedItemId && onValueChange) {
      onValueChange(selectedItemId)
    }
  }, [onValueChange, selectedItemId])

  useEffect(() => {
    setMaxDepth(getMaxDepth(itemsWithTypeAndDepth))
  }, [setMaxDepth, itemsWithTypeAndDepth])
  const handleMouseDown = (e: { clientX: number }) => {
    resizing.current = true
    setIsDragging(true)
    startX.current = e.clientX
    startWidth.current = width
    document.body.style.cursor = "ew-resize"
    document.body.style.userSelect = "none"
  }
  const defaultExpandedValues = useMemo(() => {
    return findSelectedItemPaths(itemsWithTypeAndDepth)
  }, [itemsWithTypeAndDepth])

  const [openPath, setOpenPath] = useState<string[]>(defaultExpandedValues)
  const handleMouseMove = (e: { preventDefault: () => void; clientX: number }) => {
    if (resizing.current) {
      e.preventDefault()
      const delta = e.clientX - startX.current
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta))
      setWidth(newWidth)
    }
  }

  const handleMouseUp = () => {
    resizing.current = false
    setIsDragging(false)
    document.body.style.cursor = "default"
    document.body.style.userSelect = ""
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  })
  const [lnbHide, setLnbHide] = useState(hide)
  const temp = () => {
    setLnbHide(!lnbHide)
  }
  if (!lnbHide)
    return (
      <TreeContext.Provider
        value={{ maxDepth, setMaxDepth, selectedItemId, setSelectedItemId, openPath, setOpenPath, onlyTree }}
      >
        <div className={cn("flex h-screen flex-row", className)}>
          <div
            data-slot="accordion"
            className="text-neutral-2nd flex max-w-[240px] min-w-[200px] flex-col bg-[var(--colors-neutral-neutral-05)]"
            style={{ width }}
            {...props}
          >
            {/* Header */}
            <div className="flex flex-row items-center justify-between">
              <div className="typo-sok-h6-14-700 flex items-center pr-[12px] pl-[10px]">
                {data.icon && (
                  <div className="pr-[10px]">
                    <div className="p-[1px]">{data.icon}</div>
                  </div>
                )}
                {data.title}
              </div>
              <div
                onClick={temp}
                className="flex h-[40px] w-[20px] items-center justify-center border-l border-[var(--color-border-btn-2ndary-border-default)] hover:bg-[var(--color-bg-surface-secondary)]"
              >
                <LnbTriangleLeftIcon className="flex w-[20px] items-center justify-center" />
              </div>
            </div>
            <div className="h-[1px] shrink-0 bg-[var(--color-border-btn-2ndary-border-default)]" />
            {itemsWithTypeAndDepth[0] && itemsWithTypeAndDepth[0].type == "accordion" && (
              <Accordion type="multiple">
                <AccordionItem data={itemsWithTypeAndDepth as LNBAccordionItem[]} />
              </Accordion>
            )}
            {itemsWithTypeAndDepth[0] && itemsWithTypeAndDepth[0].type == "tree" && (
              <Tree type="multiple">
                <TreeItem data={itemsWithTypeAndDepth as LNBTreeItem[]} />
              </Tree>
            )}
            {itemsWithTypeAndDepth[0] && itemsWithTypeAndDepth[0].type == "item" && (
              <ItemContent data={itemsWithTypeAndDepth as LNBContentItem[]} />
            )}
          </div>
          {/* Resizing Border */}
          <div
            className={`w-[1px] cursor-ew-resize hover:bg-[var(--color-border-selected-populated)] ${
              isDragging
                ? "bg-[var(--color-border-selected-populated)]"
                : "bg-[var(--color-border-btn-2ndary-border-default)]"
            }`}
            onMouseDown={handleMouseDown}
          />
        </div>
      </TreeContext.Provider>
    )
  else {
    return (
      <div>
        <div
          onClick={temp}
          className="absolute flex h-[40px] w-[14px] items-center justify-center border-r border-b border-[var(--color-border-btn-2ndary-border-default)] bg-[var(--colors-neutral-neutral-05)] hover:bg-[var(--color-bg-surface-secondary)]"
        >
          <LnbTriangleRightIcon className="flex w-[14px] items-center justify-center" />
        </div>
        <div className="flex h-screen flex-row">
          <div className={"w-[3px] bg-[var(--colors-neutral-neutral-05)] transition-colors duration-200"} />
          <div
            className={`w-[1px] bg-[var(--color-border-btn-2ndary-border-default)] transition-colors duration-200 hover:bg-[var(--color-border-selected-populated)]`}
          />
        </div>
      </div>
    )
  }
}

function Accordion({ children }: React.ComponentProps<typeof LnbPrimitive.Root>) {
  const { openPath } = useTreeContext()

  return (
    <LnbPrimitive.Root
      type="multiple"
      defaultValue={openPath}
      data-slot="accordion"
      className="text-neutral-2nd bg-[var(--colors-neutral-neutral-05)]"
    >
      {children}
    </LnbPrimitive.Root>
  )
}

function AccordionItem({ data }: { data: LNBAccordionItem[] }) {
  return data.map((item, index) => (
    <LnbPrimitive.Item key={index} data-slot="accordion-item" value={item.id}>
      <LnbPrimitive.Header className="flex h-[33px] flex-col">
        <LnbPrimitive.Trigger
          data-slot="accordion-trigger"
          className={cn(
            "typo-sok-h7-12-700 text-neutral-2nd flex h-[32px] flex-1 items-center justify-between pr-[7px] pl-[12px] text-left [&[data-state=closed]_svg]:rotate-180",
            item.disabled &&
              "text-color-text-lnb-disabled pointer-events-none [&_svg]:stroke-[var(--color-text-text-disabled-optional)]",
            "focus-visible:outline-ring-inner"
          )}
        >
          <span className="truncate">{item.content}</span>

          <LnbChevronUpIcon className={cn("pointer-events-none [&_svg]:stroke-[var(--color-icon-default-1st)]")} />
        </LnbPrimitive.Trigger>
      </LnbPrimitive.Header>
      <div className="h-[1px] w-full bg-[var(--color-border-btn-2ndary-border-default)]" />

      <LnbPrimitive.Content
        className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden"
        key={index}
        data-slot="accordion-content"
      >
        {item.items &&
          (item.items[0] && item.items[0].type === "tree" ? (
            <Tree type="multiple">
              <TreeItem data={item.items as LNBTreeItem[]} />
            </Tree>
          ) : (
            <ItemContent data={item.items as LNBContentItem[]} />
          ))}
        {item.items?.length != 0 && (
          <div className="h-[1px] w-full bg-[var(--color-border-btn-2ndary-border-default)]" />
        )}
      </LnbPrimitive.Content>
    </LnbPrimitive.Item>
  ))
}

function Tree({ children }: React.ComponentProps<typeof LnbPrimitive.Root>) {
  const { openPath } = useTreeContext()

  return (
    <LnbPrimitive.Root type="multiple" defaultValue={openPath} data-slot="accordion" className="w-full">
      {children}
    </LnbPrimitive.Root>
  )
}

function TreeItem({ data }: { data: LNBTreeItem[] }) {
  const { onlyTree } = useTreeContext()
  return data.map((item, index) => (
    <LnbPrimitive.Item key={index} data-slot="accordion-item" value={item.id}>
      {index != 0 && (
        <div className={cn(!onlyTree && "mx-[12px]", "h-[1px] bg-[var(--color-border-btn-2ndary-border-default)]")} />
      )}
      <LnbPrimitive.Header>
        <LnbPrimitive.Trigger
          data-slot="accordion-trigger"
          style={{
            paddingLeft: `${item.depth == 0 ? 8 : 8 + (onlyTree ? 16 : 0) + ((item.depth ? item.depth : 1) - 1) * 16}px`,
          }}
          className={cn(
            "text-neutral-2nd flex h-[32px] w-full items-center pr-[7px] text-left [&_svg]:rotate-90 [&[data-state=open]_svg]:rotate-180",
            item.depth && item.depth !== 1
              ? "typo-sok-caption-12-400 text-[var(--colors-neutral-neutral-17)]"
              : "typo-sok-h7-12-700",
            item.disabled &&
              "text-color-text-lnb-disabled pointer-events-none [&_svg]:stroke-[var(--color-text-text-disabled-optional)]",
            "focus-visible:outline-ring-inner"
          )}
        >
          <LnbChevronUpIcon className="pointer-events-none pr-[3px]" />
          <span className="truncate">{item.content}</span>
        </LnbPrimitive.Trigger>
      </LnbPrimitive.Header>
      {item.items.length !== 0 && (
        <LnbPrimitive.Content
          className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden"
          key={index}
          data-slot="accordion-content"
        >
          {item.items &&
            (item.items[0] && item.items[0].type === "tree" ? (
              <Tree type="multiple">
                <TreeItem data={item.items as LNBTreeItem[]} />
              </Tree>
            ) : (
              <ItemContent data={item.items as LNBContentItem[]} />
            ))}
        </LnbPrimitive.Content>
      )}
    </LnbPrimitive.Item>
  ))
}

function ItemContent({
  data,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { data: LNBContentItem[] }) {
  const { maxDepth, selectedItemId, setSelectedItemId, onlyTree } = useTreeContext()
  data.map((item) => {
    if (item.selected && selectedItemId == "") {
      setSelectedItemId(item.id)
    } else if (item.selected && item.id !== selectedItemId) {
      item.selected = false
    }
  })

  return data.map((item, index) => (
    <button
      key={index}
      onClick={() => setSelectedItemId(item.id)}
      tabIndex={0}
      // TODO: Style 안 보이는 문제 해결
      style={{
        paddingLeft: `${item.depth == 0 ? 8 : 8 + (onlyTree ? 16 : 0) + ((item.depth ? Math.max(item.depth, 2) : 1) - 1) * 16 - (item.type == "item" ? 16 : 0)}px`,
      }}
      className={cn(
        "typo-sok-caption-12-400 focus-visible:outline-ring-inner relative flex h-[26px] w-full items-center pr-[20px] hover:bg-[var(--colors-neutral-neutral-03)] focus-visible:bg-[var(--color-bg-surface-secondary)]",
        (selectedItemId == item.id || item.selected) &&
          "bg-background typo-sok-h7-12-700 text-[var(--color-text-on-button-on-brand-selected)]",
        item.disabled &&
          "pointer-events-none text-[var(--color-text-text-disabled-optional)] [&_svg]:stroke-[var(--color-text-text-disabled-optional)]",
        className
      )}
    >
      {!item.disabled && (selectedItemId == item.id || item.selected) && (
        <div className="absolute left-0 h-[26px] w-[3px] bg-[var(--color-bg-on-button-brand-default)]" />
      )}{" "}
      {maxDepth && maxDepth > 3 ? (
        <div className="flex w-[14px] flex-shrink-0 justify-center">
          <LnbBulletIcon className="flex w-[14px] justify-center" />
        </div>
      ) : (
        <div className="flex h-full w-[14px] flex-shrink-0" />
      )}
      <span className={cn("ml-[3px] w-fit truncate", className)} {...props}>
        {item.content}
      </span>
    </button>
  ))
}

// const renderItem = (item: LNBItem, index: number) => {
//   switch (item.type as LNBItemType) {
//     case "accordion":
//       return <Accordion key={index} type="multiple" data={item as LNBAccordionItem} />
//     case "tree":
//       return <Tree key={index} type="multiple" data={item as LNBTreeItem} />
//     case "item":
//       return <ItemContent key={index} data={item as LNBContentItem} />
//     default:
//     // console.log(JSON.stringify(item))
//   }
// }

// const LnbRoot = ({ data }: { data: LNBInputItem }) => {
//   return <Lnb data={data} />
// }

// const LnbRoot = ({ data }: { data: LNBInputItem }) => {
//   return <Lnb data={data} />
// }

export { Lnb }
