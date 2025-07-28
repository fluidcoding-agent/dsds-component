import type { Meta, StoryObj } from "@storybook/vue3-vite"

import { VBtn } from "@/components/ui"

const meta = {
  title: "Components/Button",
  component: VBtn,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "DSDS 디자인 시스템 버튼 컴포넌트입니다. React Radix-UI 구현과 동일한 Look & Feel을 제공합니다.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "warning", "danger", "ghost", "ghostLink"],
      description: "버튼의 변형 (React의 variant와 동일)",
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "버튼의 크기",
    },
    disabled: {
      control: { type: "boolean" },
      description: "버튼 비활성화 상태",
    },
    active: {
      control: { type: "boolean" },
      description: "버튼 활성화 상태",
    },
    selected: {
      control: { type: "boolean" },
      description: "버튼 선택 상태",
    },
    iconOption: {
      control: { type: "select" },
      options: ["before", "after", undefined],
      description: "아이콘 위치",
    },
  },
} satisfies Meta<typeof VBtn>

export default meta

type Story = StoryObj<typeof meta>

const defaultArgs: Story["args"] = {
  default: "button",
  size: "medium",
  disabled: false,
  active: false,
  selected: false,
}

/**
 * 기본 Primary 버튼입니다. 주요 액션에 사용하세요.
 */
export const Primary: Story = {
  args: {
    ...defaultArgs,
    variant: "primary",
  },
  parameters: {
    docs: {
      description: {
        story: "기본 Primary 버튼입니다. 주요 액션에 사용하세요.",
      },
    },
  },
}

/**
 * Secondary 버튼입니다. 보조 액션에 적합합니다.
 */
export const Secondary: Story = {
  args: {
    ...defaultArgs,
    variant: "secondary",
  },
  parameters: {
    docs: {
      description: {
        story: "Secondary 버튼입니다. 보조 액션에 적합합니다.",
      },
    },
  },
}

/**
 * Warning 버튼입니다. 주의를 요하는 액션에 사용하세요.
 */
export const Warning: Story = {
  args: {
    ...defaultArgs,
    variant: "warning",
  },
  parameters: {
    docs: {
      description: {
        story: "Warning 버튼입니다. 주의를 요하는 액션에 사용하세요.",
      },
    },
  },
}

/**
 * Danger 버튼입니다. 삭제 등 위험한 액션에 사용하세요.
 */
export const Danger: Story = {
  args: {
    ...defaultArgs,
    variant: "danger",
  },
  parameters: {
    docs: {
      description: {
        story: "Danger 버튼입니다. 삭제 등 위험한 액션에 사용하세요.",
      },
    },
  },
}

/**
 * Ghost 버튼입니다. 배경이 없는 투명한 버튼입니다.
 */
export const Ghost: Story = {
  args: {
    ...defaultArgs,
    variant: "ghost",
  },
  parameters: {
    docs: {
      description: {
        story: "Ghost 버튼입니다. 배경이 없는 투명한 버튼입니다.",
      },
    },
  },
}

/**
 * GhostLink 버튼입니다. 링크 스타일의 Ghost 버튼입니다.
 */
export const GhostLink: Story = {
  args: {
    ...defaultArgs,
    variant: "ghostLink",
  },
  parameters: {
    docs: {
      description: {
        story: "GhostLink 버튼입니다. 링크 스타일의 Ghost 버튼입니다.",
      },
    },
  },
}

/**
 * 버튼 크기 변형 예시 - React 구현과 동일한 패딩과 높이
 */
export const Sizes: Story = {
  args: {
    ...defaultArgs,
    variant: "primary",
  },
  render: () => ({
    components: { VBtn },
    template: `
      <div class="flex gap-4 items-center">
        <VBtn variant="primary" size="small">Small</VBtn>
        <VBtn variant="primary" size="medium">Medium</VBtn>
        <VBtn variant="primary" size="large">Large</VBtn>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "다양한 크기의 버튼들입니다. React 구현과 동일한 패딩과 높이를 적용합니다.",
      },
    },
  },
}

/**
 * 모든 변형 예시 - React 구현과 완전히 동일한 Look & Feel
 */
export const AllVariants: Story = {
  args: {
    ...defaultArgs,
  },
  render: () => ({
    components: { VBtn },
    template: `
      <div class="flex flex-wrap gap-4 items-center">
        <VBtn variant="primary">Primary</VBtn>
        <VBtn variant="secondary">Secondary</VBtn>
        <VBtn variant="warning">Warning</VBtn>
        <VBtn variant="danger">Danger</VBtn>
        <VBtn variant="ghost">Ghost</VBtn>
        <VBtn variant="ghostLink">Ghost Link</VBtn>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "모든 변형의 버튼들입니다. React 구현과 완전히 동일한 Look & Feel을 제공합니다.",
      },
    },
  },
}
