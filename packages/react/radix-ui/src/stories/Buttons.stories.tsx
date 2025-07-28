import type { Meta, StoryObj } from "@storybook/react-vite"

import { DummyIcon, SpinnerIcon } from "@/components/icons"
import { Button, buttonVariantsConfig, iconOptions } from "@/components/ui"

import { booleanControl, hideOnControls, selectControl } from "./utils"

const meta = {
  title: "Components/Buttons",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
    },
  },

  argTypes: {
    onClick: hideOnControls,
    variant: hideOnControls,
    size: selectControl(Object.keys(buttonVariantsConfig.size)),
    iconOption: selectControl(iconOptions),
    disabled: booleanControl,
    active: booleanControl,
    icon: hideOnControls,
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>
type ButtonStoryArgs = Story["args"]

const defaultArgs: ButtonStoryArgs = {
  children: "button",
  size: "medium",
  icon: <DummyIcon />,
  disabled: false,
  active: false,
  iconOption: undefined,
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
 * 다양한 버튼 조합 예시입니다.
 * - 아이콘만 있는 버튼
 * - 아이콘과 텍스트가 함께 있는 버튼
 * - 최소 너비가 적용된 버튼
 */
export const ButtonCombinations: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {/* 기본 버튼 */}
      <Button {...args}>button</Button>
      {/* 최소 너비 테스트입니다. 텍스트 내용이 없어도 최소 48px 를 보장합니다. */}
      <Button {...args}>min</Button>
      {/* 아이콘 + 텍스트 (왼쪽) */}
      <Button {...args} icon={<DummyIcon />} iconOption="before">
        button
      </Button>
      {/* 아이콘 + 텍스트 (오른쪽) */}
      <Button {...args} icon={<DummyIcon />} iconOption="after">
        button
      </Button>
      {/* 아이콘만 (사각형) */}
      <Button size={args.size} icon={<DummyIcon />} aria-label="icon button" />
      {/* 로딩 아이콘만 */}
      <Button
        size={args.size}
        icon={
          <DummyIcon>
            <SpinnerIcon className="relative" />
          </DummyIcon>
        }
        aria-label="loading"
      />
    </div>
  ),
  args: {
    ...defaultArgs,
    variant: "primary",
    size: "medium",
    icon: undefined,
    children: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          "다양한 버튼 조합 예시입니다. 아이콘만, 아이콘+텍스트, 최소 너비 등 실제 UI에서 자주 쓰이는 형태를 확인할 수 있습니다.",
      },
    },
  },
}
