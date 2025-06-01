"use strict";
// From https://github.com/modelcontextprotocol/typescript-sdk?tab=readme-ov-file#streamable-http
//Run on express and expose via ngrok
// Just use the exposed URL with /mcp on the MCP inspector with Streamable HTTP
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 3000;
app.post('/mcp', async (req, res) => {
    // In stateless mode, create a new instance of transport and server for each request
    // to ensure complete isolation. A single instance would cause request ID collisions
    // when multiple clients connect concurrently.
    try {
        const server = new mcp_js_1.McpServer({
            name: "example-server",
            version: "1.0.0"
        });
        // Simple tool with parameters
        server.tool("calculate-bmi", {
            weightKg: zod_1.z.number(),
            heightM: zod_1.z.number()
        }, async ({ weightKg, heightM }) => ({
            content: [{
                    type: "text",
                    text: String(weightKg / (heightM * heightM))
                }]
        }));
        // Async tool with external API call
        server.tool("fetch-weather", { city: zod_1.z.string() }, async ({ city }) => {
            const response = await fetch(`https://api.weather.com/${city}`);
            const data = await response.text();
            return {
                content: [{ type: "text", text: data }]
            };
        });
        const transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
        });
        res.on('close', () => {
            console.log('Request closed');
            transport.close();
            server.close();
        });
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    }
    catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error',
                },
                id: null,
            });
        }
    }
});
app.get('/mcp', async (req, res) => {
    console.log('Received GET MCP request');
    res.writeHead(405).end(JSON.stringify({
        jsonrpc: "2.0",
        error: {
            code: -32000,
            message: "Method not allowed."
        },
        id: null
    }));
});
app.delete('/mcp', async (req, res) => {
    console.log('Received DELETE MCP request');
    res.writeHead(405).end(JSON.stringify({
        jsonrpc: "2.0",
        error: {
            code: -32000,
            message: "Method not allowed."
        },
        id: null
    }));
});
// Start the server
app.listen(PORT, () => {
    console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
});
