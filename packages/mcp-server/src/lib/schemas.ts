// src/lib/schemas.ts
import { z } from "zod"

// --- 재귀적 속성/그룹 스키마 정의 ---

// 단일 이름 있는 속성을 정의합니다.
export type NamedProperty = {
  name: string
  type: string
  optional: boolean
  description?: string
  defaultValue?: string
}

// Union 또는 Intersection 그룹을 정의합니다.
export type PropertyGroup = { union: PropertyOrGroup[] } | { intersection: PropertyOrGroup[] }

// properties 배열의 각 요소는 이름 있는 속성이거나 그룹일 수 있습니다.
export type PropertyOrGroup = string | NamedProperty | PropertyGroup

// 이름 있는 단일 속성
const NamedPropertySchema = z.object({
  name: z.string().describe("속성의 이름"),
  type: z.string().describe("속성의 타입 문자열"),
  optional: z.boolean().describe("선택적 속성 여부"),
  description: z.string().optional().describe("JSDoc 또는 주석에서 추출된 설명"),
})

// Union 또는 Intersection 그룹
// z.lazy를 사용하여 자기 자신(PropertyOrGroupSchema)을 참조하는 재귀 구조를 정의합니다.
const PropertyGroupSchema: z.ZodUnion<[typeof PropertyGroupSchema, typeof PropertyGroupSchema]> = z.lazy(() =>
  z.union([
    z.object({ union: z.array(PropertyOrGroupSchema).describe("Union 타입의 멤버들") }),
    z.object({ intersection: z.array(PropertyOrGroupSchema).describe("Intersection 타입의 멤버들") }),
  ])
)

// 속성 또는 그룹을 나타내는 최종 스키마
export const PropertyOrGroupSchema = z.union([NamedPropertySchema, PropertyGroupSchema])

// --- 주요 정보 스키마 정의 ---

export const TypeInfoSchema = z
  .object({
    name: z.string().describe("Props 타입의 이름"),
    kind: z.enum(["interface", "type"]).describe("선언 종류"),
    properties: z.array(PropertyOrGroupSchema).optional().describe("직접 정의된 속성 및 그룹 목록"),
    extendsFrom: z.array(z.string()).optional().describe("상속받는 타입/인터페이스 목록"),
    genericParameters: z.array(z.string()).optional().describe("제네릭 파라미터 목록"),
  })
  .optional()
  .describe("컴포넌트의 메인 Props 타입 정보")

// 컴포넌트 파일의 모든 타입 정보를 담는 스키마 (Source of Truth)
export const ComponentTypeInfoSchema = z.object({
  componentName: z.string().describe("분석 대상 컴포넌트의 이름"),
  propsInfo: TypeInfoSchema,
  refType: z.string().optional().describe("컴포넌트의 ref 타입"),
  exports: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        kind: z.enum(["component", "hook", "type", "constant"]),
      })
    )
    .describe("파일에서 내보내는 모든 요소"),
  dependencies: z.array(z.string()).describe("파일의 외부 의존성 목록"),
  types: z.record(z.string(), z.array(PropertyOrGroupSchema)).describe("파일에 정의된 모든 타입의 상세 구조"),
})
export type ComponentTypeInfo = z.infer<typeof ComponentTypeInfoSchema>

// 컴포넌트 목록 아이템을 위한 기본 정보 스키마
export const ComponentInfoSchema = z.object({
  name: z.string().describe("컴포넌트 이름"),
  category: z.array(z.string()).describe("컴포넌트 카테고리 배열"),
  path: z.string().describe("컴포넌트 소스 파일 경로"),
  source: z.string().describe("컴포넌트의 전체 소스 코드"),
  // ... 기타 필요한 기본 정보 필드들
})
export type ComponentInfo = z.infer<typeof ComponentInfoSchema>

// 최종적으로 서버가 반환할 상세 정보 스키마
// ComponentInfoSchema를 확장하여 상세 타입 정보를 선택적으로 포함합니다.
export const ComponentDetailsSchema = ComponentInfoSchema.extend({
  types: ComponentTypeInfoSchema.optional().describe("컴포넌트 파일의 모든 타입에 대한 상세 분석 정보"),
})
export type ComponentDetails = z.infer<typeof ComponentDetailsSchema>
