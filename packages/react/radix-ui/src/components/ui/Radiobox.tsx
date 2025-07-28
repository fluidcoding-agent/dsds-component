import * as RadioboxPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

export type RadioboxProps = React.ComponentProps<typeof RadioboxPrimitive.Root> & {
  orientation?: "horizontal" | "vertical"
}

export function Radiobox({ className, orientation = "vertical", ...props }: RadioboxProps) {
  return (
    <RadioboxPrimitive.Root
      data-slot="radio-group"
      className={cn(orientation === "horizontal" ? "flex items-center gap-1" : "grid gap-1", className)}
      {...props}
    />
  )
}

export type RadioboxItemProps = React.ComponentProps<typeof RadioboxPrimitive.Item>

export function RadioboxItem({ className, ...props }: RadioboxItemProps) {
  return (
    <RadioboxPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // Layout & shape
        "size-4 shrink-0 rounded-full",
        // Base colors
        "border-check-off-default bg-check-off-bg-default",
        "not-[:disabled,:focus-visible]:data-[state=unchecked]:hover:border-check-off-hover not-[:disabled]:data-[state=unchecked]:hover:bg-check-off-bg-hover disabled:bg-[var(--colors-neutral-neutral-06)]",
        // Checked state
        "data-[state=checked]:bg-brand data-[state=checked]:border-brand",
        "not-[:disabled]:hover:data-[state=checked]:bg-brand-hover not-[:disabled]:hover:data-[state=checked]:border-brand-hover",
        // Focus & ring
        "focus-visible:outline-ring focus-visible:border-check-off-hover focus-visible:bg-check-off-bg-hover",
        "focus-visible:data-[state=checked]:border-brand-hover focus-visible:data-[state=checked]:bg-brand-hover",
        // Validation
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        // Disabled
        "disabled:cursor-not-allowed",
        "h-[14px] w-[14px]",
        className
      )}
      {...props}
    >
      <RadioboxPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <div className={cn("h-[6px] w-[6px] rounded-full bg-white", props.disabled && "opacity-50")} />
      </RadioboxPrimitive.Indicator>
    </RadioboxPrimitive.Item>
  )
}
