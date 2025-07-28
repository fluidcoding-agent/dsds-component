import { promises as fs } from "fs"
import path from "path"
import fg from "fast-glob"

export interface DesignGuideSection {
  title: string
  content: string
  file: string
}

export interface DesignPattern {
  name: string
  description: string
  components: string[]
  example: string
  guidelines: string[]
  category: string
}

export interface ComponentComposition {
  component: string
  role: string
  props?: Record<string, unknown>
}

export class DesignGuideAnalyzer {
  private designDocsPath: string

  constructor(designDocsPath?: string) {
    // 기본적으로 프로젝트 루트의 design/docs 경로 사용
    this.designDocsPath = designDocsPath || path.resolve(process.cwd(), "design/docs")
  }

  async getDesignSystemGuide(
    section?: string,
    searchQuery?: string
  ): Promise<{
    sections: DesignGuideSection[]
    recommendations?: string[]
  }> {
    try {
      const docFiles = await fg(["**/*.md"], {
        cwd: this.designDocsPath,
        absolute: true,
      })

      let allSections: DesignGuideSection[] = []

      if (searchQuery) {
        // 검색 쿼리를 공백으로 토큰화
        const tokens = searchQuery
          .toLowerCase()
          .split(/\s+/)
          .filter((token) => token.length > 0)

        // 각 토큰별로 검색 수행하여 결과 병합
        for (const token of tokens) {
          const tokenSections = await this.searchDocumentsByToken(docFiles, token, section)
          allSections = this.mergeSections(allSections, tokenSections)
        }

        // section 필터 적용 후 결과가 없으면 section 없이 다시 검색
        if (section && allSections.length === 0) {
          for (const token of tokens) {
            const tokenSections = await this.searchDocumentsByToken(docFiles, token, undefined)
            allSections = this.mergeSections(allSections, tokenSections)
          }
        }

        // "tokens" 키워드가 포함된 경우 디자인 토큰 정보 추가
        if (tokens.includes("tokens")) {
          const designTokens = this.getDefaultDesignTokens()
          const tokenSection: DesignGuideSection = {
            title: "Design Tokens",
            content: `# Design Tokens\n\n디자인 시스템의 토큰 정보입니다.\n\n\`\`\`json\n${JSON.stringify(designTokens, null, 2)}\n\`\`\``,
            file: "design-tokens.json",
          }
          allSections.push(tokenSection)
        }
      } else {
        // 기존 로직: 모든 파일 검색
        allSections = await this.searchAllDocuments(docFiles, section)

        // section 필터 적용 후 결과가 없으면 section 없이 다시 검색
        if (section && allSections.length === 0) {
          allSections = await this.searchAllDocuments(docFiles, undefined)
        }
      }

      const recommendationSections = await this.searchAllDocuments(docFiles, undefined)

      return {
        sections: allSections,
        recommendations: this.generateRecommendations(recommendationSections, searchQuery),
      }
    } catch (error) {
      throw new Error(`Failed to load design guide: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async getComponentComposition(
    useCase: string,
    complexity: "simple" | "medium" | "complex"
  ): Promise<{
    composition: ComponentComposition[]
    example: string
    guidelines: string[]
  }> {
    // 사용 사례별 컴포넌트 조합 패턴 정의
    const compositionPatterns: Record<string, Record<string, ComponentComposition[]>> = {
      form: {
        simple: [
          { component: "Form", role: "container" },
          { component: "Input", role: "field", props: { type: "text" } },
          { component: "Button", role: "submit", props: { type: "submit" } },
        ],
        medium: [
          { component: "Form", role: "container" },
          { component: "FormField", role: "field-wrapper" },
          { component: "Label", role: "label" },
          { component: "Input", role: "input" },
          { component: "FormMessage", role: "validation" },
          { component: "Button", role: "submit" },
        ],
        complex: [
          { component: "Form", role: "container" },
          { component: "FormField", role: "field-wrapper" },
          { component: "Label", role: "label" },
          { component: "Input", role: "input" },
          { component: "FormDescription", role: "description" },
          { component: "FormMessage", role: "validation" },
          { component: "Select", role: "dropdown" },
          { component: "Checkbox", role: "option" },
          { component: "Button", role: "submit" },
          { component: "Button", role: "cancel", props: { variant: "outline" } },
        ],
      },
      dashboard: {
        simple: [
          { component: "Card", role: "container" },
          { component: "CardHeader", role: "header" },
          { component: "CardTitle", role: "title" },
          { component: "CardContent", role: "content" },
        ],
        medium: [
          { component: "Grid", role: "layout" },
          { component: "Card", role: "widget" },
          { component: "CardHeader", role: "header" },
          { component: "CardTitle", role: "title" },
          { component: "CardDescription", role: "description" },
          { component: "CardContent", role: "content" },
          { component: "Badge", role: "status" },
        ],
        complex: [
          { component: "Layout", role: "page-container" },
          { component: "Header", role: "navigation" },
          { component: "Sidebar", role: "navigation" },
          { component: "Grid", role: "layout" },
          { component: "Card", role: "widget" },
          { component: "Chart", role: "data-visualization" },
          { component: "Table", role: "data-display" },
          { component: "Pagination", role: "navigation" },
        ],
      },
      navigation: {
        simple: [
          { component: "NavigationMenu", role: "container" },
          { component: "NavigationMenuItem", role: "item" },
          { component: "NavigationMenuLink", role: "link" },
        ],
        medium: [
          { component: "NavigationMenu", role: "container" },
          { component: "NavigationMenuItem", role: "item" },
          { component: "NavigationMenuTrigger", role: "trigger" },
          { component: "NavigationMenuContent", role: "dropdown" },
          { component: "NavigationMenuLink", role: "link" },
        ],
        complex: [
          { component: "NavigationMenu", role: "container" },
          { component: "NavigationMenuItem", role: "item" },
          { component: "NavigationMenuTrigger", role: "trigger" },
          { component: "NavigationMenuContent", role: "dropdown" },
          { component: "NavigationMenuSub", role: "submenu" },
          { component: "NavigationMenuIndicator", role: "indicator" },
          { component: "NavigationMenuViewport", role: "viewport" },
        ],
      },
    }

    const composition = compositionPatterns[useCase]?.[complexity] || []

    return {
      composition,
      example: this.generateCompositionExample(composition, useCase),
      guidelines: this.getCompositionGuidelines(useCase),
    }
  }

  async searchDesignPatterns(query: string, category?: string): Promise<DesignPattern[]> {
    // 실제로는 design/docs에서 패턴을 파싱하거나 별도의 패턴 정의 파일에서 로드
    const patterns: DesignPattern[] = [
      {
        name: "Form Layout",
        description: "사용자 입력을 위한 폼 레이아웃 패턴",
        components: ["Form", "FormField", "Input", "Label", "Button"],
        example: "Form with validation and proper spacing",
        guidelines: ["Use consistent spacing", "Provide clear labels", "Show validation feedback"],
        category: "forms",
      },
      {
        name: "Card Grid",
        description: "콘텐츠를 카드 형태로 그리드 배치하는 패턴",
        components: ["Grid", "Card", "CardHeader", "CardContent"],
        example: "Responsive card grid layout",
        guidelines: ["Maintain consistent card sizes", "Use appropriate spacing", "Ensure responsive behavior"],
        category: "layout",
      },
      {
        name: "Navigation Menu",
        description: "사이트 내 네비게이션을 위한 메뉴 패턴",
        components: ["NavigationMenu", "NavigationMenuItem", "NavigationMenuTrigger", "NavigationMenuContent"],
        example: "Multi-level navigation with dropdowns",
        guidelines: ["Highlight current page", "Maintain consistency", "Consider accessibility"],
        category: "navigation",
      },
      {
        name: "Data Table",
        description: "데이터를 테이블 형태로 표시하는 패턴",
        components: ["Table", "TableHeader", "TableBody", "TableRow", "TableCell"],
        example: "Sortable and filterable data table",
        guidelines: ["Use proper headers", "Implement sorting", "Consider pagination"],
        category: "data-display",
      },
      {
        name: "Toast Notification",
        description: "사용자에게 피드백을 제공하는 알림 패턴",
        components: ["Toast", "ToastTitle", "ToastDescription", "ToastAction"],
        example: "Success and error notifications",
        guidelines: ["Keep messages concise", "Provide clear actions", "Auto-dismiss appropriately"],
        category: "feedback",
      },
    ]

    return patterns.filter((pattern) => {
      const matchesQuery =
        pattern.name.toLowerCase().includes(query.toLowerCase()) ||
        pattern.description.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = !category || pattern.category === category
      return matchesQuery && matchesCategory
    })
  }

  async getDesignTokens(): Promise<{
    colors: Record<string, unknown>
    typography: Record<string, unknown>
    spacing: Record<string, unknown>
    breakpoints: Record<string, unknown>
  }> {
    try {
      // design/docs/tokens.md 또는 별도의 토큰 파일에서 로드
      const tokenFiles = await fg(["tokens.md", "design-tokens.md", "tokens/**/*.md"], {
        cwd: this.designDocsPath,
        absolute: true,
      })

      if (tokenFiles.length === 0) {
        // 기본 토큰 반환
        return this.getDefaultDesignTokens()
      }

      const tokenFile = tokenFiles[0]
      await fs.readFile(tokenFile, "utf-8")

      return this.parseDesignTokens()
    } catch (error) {
      console.warn("Failed to load design tokens:", error)
      return this.getDefaultDesignTokens()
    }
  }

  private findSectionEndIndex(lines: string[], startIndex: number, sectionMarker: string): number {
    for (let i = startIndex; i < lines.length; i++) {
      if (lines[i].trim().startsWith(sectionMarker)) {
        return i
      }
    }
    return lines.length
  }

  private filterSubsectionsByKeyword(sectionLines: string[], searchQuery: string): string[] {
    const result: string[] = []
    const keyword = searchQuery.toLowerCase()

    // 섹션 헤더 추가
    if (sectionLines.length > 0) {
      result.push(sectionLines[0])
    }

    let currentSubsection: string[] = []
    let currentSubsectionHeader = ""

    for (let i = 1; i < sectionLines.length; i++) {
      const line = sectionLines[i]

      if (line.trim().startsWith("### ")) {
        // 이전 서브섹션 처리
        if (currentSubsection.length > 0 && currentSubsectionHeader.toLowerCase().includes(keyword)) {
          result.push("")
          result.push(currentSubsectionHeader)
          result.push(...currentSubsection)
        }

        // 새로운 서브섹션 시작
        currentSubsectionHeader = line
        currentSubsection = []
      } else if (line.trim().startsWith("## ")) {
        // 다른 메인 섹션 시작 - 처리 중단
        break
      } else {
        currentSubsection.push(line)
      }
    }

    // 마지막 서브섹션 처리
    if (currentSubsection.length > 0 && currentSubsectionHeader.toLowerCase().includes(keyword)) {
      result.push("")
      result.push(currentSubsectionHeader)
      result.push(...currentSubsection)
    }

    return result
  }

  private extractTitle(content: string): string | null {
    const match = content.match(/^#\s+(.+)$/m)
    return match ? match[1] : null
  }

  private generateRecommendations(sections: DesignGuideSection[], searchQuery?: string): string[] {
    const recommendations: string[] = []

    // design-system.md 파일에서 개발 시 주의사항 섹션 찾기
    const designSystemSection = sections.find(
      (section) =>
        section.file.toLowerCase().includes("design-system") || section.title.toLowerCase().includes("design system")
    )

    if (designSystemSection) {
      const content = designSystemSection.content
      const recommendationsSectionMatch = content.match(
        /## 개발 시 주의사항 \(Recommendations\)\n([\s\S]*?)(?=^## |$)/i
      )

      if (recommendationsSectionMatch) {
        const recommendationsContent = recommendationsSectionMatch[1]

        // ### Basics 섹션 기본 내용 항상 추가
        const basicsMatch = recommendationsContent.match(/### Basics([\s\S]*?)(?=### |$)/i)
        if (basicsMatch) {
          const basicsContent = basicsMatch[1]
          const basicsList = this.extractListItems(basicsContent)
          recommendations.push(...basicsList)
        }

        // searchQuery가 있는 경우 키워드 기반 하위 섹션 찾기
        if (searchQuery) {
          const tokens = searchQuery
            .toLowerCase()
            .split(/\s+/)
            .filter((token) => token.length > 0)
          const subsectionMatches = recommendationsContent.match(/### ([^#\n]+)([\s\S]*?)(?=### |$)/gi)

          if (subsectionMatches) {
            for (const subsectionMatch of subsectionMatches) {
              const titleMatch = subsectionMatch.match(/### ([^#\n]+)/)
              if (titleMatch) {
                const subsectionTitle = titleMatch[1].toLowerCase()

                // 토큰 중 하나라도 하위 섹션 제목에 포함되면 해당 섹션 내용 추가
                const hasMatchingToken = tokens.some(
                  (token) =>
                    subsectionTitle.includes(token.toLowerCase()) ||
                    // 특별한 매칭 규칙
                    (token === "color" && (subsectionTitle.includes("color") || subsectionTitle.includes("색상"))) ||
                    (token === "typography" &&
                      (subsectionTitle.includes("typography") ||
                        subsectionTitle.includes("타이포") ||
                        subsectionTitle.includes("폰트"))) ||
                    (token === "spacing" &&
                      (subsectionTitle.includes("spacing") ||
                        subsectionTitle.includes("간격") ||
                        subsectionTitle.includes("여백"))) ||
                    (token === "layout" &&
                      (subsectionTitle.includes("layout") || subsectionTitle.includes("레이아웃"))) ||
                    (token === "grid" && (subsectionTitle.includes("grid") || subsectionTitle.includes("그리드"))) ||
                    (token === "component" &&
                      (subsectionTitle.includes("component") || subsectionTitle.includes("컴포넌트")))
                )

                if (hasMatchingToken) {
                  const subsectionContent = subsectionMatch.replace(/### [^#\n]+\n/, "")
                  const subsectionList = this.extractListItems(subsectionContent)
                  recommendations.push(...subsectionList)
                }
              }
            }
          }
        }
      }
    }

    // 중복 제거
    return [...new Set(recommendations)]
  }

  private extractListItems(content: string): string[] {
    const items: string[] = []
    const lines = content.split("\n")

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.match(/^\d+\.\s+/) || trimmed.startsWith("- ")) {
        // 번호 목록 또는 불릿 목록에서 내용 추출
        const item = trimmed.replace(/^\d+\.\s+/, "").replace(/^- /, "")
        if (item) {
          items.push(item)
        }
      }
    }

    return items
  }

  private generateCompositionExample(composition: ComponentComposition[], useCase: string): string {
    const imports = [...new Set(composition.map((c) => c.component))].join(", ")

    return `import { ${imports} } from "@dsds/react"

export function ${useCase.charAt(0).toUpperCase() + useCase.slice(1)}Example() {
  return (
    ${this.generateJSXFromComposition(composition)}
  )
}`
  }

  private generateJSXFromComposition(composition: ComponentComposition[]): string {
    const indent = "    "
    let jsx = ""
    let currentIndent = indent

    for (let i = 0; i < composition.length; i++) {
      const comp = composition[i]
      const props = comp.props
        ? Object.entries(comp.props)
            .map(([key, value]) => `${key}="${value}"`)
            .join(" ")
        : ""

      if (comp.role === "container" || comp.role === "wrapper") {
        jsx += `${currentIndent}<${comp.component}${props ? ` ${props}` : ""}>\n`
        currentIndent += "  "
      } else {
        jsx += `${currentIndent}<${comp.component}${props ? ` ${props}` : ""} />\n`
      }
    }

    // 닫는 태그 추가
    const containers = composition.filter((c) => c.role === "container" || c.role === "wrapper")
    for (let i = containers.length - 1; i >= 0; i--) {
      currentIndent = currentIndent.slice(0, -2)
      jsx += `${currentIndent}</${containers[i].component}>\n`
    }

    return jsx.trim()
  }

  private getCompositionGuidelines(useCase: string): string[] {
    const guidelines: Record<string, string[]> = {
      form: [
        "폼 필드는 논리적 순서로 배치하세요",
        "필수 필드는 명확히 표시하세요",
        "유효성 검사 메시지를 적절히 제공하세요",
        "적절한 간격과 그룹핑을 사용하세요",
      ],
      dashboard: [
        "중요한 정보는 상단에 배치하세요",
        "적절한 시각적 계층 구조를 유지하세요",
        "로딩 상태를 고려하세요",
        "반응형 그리드 시스템을 활용하세요",
      ],
      navigation: [
        "현재 페이지를 명확히 표시하세요",
        "일관된 네비게이션 패턴을 유지하세요",
        "접근성을 고려하세요",
        "모바일 환경에서의 사용성을 고려하세요",
      ],
    }

    return guidelines[useCase] || []
  }

  private parseDesignTokens(): {
    colors: Record<string, unknown>
    typography: Record<string, unknown>
    spacing: Record<string, unknown>
    breakpoints: Record<string, unknown>
    radius: Record<string, unknown>
    shadows: Record<string, unknown>
    opacity: Record<string, unknown>
  } {
    // 마크다운에서 디자인 토큰 파싱 로직
    // 실제로는 더 정교한 파싱이 필요
    return this.getDefaultDesignTokens()
  }

  private getDefaultDesignTokens(): {
    colors: Record<string, unknown>
    typography: Record<string, unknown>
    spacing: Record<string, unknown>
    breakpoints: Record<string, unknown>
    radius: Record<string, unknown>
    shadows: Record<string, unknown>
    opacity: Record<string, unknown>
  } {
    return {
      colors: {
        // Semantic Colors
        brand: "#3392d3",
        info: "#3392d3",
        success: "#96d552",
        warning: "#ffb546",
        danger: "#ff4337",

        // Neutral Colors (17 steps)
        neutral: {
          "01": "#ffffff",
          "02": "#fafbfc",
          "03": "#f7f9fb",
          "04": "#f3f6f8",
          "05": "#eff4f6",
          "06": "#edf2f4",
          "07": "#e4e9ed",
          "08": "#dadfe4",
          "09": "#ccd1d6",
          "10": "#c0c4c9",
          "11": "#b2b6bb",
          "12": "#a5abb1",
          "13": "#90969d",
          "14": "#767d84",
          "15": "#565e66",
          "16": "#384047",
          "17": "#283037",
        },

        // Oxygen Red (16 steps)
        "oxygen-red": {
          "01": "#fff8f8",
          "02": "#fff6f5",
          "03": "#ffeceb",
          "04": "#ffd9d7",
          "05": "#ffc7c3",
          "06": "#ffb4af",
          "07": "#ff8e87",
          "08": "#ff695f",
          "09": "#ff4337",
          "10": "#d2362c",
          "11": "#a52921",
          "12": "#781c16",
          "13": "#621611",
          "14": "#4b0f0b",
          "15": "#390906",
          "16": "#230200",
        },

        // Die Green (16 steps)
        "die-green": {
          "01": "#fafdf7",
          "02": "#f8fcf3",
          "03": "#f5fbee",
          "04": "#eaf7dc",
          "05": "#e0f2cb",
          "06": "#d5eeba",
          "07": "#c0e697",
          "08": "#abdd75",
          "09": "#96d552",
          "10": "#7cb143",
          "11": "#628d34",
          "12": "#486826",
          "13": "#3b561e",
          "14": "#2e4417",
          "15": "#21320f",
          "16": "#142008",
        },

        // Wafer Blue (16 steps)
        "wafer-blue": {
          "01": "#f7fbfd",
          "02": "#f3f8fd",
          "03": "#e6f1fa",
          "04": "#cce4f4",
          "05": "#b3d6ef",
          "06": "#99c9e9",
          "07": "#66adde",
          "08": "#3392d3",
          "09": "#0077c8",
          "10": "#0064a7",
          "11": "#005087",
          "12": "#003d66",
          "13": "#003356",
          "14": "#002946",
          "15": "#002035",
          "16": "#001625",
        },

        // Background Colors
        surface: {
          primary: "#ffffff",
          secondary: "#fafbfc",
          tertiary: "#f3f6f8",
        },

        // Text Colors
        text: {
          primary: "#384047",
          secondary: "#565e66",
          tertiary: "#767d84",
          disabled: "#b2b6bb",
          emphasized: "#283037",
        },

        // Border Colors
        border: {
          primary: "#dadfe4",
          secondary: "#e4e9ed",
          tertiary: "#edf2f4",
        },
      },
      typography: {
        fontFamily: {
          sans: ["SamsungOneKoreanNoF", "ui-sans-serif", "system-ui", "sans-serif"],
          heading: ["Samsung Sharp Sans", "SamsungOneKoreanNoF", "ui-sans-serif", "system-ui", "sans-serif"],
          mono: ["D2Coding", "Consolas", "Courier New", "ui-monospace", "monospace"],
        },
        fontSize: {
          // Samsung One Korean NoF sizes
          "sok-h1": "44px",
          "sok-h2": "32px",
          "sok-h3": "24px",
          "sok-h4": "20px",
          "sok-h5": "16px",
          "sok-h6": "14px",
          "sok-h7": "12px",
          "sok-body": "14px",
          "sok-caption": "12px",
          "sok-footnote": "11px",

          // Samsung Sharp Sans sizes
          "sss-h1": "40px",
          "sss-h2": "28px",
          "sss-h3": "22px",
          "sss-h4": "19px",
          "sss-h5": "13px",

          // Base sizes
          base: "14px", // 0.875rem
          xs: "11px",
          sm: "12px",
          md: "14px",
          lg: "16px",
          xl: "20px",
          "2xl": "24px",
          "3xl": "32px",
          "4xl": "44px",
        },
        fontWeight: {
          normal: "400",
          bold: "700",
        },
        lineHeight: {
          none: "1",
          tight: "1.25",
          normal: "1.5",
          relaxed: "1.625",
          loose: "2",
        },
      },
      spacing: {
        // Pixel-based spacing
        "0": "0px",
        "2px": "2px",
        "4px": "4px",
        "5px": "5px",
        "6px": "6px",
        "8px": "8px",
        "12px": "12px",
        "16px": "16px",
        "20px": "20px",
        "24px": "24px",
        "28px": "28px",
        "32px": "32px",
        "36px": "36px",
        "40px": "40px",

        // Semantic spacing (Compact density)
        sm: "4px",
        md: "8px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "40px",

        // Component-specific spacing
        "button-px-small": "6px",
        "button-px-medium": "8px",
        "button-px-large": "8px",
        "button-py-small": "0px",
        "button-py-medium": "2px",
        "button-py-large": "4px",
        "button-gap": "4px",

        "textbox-py-small": "2px",
        "textbox-py-medium": "4px",
        "textbox-py-large": "6px",
      },
      breakpoints: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      radius: {
        none: "0px",
        "2xs": "2px",
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "40px",
        full: "9999px",
      },
      shadows: {
        sm: "var(--shadow-1)",
        md: "var(--shadow-2)",
        lg: "var(--shadow-3)",
        xl: "var(--shadow-4)",
        "2xl": "var(--shadow-5)",
        none: "none",
      },
      opacity: {
        0: "0",
        "dim-1": "0.72",
        "dim-2": "0.56",
        "dim-3": "0.40",
        "dim-4": "0.16",
        "dim-5": "0.08",
        full: "1",
      },
    }
  }

  private async searchDocumentsByToken(
    docFiles: string[],
    token: string,
    section?: string
  ): Promise<DesignGuideSection[]> {
    const sections: DesignGuideSection[] = []

    for (const file of docFiles) {
      const content = await fs.readFile(file, "utf-8")
      const fileName = path.basename(file, ".md")

      // 섹션 필터링
      if (section && !fileName.toLowerCase().includes(section.toLowerCase())) {
        continue
      }

      // 토큰 검색 필터링
      if (!content.toLowerCase().includes(token)) {
        continue
      }

      let processedContent = content

      // 토큰별 특별 처리
      processedContent = this.processContentForTokenSearch(content, token)

      sections.push({
        title: this.extractTitle(content) || fileName,
        content: processedContent,
        file: path.relative(this.designDocsPath, file),
      })
    }

    return sections
  }

  private async searchAllDocuments(docFiles: string[], section?: string): Promise<DesignGuideSection[]> {
    const sections: DesignGuideSection[] = []

    for (const file of docFiles) {
      const content = await fs.readFile(file, "utf-8")
      const fileName = path.basename(file, ".md")

      // 섹션 필터링
      if (section && !fileName.toLowerCase().includes(section.toLowerCase())) {
        continue
      }

      sections.push({
        title: this.extractTitle(content) || fileName,
        content,
        file: path.relative(this.designDocsPath, file),
      })
    }

    return sections
  }

  private mergeSections(
    existingSections: DesignGuideSection[],
    newSections: DesignGuideSection[]
  ): DesignGuideSection[] {
    const mergedSections: DesignGuideSection[] = [...existingSections]

    for (const newSection of newSections) {
      const existingIndex = mergedSections.findIndex((existing) => existing.file === newSection.file)

      if (existingIndex !== -1) {
        // 같은 파일의 섹션이 이미 존재하는 경우 내용 병합
        const existingSection = mergedSections[existingIndex]
        mergedSections[existingIndex] = {
          ...existingSection,
          content: this.mergeContentSections(existingSection.content, newSection.content),
        }
      } else {
        // 새로운 섹션 추가
        mergedSections.push(newSection)
      }
    }

    return mergedSections
  }

  private mergeContentSections(existingContent: string, newContent: string): string {
    const existingLines = existingContent.split("\n")
    const newLines = newContent.split("\n")

    // 제목과 소개 부분은 기존 것 유지
    const titleEndIndex = this.findSectionEndIndex(existingLines, 0, "## ")
    const baseContent = existingLines.slice(0, titleEndIndex)

    // 새로운 내용에서 메인 섹션들 추출
    const newSections: string[] = []
    let currentSection: string[] = []
    let inMainSection = false

    for (const line of newLines) {
      if (line.trim().startsWith("## ")) {
        if (currentSection.length > 0) {
          newSections.push(currentSection.join("\n"))
        }
        currentSection = [line]
        inMainSection = true
      } else if (inMainSection) {
        currentSection.push(line)
      }
    }

    if (currentSection.length > 0) {
      newSections.push(currentSection.join("\n"))
    }

    // 기존 내용과 새로운 섹션 병합
    const result = [...baseContent]
    for (const section of newSections) {
      if (!existingContent.includes(section)) {
        result.push("")
        result.push(section)
      }
    }

    return result.join("\n")
  }

  private processContentForTokenSearch(content: string, token: string): string {
    const lines = content.split("\n")
    const result: string[] = []

    // 항상 소개 섹션 포함
    const introEndIndex = this.findSectionEndIndex(lines, 0, "## ")
    if (introEndIndex > 0) {
      result.push(...lines.slice(0, introEndIndex))
    }

    // 토큰별 특별 처리
    if (token === "layout") {
      this.addSectionIfExists(lines, result, "layout")
      this.addSectionIfExists(lines, result, "grid")
      this.addSectionIfExists(lines, result, "breakpoint")
    } else if (token === "grid") {
      this.addSectionIfExists(lines, result, "grid")
      this.addSectionIfExists(lines, result, "layout")
    } else if (token === "spacing") {
      this.addSectionIfExists(lines, result, "spacing")
      this.addSectionIfExists(lines, result, "margin")
      this.addSectionIfExists(lines, result, "padding")
    } else if (token === "tokens") {
      this.addSectionIfExists(lines, result, "tokens")
      this.addSectionIfExists(lines, result, "primitive")
      this.addSectionIfExists(lines, result, "semantic")
    } else {
      // 일반 토큰 검색
      this.addSectionIfExists(lines, result, token)
    }

    return result.join("\n")
  }

  private addSectionIfExists(lines: string[], result: string[], keyword: string): void {
    const lowerKeyword = keyword.toLowerCase()

    // Primitive Tokens 섹션 처리
    const primitiveStartIndex = lines.findIndex((line) => line.trim().toLowerCase().startsWith("## primitive tokens"))

    if (primitiveStartIndex !== -1) {
      const primitiveEndIndex = this.findSectionEndIndex(lines, primitiveStartIndex + 1, "## ")
      const primitiveSection = lines.slice(primitiveStartIndex, primitiveEndIndex)
      const filteredPrimitiveSection = this.filterSubsectionsByKeyword(primitiveSection, lowerKeyword)

      if (filteredPrimitiveSection.length > 1) {
        result.push("")
        result.push(...filteredPrimitiveSection)
      }
    }

    // Semantic Tokens 섹션 처리
    const semanticStartIndex = lines.findIndex((line) => line.trim().toLowerCase().startsWith("## semantic tokens"))

    if (semanticStartIndex !== -1) {
      const semanticEndIndex = this.findSectionEndIndex(lines, semanticStartIndex + 1, "## ")
      const semanticSection = lines.slice(semanticStartIndex, semanticEndIndex)
      const filteredSemanticSection = this.filterSubsectionsByKeyword(semanticSection, lowerKeyword)

      if (filteredSemanticSection.length > 1) {
        result.push("")
        result.push(...filteredSemanticSection)
      }
    }

    // 일반 섹션 처리
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.trim().toLowerCase().startsWith("## ") && line.toLowerCase().includes(lowerKeyword)) {
        const sectionEndIndex = this.findSectionEndIndex(lines, i + 1, "## ")
        const section = lines.slice(i, sectionEndIndex)

        if (section.length > 0) {
          result.push("")
          result.push(...section)
        }
      }
    }
  }
}
