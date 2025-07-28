import type { Meta, StoryObj } from "@storybook/react-vite"

import { boxMessageVariantsConfig, boxVariantsConfig, Textbox } from "@/components/ui"

import { booleanControl, hideOnControls, radioControl, rangeControl, selectControl, textControl } from "../utils"

const meta = {
  title: "Components/Boxes/Textbox",
  component: Textbox,
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
    disabled: booleanControl,
    multiline: booleanControl,
    autoResize: booleanControl,
    wrapperClassName: hideOnControls,
    onChange: hideOnControls,
  },
  args: {},
} satisfies Meta<typeof Textbox>

export default meta
type Story = StoryObj<typeof meta>
type TextboxStoryArgs = Story["args"]

const defaultArgs: TextboxStoryArgs = {
  variant: "default",
  size: "medium",
  placeholder: "textinputplace",
  value: "",
  message: "",
  messageType: "default",
  width: 120,
  disabled: false,
  multiline: false,
  autoResize: false,
}

const defaultMultilineArgs: TextboxStoryArgs = {
  ...defaultArgs,
  multiline: true,
  value: "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdf",
  width: 140,
}

const ghostArgs: TextboxStoryArgs = {
  ...defaultArgs,
  variant: "ghost",
}

export const Default: Story = {
  name: "Default",
  args: {
    ...defaultArgs,
  },
}

export const Ghost: Story = {
  name: "Ghost",
  args: {
    ...ghostArgs,
  },
}

export const DefaultWithMessage: Story = {
  name: "Default with Message",
  args: {
    ...defaultArgs,
    message: "Text (Optional)",
  },
}

export const MultiLine: Story = {
  name: "MultiLine",
  args: defaultMultilineArgs,
}

export const MultiLineWitMessage: Story = {
  name: "MultiLine with Message",
  args: {
    ...defaultMultilineArgs,
    value: "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdf",
    message: "Text (Optional)",
  },
}

export const MultiLineAutoResize: Story = {
  name: "MultiLine (Auto Resize)",
  args: {
    ...defaultMultilineArgs,
    autoResize: true,
  },
}
