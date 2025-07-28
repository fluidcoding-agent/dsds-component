import { cn } from "@/lib/utils"
import { type ButtonVariantProps } from "@/components/ui"

import { ButtonStates } from "./_components/ButtonStates"
import { DemoRowTitle } from "./_components/DemoRowTitle"

type ButtonDemoProps = {
  className?: string
}

export function ButtonsDemo({ className }: ButtonDemoProps) {
  const variants = [
    { label: "Brand (Primary)", variant: "primary" },
    { label: "Warning", variant: "warning" },
    { label: "Danger", variant: "danger" },
    { label: "2ndary", variant: "secondary", showExtraState: true },
    { label: "Ghost", variant: "ghost", showExtraState: true },
    { label: "Ghost (Link)", variant: "ghostLink" },
  ] as { variant: ButtonVariantProps["variant"]; label: string; showExtraState?: boolean }[]

  return (
    <div className={cn("flex flex-col gap-10", className)}>
      {variants.map((state, index) => (
        <ul key={index} className="flex flex-col gap-5">
          <DemoRowTitle title={state.label} />
          <ButtonStates variant={state.variant} size="large" showExtraState={state.showExtraState} showStateLabel />
          <ButtonStates variant={state.variant} size="medium" showExtraState={state.showExtraState} />
          <ButtonStates variant={state.variant} size="small" showExtraState={state.showExtraState} />
        </ul>
      ))}
    </div>
  )
}
