#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

// Define the interface for tool arguments
interface ToolArgs {
  [key: string]: unknown;
}

// Example tool functions
async function getCurrentTime(): Promise<string> {
  return new Date().toISOString();
}

async function calculateSum(a: number, b: number): Promise<number> {
  return a + b;
}

async function echoMessage(message: string): Promise<string> {
  return `Echo: ${message}`;
}

// HTTP request example (you can add fetch for API calls)
async function makeHttpRequest(url: string): Promise<any> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch from ${url}: ${error}`);
  }
}

class MCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "my-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "get_current_time",
            description: "Get the current date and time in ISO format",
            inputSchema: {
              type: "object",
              properties: {},
              required: [],
            },
          },
          {
            name: "calculate_sum",
            description: "Calculate the sum of two numbers",
            inputSchema: {
              type: "object",
              properties: {
                a: {
                  type: "number",
                  description: "First number",
                },
                b: {
                  type: "number",
                  description: "Second number",
                },
              },
              required: ["a", "b"],
            },
          },
          {
            name: "echo_message",
            description: "Echo back a message with a prefix",
            inputSchema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  description: "Message to echo back",
                },
              },
              required: ["message"],
            },
          },
          {
            name: "fetch_data",
            description: "Fetch data from a URL (GET request)",
            inputSchema: {
              type: "object",
              properties: {
                url: {
                  type: "string",
                  description: "URL to fetch data from",
                },
              },
              required: ["url"],
            },
          },
        ],
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      // Ensure args is always defined as an object
      const toolArgs: ToolArgs = args || {};

      try {
        switch (name) {
          case "get_current_time":
            return {
              content: [
                {
                  type: "text",
                  text: await getCurrentTime(),
                },
              ],
            };

          case "calculate_sum":
            this.validateArgs(toolArgs, ["a", "b"]);
            const sum = await calculateSum(
              toolArgs.a as number,
              toolArgs.b as number
            );
            return {
              content: [
                {
                  type: "text",
                  text: `The sum of ${toolArgs.a} and ${toolArgs.b} is ${sum}`,
                },
              ],
            };

          case "echo_message":
            this.validateArgs(toolArgs, ["message"]);
            const echo = await echoMessage(toolArgs.message as string);
            return {
              content: [
                {
                  type: "text",
                  text: echo,
                },
              ],
            };

          case "fetch_data":
            this.validateArgs(toolArgs, ["url"]);
            const data = await makeHttpRequest(toolArgs.url as string);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(data, null, 2),
                },
              ],
            };

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (error instanceof McpError) {
          throw error;
        }
        
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool ${name}: ${errorMessage}`
        );
      }
    });
  }

  private validateArgs(args: ToolArgs, required: string[]): void {
    if (!args || typeof args !== 'object') {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Tool arguments must be an object"
      );
    }

    for (const field of required) {
      if (!(field in args) || args[field] === undefined || args[field] === null) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Missing required argument: ${field}`
        );
      }
    }
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    // This log will help with debugging but won't interfere with MCP communication
    console.error("MCP Server running on stdio");
  }
}

// Start the server
async function main(): Promise<void> {
  try {
    const server = new MCPServer();
    await server.run();
  } catch (error) {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});