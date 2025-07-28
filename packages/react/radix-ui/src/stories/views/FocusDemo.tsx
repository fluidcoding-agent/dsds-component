import { useState } from "react"
import { TabsTemplate } from "@/stories/templates/TabsTemplate"

import { cn } from "@/lib/utils"
import {
  Checkbox,
  Label,
  Radiobox,
  RadioboxItem,
  Searchbox,
  Textbox,
  Toggle,
  type ButtonVariantProps,
} from "@/components/ui"

import { ButtonStates } from "./_components/ButtonStates"
import { DemoRowTitle } from "./_components/DemoRowTitle"
import { MarkdownCode } from "./_components/Markdown"

type FocusDemoProps = {
  className?: string
}

export function FocusDemo({ className }: FocusDemoProps) {
  const [focusType, setFocusType] = useState("type2")

  function handleFocusTypeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFocusType(e.target.value)
  }

  // Map focusType to outline style or offset
  const focusStyles: Record<string, string> = {
    type1: "1px solid var(--color-text-on-button-on-2ndary-activated-activated-hover)",
    type2: "1px solid var(--color-text-on-button-on-2ndary-activated-activated-hover)",
    type3: "1px solid var(--color-text-on-button-on-2ndary-activated-activated-hover)",
    type4: "2px solid var(--color-text-on-button-on-2ndary-activated-activated-hover)",
  }

  return (
    <div
      style={
        {
          // You can add more variables if needed
          "--focus-outline": focusStyles[focusType],
          "--focus-outline-offset": focusType === "type4" ? "2px" : `${focusType.replace("type", "")}px`,
        } as React.CSSProperties
      }
    >
      <div className="mb-2 flex items-center justify-center gap-5">
        {/* disable focus for these radio buttons to avoid auto focus on page load */}
        <div className="flex items-center gap-3">
          <Label className="text-sm" htmlFor="focusType">
            Focus Type
          </Label>
          <input
            type="radio"
            value="type1"
            className="outline-ring-1 size-3"
            name="focusType"
            checked={focusType === "type1"}
            onChange={handleFocusTypeChange}
            autoFocus
          />
          <input
            type="radio"
            value="type2"
            className="outline-ring-2 size-3"
            name="focusType"
            checked={focusType === "type2"}
            onChange={handleFocusTypeChange}
          />
          <input
            type="radio"
            value="type3"
            className="outline-ring-3 size-3"
            name="focusType"
            checked={focusType === "type3"}
            onChange={handleFocusTypeChange}
          />
          <input
            type="radio"
            value="type4"
            className="outline-ring-4 size-3"
            name="focusType"
            checked={focusType === "type4"}
            onChange={handleFocusTypeChange}
          />
        </div>
      </div>
      <DemoRowTitle as="h2" className="mb-[8px]">
        Basic Controls
      </DemoRowTitle>
      <div className={cn("mb-2 flex items-center gap-3 p-1", className)}>
        <Checkbox />
        <Radiobox orientation="horizontal" defaultValue="on" className="border-1 border-gray-100 p-1">
          <Label htmlFor="radiobox1">on</Label>
          <RadioboxItem value="on" id="radiobox1" />
          <Label htmlFor="radiobox2">off</Label>
          <RadioboxItem value="off" id="radiobox2" />
        </Radiobox>
        <Toggle size="small" />
        <Toggle size="medium" />
        <Toggle size="large" />
        <Textbox placeholder="Input Text" width={85} />
        <Searchbox placeholder="Search..." width={85} />
      </div>
      <DemoRowTitle as="h2" className="mb-[8px]">
        Tabs
      </DemoRowTitle>
      <div className={cn("mb-2 flex items-center gap-5 p-1", className)}>
        <TabsTemplate size="small" tabCount={2} width={100} />
        <TabsTemplate size="medium" tabCount={2} width={120} />
        <TabsTemplate variant="button" size="small" tabCount={2} width={120} />
        <TabsTemplate variant="button" size="medium" tabCount={2} width={140} />
      </div>
      <DemoRowTitle as="h2" className="mb-[8px]">
        Buttons
      </DemoRowTitle>
      <div className={cn("flex flex-col gap-3", className)}>
        <div>
          <DemoRowTitle as="h3" className="font-heading text-lg">
            Container padding
          </DemoRowTitle>
          <div className="border border-red-100 bg-white">
            <ButtonsFocusDemo sizes={Object.values(allSizes)} className="m-0 p-1" />
          </div>
        </div>
        <div>
          <DemoRowTitle as="h3" className="font-heading text-lg">
            Container with compensated padding and margin (Layout Unaffected)
          </DemoRowTitle>

          <ul className="flex gap-2 border border-red-100 bg-white">
            <ButtonsFocusDemo sizes={["large"]} className="m-[-4px] p-[4px]" />
          </ul>
          <MarkdownCode lang="css" content={`{ padding: 4px; margin: -4px}`} />
        </div>
        <div>
          <DemoRowTitle as="h3" className="font-heading text-lg">
            No padding (Focus outline is clipped)
          </DemoRowTitle>
          <ul className="flex gap-2 border border-red-100 bg-white">
            <ButtonsFocusDemo sizes={["large"]} className="m-0 p-0" />
          </ul>
        </div>
      </div>
    </div>
  )
}

const variants = [
  { label: "Brand (Primary)", variant: "primary" },
  { label: "Warning", variant: "warning" },
  { label: "Danger", variant: "danger" },
  { label: "Ghost (Link)", variant: "ghostLink" },
  { label: "2ndary", variant: "secondary", showExtraState: true },
  { label: "Ghost", variant: "ghost", showExtraState: true },
] as { variant: ButtonVariantProps["variant"]; label: string; showExtraState?: boolean }[]

const allSizes = ["large", "medium", "small"] as const
type SizeType = (typeof allSizes)[number]

const ButtonsFocusDemo = ({ sizes, className }: { sizes: SizeType[]; className?: string }) =>
  sizes.map((size, sizeIndex) => (
    <ul className="flex gap-2" key={sizeIndex}>
      {variants.map((state, variantIndex) => (
        <ButtonStates
          key={variantIndex}
          hideTitle
          rowClassName="[&>ul]:gap-0"
          itemClassName={cn("w-auto", className)}
          variant={state.variant}
          size={size}
          showExtraState={state.showExtraState}
          statesOnly={state.showExtraState ? ["enabled", "activated", "selected"] : ["enabled"]}
          examplesOnly={["default"]}
        />
      ))}
    </ul>
  ))
