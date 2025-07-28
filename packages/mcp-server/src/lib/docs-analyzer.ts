import { promises as fs } from "fs"
import path from "path"
import fg from "fast-glob"

export interface DocInfo {
  name: string
  component: string
  documentation: {
    description?: string
    usage?: string
    examples?: Array
    props?: Array
    accessibility?: string
    guidelines?: string
  }
  source?: string
}

export class DocsAnalyzer {
  private componentsPath: string

  constructor(componentsPath: string) {
    this.componentsPath = componentsPath
  }

  async getComponentDocs(componentName: string, includeExamples = true): Promise {
    try {
      // 문서 파일 찾기 (여러 형태 지원)
      const docFiles = await this.findDocumentationFiles(componentName)

      if (docFiles.length === 0) {
        // 문서 파일이 없으면 소스 코드에서 JSDoc 추출
        return await this.extractFromSourceCode(componentName, includeExamples)
      }

      const docFile = docFiles[0]
      const source = await fs.readFile(docFile, "utf-8")

      const documentation = await this.parseMarkdownDoc(source, includeExamples)

      return {
        name: componentName,
        component: componentName,
        documentation,
        source,
      }
    } catch (error) {
      console.warn(`Failed to analyze docs for ${componentName}:`, error)
      return null
    }
  }

  private async findDocumentationFiles(componentName: string): Promise {
    const patterns = [
      `docs/components/${componentName}.md`,
      `docs/components/${componentName}/*.md`,
      `src/components/**/${componentName}/README.md`,
      `src/components/**/${componentName}/${componentName}.md`,
      `src/components/**/${componentName}/docs.md`,
      `.storybook/docs/${componentName}.md`,
      `.storybook/docs/${componentName}/*.md`,
    ]

    const docFiles = await fg(patterns, {
      cwd: this.componentsPath,
      absolute: true,
    })

    return docFiles
  }

  private async extractFromSourceCode(componentName: string, includeExamples: boolean): Promise {
    try {
      // 컴포넌트 소스 파일 찾기
      const sourceFiles = await fg(
        [
          `src/components/**/${componentName}.tsx`,
          `src/components/**/${componentName}/index.tsx`,
          `src/components/**/${componentName}/${componentName}.tsx`,
        ],
        {
          cwd: this.componentsPath,
          absolute: true,
        }
      )

      if (sourceFiles.length === 0) {
        return null
      }

      const sourceFile = sourceFiles[0]
      const source = await fs.readFile(sourceFile, "utf-8")

      const documentation = this.extractJSDocFromSource(source, includeExamples)

      return {
        name: componentName,
        component: componentName,
        documentation,
      }
    } catch (error) {
      console.warn(`Failed to extract docs from source for ${componentName}:`, error)
      return null
    }
  }

  private async parseMarkdownDoc(source: string, includeExamples: boolean): Promise {
    const documentation: DocInfo["documentation"] = {}

    // 제목과 설명 추출
    const descriptionMatch = source.match(/^#\s+(.+)\n\n(.*?)(?=\n##|\n```)/)
    if (descriptionMatch) {
      documentation.description = descriptionMatch.trim()
    }

    // Usage 섹션 추출
    const usageMatch = source.match(/##\s+Usage\s*\n(.*?)(?=\n##|$)/s)
    if (usageMatch) {
      documentation.usage = usageMatch.trim()
    }

    // Examples 섹션 추출
    if (includeExamples) {
      documentation.examples = this.extractExamplesFromMarkdown(source)
    }

    // Props 섹션 추출
    documentation.props = this.extractPropsFromMarkdown(source)

    // Accessibility 섹션 추출
    const accessibilityMatch = source.match(/##\s+Accessibility\s*\n(.*?)(?=\n##|$)/s)
    if (accessibilityMatch) {
      documentation.accessibility = accessibilityMatch.trim()
    }

    // Guidelines 섹션 추출
    const guidelinesMatch = source.match(/##\s+(?:Guidelines|Design\s+Guidelines)\s*\n(.*?)(?=\n##|$)/s)
    if (guidelinesMatch) {
      documentation.guidelines = guidelinesMatch.trim()
    }

    return documentation
  }

  private extractExamplesFromMarkdown(source: string): Array {
    const examples: Array = []

    // ### 제목과 코드 블록 패턴 매칭
    const examplePattern = /###\s+(.+?)\n(.*?)```(?:tsx?|javascript|jsx)\n(.*?)```/
    let match

    while ((match = examplePattern.exec(source)) !== null) {
      const [, title, description, code] = match

      examples.push({
        title: title.trim(),
        code: code.trim(),
        description: description.trim() || undefined,
      })
    }

    return examples
  }

  private extractPropsFromMarkdown(source: string): Array {
    const props: Array = []

    // Props 테이블 추출
    const propsTableMatch = source.match(/##\s+Props\s*\n.*?\n\|.*?\|\n\|.*?\|\n((?:\|.*?\|\n)*)/s)
    if (!propsTableMatch) {
      return props
    }

    const tableRows = propsTableMatch.split("\n").filter((row) => row.trim().startsWith("|"))

    for (const row of tableRows) {
      const cells = row
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell)

      if (cells.length >= 4) {
        const [name, type, description, required, defaultValue] = cells

        props.push({
          name: name.replace(/`/g, ""),
          type: type.replace(/`/g, ""),
          description: description,
          required: required.toLowerCase() === "yes" || required.toLowerCase() === "true",
          defaultValue: defaultValue && defaultValue !== "-" ? defaultValue.replace(/`/g, "") : undefined,
        })
      }
    }

    return props
  }

  private extractJSDocFromSource(source: string, includeExamples: boolean): DocInfo["documentation"] {
    const documentation: DocInfo["documentation"] = {}

    // JSDoc 주석에서 설명 추출
    const jsdocMatch = source.match(/\/\*\*\s*\n((?:\s*\*.*\n)*)\s*\*\//)
    if (jsdocMatch) {
      const jsdocContent = jsdocMatch
        .split("\n")
        .map((line) => line.replace(/^\s*\*\s?/, ""))
        .join("\n")
        .trim()

      documentation.description = jsdocContent
    }

    // 인터페이스에서 Props 정보 추출
    const interfaceMatch = source.match(/interface\s+\w*Props\s*{([^}]*)}/s)
    if (interfaceMatch) {
      documentation.props = this.parsePropsInterface(interfaceMatch)
    }

    // 예제 코드 추출 (JSDoc @example 태그)
    if (includeExamples) {
      const exampleMatches = source.matchAll(/@example\s*\n(.*?)(?=@|\*\/)/gs)
      documentation.examples = []

      for (const match of exampleMatches) {
        documentation.examples.push({
          title: "Basic Usage",
          code: match.trim(),
        })
      }
    }

    return documentation
  }

  private parsePropsInterface(interfaceContent: string): Array {
    const props: Array = []

    const propLines = interfaceContent.split("\n").filter((line) => line.trim())

    for (const line of propLines) {
      const trimmedLine = line.trim()

      // JSDoc 주석 라인 건너뛰기
      if (trimmedLine.startsWith("/**") || trimmedLine.startsWith("*") || trimmedLine.startsWith("*/")) {
        continue
      }

      // prop 정의 파싱
      const propMatch = trimmedLine.match(/(\w+)(\??)\s*:\s*([^;]+);?/)
      if (propMatch) {
        const [, name, optional, type] = propMatch

        // 이전 JSDoc 주석에서 설명 찾기
        const prevCommentIndex = interfaceContent.lastIndexOf("/**", interfaceContent.indexOf(line))
        let description = ""

        if (prevCommentIndex !== -1) {
          const commentEnd = interfaceContent.indexOf("*/", prevCommentIndex)
          const comment = interfaceContent.substring(prevCommentIndex, commentEnd + 2)
          const descMatch = comment.match(/\*\s*(.+?)(?:\n|$)/)
          if (descMatch) {
            description = descMatch.trim()
          }
        }

        props.push({
          name,
          type: type.trim(),
          description: description || `${name} prop`,
          required: !optional,
          defaultValue: undefined,
        })
      }
    }

    return props
  }

  async getAllComponentDocs(): Promise {
    const docsMap = new Map()

    try {
      // 모든 문서 파일 스캔
      const allDocFiles = await fg(
        ["docs/components/*.md", "docs/components/**/*.md", "src/components/**/README.md", "src/components/**/*.md"],
        {
          cwd: this.componentsPath,
          absolute: true,
        }
      )

      for (const docFile of allDocFiles) {
        const componentName = this.extractComponentNameFromDocPath(docFile)
        if (componentName) {
          const docInfo = await this.getComponentDocs(componentName, true)
          if (docInfo) {
            docsMap.set(componentName, docInfo)
          }
        }
      }
    } catch (error) {
      console.warn("Failed to get all component docs:", error)
    }

    return docsMap
  }

  private extractComponentNameFromDocPath(docPath: string): string | null {
    const fileName = path.basename(docPath, ".md")

    // README 파일인 경우 디렉토리 이름 사용
    if (fileName === "README") {
      return path.basename(path.dirname(docPath))
    }

    return fileName
  }
}
