import type { Meta, StoryObj } from "@storybook/react-vite"

import { toPublishedSourceCode } from "@/lib/utils"
import { boxMessageVariantsConfig, boxVariantsConfig, Searchbox } from "@/components/ui"

import { SearchboxTemplate } from "../templates/SearchboxTemplate"
import SearchboxTemplateSource from "../templates/SearchboxTemplate?raw"
import { booleanControl, hideOnControls, radioControl, rangeControl, selectControl, textControl } from "../utils"

const meta = {
  title: "Components/Boxes/Searchbox",
  component: Searchbox,
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
    className: hideOnControls,
    wrapperClassName: hideOnControls,
    onChange: hideOnControls,
    onClear: hideOnControls,
  },
  args: {},
} satisfies Meta<typeof Searchbox>

export default meta
type Story = StoryObj<typeof meta>
type SearchboxStoryArgs = Story["args"]

const defaultArgs: SearchboxStoryArgs = {
  variant: "default",
  size: "medium",
  placeholder: "Search",
  value: "",
  message: "",
  messageType: "default",
  width: 120,
  disabled: false,
  onClear: () => console.log("clear"),
}

export const Default: Story = {
  render: (args) => <SearchboxTemplate args={args} />,
  name: "Default",
  args: {
    ...defaultArgs,
  },
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(SearchboxTemplateSource),
      },
    },
  },
}

export const Ghost: Story = {
  name: "Ghost",
  args: {
    ...defaultArgs,
    variant: "ghost",
  },
}

export const DefaultWithMessage: Story = {
  name: "Default with Message",
  args: {
    ...defaultArgs,
    message: "Text (Optional)",
  },
}
