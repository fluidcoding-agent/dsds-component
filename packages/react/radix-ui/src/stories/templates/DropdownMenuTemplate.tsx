"use client"

import { useRef, useState } from "react"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Selectbox,
  type TextboxWrapperVariantProps,
} from "@/components/ui"

export type DropdownMenuTemplateProps = {
  /** Show dropdown open by default */
  menuItems: string[]
  defaultOpen?: boolean
  /** Width of the select box */
  width?: number
  highlightSelected?: boolean
} & Pick<TextboxWrapperVariantProps, "size" | "variant">

export function DropdownMenuTemplate({
  defaultOpen = false,
  width = 120,
  size = "large",
  variant = "default",
  highlightSelected = false,
  menuItems,
}: DropdownMenuTemplateProps) {
  const [selectedValue, setSelectedValue] = useState("")
  const [open, setOpen] = useState(defaultOpen)
  const selectRef = useRef<HTMLButtonElement>(null)

  const handleItemClick = (value: string) => {
    setSelectedValue(value)
    setOpen(false) // Optionally close after selection
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <Selectbox
          placeholder="Select"
          value={selectedValue}
          width={width}
          size={size}
          variant={variant}
          selected={selectedValue ? true : false}
          highlightSelected={highlightSelected}
          ref={selectRef}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onCloseAutoFocus={(e) => {
          e.preventDefault()
          selectRef.current?.focus()
        }}
      >
        {menuItems.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onSelect={() => handleItemClick(item)}
            className={cn(item === selectedValue && "text-brand")}
          >
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
