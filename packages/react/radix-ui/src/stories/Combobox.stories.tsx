import type { Meta, StoryObj } from "@storybook/react-vite"

import { toPublishedSourceCode } from "@/lib/utils"

import { ComboboxTemplate } from "./templates/ComboboxTemplate"
import ComboboxTemplateSource from "./templates/ComboboxTemplate?raw"
import { radioControl } from "./utils"

type LayoutProps = {
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
        <ComboboxTemplate defaultOpen={true} />
      </div>
    </div>
  )
}

const meta = {
  title: "Components/Combobox",
  component: DropdownTemplateLayout,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
    },
  },
  argTypes: {
    horizontal: radioControl(["start", "center", "end"]),
    vertical: radioControl(["start", "center", "end"]),
  },
  args: {},
} satisfies Meta<typeof DropdownTemplateLayout>

export default meta
type Story = StoryObj<typeof meta>
type ComboboxStoryArgs = Story["args"]

const defaultArgs: ComboboxStoryArgs = {
  horizontal: "center",
  vertical: "center",
}

export const Default: Story = {
  name: "Default",
  args: {
    ...defaultArgs,
  },
  render: (args: Meta["args"]) => <DropdownTemplateLayout {...args} />,
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(ComboboxTemplateSource),
      },
    },
  },
}
