import type { Meta, StoryObj } from "@storybook/react-vite"

import { Checkbox } from "@/components/ui"

import { booleanControl, hideOnControls } from "./utils"

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
    },
  },
  args: {
    checked: false,
    disabled: false,
  },
  argTypes: {
    checked: booleanControl,
    disabled: booleanControl,
    onCheckedChange: hideOnControls,
  },
}
export default meta

type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
  },
}

export const Checked: Story = {
  args: {
    checked: true,
    disabled: false,
  },
}
