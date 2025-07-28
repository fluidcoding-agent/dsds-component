import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, spyOn, userEvent, within } from "storybook/test"

import { Header, HeaderProps } from "@/components/ui"

import { hideOnControls, radioControl } from "../utils"

// Storybook 메타 정보 정의
const meta = {
  title: "Components/Header/Components",
  component: Header,
  parameters: {
    layout: "fullscreen",
    docs: {
      codePanel: true,
    },
  },
  // props 컨트롤을 위한 argTypes 정의
  argTypes: {
    logo: {
      control: "text",
      description: "로고 영역에 표시될 텍스트 또는 ReactNode입니다.",
    },
    logoAs: hideOnControls,
    gnb: hideOnControls,
    utility: hideOnControls,
    theme: radioControl(["light", "dark"]),
    size: {
      control: { type: "radio" },
      options: ["compact", "comportable"],
    },
    // children은 고급 사용법이므로 컨트롤 패널에서 숨깁니다.
    children: {
      table: {
        disable: true,
      },
    },
    asChild: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

const defaultArgs: HeaderProps = {
  logo: "LogoTitle",
}

// --- 스토리 정의 ---

export const MenuWithItems: Story = {
  name: "HeaderMenu 인터랙션",
  args: {
    ...defaultArgs,
    gnb: [
      {
        type: "menu",
        content: "Menu Trigger",
        items: [
          { content: "Menu1", value: "menu1" },
          { content: "Menu2", value: "menu2" },
          { content: "Menu3", value: "menu3", disabled: true },
        ],
        onSelect: (value: string) => alert(value),
        selected: "menu2",
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const origAlert = window.alert // 원래 alert 저장

    window.alert = (message) => {
      console.log("Mocked Alert:", message) // Log the message or perform other assertions
    }

    // spy on window.alert
    const alertSpy = spyOn(window, "alert")

    // 메뉴 트리거 확인 및 클릭
    const trigger = await canvas.findByRole("button", { name: /menu trigger/i })
    await userEvent.click(trigger)
    // 포탈로 렌더링된 메뉴 항목을 문서 전체에서 찾음
    const body = within(document.body)
    // 메뉴 항목 렌더링 확인
    await expect(body.getByRole("menuitem", { name: /Menu1/i })).toBeInTheDocument()
    await expect(body.getByRole("menuitem", { name: /Menu2/i })).toBeInTheDocument()
    // 세 번째 메뉴 항목이 disabled 상태인지 확인
    const menu3 = body.getByRole("menuitem", { name: /Menu3/i })
    await expect(menu3).toHaveAttribute("aria-disabled", "true")
    const menu2 = body.getByRole("menuitem", { name: /Menu2/i })
    // 두 번째 메뉴 선택 시 콜백 호출 확인
    await userEvent.click(menu2)
    await expect(alertSpy).toHaveBeenCalledWith("menu2")

    // restore spy
    alertSpy.mockRestore()

    window.alert = origAlert // 원래 alert 복원
  },
}

/**
 * HamburgerMenu의 동작을 확인하는 스토리입니다.
 */
export const HamburgerMenu: Story = {
  name: "햄버거 메뉴",
  args: {
    ...defaultArgs,
    utility: [
      {
        type: "hamburger",
        props: {
          onClick: () => console.log("Mobile hamburger clicked"),
        },
      },
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
}
