import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "@/lib/utils"

import { CheckedOnIcon } from "../icons/CheckIcons"

// TODO: Checkbox Intermediate State 구현

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Layout & shape
        "size-4 shrink-0 rounded-xs",
        // Base colors
        "border-check-off-default bg-check-off-bg-default border",
        "not-[:disabled]:hover:border-check-off-hover not-[:disabled]:hover:bg-check-off-bg-hover",
        // Checked state
        "data-[state=checked]:bg-brand data-[state=checked]:border-brand",
        "not-[:disabled]:hover:data-[state=checked]:bg-brand-hover not-[:disabled]:hover:data-[state=checked]:border-brand-hover",
        // Focus & ring
        "focus-visible:outline-ring focus-visible:border-check-off-hover focus-visible:bg-check-off-bg-hover",
        "focus-visible:data-[state=checked]:bg-brand-hover focus-visible:data-[state=checked]:border-brand-hover",
        // Validation
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        // Disabled
        "disabled:cursor-not-allowed",
        "h-[14px] w-[14px]",
        props.disabled && "bg-check-off-bg-disable",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckedOnIcon
          className={cn("[&>svg>path]:stroke-icon-path-default", props.disabled && "[&>svg>path]:opacity-35")}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
