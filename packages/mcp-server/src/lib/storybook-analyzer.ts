import { promises as fs } from "fs"
import fg from "fast-glob"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StoryObj = { name: string; args?: any; parameters?: any }

export interface StoryInfo {
  name: string
  component: string
  stories: Array<StoryObj>
  source?: string
}

export class StoryBookAnalyzer {
  private componentsPath: string

  constructor(componentsPath: string) {
    this.componentsPath = componentsPath
  }

  async getComponentStories(componentName: string, includeSource = true): Promise<StoryInfo | null> {
    try {
      // 스토리 파일 찾기
      const storyFiles = await fg(
        [
          `src/components/**/*${componentName}.stories.tsx`,
          `src/components/**/*${componentName}.stories.ts`,
          `src/components/**/${componentName}/*.stories.tsx`,
          `src/components/**/${componentName}/*.stories.ts`,
        ],
        {
          cwd: this.componentsPath,
          absolute: true,
        }
      )

      if (storyFiles.length === 0) {
        return null
      }

      const storyFile = storyFiles[0]
      const source = await fs.readFile(storyFile, "utf-8")

      const stories = this.parseStories(source)

      return {
        name: componentName,
        component: componentName,
        stories,
        ...(includeSource && { source }),
      }
    } catch (error) {
      console.warn(`Failed to analyze stories for ${componentName}:`, error)
      return null
    }
  }

  private parseStories(source: string): Array<StoryObj> {
    const stories: Array<StoryObj> = []

    // export된 스토리 찾기
    const exportRegex = /export\s+const\s+(\w+)\s*=\s*{([^}]*)}/g
    let match

    while ((match = exportRegex.exec(source)) !== null) {
      const [, name, content] = match

      if (name === "default") continue

      const story = { name } as StoryObj

      // args 파싱
      const argsMatch = content.match(/args:\s*{([^}]*)}/)
      if (argsMatch) {
        try {
          story.args = this.parseObjectString(argsMatch[1])
        } catch (error) {
          console.warn(`Failed to parse args for story ${name}:`, error)
        }
      }

      stories.push(story)
    }

    return stories
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseObjectString(str: string): any {
    // 간단한 객체 파싱 (실제로는 더 복잡한 파서가 필요할 수 있음)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: Record<string, any> = {}
    const pairs = str.split(",")

    for (const pair of pairs) {
      const [key, value] = pair.split(":").map((s) => s.trim())
      if (key && value) {
        const cleanKey = key.replace(/['"]/g, "")
        let cleanValue: boolean | number | string = value.replace(/['"]/g, "")

        if (cleanValue === "true") cleanValue = true
        else if (cleanValue === "false") cleanValue = false
        else if (!isNaN(Number(cleanValue))) cleanValue = Number(cleanValue)

        obj[cleanKey] = cleanValue
      }
    }

    return obj
  }
}
