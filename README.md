# MCP Server TypeScript Template

A comprehensive TypeScript template for creating Model Context Protocol (MCP) servers using Node.js.

## Features

- 🚀 **TypeScript** - Full type safety and modern JavaScript features
- 🛠️ **Example Tools** - Pre-built tools to demonstrate MCP capabilities
- 🔧 **Error Handling** - Robust error handling with proper MCP error codes
- 📝 **Extensible** - Easy to add new tools and functionality
- 🏗️ **Production Ready** - Includes proper build pipeline and configuration

## Quick Start

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. **Clone or create your project directory:**
   ```bash
   mkdir my-mcp-server
   cd my-mcp-server
   ```

2. **Copy the template files** (package.json, tsconfig.json, src/index.ts)

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Test the server:**
   ```bash
   npm start
   ```

## Project Structure

```
mcp_node-ts-boilderplate/
├── src/
│   └── index.ts              ← Main server code
├── build/                    ← Generated (after npm run build)
├── .env                      ← secrets
├── .gitignore                ← Git ignore rules
├── LICENSE                   ← MIT license
├── package.json              ← Dependencies and scripts
├── README.md                 ← Documentation
├── setup.sh                  ← Setup script
├── tsconfig.json             ← TypeScript config
└── claude_desktop_config.example.json ← Config example
```

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled server
- `npm run dev` - Build and run in one command
- `npm run watch` - Watch for changes and recompile
- `npm run clean` - Remove build directory

## Example Tools Included

The template includes these example tools:

1. **get_current_time** - Returns current date/time in ISO format
2. **calculate_sum** - Adds two numbers together
3. **echo_message** - Echoes back a message with prefix
4. **fetch_data** - Makes HTTP GET requests to URLs

## Adding Your Own Tools

To add a new tool:

1. **Add the tool definition** in the `ListToolsRequestSchema` handler
2. **Implement the tool logic** in the `CallToolRequestSchema` handler
3. **Create helper functions** as needed

Example:
```typescript
// In ListToolsRequestSchema handler
{
  name: "my_custom_tool",
  description: "Description of what this tool does",
  inputSchema: {
    type: "object",
    properties: {
      param1: {
        type: "string",
        description: "Description of param1",
      },
    },
    required: ["param1"],
  },
}

// In CallToolRequestSchema handler
case "my_custom_tool":
  this.validateArgs(args, ["param1"]);
  const result = await myCustomFunction(args.param1 as string);
  return {
    content: [
      {
        type: "text",
        text: result,
      },
    ],
  };
```

## Connecting to Claude Desktop

1. **Build your server:**
   ```bash
   npm run build
   ```

2. **Find your project path:**
   ```bash
   pwd  # Copy this path
   ```

3. **Configure Claude Desktop** by editing `claude_desktop_config.json`:
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

4. **Add your server configuration:**
   ```json
   {
     "mcpServers": {
       "my-mcp-server": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/YOUR/PROJECT/build/index.js"]
       }
     }
   }
   ```

5. **Restart Claude Desktop**

## Development Tips

### Debugging

- Use `console.error()` for debug messages (they won't interfere with MCP communication)
- Check Claude Desktop logs if your server isn't connecting
- Ensure your server builds successfully before testing

### Error Handling

The template includes comprehensive error handling:
- Input validation for tool arguments
- Proper MCP error codes
- Graceful error recovery

### TypeScript Benefits

- **Type Safety** - Catch errors at compile time
- **IntelliSense** - Better development experience
- **Refactoring** - Safe code changes

## Common Issues

1. **Server not connecting**: Ensure you've built the project (`npm run build`)
2. **Tools not appearing**: Check the Claude Desktop configuration file path
3. **Permission errors**: Make sure the build/index.js file is accessible

## Resources

- [MCP Official Documentation](https://modelcontextprotocol.io/)
- [MCP SDK TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop](https://claude.ai/download)

## License

MIT License - feel free to use this template for your own projects!