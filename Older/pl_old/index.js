// // // // // // import express from 'express';
// // // // // // import mcp from '@playwright/mcp';
// // // // // // import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

// // // // // // const { createConnection } = mcp;
// // // // // // const app = express();

// // // // // // app.get('/sse', async (req, res) => {
// // // // // //   res.setHeader('Content-Type', 'text/event-stream');
// // // // // //   res.setHeader('Cache-Control', 'no-cache');
// // // // // //   res.setHeader('Connection', 'keep-alive');

// // // // // //   try {
// // // // // //     const connection = await createConnection({
// // // // // //       browser: {
// // // // // //         launchOptions: { headless: true },
// // // // // //       },
// // // // // //     });

// // // // // //     const transport = new SSEServerTransport('/sse', res);
// // // // // //     await connection.connect(transport);

// // // // // //     req.on('close', async () => {
// // // // // //       await connection.close();
// // // // // //     });
// // // // // //   } catch (err) {
// // // // // //     console.error('MCP connection error:', err);
// // // // // //     res.status(500).end('Failed to connect');
// // // // // //   }
// // // // // // });

// // // // // // app.listen(3000, () => {
// // // // // //   console.log('MCP server running at http://localhost:3000/sse');
// // // // // // });


// // // // // import express from 'express';
// // // // // import { createConnection } from '@playwright/mcp';
// // // // // import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// // // // // import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
// // // // // import { z } from 'zod';


// // // // // const app = express();
// // // // // const port = 8931;

// // // // // // Create MCP Server
// // // // // const server = new McpServer({
// // // // //   name: "Playwright Agent",
// // // // //   version: "1.0.0"
// // // // // });


// // // // // // Register a dummy tool
// // // // // server.tool(
// // // // //   "ping",
// // // // //   {},
// // // // //   async () => ({ content: [{ type: "text", text: "pong" }] })
// // // // // );

// // // // // // SSE route
// // // // // app.post('/sse', (req, res) => {
// // // // //   const transport = new SSEServerTransport('/sse', res);
// // // // //   server.connect(transport);
// // // // // });

// // // // // // Serve JSON introspection
// // // // // app.get('/mcp', (req, res) => {
// // // // //   server.server('/mcp').fetch(req).then(response => {
// // // // //     response.text().then(body => {
// // // // //       res.status(response.status).send(body);
// // // // //     });
// // // // //   });
// // // // // });

// // // // // app.listen(port, () => {
// // // // //   console.log(`MCP server running at http://localhost:${port}`);
// // // // // });

// // // // import { createConnection } from '@playwright/mcp';
// // // // // Import necessary transport classes, e.g., from '@playwright/mcp/lib/sseServerTransport';
// // // // // Or potentially implement your own transport mechanism.
// // // // import http from 'http';
// // // // import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';


// // // // async function runMyMCPServer() {
// // // //   // Create the MCP server instance
// // // //   const server = createConnection({
// // // //     // You can pass Playwright launch options here
// // // //     launchOptions: {
// // // //        headless: true,
// // // //        // other Playwright options...
// // // //     },
// // // //     // You might specify other server options if available
// // // //   });

// // // //   // Example using SSE transport (requires appropriate setup like an HTTP server)
// // // //   // This part is conceptual and depends on your specific server framework (e.g., Express, Node http)
  
// // // // //   const http = require('http');

// // // // //   const { SSEServerTransport } = require('@playwright/mcp/lib/sseServerTransport'); // Adjust path as needed

// // // //   const httpServer = http.createServer((req, res) => {
// // // //     if (req.url === '/messages' && req.method === 'GET') {
// // // //       res.writeHead(200, {
// // // //         'Content-Type': 'text/event-stream',
// // // //         'Cache-Control': 'no-cache',
// // // //         'Connection': 'keep-alive',
// // // //       });
// // // //       const transport = new SSEServerTransport("/messages", res); // Pass the response object
// // // //     //   server.connect(transport); // Connect the MCP server to this transport
// // // //       server.connect(transport)

// // // //       req.on('close', () => {
// // // //         // Handle client disconnect if necessary
// // // //         server.disconnect(transport);
// // // //       });
// // // //     } else {
// // // //       res.writeHead(404);
// // // //       res.end();
// // // //     }
// // // //   });

// // // //   httpServer.listen(8931, () => {
// // // //     console.log('MCP Server with SSE transport listening on port 8931');
// // // //   });
  

// // // // //   // For simpler non-web transport, you might use other mechanisms
// // // // //   (await server).connect(yourCustomTransport);

// // // //   console.log('Playwright MCP server started programmatically.');

// // // //   // Keep the server running, handle connections, etc.
// // // //   // Add cleanup logic for server shutdown.
// // // // }

// // // // runMyMCPServer().catch(console.error);


// // // import http from 'http';
// // // import { createConnection } from '@playwright/mcp';
// // // import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// // // import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
// // // import { z } from 'zod';

// // // // Create MCP server
// // // const server = new McpServer({
// // //   name: 'Playwright Automation Server',
// // //   version: '1.0.0',
// // // });

// // // // Register a dummy tool
// // // server.tool(
// // //   'ping',
// // //   {},
// // //   async () => ({
// // //     content: [{ type: 'text', text: 'pong' }],
// // //   })
// // // );

// // // http
// // //   .createServer(async (req, res) => {
// // //     const url = new URL(req.url || '', `http://${req.headers.host}`);

// // //     if (url.pathname === '/sse') {
// // //       const transport = new SSEServerTransport('/sse', res);
// // //       server.connect(transport);
// // //       return;
// // //     }

// // //     if (url.pathname === '/mcp') {
// // //       const json = server.introspect(); // This gives tool metadata
// // //       const body = JSON.stringify(json, null, 2);
// // //       res.writeHead(200, { 'Content-Type': 'application/json' });
// // //       res.end(body);
// // //       return;
// // //     }

// // //     res.writeHead(404, { 'Content-Type': 'text/plain' });
// // //     res.end('Not found');
// // //   })
// // //   .listen(8931, () => {
// // //     console.log('MCP server running at http://localhost:8931');
// // //   });


// // import http from 'http';
// // import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// // import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
// // import { createConnection } from '@playwright/mcp';
// // import { z } from 'zod';
// // import { Readable } from 'stream';

// // // Setup MCP server
// // const server = new McpServer({
// //   name: 'Playwright MCP Server',
// //   version: '1.0.0',
// // });

// // // Register a simple tool
// // server.tool(
// //   'screenshot',
// //   { url: z.string().url() },
// //   async ({ url }) => {
// //     const connection = await createConnection({ browser: { launchOptions: { headless: true } } });
// //     const page = await connection.context.newPage();
// //     await page.goto(url);
// //     const screenshot = await page.screenshot();
// //     await connection.browser.close();

// //     return {
// //       content: [
// //         {
// //           type: 'image',
// //           image_url: `data:image/png;base64,${screenshot.toString('base64')}`,
// //         },
// //       ],
// //     };
// //   }
// // );

// // // Helper: Convert Node req/res to Web fetch-style
// // async function nodeToFetchRequest(req) {
// //   const body = req.method === 'POST' || req.method === 'PUT' ? req : undefined;
// //   const url = `http://${req.headers.host}${req.url}`;
// //   return new Request(url, {
// //     method: req.method,
// //     headers: req.headers,
// //     body: body && Readable.toWeb(req),
// //   });
// // }

// // http
// //   .createServer(async (req, res) => {
// //     const url = new URL(req.url || '', `http://${req.headers.host}`);

// //     if (url.pathname === '/sse') {
// //       const transport = new SSEServerTransport('/sse', res);
// //       server.connect(transport);
// //       return;
// //     }

// //     if (url.pathname === '/mcp') {
// //       const fetchReq = await nodeToFetchRequest(req);
// //       const fetchRes = await server.serve('/mcp').fetch(fetchReq);

// //       res.writeHead(fetchRes.status, Object.fromEntries(fetchRes.headers.entries()));
// //       res.end(await fetchRes.text());
// //       return;
// //     }

// //     res.writeHead(404, { 'Content-Type': 'text/plain' });
// //     res.end('Not found');
// //   })
// //   .listen(8931, () => {
// //     console.log('✅ MCP server running at http://localhost:8931');
// //   });


// import { createConnection} from '@playwright/mcp';
// import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
// import http from 'http';

// // Import necessary transport classes, e.g., from ';
// // Or potentially implement your own transport mechanism.

// async function runMyMCPServer() {
//   // Create the MCP server instance
//   const connection = createConnection({ browser: { launchOptions: { headless: true } } });

//   // Example using SSE transport (requires appropriate setup like an HTTP server)
//   // This part is conceptual and depends on your specific server framework (e.g., Express, Node http)
  

//   const httpServer = http.createServer(async (req, res) => {
//     if (req.url === '/sse' && (req.method === 'POST')){
//       const transport = new SSEServerTransport("/messages", res); // Pass the response object
//     //   console.log(transport)
//       (await connection).connect(transport)
//     //   ;(await connection).close
//     //   await connection.connect(transport); // Connect the MCP server to this transport

//     //   res.writeHead(200, {
//     //     'Content-Type': 'text/event-stream',
//     //     'Cache-Control': 'no-cache',
//     //     'Connection': 'keep-alive',
//     //   });

//       req.on('close', () => {
//         // Handle client disconnect if necessary
        
//       });
//     } else {
//       res.writeHead(404);
//       res.end();
//     }
//   });

//   httpServer.listen(8931, () => {
//     console.log('MCP Server with SSE transport listening on port 8931');
//   });

//   // For simpler non-web transport, you might use other mechanisms
//   // server.connect(yourCustomTransport);

//   console.log('Playwright MCP server started programmatically.');

//   // Keep the server running, handle connections, etc.
//   // Add cleanup logic for server shutdown.
// }

// runMyMCPServer().catch(console.error);

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import express from "express"
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"

// Create server instance
const server = new Server({
    name: "itsuki-mcp-server",
    version: "1.0.0"
}, {
    capabilities: {
        tools: {}
    }
})

// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport

const transports = {}

const app = express()
app.use(express.json())

const router = express.Router()

// endpoint for the client to use for sending messages

router.post('/messages', async (req, res) => {
    console.log("message request received: ", req.body)
    // when client sends messages with `SSEClientTransport`,
    // the sessionId will be atomically set as query parameter.
    const sessionId = req.query.sessionId

    if (typeof (sessionId) != "string") {
        res.status(400).send({ messages: "Bad session id." })
        return
    }
    const transport = transports[sessionId]
    if (!transport) {
        res.status(400).send({ messages: "No transport found for sessionId." })
        return
    }

    // IMPORTANT!
    // using `await transport.handlePostMessage(req, res)` will cause
    // `SSE transport error: Error: Error POSTing to endpoint (HTTP 400): InternalServerError: stream is not readable`
    // on the client side
    await transport.handlePostMessage(req, res, req.body)

    return
})


// initialization:
// create a new transport to connect and
// send an endpoint event containing a URI for the client to use for sending messages
router.get("/connect", async (req, res) => {
    console.log("connection request received")
    // tells the client to send messages to the `POST_ENDPOINT`
    const transport = new SSEServerTransport(POST_ENDPOINT, res)
    console.log("new transport created with session id: ", transport.sessionId)

    transports[transport.sessionId] = transport

    res.on("close", () => {
        console.log("SSE connection closed")
        delete transports[transport.sessionId]
    })

    await server.connect(transport)

    // an exmaple of a server-sent-event (message) to client
    await sendMessages(transport)

    return
})

async function sendMessages(transport) {
    try {
        await transport.send({
            jsonrpc: "2.0",
            method: "sse/connection",
            params: { message: "Stream started" }
        })
        console.log("Stream started")

        let messageCount = 0
        const interval = setInterval(async () => {

        messageCount++

        const message = `Message ${messageCount} at ${new Date().toISOString()}`

        try {
            await transport.send({
                jsonrpc: "2.0",
                method: "sse/message",
                params: { data: message }
            })

          console.log(`Sent: ${message}`)

            if (messageCount === 2) {
                clearInterval(interval)
                await transport.send({
                    jsonrpc: "2.0",
                    method: "sse/complete",
                    params: { message: "Stream completed" }
                })
                console.log("Stream completed")
            }

        } catch (error) {
          console.error("Error sending message:", error)
          clearInterval(interval)
        }

      }, 1000)

    } catch (error) {
      console.error("Error in startSending:", error)
    }
}



app.use('/', router)

const PORT = 3000
app.listen(PORT, () => {
    console.log(`MCP Streamable HTTP Server listening on port ${PORT}`)
})
