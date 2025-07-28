import type { Meta, StoryObj } from "@storybook/react-vite"

import { Header, HeaderProps } from "@/components/ui"

import { hideOnControls, radioControl } from "../utils"
import { CuteAnimalbox } from "./_components/CuteAnimalbox"

// Storybook 메타 정보 정의
const meta = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
    docs: {
      codePanel: true,
    },
  },
  tags: ["autodocs"],
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
      options: ["compact", "cozy"],
    },
    // children은 고급 사용법이므로 컨트롤 패널에서 숨깁니다.
    sticky: hideOnControls,
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

/**
 * 이 스토리는 `logo`과 `items` prop을 사용하여 헤더를 구성하는 가장 기본적인 방법입니다.
 * 데이터 기반으로 헤더를 생성하여 일관성을 유지하고 API 연동을 쉽게 만듭니다.
 */
export const Default: Story = {
  args: {
    ...defaultArgs,
    gnb: [
      { type: "tenant", content: "Tenant", items: [{ content: "Tenant1", value: "tenant1" }] },
      { type: "divider" },
      { type: "searchbox" },
      { type: "menu", content: "Menu", items: [{ content: "Docs", value: "docs" }] },
    ],
    utility: [
      { type: "searchbox" },
      { type: "button", content: "알림", props: { badge: true } },
      { type: "link", content: "S-VOC", href: "/svoc" },
      { type: "link", content: "Q&A", href: "/qna" },
      { type: "divider" },
      {
        type: "custom",
        content: <CuteAnimalbox animalType="rabbit" speed={1.5} containerWidth={150} containerHeight={30} />,
      },
      {
        type: "image",
        props: {
          src: "https://github.com/shadcn.png",
          alt: "User Avatar",
        },
      },
      {
        type: "button",
        props: { onClick: () => console.log("Login!") },
        content: "Login",
      },
    ],
  },
}

/**
 * 이 스토리는 `children`을 직접 전달하여 커스텀 레이아웃을 구성하는 방법을 보여줍니다.
 * `Header.Menu`, `Header.Button` 같은 컴파운드 컴포넌트를 사용하여 더 높은 자유도를 가집니다.
 */
export const CustomLayout: Story = {
  name: "커스텀 레이아웃",
  args: {
    ...defaultArgs,
  },
  render: (args) => (
    <>
      <style>
        {`
          .rainbow-text {
            background: linear-gradient(
              90deg, #ff0000, #ff8000, #0080ff, #0000ff, #ff00ff, #ff0000
            );
            background-size: 200% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: rainbow-animation 3s linear infinite;
          }

          @keyframes rainbow-animation {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}
      </style>
      <Header {...args}>
        <div className="rounded-md border-2 border-blue-300 font-bold" data-testid="custom-logo">
          <div className="rounded-md border-4 border-red-100">
            <span className="rainbow-text">My Custom Logo</span>
          </div>
        </div>
        <div className="flex-grow" />
        <div className="flex items-center gap-4" data-testid="custom-gnb" role="group" aria-label="custom gnb">
          <Header.Menu items={[{ content: "Home", value: "home" }]}>Home</Header.Menu>
          <Header.Menu items={[{ content: "About", value: "about" }]}>Home</Header.Menu>
          <Header.Divider />
          <Header.Button>Login</Header.Button>
        </div>
      </Header>
    </>
  ),
}

/**
 * 커스텀 레이아웃으로 Header.GNB와 Header.Utility를 사용하는 방법을 보여줍니다.
 */
export const CustomLayoutWithGNBUtility: Story = {
  name: "커스텀 레이아웃 (GNB / Utility)",
  args: {
    ...defaultArgs,
  },
  render: (args) => (
    <Header {...args}>
      <Header.Logo>MyApp</Header.Logo>
      <Header.GNB>
        <Header.Tenant items={[{ content: "Memory", value: "memory" }]}>Memory</Header.Tenant>
        <Header.Divider />
        <Header.Menu items={[{ content: "문서", value: "docs" }]}>문서</Header.Menu>
        <Header.Menu items={[{ content: "가이드", value: "guide" }]}>가이드</Header.Menu>
      </Header.GNB>
      <Header.Utility>
        <Header.Button>알림</Header.Button>
        <Header.Button>도움말</Header.Button>
        <Header.Divider />
        <Header.Image src="https://github.com/shadcn.png" alt="User Avatar" />
        <Header.HamburgerMenu />
      </Header.Utility>
    </Header>
  ),
}

/**
 * `items`나 `children` 없이 `logo`만 전달했을 때의 모습입니다.
 */
export const LogoOnly: Story = {
  name: "로고만 있는 경우",
  args: {
    ...defaultArgs,
  },
}

/**
 * GNB와 Utility props를 사용하여 Header를 구성하는 방법을 보여줍니다.
 * 이는 기존 items prop보다 더 구조화된 방식으로 Header를 정의합니다.
 */
export const WithGNBAndUtility: Story = {
  name: "GNB와 Utility 사용",
  args: {
    ...defaultArgs,
    gnb: [
      {
        type: "tenant",
        content: "Memory",
        items: [{ content: "Tenant1", value: "tenant1" }],
        props: {
          onClick: () => console.log("Tenant clicked"),
        },
      },
      { type: "divider" },
      {
        type: "menu",
        content: "문서",
        items: [{ content: "문서1", value: "doc1" }],
        props: {
          onClick: () => console.log("문서 menu clicked"),
        },
      },
      {
        type: "menu",
        content: "가이드",
        items: [{ content: "가이드1", value: "guide1" }],
        props: {
          onClick: () => console.log("가이드 menu clicked"),
        },
      },
    ],
    utility: [
      { type: "searchbox" },
      {
        type: "button",
        content: "알림",
        props: {
          onClick: () => console.log("알림 clicked"),
          "data-noti-count": "3",
        } as React.ButtonHTMLAttributes<HTMLButtonElement>,
      },
      {
        type: "button",
        content: "업데이트",
        props: {
          onClick: () => console.log("업데이트 clicked"),
          "data-badge": "true",
        } as React.ButtonHTMLAttributes<HTMLButtonElement>,
      },
      { type: "divider" },
      {
        type: "image",
        props: {
          src: "https://github.com/shadcn.png",
          alt: "User Avatar",
        },
      },
      {
        type: "hamburger",
        props: {
          onClick: () => console.log("Hamburger menu clicked"),
        },
      },
    ],
  },
}

// --- 실험 기능 스토리 ---

/**
 * `variant="sticky"` prop의 동작을 확인하기 위한 스토리입니다.
 * 데코레이터를 사용하여 스크롤 가능한 영역을 추가했습니다.
 */
export const Sticky: Story = {
  name: "[실험중] Sticky Header",
  args: {
    ...Default.args, // Default 스토리의 props를 재사용합니다.
    sticky: true,
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <div className="bg-muted mt-[50vh] flex h-[150vh] flex-col gap-4 p-8 pt-10">
          <p className="h-[50px] bg-red-300">Scroll down to see the sticky effect.</p>
          <p className="h-[50px] bg-blue-300">Scroll down to see the sticky effect.</p>
          <p className="h-[50px] bg-green-300">Scroll down to see the sticky effect.</p>
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: { disable: true },
  },
}
