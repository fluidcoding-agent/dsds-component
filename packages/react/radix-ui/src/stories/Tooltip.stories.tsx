import type { Meta, StoryObj } from "@storybook/react-vite"

import { toPublishedSourceCode } from "@/lib/utils"
import { alignPlaces, sidePlaces } from "@/components/ui"

import { TooltipTemplate, type TooltipTemplateProps } from "./templates/TooltipTemplate"
import TooltipTemplateSource from "./templates/TooltipTemplate?raw"
import { hideOnControls, radioControl } from "./utils"

type LayoutProps = TooltipTemplateProps & {}

function TooltipTemplateLayout(args: LayoutProps) {
  return (
    <div className="flex-coll flex h-full">
      <div className="flex flex-1">
        <TooltipTemplate {...args} />
      </div>
    </div>
  )
}

const meta = {
  title: "Components/Tooltip",
  component: TooltipTemplateLayout,
  parameters: {
    docs: {
      codePanel: true,
    },
  },
  argTypes: {
    defaultSide: radioControl(sidePlaces.map((it) => it as string)),
    defaultAlign: radioControl(alignPlaces.map((it) => it as string)),
    showOnly: hideOnControls,
    className: hideOnControls,
    rowClassName: hideOnControls,
    tooltipClassName: hideOnControls,
    content: hideOnControls,
  },
  args: {},
} satisfies Meta<typeof TooltipTemplateLayout>

export default meta
type Story = StoryObj<typeof meta>
type TooltipStoryArgs = Story["args"]

const defaultArgs: TooltipStoryArgs = {}

export const Default: Story = {
  name: "Default",
  args: {
    ...defaultArgs,
    defaultOpen: true,
    showOnly: ["auto"],
    className: "justify-center",
    rowClassName: "justify-center",
  },
  render: (args: Meta["args"]) => <TooltipTemplateLayout {...args} />,
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(TooltipTemplateSource),
      },
    },
  },
}

export const LeftAuto: Story = {
  args: {
    ...defaultArgs,
    defaultOpen: true,
    defaultSide: "right",
    defaultAlign: "start",
    content: (
      <div>
        <p>Text Line 11111111111</p>
        <p>Text Line 22222222222</p>
        <p>Text Line 33333333333</p>
      </div>
    ),
    showOnly: ["auto"],
    className: "justify-start h-10 max-h-10",
    rowClassName: "justify-start",
    tooltipClassName: "absolute top-5 left-0",
  },
  render: (args: Meta["args"]) => (
    <div className="min-h-[calc(100%-150px)] bg-blue-100">
      <TooltipTemplateLayout {...args} />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(TooltipTemplateSource),
      },
    },
  },
}

export const LayoutTest: Story = {
  name: "Layout Test",
  args: {
    ...defaultArgs,
    defaultOpen: true,
  },
  argTypes: {
    defaultAlign: hideOnControls,
    defaultSide: hideOnControls,
  },
  render: (args: Meta["args"]) => <TooltipTemplateLayout {...args} />,
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(TooltipTemplateSource),
      },
    },
  },
}
