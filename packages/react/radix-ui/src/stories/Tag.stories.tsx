import type { Meta, StoryObj } from "@storybook/react-vite"

import { DummyIcon } from "@/components/icons"
import { TagProps } from "@/components/ui"

import { TagTemplate } from "./templates/TagTemplate"
import { booleanControl, hideOnControls } from "./utils"

const meta: Meta = {
  title: "Components/Tag",
  component: TagTemplate,
  parameters: {
    docs: {
      layout: "centered",
      codePanel: true,
    },
  },
  args: {},
  argTypes: {
    icon: hideOnControls,
  },
}

export default meta

type Story = StoryObj

const defaultArgs = {
  title: "Tag",
  round: false,
  hashtag: false,
  closeIcon: false,
  disabled: false,
} as TagProps

export const Default: Story = {
  name: "Default",
  args: {
    ...defaultArgs,
  },
  argTypes: {
    disabled: booleanControl,
  },
}

export const Icon: Story = {
  name: "Icon",
  args: {
    ...defaultArgs,
    icon: <DummyIcon />,
  },
  argTypes: {},
}
