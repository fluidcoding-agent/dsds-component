import { promises as fs } from "fs"
import path from "path"
import fg from "fast-glob"
import { z } from "zod"

import { componentMetadata, ComponentMetadataSchema } from "../../../react/radix-ui/src/components/ui/metadata"

export const ComponentInfoSchema = z.object({
  name: z.string().describe("컴포넌트 이름"),
  categories: z.array(z.string()).describe("카테고리 배열"),
  path: z.string().describe("컴포넌트 경로"),
  source: z.string().describe("소스 코드"),
  exports: z.array(z.string()).describe("내보낸 요소 목록"),
  hasStory: z.boolean().describe("Storybook 스토리 존재 여부"),
  hasTests: z.boolean().describe("테스트 파일 존재 여부"),
  hasDoc: z.boolean().describe("문서 파일 존재 여부"),
  metadata: ComponentMetadataSchema.optional().describe("메타데이터 (선택적)"),
})

export type ComponentInfo = z.infer<typeof ComponentInfoSchema>
export class ComponentRegistry {
  private componentsPath: string
  private components: Map<string, ComponentInfo> = new Map()
  private initialized = false

  constructor(componentsPath: string) {
    this.componentsPath = componentsPath
  }

  async initialize() {
    if (this.initialized) return

    try {
      await this.scanComponents()
      this.initialized = true
    } catch (error) {
      console.error("Failed to initialize component registry:", error)
      throw error
    }
  }

  private async scanComponents() {
    // src 디렉토리에서 컴포넌트 파일 스캔
    const componentFiles = await fg(
      [
        "src/components/ui/**/*.tsx",
        // "src/components/ui/**/*.ts",
        "!src/components/ui/**/*.stories.*",
        "!src/components/ui**/*.test.*",
        "!src/components/**/*.spec.*",
      ],
      {
        cwd: this.componentsPath,
        absolute: true,
      }
    )

    for (const file of componentFiles) {
      await this.processComponentFile(file)
    }
  }

  private async processComponentFile(filePath: string) {
    try {
      const source = await fs.readFile(filePath, "utf-8")
      const relativePath = path.relative(this.componentsPath, filePath)
      const name = this.extractComponentName(source, filePath)

      if (!name) return

      // 메타데이터에서 카테고리 가져오기 (fallback: 기존 categorizeComponent 사용)
      const meta = componentMetadata[name]
      const categories = meta?.categories ?? [this.categorizeComponent(relativePath)] // 다중 카테고리 지원
      const exports = this.extractExports(source)

      // 관련 파일 확인
      const hasStory = await this.checkFileExists(filePath, ".stories.tsx")
      const hasTests = await this.checkFileExists(filePath, ".test.tsx")
      const hasDoc = await this.checkFileExists(filePath, ".md")

      const componentInfo: ComponentInfo = {
        name,
        categories, // 배열로 저장
        path: relativePath,
        source,
        exports,
        hasStory,
        hasTests,
        hasDoc,
        ...(meta && { metadata: meta }), // 전체 메타데이터 추가
      }

      this.components.set(name, componentInfo)
    } catch (error) {
      console.warn(`Failed to process component file ${filePath}:`, error)
    }
  }

  private extractComponentName(source: string, filePath: string): string | null {
    // export된 컴포넌트 이름 추출
    const exportMatches = source.match(/export\s+(?:const|function)\s+(\w+)/g)
    if (exportMatches) {
      const componentName = exportMatches[0].match(/(\w+)$/)?.[1]
      if (componentName) return componentName
    }

    // 파일명에서 추출
    const fileName = path.basename(filePath, path.extname(filePath))
    return fileName !== "index" ? fileName : null
  }

  private categorizeComponent(relativePath: string): string {
    const pathParts = relativePath.split("/")

    // 디렉토리 기반 카테고리 결정
    if (pathParts.includes("buttons")) return "Buttons"
    if (pathParts.includes("boxes")) return "Boxes"
    if (pathParts.includes("forms")) return "Forms"
    if (pathParts.includes("overlays")) return "Overlays"
    if (pathParts.includes("navigation")) return "Navigation"
    if (pathParts.includes("feedback")) return "Feedback"
    if (pathParts.includes("layout")) return "Layout"

    return "Basic"
  }

  private extractExports(source: string): string[] {
    const exportRegex = /export\s+(?:const|function|class|interface|type)\s+(\w+)/g
    const exports: string[] = []
    let match

    while ((match = exportRegex.exec(source)) !== null) {
      exports.push(match[1])
    }

    return exports
  }

  private async checkFileExists(basePath: string, suffix: string): Promise<boolean> {
    const dir = path.dirname(basePath)
    const name = path.basename(basePath, path.extname(basePath))
    const checkPath = path.join(dir, `${name}${suffix}`)

    try {
      await fs.access(checkPath)
      return true
    } catch {
      return false
    }
  }

  async listComponents(category?: string, tag?: string): Promise<ComponentInfo[]> {
    await this.initialize()

    let components = Array.from(this.components.values())

    // 카테고리로 필터링
    if (category) {
      components = components.filter((comp) =>
        comp.categories.some((cat) => cat.toLowerCase() === category.toLowerCase())
      )
    }

    // 태그로 필터링
    if (tag) {
      components = components.filter((comp) => comp.metadata?.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()))
    }

    return components
  }

  // 카테고리 및 태그 검색을 위한 새로운 메서드
  async searchComponents(filters: {
    category?: string
    tag?: string
    name?: string
    description?: string
    includeMetadata?: boolean
  }): Promise<ComponentInfo[]> {
    await this.initialize()

    let components = Array.from(this.components.values())

    // 카테고리 필터
    if (filters.category) {
      components = components.filter((comp) =>
        comp.categories.some((cat) => cat.toLowerCase().includes(filters.category!.toLowerCase()))
      )
    }

    // 태그 필터
    if (filters.tag) {
      components = components.filter((comp) =>
        comp.metadata?.tags?.some((t) => t.toLowerCase().includes(filters.tag!.toLowerCase()))
      )
    }

    // 이름 검색
    if (filters.name) {
      components = components.filter((comp) => comp.name.toLowerCase().includes(filters.name!.toLowerCase()))
    }

    // 설명 검색
    if (filters.description) {
      components = components.filter((comp) =>
        comp.metadata?.description?.toLowerCase().includes(filters.description!.toLowerCase())
      )
    }

    return components
  }

  // 모든 카테고리 목록 반환
  async getAllCategories(): Promise<string[]> {
    await this.initialize()
    const categories = new Set<string>()

    for (const component of this.components.values()) {
      component.categories.forEach((cat) => categories.add(cat))
    }

    return Array.from(categories).sort()
  }

  // 모든 태그 목록 반환
  async getAllTags(): Promise<string[]> {
    await this.initialize()
    const tags = new Set<string>()

    for (const component of this.components.values()) {
      component.metadata?.tags?.forEach((tag) => tags.add(tag))
    }

    return Array.from(tags).sort()
  }

  async getComponent(name: string): Promise<ComponentInfo> {
    await this.initialize()

    const componentKey = [...this.components.keys()].find((key) => key.toLowerCase() === name.toLowerCase())
    if (!componentKey) {
      throw new Error(`Component '${name}' not found`)
    }

    const component = this.components.get(componentKey)!
    return component
  }

  async getComponentStyles(name: string): Promise<string | null> {
    await this.initialize()

    const component = this.components.get(name)
    if (!component) {
      throw new Error(`Component '${name}' not found`)
    }

    // 컴포넌트 파일 이름과 .css 확장자를 조합하여 스타일 파일 경로 생성
    // 예: src/components/ui/button.tsx -> src/styles/button.css
    const styleFilePath = path.join(this.componentsPath, "src", "styles", `${component.name.toLowerCase()}.css`)
    try {
      const styles = await fs.readFile(styleFilePath, "utf-8")
      return styles
    } catch (error) {
      console.warn(`Failed to load styles for component '${name}':`, error)
      return null
    }
  }

  async generateExample(
    name: string,
    variant?: string,
    useCase?: string
  ): Promise<{
    code: string
    description: string
  }> {
    const component = await this.getComponent(name)

    // 컴포넌트 정보를 활용한 예제 생성
    const mainExport = component.exports.find((exp) => exp === name) || component.exports[0] || name
    const props = this.generatePropsFromComponent(component, variant, useCase)
    const imports = this.generateImportsFromComponent(component)

    const code = `${imports}

export function ${mainExport}Example() {
  return (
    <${mainExport}${props}>
      ${this.generateExampleContent(name, useCase)}
    </${mainExport}>
  );
}`

    const description = `${name} 컴포넌트의 ${variant ? `${variant} 변형` : "기본"} 사용 예제${useCase ? ` (${useCase} 용도)` : ""}`

    return { code, description }
  }

  private generatePropsFromComponent(component: ComponentInfo, variant?: string, useCase?: string): string {
    const props: string[] = []

    // variant prop 추가
    if (variant) {
      props.push(`variant="${variant}"`)
    }

    // 컴포넌트 카테고리에 따른 기본 props 추가
    const categories = component.categories.map((it) => it.toLowerCase())

    if (categories.includes("forms")) {
      if (useCase === "required") {
        props.push("required")
      }
      if (component.name.toLowerCase().includes("textbox")) {
        props.push('placeholder="Enter text..."')
      }
    }

    if (categories.includes("buttons")) {
      if (useCase === "form") {
        props.push('type="submit"')
      }
      if (useCase === "disabled") {
        props.push("disabled")
      }
    }

    return props.length > 0 ? ` ${props.join(" ")}` : ""
  }

  private generateImportsFromComponent(component: ComponentInfo): string {
    // 컴포넌트의 실제 exports를 기반으로 import 문 생성
    const mainExports = component.exports.filter(
      (exp) => !exp.endsWith("Props") && !exp.endsWith("Ref") && !exp.startsWith("use")
    )

    if (mainExports.length === 0) {
      return `import { ${component.name} } from '@dsds/react-radix-ui';`
    }

    if (mainExports.length === 1) {
      return `import { ${mainExports[0]} } from '@dsds/react-radix-ui';`
    }

    return `import { ${mainExports.join(", ")} } from '@dsds/react-radix-ui';`
  }

  private generateExampleContent(componentName: string, useCase?: string): string {
    const name = componentName.toLowerCase()

    if (name.includes("button")) {
      return useCase === "form" ? "Submit" : "Click me"
    }

    if (name.includes("textbox") || name.includes("input")) {
      return "" // self-closing
    }

    if (name.includes("modal")) {
      return "Modal content goes here"
    }

    return `${componentName} content`
  }

  async getDesignTokens(category?: string): Promise<unknown> {
    try {
      // design/generated/css/global.css 파일에서 CSS 변수 추출
      const cssPath = path.resolve(this.componentsPath, "../../design/generated/css/global.css")
      const cssContent = await fs.readFile(cssPath, "utf-8")

      const tokens = this.extractCSSVariables(cssContent)

      if (category) {
        return tokens[category] || {}
      }

      return tokens
    } catch (error) {
      console.warn("Failed to load design tokens:", error)
      return {}
    }
  }

  private extractCSSVariables(css: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tokens: Record<string, any> = {}
    const variableRegex = /--([^:]+):\s*([^;]+);/g
    let match

    while ((match = variableRegex.exec(css)) !== null) {
      const [, name, value] = match
      const parts = name.split("-")

      if (parts.length > 1) {
        const category = parts[0]
        const subCategory = parts[1]
        const tokenName = parts.slice(2).join("-")

        if (!tokens[category]) tokens[category] = {}
        if (!tokens[category][subCategory]) tokens[category][subCategory] = {}

        tokens[category][subCategory][tokenName] = value.trim()
      }
    }

    return tokens
  }
}
