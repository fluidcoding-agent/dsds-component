import type { Meta, StoryObj } from "@storybook/react-vite"

import { toPublishedSourceCode } from "@/lib/utils"

import { PopoverTemplate, type PopoverTemplateProps } from "./templates/PopoverTemplate"
import PopoverTemplateSource from "./templates/PopoverTemplate?raw"
import { hideOnControls, selectControl, textControl } from "./utils"

const meta: Meta = {
  title: "Components/Popover",
  component: PopoverTemplate,
  parameters: {
    docs: {
      codePanel: true,
    },
  },
  args: {},
  argTypes: {
    isOpen: hideOnControls,
  },
}

export default meta

type Story = StoryObj

const defaultArgs = {
  title: "Title_Inputplace",
  isOpen: true,
  trigger: "button",
  className: "",
  titleClassName: "",
  childrenClassName: "",
  children: "",
} as PopoverTemplateProps

export const Default: Story = {
  name: "Default",
  args: {
    ...defaultArgs,
  },
  argTypes: {
    trigger: selectControl(["button", "icon", "text"]),
    className: textControl(),
    titleClassName: textControl(),
    childrenClassName: textControl(),
  },
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(PopoverTemplateSource),
      },
    },
  },
}

export const Closed: Story = {
  name: "Closed",
  args: {
    ...defaultArgs,
    isOpen: false,
  },
  argTypes: {
    trigger: selectControl(["button", "icon", "text"]),
    className: textControl(),
    titleClassName: textControl(),
    childrenClassName: textControl(),
  },
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(PopoverTemplateSource),
      },
    },
  },
}
