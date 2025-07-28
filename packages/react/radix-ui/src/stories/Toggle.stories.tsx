import type { Meta, StoryObj } from "@storybook/react-vite"

import { Toggle } from "@/components/ui"

import { booleanControl, hideOnControls, selectControl } from "./utils"

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
    },
  },
  argTypes: {
    checked: booleanControl,
    disabled: booleanControl,
    onCheckedChange: hideOnControls,
    size: selectControl(["large", "medium", "small"]),
  },
}
export default meta

type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
    size: "medium",
  },
}

export const CheckedSmall: Story = {
  args: {
    checked: true,
    disabled: false,
    size: "small",
  },
}
