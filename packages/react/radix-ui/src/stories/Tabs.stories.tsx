import type { Meta, StoryObj } from "@storybook/react-vite"

import { toPublishedSourceCode } from "@/lib/utils"
import { tabsVariantsConfig } from "@/components/ui"

import { TabsTemplate } from "./templates/TabsTemplate"
import TabsTemplateSource from "./templates/TabsTemplate?raw"
import { numberControl, radioControl, rangeControl } from "./utils"

type TabsTemplateProps = React.ComponentProps<typeof TabsTemplate>

function TabsTemplateLayout(props: TabsTemplateProps) {
  return (
    <div className="flex-coll flex h-full">
      <div className="flex flex-1 items-center justify-center">
        <TabsTemplate {...props} />
      </div>
    </div>
  )
}

const meta = {
  title: "Components/Tabs",
  component: TabsTemplateLayout,
  parameters: {
    docs: {
      codePanel: true,
    },
  },
  argTypes: {
    variant: radioControl(Object.keys(tabsVariantsConfig.variant)),
    size: radioControl(Object.keys(tabsVariantsConfig.size)),
    width: rangeControl(200, 500),
    tabCount: numberControl,
  },
  args: {},
} satisfies Meta<typeof TabsTemplateLayout>

export default meta
type Story = StoryObj<typeof meta>
type TabsStoryArgs = Story["args"]

const defaultArgs: TabsStoryArgs = {
  variant: "default",
  size: "medium",
  width: 300,
  tabCount: 5,
}

export const Default: Story = {
  name: "Default",
  args: {
    ...defaultArgs,
  },
  render: (args: Meta["args"]) => <TabsTemplateLayout tabCount={0} {...args} />,
  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(TabsTemplateSource),
      },
    },
  },
}
