import * as TogglePrimitive from "@radix-ui/react-switch"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export function ToggleCheckIcon() {
  return (
    <div className="icon [&>svg]:stroke-toggle-thumb-stroke size-[12px]">
      <svg fill="none">
        <path d="M2 5L5 8L10 3" strokeWidth="1.7" />
      </svg>
    </div>
  )
}

const toggleVariants = cva(
  cn(
    "inline-flex items-center shrink-0 rounded-full",
    "focus-visible:outline-ring outline-ring-none outline-offset-2",
    // Remove transition-all to avoid animating non-transform properties
    "disabled:cursor-not-allowed"
  ),
  {
    variants: {
      size: {
        large: "h-[24px] w-[40px]",
        medium: "h-[20px] w-[32px]",
        small: "h-[16px] w-[28px]",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
)
const toggleThumbVariants = cva(
  "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-[3px]",
  {
    variants: {
      size: {
        large: "data-[state=checked]:size-[20px] data-[state=unchecked]:size-[18px]",
        medium: "data-[state=checked]:size-[16px] data-[state=unchecked]:size-[14px]",
        small:
          "data-[state=checked]:size-[14px] data-[state=unchecked]:size-[12px] data-[state=unchecked]:translate-x-[2px] data-[state=checked]:translate-x-[calc(100%-1px)]",
      },
    },
  }
)
type ToggleVariantProps = VariantProps<typeof toggleVariants>

type Props = ToggleVariantProps & React.ComponentProps<typeof TogglePrimitive.Root>

function Toggle({ className, size = "medium", ...props }: Props) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(
        toggleVariants({ size }),
        // State
        "data-[state=unchecked]:toggle-unchecked",
        "data-[state=checked]:toggle-checked",
        className
      )}
      {...props}
    >
      <TogglePrimitive.Thumb
        data-slot="toggle-thumb"
        className={cn(
          toggleThumbVariants({ size }),
          "flex items-center justify-center",
          // Only animate transform (horizontal movement)
          "transition-transform",
          "bg-toggle-thumb-bg pointer-events-none rounded-full",
          "data-[state=checked]:toggle-thumb-checked",
          "data-[state=unchecked]:toggle-thumb-unchecked"
        )}
      >
        <ToggleCheckIcon />
      </TogglePrimitive.Thumb>
    </TogglePrimitive.Root>
  )
}

export { Toggle }
