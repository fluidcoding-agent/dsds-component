import { useRef, useState } from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Selectbox,
  type TextboxWrapperVariantProps,
} from "@/components/ui"

import { Popover, PopoverContent, PopoverTrigger } from "./_components/Popover"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export type ComboboxTemplateProps = {
  /** Show dropdown open by default */
  defaultOpen?: boolean
  /** Width of the select box */
  width?: number
  align?: "start" | "center" | "end"
} & Pick<TextboxWrapperVariantProps, "size" | "variant">

export function ComboboxTemplate({
  defaultOpen = false,
  width = 180,
  size = "large",
  align = "start",
  variant = "default",
}: ComboboxTemplateProps) {
  const selectRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(defaultOpen)
  const [value, setValue] = useState("")
  const selectedValue = value ? frameworks.find((framework) => framework.value === value)?.label : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Selectbox
          ref={selectRef}
          role="combobox"
          aria-expanded={open}
          selected={selectedValue ? true : false}
          value={selectedValue}
          size={size}
          variant={variant}
          placeholder="Select a framework…"
          wrapperClassName={cn(open && "focused")}
          width={width}
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-[200px] p-0"
        align={align}
        onCloseAutoFocus={(e) => {
          e.preventDefault()
          selectRef.current?.focus()
        }}
      >
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {framework.label}
                  <Check className={cn("ml-auto", value === framework.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
