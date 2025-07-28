import path from "path"
import { fileURLToPath } from "url"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import cors from "cors"
import express, { Request, Response } from "express"
import { z } from "zod"

import { ComponentMetadataSchema } from "../../react/radix-ui/src/components/ui/metadata"
import { ComponentInfo, ComponentInfoSchema, ComponentRegistry } from "./lib/component-registry"
import { DesignGuideAnalyzer } from "./lib/design-guide-analyzer"
import { DocsAnalyzer } from "./lib/docs-analyzer"
import { ComponentTypeInfoSchema } from "./lib/schemas"
import { StoryBookAnalyzer } from "./lib/storybook-analyzer"
import { TypeAnalyzer } from "./lib/type-analyzer"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UI_COMPONENTS_PATH = path.resolve(__dirname, "../../react/radix-ui")

// 포트 설정 - 환경변수 또는 기본값 사용
const PORT = process.env.PORT || process.env.MCP_SERVER_PORT || 3002

// Express 앱 생성
const app = express()

// CORS 설정 개선
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "https://dsds.mwebdev.samsungds.net",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept", "Authorization", "mcp-session-id", "X-Requested-With"],
    exposedHeaders: ["mcp-session-id"],
  })
)

app.use(express.json())

// 컴포넌트 레지스트리 초기화
const componentRegistry = new ComponentRegistry(UI_COMPONENTS_PATH)
const storyBookAnalyzer = new StoryBookAnalyzer(UI_COMPONENTS_PATH)
const docsAnalyzer = new DocsAnalyzer(UI_COMPONENTS_PATH)
const typeAnalyzer = new TypeAnalyzer(UI_COMPONENTS_PATH)

// 디자인 가이드 분석기 초기화 (별도의 경로 사용)
const designGuideAnalyzer = new DesignGuideAnalyzer(path.resolve(__dirname, "../../../design/docs"))

// MCP 서버 인스턴스 생성
const server = new McpServer(
  {
    name: "dsds-react-radix-ui-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

export const ComponentListItemSchema = ComponentInfoSchema.omit({ source: true })
export const ComponentDetailsSchema = ComponentInfoSchema.extend({
  styles: z.string().optional().describe("스타일 정보 (선택적)"),
  types: ComponentTypeInfoSchema.optional().describe("타입 정보 (선택적)"),
})

// 디자인 시스템 가이드 조회 도구
server.registerTool(
  "getDesignSystemGuide",
  {
    description: "DSDS 디자인 시스템 가이드 및 디자인 토큰디자인 토큰 (색상, 타이포그래피, 간격 등)을 조회합니다..",
    inputSchema: {
      section: z.string().optional().describe("특정 섹션 (colors, typography, layout, patterns, etc.)"),
      searchQuery: z.string().optional().describe("검색할 키워드"),
    },
    outputSchema: {
      data: z.object({
        sections: z.array(
          z.object({
            title: z.string(),
            content: z.string(),
            file: z.string(),
          })
        ),
        recommendations: z.array(z.string()).optional(),
      }),
    },
  },
  async (params) => {
    const { section, searchQuery } = params

    try {
      const guide = await designGuideAnalyzer.getDesignSystemGuide(section, searchQuery)

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(guide, null, 2),
          },
        ],
        structuredContent: { data: guide },
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
        structuredContent: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }
    }
  }
)

// 디자인 토큰 조회 도구
server.registerTool(
  "getDesignTokens",
  {
    description: "디자인 토큰 (색상, 타이포그래피, 간격 등)을 조회합니다.",
    inputSchema: {
      type: z
        .enum(["colors", "typography", "spacing", "opacity", "border", "radius", "shadows", "opacity"])
        .optional()
        .describe("토큰 유형"),
    },
    outputSchema: {
      data: z.object({
        colors: z.record(z.any()).optional(),
        typography: z.record(z.any()).optional(),
        spacing: z.record(z.any()).optional(),
        breakpoints: z.record(z.any()).optional(),
      }),
    },
  },
  async (params) => {
    const { type = "all" } = params

    try {
      const tokens = await designGuideAnalyzer.getDesignTokens()

      let data
      if (type === "all") {
        data = tokens
      } else if (type in tokens) {
        data = { [type]: tokens[type as keyof typeof tokens] }
      } else {
        data = {}
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ data }, null, 2),
          },
        ],
        structuredContent: { data },
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
        structuredContent: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }
    }
  }
)

// 디자인 패턴 검색 도구 (수정)
server.registerTool(
  "(Not Implemeneted) searchDesignPatterns",
  {
    description: "디자인 패턴과 베스트 프랙티스를 검색합니다.",
    inputSchema: {
      query: z.string().describe("검색 쿼리"),
      category: z
        .enum(["layout", "forms", "navigation", "feedback", "data-display"])
        .optional()
        .describe("패턴 카테고리"),
    },
    outputSchema: {
      data: z.object({
        patterns: z.array(
          z.object({
            name: z.string(),
            description: z.string(),
            components: z.array(z.string()),
            example: z.string(),
            guidelines: z.array(z.string()),
          })
        ),
      }),
    },
  },
  async (params) => {
    const { query, category } = params

    try {
      const patterns = await designGuideAnalyzer.searchDesignPatterns(query, category)

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ data: { patterns } }, null, 2),
          },
        ],
        structuredContent: { data: { patterns } },
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
        structuredContent: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }
    }
  }
)

// 컴포넌트 목록 조회 도구 (개선된 버전)
server.registerTool(
  "listComponents",
  {
    description: "DSDS React Radix UI 컴포넌트 목록을 다양한 필터로 조회합니다.",
    inputSchema: {
      category: z.string().optional().describe("컴포넌트 카테고리 (buttons, forms, navigation, etc.)"),
      tag: z.string().optional().describe("컴포넌트 태그 (interactive, accessible, input, etc.)"),
      name: z.string().optional().describe("컴포넌트 이름으로 검색"),
      description: z.string().optional().describe("설명으로 검색"),
      includeMetadata: z.boolean().optional().describe("메타데이터 포함 여부"),
    },
    outputSchema: {
      data: z.array(ComponentListItemSchema).describe("컴포넌트 목록 배열"),
      categories: z.array(z.string()).optional().describe("사용 가능한 카테고리 목록"),
      tags: z.array(z.string()).optional().describe("사용 가능한 태그 목록"),
    },
  },
  async (params) => {
    const { category, tag, name, description, includeMetadata = false } = params

    try {
      let componentsRaw: ComponentInfo[]

      // 필터가 있으면 검색, 없으면 일반 목록 조회
      if (category || tag || name || description) {
        componentsRaw = await componentRegistry.searchComponents({
          category,
          tag,
          name,
          description,
          includeMetadata,
        })
      } else {
        componentsRaw = await componentRegistry.listComponents(undefined)
      }

      const data = componentsRaw.map((c) => ({
        name: c.name,
        categories: c.categories,
        path: c.path,
        exports: c.exports,
        hasStory: c.hasStory,
        hasTests: c.hasTests,
        hasDoc: c.hasDoc,
        metadata: includeMetadata ? c.metadata : undefined,
      }))

      // 사용 가능한 카테고리와 태그 목록도 함께 반환
      const allCategories = await componentRegistry.getAllCategories()
      const allTags = await componentRegistry.getAllTags()

      const content = {
        data,
        categories: allCategories,
        tags: allTags,
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(content, null, 2),
          },
        ],
        structuredContent: content,
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
      }
    }
  }
)

// 새로운 도구: 컴포넌트 메타데이터 조회
server.registerTool(
  "getComponentMetadata",
  {
    description: "컴포넌트의 메타데이터 정보를 조회합니다.",
    inputSchema: {
      name: z.string().describe("컴포넌트 이름"),
    },
    outputSchema: {
      data: z.object({
        name: z.string(),
        metadata: ComponentMetadataSchema.optional(),
      }),
    },
  },
  async (params) => {
    const { name } = params

    try {
      const component = await componentRegistry.getComponent(name)

      const content = {
        data: {
          name: component.name,
          metadata: component.metadata,
        },
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(content, null, 2),
          },
        ],
        structuredContent: content,
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
      }
    }
  }
)

// 컴포넌트 소스 조회 도구
server.registerTool(
  "getComponent",
  {
    description: "특정 DSDS 컴포넌트의 소스 코드와 타입 정보를 반환합니다.",
    inputSchema: {
      name: z.string().describe("컴포넌트 이름"),
      includeTypes: z.boolean().optional().describe("TypeScript 타입 정보 포함 여부"),
      includeStyles: z.boolean().optional().describe("스타일 정보 포함 여부"),
    },
    outputSchema: {
      data: ComponentDetailsSchema.optional().describe("컴포넌트 상세 정보"),
      error: z.string().optional().describe("오류 메시지 (선택적)"),
    },
  },
  async (params) => {
    const { name, includeTypes = true, includeStyles = false } = params

    try {
      const component = await componentRegistry.getComponent(name)
      const types = includeTypes ? await typeAnalyzer.extractComponentTypes(component.name) : null
      const styles = includeStyles ? await componentRegistry.getComponentStyles(component.name) : null

      const content = {
        data: {
          ...component,
          ...(types && { types }),
          ...(includeStyles && { styles }),
        },
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(content, null, 2),
          },
        ],
        structuredContent: content,
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
        structuredContent: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }
    }
  }
)

// 컴포넌트 스토리 조회 도구
server.registerTool(
  "(Not Implemented) getComponentStories",
  {
    description: "컴포넌트의 Storybook 스토리와 예제를 반환합니다.",
    inputSchema: {
      name: z.string().describe("컴포넌트 이름"),
      includeSource: z.boolean().optional().describe("스토리 소스 코드 포함 여부"),
    },
  },
  async ({ name, includeSource = true }) => {
    try {
      const stories = await storyBookAnalyzer.getComponentStories(name, includeSource)
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(stories, null, 2),
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
      }
    }
  }
)

// 컴포넌트 문서 조회 도구
server.registerTool(
  "(Not Implemented) getComponentDocs",
  {
    description: "컴포넌트의 문서와 사용 가이드를 반환합니다.",
    inputSchema: {
      name: z.string().describe("컴포넌트 이름"),
      includeExamples: z.boolean().optional().describe("사용 예제 포함 여부"),
    },
  },
  async ({ name, includeExamples = true }) => {
    try {
      const docs = await docsAnalyzer.getComponentDocs(name, includeExamples)
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(docs, null, 2),
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
      }
    }
  }
)

// 컴포넌트 사용 예제 생성 도구
server.registerTool(
  "(Not Implemented) generateComponentExample",
  {
    description: "특정 컴포넌트의 사용 예제를 생성합니다.",
    inputSchema: {
      name: z.string().describe("컴포넌트 이름"),
      variant: z.string().optional().describe("컴포넌트 변형"),
      useCase: z.string().optional().describe("사용 사례 (form, dashboard, etc.)"),
    },
  },
  async ({ name, variant, useCase }) => {
    try {
      const example = await componentRegistry.generateExample(name, variant, useCase)
      return {
        content: [
          {
            type: "resource",
            resource: {
              text: example.code,
              uri: "",
              mimeType: "text/plain",
            },
          },
          {
            type: "text",
            text: `Example description: ${example.description}`,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
      }
    }
  }
)

// 컴포넌트 조합 추천 도구
server.registerTool(
  "(Not Implemented) getComponentComposition",
  {
    description: "특정 용도나 패턴에 맞는 컴포넌트 조합을 추천합니다.",
    inputSchema: {
      useCase: z.string().describe("사용 사례 (form, dashboard, navigation, etc.)"),
      complexity: z.enum(["simple", "medium", "complex"]).optional().describe("복잡도 수준"),
    },
    outputSchema: {
      data: z.object({
        composition: z.array(
          z.object({
            component: z.string(),
            role: z.string(),
            props: z.record(z.any()).optional(),
          })
        ),
        example: z.string(),
        guidelines: z.array(z.string()),
      }),
    },
  },
  async (params) => {
    const { useCase, complexity = "medium" } = params

    try {
      const composition = await designGuideAnalyzer.getComponentComposition(useCase, complexity)

      return {
        content: [
          {
            type: "resource",
            resource: {
              text: composition.example,
              uri: "",
              mimeType: "text/tsx",
            },
          },
          {
            type: "text",
            text: JSON.stringify(
              {
                composition: composition.composition,
                guidelines: composition.guidelines,
              },
              null,
              2
            ),
          },
        ],
        structuredContent: { data: composition },
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
        structuredContent: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }
    }
  }
)

// StreamableHTTPServerTransport 생성 (포트 설정 없음)
const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: undefined, // 상태 없는 서버를 위해 undefined 설정
})

// MCP 엔드포인트 설정
app.post("/mcp", async (req: Request, res: Response) => {
  // Accept 헤더 검증
  const acceptHeader = req.headers.accept
  if (!acceptHeader || !acceptHeader.includes("application/json") || !acceptHeader.includes("text/event-stream")) {
    return res.status(406).json({
      jsonrpc: "2.0",
      error: {
        code: -32600,
        message: "Not Acceptable: Client must accept both application/json and text/event-stream",
      },
      id: null,
    })
  }

  try {
    console.log("Received MCP request:", req.body)
    await transport.handleRequest(req, res, req.body)
  } catch (error) {
    console.error("Error handling MCP request:", error)
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      })
    }
  }
})

// OPTIONS 요청 처리
app.options("/mcp", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, mcp-session-id")
  res.sendStatus(200)
})

// GET 요청 처리 (필요한 경우)
app.get("/mcp", async (req: Request, res: Response) => {
  console.log("Received GET MCP request")
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    })
  )
})

// 서버 초기화 및 시작
async function startServer() {
  try {
    // 컴포넌트 레지스트리 초기화
    await componentRegistry.initialize()

    // MCP 서버와 transport 연결
    await server.connect(transport)

    // Express 서버 시작 (여기서 포트 설정)
    app.listen(PORT, () => {
      console.log("🚀 DSDS React Radix UI MCP Server started")
      console.log(`📍 Server URL: http://localhost:${PORT}/mcp`)
      console.log("📋 Available tools:")
      console.log("  - getDesignSystemGuide: 디자인 시스템 가이드 조회")
      console.log("  - getDesignTokens: 디자인 토큰(색상, 서체, 간격 등) 조회")
      console.log("  - listComponents: 컴포넌트 목록 조회")
      console.log("  - getComponent: 컴포넌트 소스 조회")
      console.log("  - getComponentMetadata: 컴포넌트 메타데이터 조회")
      console.log("🚧 Not implemented:")
      console.log("  - searchDesignPatterns: 디자인 패턴 검색")
      console.log("  - getComponentStories: 스토리북 스토리 조회")
      console.log("  - getComponentDocs: 컴포넌트 문서 조회")
      console.log("  - generateComponentExample: 사용 예제 생성")
      console.log("  - getComponentComposition: 컴포넌트 조합 추천")
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
