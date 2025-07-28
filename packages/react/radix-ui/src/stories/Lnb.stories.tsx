import { LnbTemplate } from "@/stories/templates/LnbTemplate"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { toPublishedSourceCode } from "@/lib/utils"

// import { LnbUnionIcon } from "@/components/icons/LnbIcon"

import LnbTemplateSource from "./templates/LnbTemplate?raw"

const meta: Meta = {
  title: "Components/LNB",
  component: LnbTemplate,
  parameters: {
    layout: "left",
    docs: {
      codePanel: true,
    },
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  name: "Default",
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(LnbTemplateSource),
      },
    },
  },
}
