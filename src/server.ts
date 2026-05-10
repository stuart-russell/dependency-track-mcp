import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { ACTIONS } from "./actions.js";
import { registerSearchActions } from "./tools/search-actions.js";
import { registerExecuteAction } from "./tools/execute-action.js";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export interface DTMcpConfig {
  dependencyTrack: {
    baseUrl: string;
    apiKey: string;
  };
  server: {
    port?: number;
  };
}

// ---------------------------------------------------------------------------
// MCP Server factory
// ---------------------------------------------------------------------------

function createMcpServer(config: DTMcpConfig): McpServer {
  // Set env vars so downstream code (tools, client) can read them
  process.env.DEPENDENCY_TRACK_BASE_URL = config.dependencyTrack.baseUrl;
  process.env.DEPENDENCY_TRACK_API_KEY = config.dependencyTrack.apiKey;

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
        "Most list endpoints support pagination via offset and limit parameters.",
    },
  );

  registerSearchActions(server);
  registerExecuteAction(server);

  return server;
}

// ---------------------------------------------------------------------------
// Express app factory (no side effects — does not listen)
// ---------------------------------------------------------------------------

function createApp(config: DTMcpConfig): express.Application {
  const app = express();
  app.use(express.json());

  // Shared handler for all MCP HTTP methods
  async function handleMcpRequest(req: express.Request, res: express.Response) {
    const server = createMcpServer(config);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
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
  }

  app.post("/mcp", handleMcpRequest);
  app.get("/mcp", handleMcpRequest);
  app.delete("/mcp", handleMcpRequest);

  return app;
}

// ---------------------------------------------------------------------------
// Convenience: create app + start listening
// ---------------------------------------------------------------------------

async function startServer(config: DTMcpConfig): Promise<void> {
  const app = createApp(config);
  const port = config.server.port ?? 3000;

  return new Promise((resolve) => {
    app.listen(port, () => {
      console.log(`Dependency-Track MCP Server listening on port ${port}`);
      console.log(`Endpoint: http://localhost:${port}/mcp`);
      console.log(`Actions available: ${ACTIONS.length} read-only actions\n`);
      resolve();
    });
  });
}

export { createMcpServer, createApp, startServer };
