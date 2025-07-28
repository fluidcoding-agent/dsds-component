import type { Meta, StoryObj } from "@storybook/react-vite"

import { toPublishedSourceCode } from "@/lib/utils"

import { ToggletipTemplate } from "./templates/ToggletipTemplate"
import ToggletipTemplateSource from "./templates/ToggletipTemplate?raw"
import { selectControl } from "./utils"

const meta: Meta = {
  title: "Components/Toggletip",
  component: ToggletipTemplate,
  parameters: {
    docs: {
      codePanel: true,
    },
  },
  args: {},
  argTypes: {},
}

export default meta

type Story = StoryObj

const defaultArgs = {
  title: "TitleInputplace",
  content: "Lorem ipsum dolor sit amet, a consectetur adipisicing elit, sed do eiusmod tempor incididunt u",
  side: "top",
  align: "center",
  size: "small",
  trigger: "button",
  footer: true,
}

export const Default: Story = {
  name: "Default",
  args: {
    ...defaultArgs,
  },
  argTypes: {
    trigger: selectControl(["button", "icon", "text"]),
    side: selectControl(["top", "right", "bottom", "left"]),
    size: selectControl(["small", "medium"]),
    align: selectControl(["start", "center", "end"]),
  },
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(ToggletipTemplateSource),
      },
    },
  },
}

export const WithoutFooter: Story = {
  name: "Without Footer",
  args: {
    ...defaultArgs,
    footer: false,
  },
  argTypes: {
    trigger: selectControl(["button", "icon", "text"]),
    side: selectControl(["top", "right", "bottom", "left"]),
    size: selectControl(["small", "medium"]),
    align: selectControl(["start", "center", "end"]),
  },
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(ToggletipTemplateSource),
      },
    },
  },
}
