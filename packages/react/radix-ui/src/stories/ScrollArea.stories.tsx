import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button, Checkbox, ScrollArea } from "@/components/ui"

const meta = {
  title: "Components/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: `ScrollArea는 커스텀 스크롤바를 제공하는 컴포넌트입니다.

**주요 특징:**
- **플로팅 스크롤바**: 네이티브 스크롤바와 달리 콘텐츠 영역을 차지하지 않고 overlay 형태로 표시됩니다.
- **크로스 플랫폼**: 모든 브라우저와 OS에서 일관된 스크롤바 스타일을 제공합니다.
- **접근성**: 키보드 네비게이션과 스크린 리더를 완벽 지원합니다.
- **커스터마이징**: 디자인 토큰을 통한 스타일 커스터마이징이 가능합니다.
- **양방향 지원**: 수직 및 수평 스크롤바를 모두 지원합니다.`,
      },
    },
  },
  argTypes: {
    className: {
      control: "text",
      description: "추가 CSS 클래스",
    },
    children: {
      control: false,
      description: "스크롤할 콘텐츠",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex h-[500px] items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: "기본",
  args: {
    className: "h-[200px] w-[350px] rounded-xs bg-surface-primary",
    children: (
      <div className="space-y-4">
        <h3 className="typo-sok-h6-14-700 text-heading">샘플 텍스트 콘텐츠</h3>
        <div className="typo-body text-body text-justify leading-relaxed hyphens-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat.
          {"\n\n"}
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          {"\n\n"}
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
          aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          {"\n\n"}
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
          dolores eos qui ratione voluptatem sequi nesciunt.
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "기본 ScrollArea 컴포넌트입니다. 긴 텍스트 내용을 스크롤하여 볼 수 있습니다.",
      },
    },
  },
}

export const HorizontalScroll: Story = {
  name: "수평 스크롤",
  args: {
    className: "w-[400px] h-[300px] rounded-xs bg-surface-primary",
    children: (
      <div className="space-y-4">
        <div className="p-4">
          <h3 className="typo-sok-h6-14-700 text-heading mb-2">Horizontal Scroll Demo</h3>
          <p className="typo-body text-body mb-4">This demonstrates horizontal scrolling with a wide content area.</p>
        </div>

        <div className="w-[800px] space-y-2 p-4">
          <div className="flex gap-4 border-b pb-2 font-semibold">
            <div className="w-[100px]">Name</div>
            <div className="w-[150px]">Email</div>
            <div className="w-[120px]">Department</div>
            <div className="w-[100px]">Role</div>
            <div className="w-[120px]">Start Date</div>
            <div className="w-[100px]">Status</div>
            <div className="w-[100px]">Actions</div>
          </div>

          {Array.from({ length: 15 }, (_, i) => (
            <div key={i} className="flex gap-4 border-b border-gray-100 py-2">
              <div className="typo-body w-[100px]">User {i + 1}</div>
              <div className="typo-body w-[150px]">user{i + 1}@example.com</div>
              <div className="typo-body w-[120px]">Engineering</div>
              <div className="typo-body w-[100px]">Developer</div>
              <div className="typo-body w-[120px]">2025-01-{String(i + 1).padStart(2, "0")}</div>
              <div className="w-[100px]">
                <span className="typo-caption rounded-xs bg-green-100 px-2 py-1 text-green-800">Active</span>
              </div>
              <div className="w-[100px]">
                <Button variant="ghostLink" size="small">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-[800px] rounded-xs border border-blue-200 bg-blue-50 p-4">
          <p className="typo-body text-body">
            The horizontal scrollbar appears at the bottom when content exceeds the container width. Just like the
            vertical scrollbar, it floats above the content without taking up space.
          </p>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "가로 스크롤 예제입니다. 넓은 테이블 형태의 콘텐츠를 가로로 스크롤할 수 있습니다.",
      },
    },
  },
}

export const ListContent: Story = {
  name: "목록 콘텐츠",
  args: {
    className: "h-[300px] w-[350px] rounded-xs bg-surface-primary",
    children: (
      <div className="p-2">
        <h3 className="typo-sok-h6-14-700 text-heading p-2">목록 아이템</h3>
        <ul className="space-y-1">
          {Array.from({ length: 50 }, (_, i) => (
            <li key={i} className="hover:bg-hover-bg gap-sm flex cursor-pointer flex-col rounded-xs p-2">
              <div className="typo-body text-primary font-bold">아이템 {i + 1}</div>
              <div className="typo-caption text-secondary">아이템 {i + 1}에 대한 설명</div>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "여러 리스트 아이템을 스크롤하여 표시하는 예제입니다.",
      },
    },
  },
}

export const Compact: Story = {
  name: "소형",
  args: {
    className: "h-[150px] w-[250px] rounded-xs bg-surface-primary",
    children: (
      <div className="p-2">
        <h3 className="typo-sok-h6-14-700 text-heading p-2">목록 아이템</h3>
        <ul className="space-y-1">
          {Array.from({ length: 25 }, (_, i) => (
            <li key={i} className="hover:bg-hover-bg gap-sm flex cursor-pointer flex-col rounded-xs p-2">
              <div className="typo-body text-primary">항목 {i + 1}</div>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "작은 크기의 ScrollArea 예제입니다.",
      },
    },
  },
}

export const FloatingScrollbarDemo: Story = {
  name: "플로팅 스크롤바 데모",
  args: {
    className: "h-[300px] w-[350px] rounded-xs bg-surface-primary",
    children: (
      <div className="space-y-4">
        <div className="rounded-xs border border-blue-200 bg-blue-50 p-4">
          <h3 className="typo-sok-h6-14-700 text-heading mb-2">플로팅 스크롤바 데모</h3>
          <p className="typo-body text-body mb-4 text-justify">
            스크롤 막대가 오버레이로 나타나 콘텐츠 공간을 차지하지 않는 점을 확인하세요. 이 텍스트는 컨테이너의
            가장자리까지 확장되어 스크롤 막대가 사용 가능한 너비를 줄이지 않고 콘텐츠 위에 떠 있는 것을 보여줍니다.
          </p>
        </div>

        <div className="rounded-xs border border-yellow-200 bg-yellow-50 p-4">
          <h4 className="typo-sok-h6-14-700 text-heading mb-2">네이티브 스크롤바와 사용자 정의 스크롤바 비교</h4>
          <p className="typo-body text-body text-justify">
            콘텐츠 너비를 줄이는 네이티브 스크롤바와 비교해 보세요. 이 사용자 정의 스크롤바는 모든 플랫폼에서 부드러운
            스크롤 경험을 제공하면서 전체 너비를 유지합니다. 스크롤바는 호버링하거나 적극적으로 스크롤할 때만
            나타납니다.
          </p>
        </div>

        <div className="space-y-2">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="gap-sm flex flex-col rounded-xs border bg-gray-50 p-3">
              <div className="typo-body text-primary">Item {i + 1} - 컨테이너의 전체 너비로 확장됩니다.</div>
              <div className="typo-caption text-secondary">플로팅 스크롤바는 사용 가능한 공간을 줄이지 않습니다.</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Floating scrollbar의 특성을 보여주는 데모입니다. 스크롤바가 콘텐츠 영역을 차지하지 않고 overlay 형태로 표시되는 것을 확인할 수 있습니다.",
      },
    },
  },
}

export const MixedContent: Story = {
  name: "혼합 콘텐츠",
  args: {
    className: "h-[350px] w-[400px] rounded-xs bg-surface-primary",
    children: (
      <div className="space-y-6">
        <div className="p-4">
          <h2 className="typo-sok-h5-16-700 text-heading mb-4">혼합 콘텐츠 데모</h2>
          <div className="typo-body text-body mb-6 leading-relaxed">
            다양한 콘텐츠 유형이 포함된 ScrollArea 예제입니다.
          </div>
        </div>

        <div className="border-l-accent bg-surface-secondary p-4">
          <h3 className="typo-sok-h6-14-700 text-accent mb-2">정보</h3>
          <p className="typo-body text-body">스크롤 가능한 콘텐츠 내부의 정보 섹션입니다.</p>
        </div>

        <div className="px-4">
          <h3 className="typo-sok-h6-14-700 text-heading mb-3">목록</h3>
          <ul className="space-y-2">
            {Array.from({ length: 10 }, (_, i) => (
              <li key={i} className="hover:bg-hover-bg flex items-center gap-3 rounded-xs p-2">
                <Checkbox />
                <span className="typo-body text-primary flex-1">항목 {i + 1}</span>
                <Button variant="ghostLink" size="small">
                  편집
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "텍스트, 리스트, 인터랙티브 요소가 혼합된 복잡한 내용을 스크롤하여 표시하는 예제입니다.",
      },
    },
  },
}
