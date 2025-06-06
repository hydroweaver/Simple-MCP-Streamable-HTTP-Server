//From main page: https://modelcontextprotocol.io/quickstart/client#node

import { Anthropic } from "@anthropic-ai/sdk";
import {
  MessageParam,
  Tool,
} from "@anthropic-ai/sdk/resources/messages/messages.mjs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import readline from "readline/promises";
import dotenv from "dotenv";
import Stream from "stream";

dotenv.config();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set");
}

class MCPClient {
  private mcp: Client;
  private anthropic: Anthropic;
  private transport: StreamableHTTPClientTransport | null = null;
  private tools: Tool[] = [];

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });
    this.mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });
  }
  // methods will go here


async connectToServer() {
  try {

    // this.transport = new StreamableHTTPClientTransport(new URL('http://localhost:8931/mcp'));

    this.transport = new StreamableHTTPClientTransport(new URL('https://abb8-195-238-25-46.ngrok-free.app/mcp'))
    
    await this.mcp.connect(this.transport);

    const toolsResult = await this.mcp.listTools();
    this.tools = toolsResult.tools.map((tool) => {
      return {
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema,
      };
    });
    console.log(
      "Connected to server with tools:",
      this.tools.map(({ name }) => name)
    );
  } catch (e) {
    console.log("Failed to connect to MCP server: ", e);
    throw e;
  }
}

async processQuery(query: string) {
  const messages: MessageParam[] = [
    {
      role: "user",
      content: query,
    },
  ];

  const response = await this.anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    messages,
    tools: this.tools,
  });

  const finalText = [];
  const toolResults = [];

  for (const content of response.content) {
    if (content.type === "text") {
      finalText.push(content.text);
    } else if (content.type === "tool_use") {
      const toolName = content.name;
      const toolArgs = content.input as { [x: string]: unknown } | undefined;

      const result = await this.mcp.callTool({
        name: toolName,
        arguments: toolArgs,
      });
      toolResults.push(result);
      finalText.push(
        `[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`
      );

      messages.push({
        role: "user",
        content: result.content as string,
      });

      const response = await this.anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        messages,
      });

      finalText.push(
        response.content[0].type === "text" ? response.content[0].text : ""
      );
    }
  }

  return finalText.join("\n");
}

async chatLoop() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    console.log("\nMCP Client Started!");
    console.log("Type your queries or 'quit' to exit.");

    while (true) {
      const message = await rl.question("\nQuery: ");
      if (message.toLowerCase() === "quit") {
        break;
      }
      const response = await this.processQuery(message);
      console.log("\n" + response);
    }
  } finally {
    rl.close();
  }
}

async cleanup() {
  await this.mcp.close();
}
}

async function main() {
//   if (process.argv.length < 3) {
//     console.log("Usage: node index.ts <path_to_server_script>");
//     return;
//   }
  const mcpClient = new MCPClient();
  try {
    await mcpClient.connectToServer();
    await mcpClient.chatLoop();
  } finally {
    await mcpClient.cleanup();
    process.exit(0);
  }
}

main();



// // use the following:

// import { Client } from '@modelcontextprotocol/sdk/client/index.js';
// import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

// // Track received notifications for debugging resumability
// let notificationCount = 0;

// // Global client and transport for interactive commands
// let client: Client | null = null;
// let transport: StreamableHTTPClientTransport | null = null;
// let serverUrl = 'http://localhost:8931/mcp';
// let sessionId: string | undefined = undefined;

// async function main(): Promise<void> {
//   console.log('MCP Interactive Client');
//   console.log('=====================');

//   // Connect to server immediately with default settings
//   await connect();
// }

// async function connect(url?: string): Promise<void> {
//   if (client) {
//     console.log('Already connected. Disconnect first.');
//     return;
//   }

//   if (url) {
//     serverUrl = url;
//   }

//   console.log(`Connecting to ${serverUrl}...`);

//   try {
//     // Create a new client
//     client = new Client({
//       name: 'example-client',
//       version: '1.0.0'
//     });
//     client.onerror = (error) => {
//       console.error('\x1b[31mClient error:', error, '\x1b[0m');
//     }

//     transport = new StreamableHTTPClientTransport(
//       new URL(serverUrl),
//       {
//         sessionId: sessionId
//       }
//     );

//     // Connect the client
//     await client.connect(transport);
//     sessionId = transport.sessionId
//     console.log('Transport created with session ID:', sessionId);
//     console.log('Connected to MCP server');
//   } catch (error) {
//     console.error('Failed to connect:', error);
//     client = null;
//     transport = null;
//   }
// }

// async function disconnect(): Promise<void> {
//   if (!client || !transport) {
//     console.log('Not connected.');
//     return;
//   }

//   try {
//     await transport.close();
//     console.log('Disconnected from MCP server');
//     client = null;
//     transport = null;
//   } catch (error) {
//     console.error('Error disconnecting:', error);
//   }
// }

// async function cleanup(): Promise<void> {
//   if (client && transport) {
//     try {
//       // First try to terminate the session gracefully
//       if (transport.sessionId) {
//         try {
//           console.log('Terminating session before exit...');
//           await transport.terminateSession();
//           console.log('Session terminated successfully');
//         } catch (error) {
//           console.error('Error terminating session:', error);
//         }
//       }

//       // Then close the transport
//       await transport.close();
//     } catch (error) {
//       console.error('Error closing transport:', error);
//     }
//   }

//   console.log('\nGoodbye!');
//   process.exit(0);
// }

// // Handle Ctrl+C
// process.on('SIGINT', async () => {
//   console.log('\nReceived SIGINT. Cleaning up...');
//   await cleanup();
// });

// // Start the interactive client
// main().catch((error: unknown) => {
//   console.error('Error running MCP client:', error);
//   process.exit(1);
// });


//Corrected older client

// import { Anthropic } from "@anthropic-ai/sdk";
// import {
//   MessageParam,
//   Tool,
// } from "@anthropic-ai/sdk/resources/messages/messages.mjs";
// import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
// import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
// import readline from "readline/promises";
// import dotenv from "dotenv";

// let sessionId: string | undefined = undefined;

// dotenv.config();

// const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
// if (!ANTHROPIC_API_KEY) {
//   throw new Error("ANTHROPIC_API_KEY is not set");
// }

// class MCPClient {
//   private mcp: Client;
//   private anthropic: Anthropic;
//   private transport: StreamableHTTPClientTransport | null = null;
// //   private transport: SSEClientTransport | null = null;
//   private tools: Tool[] = [];

//   constructor() {
//     this.anthropic = new Anthropic({
//       apiKey: ANTHROPIC_API_KEY,
//     });
//     this.mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });
//   }

//   async connectToServer() {
//   try {
//     //Dummy MCP with BMI and weather API
//     // this.transport = new StreamableHTTPClientTransport (new URL('http://localhost:3000/mcp'));

//     //Playwright MCP server
//     // this.transport = new StreamableHTTPClientTransport (new URL('http://localhost:8931/mcp'),{
//     //     sessionId: sessionId
//     // });

//         this.transport = new StreamableHTTPClientTransport (new URL('http://localhost:8931/mcp'));
//     // this.transport = new SSEClientTransport (new URL('http://localhost:8931/sse'));

//     console.log(this.transport);

//     await this.mcp.connect(this.transport);

//     const toolsResult = await this.mcp.listTools();
//     this.tools = toolsResult.tools.map((tool) => {
//       return {
//         name: tool.name,
//         description: tool.description,
//         input_schema: tool.inputSchema,
//       };
//     });
//     console.log(
//       "Connected to server with tools:",
//       this.tools.map(({ name }) => name)
//     );
//   } catch (e) {
//     console.log("Failed to connect to MCP server: ", e);
//     throw e;
//   }
// }


// async processQuery(query: string) {
//   const messages: MessageParam[] = [
//     {
//       role: "user",
//       content: query,
//     },
//   ];

//   const response = await this.anthropic.messages.create({
//     model: "claude-sonnet-4-20250514",
//     // model: 'claude-3-7-sonnet-20250219',
//     max_tokens: 1000,
//     messages,
//     tools: this.tools,
//   });

//   console.log(response)

//   const finalText = [];
//   const toolResults = [];

//   for (const content of response.content) {
//     if (content.type === "text") {
//       finalText.push(content.text);
//     } else if (content.type === "tool_use") {
//       const toolName = content.name;
//       const toolArgs = content.input as { [x: string]: unknown } | undefined;

//       const result = await this.mcp.callTool({
//         name: toolName,
//         arguments: toolArgs,
//       });
//       toolResults.push(result);
//       finalText.push(
//         `[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`
//       );

//       messages.push({
//         role: "user",
//         content: result.content as string,
//       });

//       const response = await this.anthropic.messages.create({
//         model: "claude-sonnet-4-20250514",
//         // model: "claude-3-5-sonnet-20241022",
//         max_tokens: 1000,
//         messages,
//       });

//       finalText.push(
//         response.content[0].type === "text" ? response.content[0].text : ""
//       );
//     }
//   }

//   return finalText.join("\n");
// }

// async chatLoop() {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   try {
//     console.log("\nMCP Client Started!");
//     console.log("Type your queries or 'quit' to exit.");

//     while (true) {
//       const message = await rl.question("\nQuery: ");
//       if (message.toLowerCase() === "quit") {
//         break;
//       }
//       const response = await this.processQuery(message);
//       console.log("\n" + response);
//     }
//   } finally {
//     rl.close();
//   }
// }

// async cleanup() {
//   await this.mcp.close();
// }
// }

// async function main() {
// //   if (process.argv.length < 3) {
// //     console.log("Usage: node index.ts <path_to_server_script>");
// //     return;
// //   }
//   const mcpClient = new MCPClient();
//   try {
//     await mcpClient.connectToServer();
//     await mcpClient.chatLoop();
//   } finally {
//     await mcpClient.cleanup();
//     process.exit(0);
//   }
// }

// main();