import dotenv from "dotenv";
dotenv.config();

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { ACTIONS } from "./actions.js";
import { registerSearchActions } from "./tools/search-actions.js";
import { registerExecuteAction } from "./tools/execute-action.js";

// ---------------------------------------------------------------------------
// Express server with Streamable HTTP transport
// ---------------------------------------------------------------------------

const app = express();
app.use(express.json());

// Factory function to create a new MCP server instance (for stateless mode)
function createMcpServer(): McpServer {
  const server = new McpServer(
    {
      name: "dependency-track",
      version: "0.1.0",
    },
    {
      instructions:
        "This server provides read-only access to the OWASP Dependency-Track API. " +
        "Use search_actions to discover available operations by describing what you want in plain English. " +
        "Then use execute_action with the action_id and parameters returned from search_actions. " +
        "Most list endpoints support pagination via offset and limit parameters. " +
        "Configure DEPENDENCY_TRACK_BASE_URL and DEPENDENCY_TRACK_API_KEY environment variables.",
    },
  );

  // Register tools
  registerSearchActions(server);
  registerExecuteAction(server);

  return server;
}

app.post("/mcp", async (req, res) => {
  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless mode
  });

  res.on("close", () => transport.close());

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("MCP handler error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal error" },
        id: null,
      });
    }
  }
});

// Handle GET requests for Streamable HTTP session initialization
app.get("/mcp", async (req, res) => {
  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  res.on("close", () => transport.close());
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res);
  } catch (error) {
    console.error("MCP GET handler error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal error" },
        id: null,
      });
    }
  }
});

// Handle DELETE requests for session termination
app.delete("/mcp", async (req, res) => {
  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  res.on("close", () => transport.close());
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res);
  } catch (error) {
    console.error("MCP DELETE handler error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal error" },
        id: null,
      });
    }
  }
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Dependency-Track MCP Server listening on port ${port}`);
  console.log(`Endpoint: http://localhost:${port}/mcp`);
  console.log(`Actions available: ${ACTIONS.length} read-only actions\n`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down gracefully...");
  process.exit(0);
});
