import type { Meta, StoryObj } from "@storybook/react-vite"

import { boxMessageVariantsConfig, boxVariantsConfig, Selectbox } from "@/components/ui"

import { booleanControl, hideOnControls, radioControl, rangeControl, selectControl, textControl } from "../utils"

const meta = {
  title: "Components/Boxes/Selectbox",
  component: Selectbox,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
    },
  },

  argTypes: {
    placeholder: textControl("The title of the box"),
    size: selectControl(Object.keys(boxVariantsConfig.size)),
    variant: selectControl(Object.keys(boxVariantsConfig.variant)),
    message: textControl(),
    width: rangeControl(85, 200),
    messageType: radioControl(Object.keys(boxMessageVariantsConfig.messageType)),
    iconOnly: booleanControl,
    disabled: booleanControl,
    className: hideOnControls,
    wrapperClassName: hideOnControls,
    onChange: hideOnControls,
  },
  args: {},
} satisfies Meta<typeof Selectbox>

export default meta
type Story = StoryObj<typeof meta>
type SelectboxStoryArgs = Story["args"]

const defaultArgs: SelectboxStoryArgs = {
  variant: "default",
  size: "medium",
  placeholder: "Hint",
  value: "",
  message: "",
  messageType: "default",
  width: 120,
  iconOnly: false,
  disabled: false,
}

export const Default: Story = {
  name: "Default",
  args: {
    ...defaultArgs,
  },
}

export const DefaultWithMessage: Story = {
  name: "Default with Message",
  args: {
    ...defaultArgs,
    message: "Text (Optional)",
  },
}

export const Ghost: Story = {
  name: "Ghost",
  args: {
    ...defaultArgs,
    variant: "ghost",
  },
}
