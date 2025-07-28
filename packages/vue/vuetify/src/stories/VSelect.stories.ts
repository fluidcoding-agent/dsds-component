import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

import { VSelect } from "@/components/ui"

const meta = {
  title: "Components/Select",
  component: VSelect,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component:
          "DSDS 디자인 시스템 Select 컴포넌트입니다. React DropdownMenu 구현과 동일한 Look & Feel을 제공합니다.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "ghost"],
      description: "Select의 변형 (기본값: default)",
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "Select의 크기",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Select 비활성화 상태",
    },
    clearable: {
      control: { type: "boolean" },
      description: "선택값 클리어 가능 여부",
    },
    multiple: {
      control: { type: "boolean" },
      description: "다중 선택 가능 여부",
    },
    placeholder: {
      control: { type: "text" },
      description: "플레이스홀더 텍스트",
    },
    itemTitle: {
      control: { type: "text" },
      description: "아이템 객체에서 표시할 텍스트 속성명 (기본값: title)",
    },
    itemValue: {
      control: { type: "text" },
      description: "아이템 객체에서 값으로 사용할 속성명 (기본값: value)",
    },
    width: {
      control: { type: "number" },
      description: "Select 너비 (px 단위, 기본값: 120)",
    },
  },
} satisfies Meta<typeof VSelect>

export default meta

type Story = StoryObj<typeof meta>

const sampleItems = [
  { value: "apple", title: "Apple" },
  { value: "banana", title: "Banana" },
  { value: "cherry", title: "Cherry" },
  { value: "date", title: "Date" },
  { value: "elderberry", title: "Elderberry" },
]

const defaultArgs: Story["args"] = {
  variant: "default",
  size: "medium",
  disabled: false,
  clearable: false,
  multiple: false,
  placeholder: "Select",
  itemTitle: "title",
  itemValue: "value",
  width: 120,
  items: sampleItems,
}

/**
 * 기본 Default Select입니다. DSDS 표준 스타일을 적용합니다.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VSelect },
    setup() {
      const selectedValue = ref(null)
      return { args, selectedValue, sampleItems }
    },
    template: `
      <VSelect
        v-bind="args"
        v-model="selectedValue"
        :items="sampleItems"
      />
    `,
  }),
  args: {
    ...defaultArgs,
  },
  parameters: {
    docs: {
      description: {
        story: "기본 Default Select입니다. React TextboxWrapper와 동일한 스타일을 적용합니다.",
      },
    },
  },
}

/**
 * Ghost Select입니다. 배경색이 채워진 스타일입니다.
 */
export const Ghost: Story = {
  render: (args) => ({
    components: { VSelect },
    setup() {
      const selectedValue = ref(null)
      return { args, selectedValue, sampleItems }
    },
    template: `
      <VSelect
        v-bind="args"
        v-model="selectedValue"
        :items="sampleItems"
      />
    `,
  }),
  args: {
    ...defaultArgs,
    variant: "ghost",
  },
  parameters: {
    docs: {
      description: {
        story: "Ghost Select입니다. React TextboxWrapper의 ghost variant와 동일한 스타일입니다.",
      },
    },
  },
}

/**
 * Select 크기 변형 예시 - React DropdownMenu와 동일한 패딩과 높이
 */
export const Sizes: Story = {
  render: () => ({
    components: { VSelect },
    setup() {
      const smallValue = ref(null)
      const mediumValue = ref(null)
      const largeValue = ref(null)
      return { sampleItems, smallValue, mediumValue, largeValue }
    },
    template: `
      <div class="flex flex-col gap-4 items-start">
        <VSelect variant="default" size="small" :items="sampleItems" v-model="smallValue" placeholder="Small Select" />
        <VSelect variant="default" size="medium" :items="sampleItems" v-model="mediumValue" placeholder="Medium Select" />
        <VSelect variant="default" size="large" :items="sampleItems" v-model="largeValue" placeholder="Large Select" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "다양한 크기의 Select들입니다. React DropdownMenu와 동일한 패딩과 높이를 적용합니다.",
      },
    },
  },
}

/**
 * 모든 변형 예시 - React DropdownMenu와 완전히 동일한 Look & Feel
 */
export const AllVariants: Story = {
  render: () => ({
    components: { VSelect },
    setup() {
      const defaultValue = ref(null)
      const ghostValue = ref(null)
      return { sampleItems, defaultValue, ghostValue }
    },
    template: `
      <div class="flex flex-col gap-4 items-start">
        <VSelect variant="default" :items="sampleItems" v-model="defaultValue" placeholder="Default Select" />
        <VSelect variant="ghost" :items="sampleItems" v-model="ghostValue" placeholder="Ghost Select" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "지원하는 모든 변형의 Select들입니다. React TextboxWrapper와 완전히 동일한 Look & Feel을 제공합니다.",
      },
    },
  },
}

/**
 * 다중 선택 및 클리어 가능한 Select
 */
export const Features: Story = {
  render: () => ({
    components: { VSelect },
    setup() {
      const clearableValue = ref(null)
      const multipleValue = ref([])
      const disabledValue = ref(null)
      return { sampleItems, clearableValue, multipleValue, disabledValue }
    },
    template: `
      <div class="flex flex-col gap-4 items-start">
        <VSelect :items="sampleItems" v-model="clearableValue" clearable placeholder="Clearable Select" />
        <VSelect :items="sampleItems" v-model="multipleValue" multiple chips placeholder="Multiple Select" />
        <VSelect :items="sampleItems" v-model="disabledValue" disabled placeholder="Disabled Select" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: "다양한 기능을 가진 Select들입니다. 클리어 가능, 다중 선택, 비활성화 등을 지원합니다.",
      },
    },
  },
}

/**
 * 다양한 데이터 형식 지원 - item-title과 item-value 사용
 */
export const CustomDataFormat: Story = {
  render: () => ({
    components: { VSelect },
    setup() {
      const customItems = [
        { id: 1, name: "사과", category: "과일" },
        { id: 2, name: "바나나", category: "과일" },
        { id: 3, name: "당근", category: "채소" },
        { id: 4, name: "브로콜리", category: "채소" },
      ]

      const simpleItems = ["Apple", "Banana", "Cherry", "Date"]

      const customValue = ref(null)
      const simpleValue = ref(null)

      return { customItems, simpleItems, customValue, simpleValue }
    },
    template: `
      <div class="flex flex-col gap-4 items-start">
        <VSelect
          :items="customItems"
          v-model="customValue"
          item-title="name"
          item-value="id"
          placeholder="Custom object format (name/id)"
        />
        <VSelect
          :items="simpleItems"
          v-model="simpleValue"
          placeholder="Simple string array"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "다양한 데이터 형식을 지원합니다. 객체 배열의 경우 item-title과 item-value로 표시할 속성과 값 속성을 지정할 수 있습니다.",
      },
    },
  },
}
