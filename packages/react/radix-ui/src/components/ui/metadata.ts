import { z } from "zod"

export const ComponentMetadataSchema = z.object({
  categories: z.array(z.string()).describe('다중 카테고리 배열 (예: ["buttons", "forms"])'),
  hierarchy: z
    .object({
      parent: z.string().optional().describe("부모 카테고리 이름 (선택적)"),
      children: z.array(z.string()).optional().describe("자식 카테고리 배열 (선택적)"),
    })
    .describe("카테고리 계층 구조"),
  description: z.string().describe("컴포넌트 설명 텍스트"),
  tags: z.array(z.string()).optional().describe('추가 태그 배열 (예: ["interactive", "accessible"])'),
})

export type ComponentMetadata = z.infer<typeof ComponentMetadataSchema>

export const componentMetadata: Record<string, ComponentMetadata> = {
  // 버튼 컴포넌트들
  Button: {
    categories: ["buttons", "forms"],
    hierarchy: { parent: "basic", children: ["primary", "secondary"] },
    description: "기본 버튼 컴포넌트",
    tags: ["interactive", "accessible", "clickable"],
  },

  // 입력 컴포넌트들
  Textbox: {
    categories: ["boxes", "forms"],
    hierarchy: { parent: "input" },
    description: "텍스트 입력 컴포넌트",
    tags: ["input", "form", "text"],
  },

  // 헤더 컴포넌트들
  Header: {
    categories: ["navigation", "layout"],
    hierarchy: { parent: "layout" },
    description: "페이지 헤더 컴포넌트",
    tags: ["navigation", "layout", "header"],
  },

  // 배지 컴포넌트들
  Badge: {
    categories: ["feedback", "indicators"],
    hierarchy: { parent: "display" },
    description: "상태 표시 배지 컴포넌트",
    tags: ["status", "indicator", "notification"],
  },

  // 태그 컴포넌트들
  Tag: {
    categories: ["labels", "indicators"],
    hierarchy: { parent: "display" },
    description: "라벨 태그 컴포넌트",
    tags: ["label", "tag", "removable"],
  },

  // 브레드크럼 컴포넌트들
  Breadcrumb: {
    categories: ["navigation"],
    hierarchy: { parent: "navigation" },
    description: "페이지 경로 표시 컴포넌트",
    tags: ["navigation", "path", "hierarchy"],
  },

  // 체크박스 컴포넌트들
  Checkbox: {
    categories: ["forms", "inputs"],
    hierarchy: { parent: "input" },
    description: "체크박스 입력 컴포넌트",
    tags: ["input", "form", "selection", "boolean"],
  },

  // 콤보박스 컴포넌트들
  Combobox: {
    categories: ["forms", "inputs"],
    hierarchy: { parent: "input" },
    description: "콤보박스 선택 컴포넌트",
    tags: ["input", "form", "selection", "dropdown"],
  },

  // 날짜 선택 컴포넌트들
  DateRangePicker: {
    categories: ["forms", "inputs"],
    hierarchy: { parent: "input" },
    description: "날짜 범위 선택 컴포넌트",
    tags: ["input", "form", "date", "range", "picker"],
  },

  // 드롭다운 메뉴 컴포넌트들
  DropdownMenu: {
    categories: ["navigation", "overlays"],
    hierarchy: { parent: "overlay" },
    description: "드롭다운 메뉴 컴포넌트",
    tags: ["menu", "dropdown", "overlay", "navigation"],
  },

  // 모달 컴포넌트들
  Modal: {
    categories: ["overlays", "feedback"],
    hierarchy: { parent: "overlay" },
    description: "모달 대화상자 컴포넌트",
    tags: ["modal", "dialog", "overlay", "popup"],
  },

  // 페이지네이션 컴포넌트들
  Pagination: {
    categories: ["navigation", "data-display"],
    hierarchy: { parent: "navigation" },
    description: "페이지네이션 컴포넌트",
    tags: ["pagination", "navigation", "data", "paging"],
  },

  // 팝오버 컴포넌트들
  Popover: {
    categories: ["overlays", "feedback"],
    hierarchy: { parent: "overlay" },
    description: "팝오버 컴포넌트",
    tags: ["popover", "overlay", "tooltip", "popup"],
  },
} satisfies Record<string, ComponentMetadata>
