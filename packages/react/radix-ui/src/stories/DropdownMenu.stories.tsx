import type { Meta, StoryObj } from "@storybook/react-vite"

import { toPublishedSourceCode } from "@/lib/utils"

import { DropdownMenuTemplate, type DropdownMenuTemplateProps } from "./templates/DropdownMenuTemplate"
import DropdownMenuTemplateSource from "./templates/DropdownMenuTemplate?raw"
import { booleanControl, hideOnControls, radioControl } from "./utils"

type LayoutProps = DropdownMenuTemplateProps & {
  horizontal?: "start" | "center" | "end"
  vertical?: "start" | "center" | "end"
}

function DropdownTemplateLayout(args: LayoutProps) {
  return (
    <div className="flex-coll flex h-full">
      <div
        className="flex flex-1"
        style={{ justifyContent: args?.horizontal || "center", alignItems: args?.vertical || "center" }}
      >
        <DropdownMenuTemplate {...args} />
      </div>
    </div>
  )
}

const meta = {
  title: "Components/Dropdown Menu",
  component: DropdownTemplateLayout,
  parameters: {
    docs: {
      codePanel: true,
    },
  },
  argTypes: {
    highlightSelected: booleanControl,
    horizontal: radioControl(["start", "center", "end"]),
    vertical: radioControl(["start", "center", "end"]),
  },
  args: {},
} satisfies Meta<typeof DropdownTemplateLayout>

export default meta
type Story = StoryObj<typeof meta>
type DropdownMenuStoryArgs = Story["args"]

const defaultArgs: DropdownMenuStoryArgs = {
  horizontal: "center",
  vertical: "center",
  highlightSelected: false,
  menuItems: ["selected", "selected1", "selected2", "selected3", "selected4"],
}

export const Default: Story = {
  name: "Default",
  args: {
    ...defaultArgs,
  },
  argTypes: {
    horizontal: hideOnControls,
    vertical: hideOnControls,
    menuItems: hideOnControls,
  },
  render: (args: Meta["args"]) => <DropdownTemplateLayout {...args} menuItems={args?.menuItems} />,
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(DropdownMenuTemplateSource),
      },
    },
  },
}

export const LayoutTest: Story = {
  name: "Layout Test",
  args: {
    ...defaultArgs,
    defaultOpen: true,
    menuItems: Array.from({ length: 8 }, (_, i) => `${i + 1}: Very Long Menu Inputplace`),
  },
  render: (args: Meta["args"]) => <DropdownTemplateLayout {...args} menuItems={args?.menuItems} />,
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(DropdownMenuTemplateSource),
      },
    },
  },
}
