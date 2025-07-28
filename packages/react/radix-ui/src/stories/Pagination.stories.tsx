import type { Meta, StoryObj } from "@storybook/react-vite"

import { PaginationTemplate, PaginationTemplateProps } from "./templates/PaginationTemplate"
import { hideOnControls, numberControl } from "./utils"

const meta: Meta = {
  title: "Components/Pagination",
  component: PaginationTemplate,
  parameters: {
    docs: {
      layout: "centered",
      codePanel: true,
    },
  },
  args: {},
  argTypes: {
    isDot: hideOnControls,
  },
}

export default meta

type Story = StoryObj

const defaultArgs = {
  isDot: false,
  length: 5,
} as PaginationTemplateProps

export const Number: Story = {
  args: {
    ...defaultArgs,
    startPage: 1,
    selectedPage: 1,
  },
  argTypes: {
    startPage: numberControl,
    selectedPage: numberControl,
    length: numberControl,
  },
}
export const Dot: Story = {
  args: {
    ...defaultArgs,
    isDot: true,
    startPage: 1,
    selectedPage: 1,
  },
  argTypes: {
    startPage: numberControl,
    selectedPage: numberControl,
    length: numberControl,
  },
}
