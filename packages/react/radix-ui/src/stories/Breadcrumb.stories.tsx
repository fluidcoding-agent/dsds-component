import type { Meta, StoryObj } from "@storybook/react-vite"

import { toPublishedSourceCode } from "@/lib/utils"

import { BreadcrumbTemplate } from "./templates/BreadcrumbTemplate"
import BreadcrumbTemplateSource from "./templates/BreadcrumbTemplate?raw"
import { booleanControl, hideOnControls, textControl } from "./utils"

const meta: Meta = {
  title: "Components/Breadcrumb",
  component: BreadcrumbTemplate,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
    },
  },
  args: {},
  argTypes: {
    isText: hideOnControls,
    isLast: hideOnControls,
  },
}

export default meta

type Story = StoryObj

const defaultArgs = {
  selected: false,
  breadcrumbName: "Menu_01",
}

export const Text: Story = {
  name: "Text",
  args: { ...defaultArgs, isText: true, disabled: false },
  argTypes: {
    selected: booleanControl,
    disabled: booleanControl,
    breadcrumbName: textControl,
  },
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(BreadcrumbTemplateSource),
      },
    },
  },
}

export const Select: Story = {
  name: "Select",
  args: { ...defaultArgs, isText: false, disabled: "" },
  argTypes: {
    selected: booleanControl,
    disabled: booleanControl,
    breadcrumbName: textControl,
  },
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(BreadcrumbTemplateSource),
      },
    },
  },
}
