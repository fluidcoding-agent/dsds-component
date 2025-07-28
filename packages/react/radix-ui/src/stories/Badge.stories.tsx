import type { Meta, StoryObj } from "@storybook/react-vite"

import { toPublishedSourceCode } from "@/lib/utils"

import { BadgeTemplate } from "./templates/BadgeTemplate"
import BadgeTemplateSource from "./templates/BadgeTemplate?raw"
import { hideOnControls, selectControl, textControl } from "./utils"

const meta: Meta = {
  title: "Components/Badge",
  component: BadgeTemplate,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
    },
  },
  args: {},
  argTypes: {
    type: hideOnControls,
    className: hideOnControls,
  },
}

export default meta

type Story = StoryObj

export const BadgeNotificationNew: Story = {
  name: "Notification/Badge-New",
  args: {
    type: "BadgeNotificationNew",
  },
  argTypes: {
    children: hideOnControls,

    color: hideOnControls,
  },
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(BadgeTemplateSource),
      },
    },
  },
}

export const BadgeNotificationCount: Story = {
  name: "Notification/Badge-Count",
  args: {
    type: "BadgeNotificationCount",
    children: "32",
  },
  argTypes: {
    children: textControl(),
    color: hideOnControls,
  },
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(BadgeTemplateSource),
      },
    },
  },
}

export const BadgeText: Story = {
  name: "Badge-Text",
  args: {
    children: "Text_Inputplace",
    type: "BadgeText",
    color: "default",
  },
  argTypes: {
    children: textControl(),
    color: selectControl(["default", "blue"]),
  },
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(BadgeTemplateSource),
      },
    },
  },
}
