import type { Meta, StoryObj } from "@storybook/react-vite"
import { toast } from "sonner"

import { toPublishedSourceCode } from "@/lib/utils"
import { Button, CustomToast } from "@/components/ui"

import { ToastTemplate } from "./templates/ToastTemplate"
import ToastTemplateSource from "./templates/ToastTemplate?raw"
import { booleanControl, hideOnControls, numberControl, selectControl } from "./utils"

const meta: Meta<typeof ToastTemplate> = {
  title: "Components/Toast",
  component: ToastTemplate,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
    },
  },
  argTypes: {
    t: hideOnControls,
    onClose: hideOnControls,
    type: hideOnControls,
    transitionDuration: selectControl([100, 200, 300, 400, 500]),
  },
}
export default meta

type Story = StoryObj<typeof ToastTemplate>

const defaultItemArgs = {
  link: "/",
  body: "시작일로부터 60일 이내 데이터가 다운로드 되었습니다.",
  duration: 2000,
  transitionDuration: 200,
}

export const Success: Story = {
  args: {
    ...defaultItemArgs,
    title: "타이틀 성공",
    type: "success",
  },
  argTypes: {
    duration: numberControl,
    animation: booleanControl,
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col">
        <Button
          className="w-[100px]"
          onClick={() =>
            //   toast("dd", { cancel: { label: "Cancel", onClick: () => console.log("cancel") } })
            toast.custom((t) => (
              <CustomToast
                title="타이틀 성공"
                body="시작일로부터 60일 이내 데이터가 다운로드 되었습니다."
                link="/"
                type="success"
                t={t}
              />
            ))
          }
        >
          Add Toast
        </Button>
        <Story />
      </div>
    ),
  ],

  parameters: {
    docs: {
      source: {
        code: toPublishedSourceCode(ToastTemplateSource),
      },
    },
  },
}

export const Fail: Story = {
  args: {
    ...defaultItemArgs,
    title: "타이틀 실패",
    type: "fail",
  },
  argTypes: {
    duration: numberControl,
    animation: booleanControl,
  },
}

export const Warning: Story = {
  args: {
    ...defaultItemArgs,
    title: "타이틀 주의",
    type: "warning",
  },
  argTypes: {
    duration: numberControl,
    animation: booleanControl,
  },
}

export const Inform: Story = {
  args: {
    ...defaultItemArgs,
    title: "타이틀 정보",
    type: "inform",
  },
  argTypes: {
    duration: numberControl,
    animation: booleanControl,
  },
}
