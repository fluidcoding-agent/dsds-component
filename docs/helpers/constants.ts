import { cva } from "class-variance-authority"

export const cardStyles = cva(
  [
    "inline-flex flex-col justify-between overflow-hidden rounded-md p-0 shadow-sm",
    "transition-all duration-200",
    "outline-hidden focus-visible:outline-ring",
  ],
  {
    variants: {
      disabled: {
        true: "opacity-dim-3 hover:cursor-not-allowed",
        false: "hover:cursor-pointer hover:shadow-md",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
)
