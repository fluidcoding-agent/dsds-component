// TextboxStates.tsx
import React from "react"

import { cn } from "@/lib/utils"
import type { BasicboxMessageType } from "@/components/ui/boxes"
import { Textbox, type TextboxProps } from "@/components/ui"

import { DemoRow } from "./DemoRow"
import { DemoRowItem } from "./DemoRowItem"

type BoxStatesProps = {
  size: "small" | "medium" | "large"
  boxProps: TextboxProps & {
    Component?: React.ComponentType<TextboxProps>
    populatedValue?: string
  }
  comment?: string
  width: number
  messageType?: BasicboxMessageType
  showStateLabel?: boolean
  hidePopulatedHover?: boolean
  populatedValue?: string
  showIconOnly?: boolean
  component?: React.ComponentType<TextboxProps>
}

export const BoxStates: React.FC<BoxStatesProps> = ({
  size,
  comment,
  boxProps,
  width,
  showStateLabel,
  showIconOnly,
  hidePopulatedHover,
  ...props
}) => {
  const { Component = Textbox, populatedValue = "populated", ...defaultTextboxProps } = boxProps
  const messageType =
    props.messageType ||
    ({
      large: "default",
      medium: "emphasis",
      small: "danger",
    }[size!] as BasicboxMessageType)

  const states = [
    { label: "Enabled", props: {} },
    { label: "Hovered", props: { wrapperClassName: "hovered" } },
    { label: "Disabled", props: { disabled: true } },
    {
      label: "Focused",
      props: {
        wrapperClassName: "focused",
        value: "|",
        message: "Text(Optional)",
        messageType,
      },
    },
    { label: "Populated", props: { value: populatedValue, message: "Text(Optional)", messageType } },
  ]

  if (!hidePopulatedHover) {
    states.push({
      label: "Populated (Hover)",
      props: {
        wrapperClassName: "hovered",
        value: populatedValue,
        message: "Text(Optional)",
        messageType,
      },
    })
  }

  return (
    <DemoRow hideTitle size={size} comment={comment} className={cn(showStateLabel && "[&>label]:mt-[25px]")}>
      {states.map((state, index) => (
        <DemoRowItem
          key={index}
          label={showStateLabel ? state.label : undefined}
          className={cn(showIconOnly ? "min-w-48" : "min-w-40")}
        >
          <Component {...defaultTextboxProps} {...state.props} size={size} width={width} />
          {showIconOnly && (
            <Component
              {...defaultTextboxProps}
              {...state.props}
              children={undefined}
              size={size}
              width={width}
              iconOnly
            />
          )}
        </DemoRowItem>
      ))}
    </DemoRow>
  )
}
