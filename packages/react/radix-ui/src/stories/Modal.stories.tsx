import { ModalTemplate } from "@/stories/templates/ModalTemplate"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { toPublishedSourceCode } from "@/lib/utils"

import ModalTemplateSource from "./templates/ModalTemplate?raw"
import { hideOnControls, selectControl, textControl } from "./utils"

const meta: Meta = {
  title: "Components/Modal",
  component: ModalTemplate,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
    },
  },
  args: {},
  argTypes: {
    isMessage: {
      table: { disable: true },
    },
  },
}
export default meta

type Story = StoryObj

const defaultItemArgs = { title: "Text_Inputplace" }

export const Modal: Story = {
  args: {
    ...defaultItemArgs,
    isMessage: false,
    size: "xs",
  },
  argTypes: {
    size: selectControl(["xs", "sm", "md", "lg", "xl", "2xl"]),
    title: textControl,
  },
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(ModalTemplateSource),
      },
    },
  },
}

export const Message: Story = {
  args: {
    ...defaultItemArgs,
    isMessage: true,
    message: "Text Inputplace",
  },
  argTypes: {
    message: textControl,
    title: hideOnControls,
  },
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(ModalTemplateSource),
      },
    },
  },
}
