import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { addDays, subDays } from "date-fns"
import { DateRange } from "react-day-picker"

import { DateRangePicker } from "@/components/ui"

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    maxDays: {
      control: { type: "number", min: 1, max: 365 },
      description: "선택 가능한 최대 일수",
    },
    onChange: { action: "range-changed" },
  },
} as const

export default meta
type Story = StoryObj<typeof DateRangePicker>

// 기본 사용법
export const Default: Story = {
  args: {},
}

// 초기 범위 설정 (Uncontrolled)
export const WithInitialRange: Story = {
  args: {
    initialRange: {
      from: new Date(),
      to: addDays(new Date(), 14), // 2주 후
    },
  },
  parameters: {
    docs: {
      description: {
        story: "초기 날짜 범위가 설정된 uncontrolled 모드. 컴포넌트 내부에서 상태를 관리합니다.",
      },
    },
  },
}

// Controlled 모드
export const Controlled: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: addDays(new Date(), 7),
    })

    return (
      <div>
        <DateRangePicker
          value={range}
          onChange={setRange} // 타입 에러 해결
        />
        <div className="mt-4 rounded bg-gray-100 p-4">
          <h3 className="font-semibold">현재 선택된 범위:</h3>
          <p>시작: {range?.from?.toLocaleDateString() || "없음"}</p>
          <p>종료: {range?.to?.toLocaleDateString() || "없음"}</p>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: "Controlled 모드로, 부모 컴포넌트에서 날짜 범위를 관리합니다.",
      },
    },
  },
}

// 커스텀 제한 설정
export const CustomLimits: Story = {
  args: {
    maxDays: 30, // 최대 30일
    fromDate: subDays(new Date(), 7), // 1주일 전부터
    toDate: addDays(new Date(), 45), // 45일 후까지
  },
  parameters: {
    docs: {
      description: {
        story: "커스텀 제한 설정: 최대 30일, 1주일 전부터 45일 후까지 선택 가능",
      },
    },
  },
}

// 커스텀 스타일링
export const CustomStyled: Story = {
  args: {
    className: "border-2 border-blue-300 bg-blue-50",
    initialRange: {
      from: new Date(),
      to: addDays(new Date(), 10),
    },
  },
  parameters: {
    docs: {
      description: {
        story: "TailwindCSS를 사용한 커스텀 스타일링 예시",
      },
    },
  },
}
