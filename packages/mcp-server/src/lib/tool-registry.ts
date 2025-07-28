import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { ZodType } from "zod/v4"

export interface ToolDefinition {
  name: string
  description: string
  inputSchema: z.ZodSchema<any>
  outputSchema?: z.ZodSchema<any>
}

export class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map()
  private server: McpServer

  constructor(server: McpServer) {
    this.server = server
  }

  registerTool<TInput, TOutput>(
    name: string,
    definition: {
      description: string
      inputSchema: TInput
      outputSchema?: TOutput
    },
    handler: (params: TInput) => Promise<TOutput>
  ): void {
    // 도구 정보 저장
    this.tools.set(name, {
      name,
      description: definition.description,
      inputSchema: definition.inputSchema as z.ZodSchema<TInput>,
      outputSchema: definition.outputSchema as z.ZodSchema<TOutput>,
    })

    // 실제 MCP 서버에 도구 등록
    this.server.registerTool(
      name,
      {
        description: definition.description,
        inputSchema: definition.inputSchema as any,
        outputSchema: definition.outputSchema as any,
      },
      handler
    )
  }

  tool<TInput, TOutput>(
    name: string,
    definition: {
      description: string
      inputSchema: z.ZodSchema<TInput>
    },
    handler: (params: TInput) => Promise<any>
  ): void {
    // 도구 정보 저장
    this.tools.set(name, {
      name,
      description: definition.description,
      inputSchema: definition.inputSchema,
    })

    // 실제 MCP 서버에 도구 등록
    this.server.tool(name, definition, handler)
  }

  getRegisteredTools(): ToolDefinition[] {
    return Array.from(this.tools.values())
  }

  getToolByName(name: string): ToolDefinition | undefined {
    return this.tools.get(name)
  }

  getToolNames(): string[] {
    return Array.from(this.tools.keys())
  }

  getToolsInfo(): Array<{ name: string; description: string }> {
    return Array.from(this.tools.values()).map((tool) => ({
      name: tool.name,
      description: tool.description,
    }))
  }
}
