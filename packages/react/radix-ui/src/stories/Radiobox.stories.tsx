import type { Meta, StoryContext, StoryObj } from "@storybook/react-vite"

import { toPublishedSourceCode } from "@/lib/utils"

import { RadioboxTemplate, type RadioboxTemplateProps } from "./templates/RadioboxTemplate"
import RadioboxTemplateSource from "./templates/RadioboxTemplate?raw"
import { booleanControl, hideOnControls, radioControl } from "./utils"

const meta: Meta<typeof RadioboxTemplate> = {
  title: "Components/Radiobox",
  component: RadioboxTemplate,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
    },
  },
  args: {
    checked: false,
    disabled: false,
  },
  argTypes: {
    checked: booleanControl,
    disabled: booleanControl,
    itemCount: hideOnControls,
  },
}
export default meta

type Story = StoryObj<typeof RadioboxTemplate>

const defaultItemArgs = {
  checked: false,
  disabled: false,
  orientation: "vertical",
  itemCount: 1,
} as RadioboxTemplateProps

const docs = {
  source: {
    transform: (_: string, context: StoryContext) => {
      let code = `
          <Radiobox>
            <Label htmlFor="option-1">Option 1</Label>
            <RadioboxItem checked={checked} disabled={disabled} value="Option 1" id="option-1"/>
          </Radiobox>
          `
      code = code.replace(/checked=\{checked\} /g, context.args.checked ? "checked " : "")
      code = code.replace(/disabled=\{disabled\} /g, context.args.disabled ? "disabled " : "")
      return code
    },
  },
}

export const Default: Story = {
  args: {
    ...defaultItemArgs,
  },
  argTypes: {
    orientation: hideOnControls,
  },
  parameters: {
    docs,
  },
}

export const Checked: Story = {
  args: {
    ...defaultItemArgs,
    checked: true,
  },
  argTypes: {
    orientation: hideOnControls,
  },
  parameters: {
    docs,
  },
}

export const Orientation: Story = {
  args: {
    ...defaultItemArgs,
    itemCount: 3,
    orientation: "vertical",
  },
  argTypes: {
    checked: hideOnControls,
    disabled: hideOnControls,
    orientation: radioControl(["horizontal", "vertical"]),
  },
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(RadioboxTemplateSource),
      },
    },
  },
}
