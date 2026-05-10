#!/usr/bin/env node
import dotenv from "dotenv";
import { parseArgs } from "node:util";
import { startServer } from "./server.js";

// Load .env file first (CLI args override these later)
dotenv.config();

interface ParsedValues {
  "base-url"?: string;
  "api-key"?: string;
  port?: string;
  help?: boolean;
}

let values: ParsedValues;

try {
  const parsed = parseArgs({
    options: {
      "base-url": { type: "string", short: "u" },
      "api-key": { type: "string", short: "k" },
      port: { type: "string", short: "p" },
      help: { type: "boolean", short: "h" },
    },
    allowPositionals: true,
  });
  values = parsed.values as ParsedValues;
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Error: ${message}`);
  console.error(
    "Usage: dependency-track-mcp-server [--base-url <url>] [--api-key <key>] [--port <port>]",
  );
  process.exit(1);
}

if (values.help) {
  console.log(`
dependency-track-mcp-server - MCP Server for Dependency Track API

USAGE
  npx dependency-track-mcp-server [options]

OPTIONS
  -u, --base-url <url>    Dependency-Track instance base URL (required)
  -k, --api-key <key>     Dependency-Track API key (required)
  -p, --port <port>       Server port (default: 3000)
  -h, --help              Show this help message

ENVIRONMENT VARIABLES
  DEPENDENCY_TRACK_BASE_URL  (alternative to --base-url)
  DEPENDENCY_TRACK_API_KEY   (alternative to --api-key)
  PORT                       (alternative to --port)

Configuration can also be loaded from a .env file.
`);
  process.exit(0);
}

// Build config: CLI args take precedence over environment variables
const config = {
  dependencyTrack: {
    baseUrl: values["base-url"] ?? process.env.DEPENDENCY_TRACK_BASE_URL ?? "",
    apiKey: values["api-key"] ?? process.env.DEPENDENCY_TRACK_API_KEY ?? "",
  },
  server: {
    port: values["port"] ? Number(values["port"]) : process.env.PORT ? Number(process.env.PORT) : undefined,
  },
};

// Validate required configuration before starting the server
if (!config.dependencyTrack.baseUrl) {
  console.error("Error: DEPENDENCY_TRACK_BASE_URL is required.");
  console.error(
    "  Provide via --base-url option, DEPENDENCY_TRACK_BASE_URL env var, or .env file.",
  );
  process.exit(1);
}
if (!config.dependencyTrack.apiKey) {
  console.error("Error: DEPENDENCY_TRACK_API_KEY is required.");
  console.error(
    "  Provide via --api-key option, DEPENDENCY_TRACK_API_KEY env var, or .env file.",
  );
  process.exit(1);
}

startServer(config).catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
