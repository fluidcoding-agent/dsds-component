import { cn } from "@/lib/utils"
import { Searchbox, Selectbox, type TextboxVariantProps } from "@/components/ui"

import { BasicboxDemo } from "./_components/BasicboxDemo"
import { BoxStates } from "./_components/BoxStates"
import { DemoRowTitle } from "./_components/DemoRowTitle"

type Props = {
  className?: string
}

export function BoxesDemo({ className }: Props) {
  const defaultTextboxProps = {
    placeholder: "textinputplace",
  }

  const ghostTextboxProps = {
    ...defaultTextboxProps,
    variant: "ghost" as TextboxVariantProps["variant"],
  }

  const bulkTextboxProps = {
    ...defaultTextboxProps,
    multiline: true,
  }

  const bulkGhostTextboxProps = {
    ...ghostTextboxProps,
    multiline: true,
  }

  const defaultSearchboxProps = {
    ...defaultTextboxProps,
    placeholder: "Search",
    populatedValue: "Searched",
    Component: Searchbox,
  }

  const ghostSearchboxProps = {
    ...defaultSearchboxProps,
    variant: "ghost" as TextboxVariantProps["variant"],
  }

  const defaultSelectboxProps = {
    ...defaultTextboxProps,
    placeholder: "Hint",
    populatedValue: "selected",
    Component: Selectbox,
  }

  const ghostSelectboxProps = {
    ...defaultSelectboxProps,
    variant: "ghost" as TextboxVariantProps["variant"],
  }
  return (
    <div className={cn("flex flex-col gap-10", className)}>
      <BasicboxDemo />
      <hr />
      <ul className="flex flex-col gap-5">
        <DemoRowTitle title="Textbox - default" />
        <BoxStates size="large" boxProps={defaultTextboxProps} width={120} showStateLabel />
        <BoxStates size="medium" boxProps={defaultTextboxProps} width={120} />
        <BoxStates size="small" boxProps={defaultTextboxProps} width={108} />
      </ul>
      <ul className="flex flex-col gap-5">
        <DemoRowTitle title="Textbox - default / ghost" />
        <BoxStates size="large" boxProps={ghostTextboxProps} width={120} showStateLabel />
        <BoxStates size="medium" boxProps={ghostTextboxProps} width={120} />
        <BoxStates size="small" boxProps={ghostTextboxProps} width={108} />
      </ul>
      <ul className="flex flex-col gap-5">
        <DemoRowTitle title="Textbox - bulk" />
        <BoxStates size="large" boxProps={bulkTextboxProps} width={120} showStateLabel />
        <BoxStates size="small" boxProps={bulkTextboxProps} width={108} messageType="emphasis" />
        <BoxStates
          size="small"
          comment="Auto Resize"
          boxProps={{ ...bulkTextboxProps, autoResize: true }}
          width={108}
        />
      </ul>
      <ul className="flex flex-col gap-5">
        <DemoRowTitle title="Textbox - bulk / ghost" />
        <BoxStates size="large" boxProps={bulkGhostTextboxProps} width={120} showStateLabel />
        <BoxStates size="small" boxProps={bulkGhostTextboxProps} width={108} messageType="emphasis" />
        <BoxStates
          size="small"
          comment="Auto Resize"
          boxProps={{ ...bulkGhostTextboxProps, autoResize: true }}
          width={108}
        />
      </ul>
      <hr />
      <ul className="flex flex-col gap-5">
        <DemoRowTitle title="Searchbox" />
        <BoxStates size="large" boxProps={defaultSearchboxProps} width={120} showStateLabel />
        <BoxStates size="medium" boxProps={defaultSearchboxProps} width={120} />
        <BoxStates size="small" boxProps={defaultSearchboxProps} width={108} />
      </ul>
      <ul className="flex flex-col gap-5">
        <DemoRowTitle title="Searchbox - ghost" />
        <BoxStates size="large" boxProps={ghostSearchboxProps} width={120} showStateLabel />
        <BoxStates size="medium" boxProps={ghostSearchboxProps} width={120} />
        <BoxStates size="small" boxProps={ghostSearchboxProps} width={108} />
      </ul>
      <hr />
      <ul className="flex flex-col gap-5">
        <DemoRowTitle title="Selectbox" />
        <BoxStates size="large" boxProps={defaultSelectboxProps} width={120} showIconOnly showStateLabel />
        <BoxStates size="medium" boxProps={defaultSelectboxProps} width={120} showIconOnly />
        <BoxStates size="small" boxProps={defaultSelectboxProps} width={108} showIconOnly />
      </ul>
      <ul className="flex flex-col gap-5">
        <DemoRowTitle title="Selectbox - ghost" />
        <BoxStates size="large" boxProps={ghostSelectboxProps} width={120} showIconOnly showStateLabel />
        <BoxStates size="medium" boxProps={ghostSelectboxProps} width={120} showIconOnly />
        <BoxStates size="small" boxProps={ghostSelectboxProps} width={108} showIconOnly />
      </ul>
    </div>
  )
}
