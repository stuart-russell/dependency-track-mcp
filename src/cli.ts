#!/usr/bin/env node
import { parseArgs } from "node:util";

interface ParsedValues {
  "base-url"?: string;
  "api-key"?: string;
  "port"?: string;
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

// CLI arguments take precedence over environment variables
if (values["base-url"]) process.env.DEPENDENCY_TRACK_BASE_URL = values["base-url"];
if (values["api-key"]) process.env.DEPENDENCY_TRACK_API_KEY = values["api-key"];
if (values["port"]) process.env.PORT = values["port"];

// Validate required configuration before starting the server
if (!process.env.DEPENDENCY_TRACK_BASE_URL) {
  console.error("Error: DEPENDENCY_TRACK_BASE_URL is required.");
  console.error(
    "  Provide via --base-url option, DEPENDENCY_TRACK_BASE_URL env var, or .env file.",
  );
  process.exit(1);
}
if (!process.env.DEPENDENCY_TRACK_API_KEY) {
  console.error("Error: DEPENDENCY_TRACK_API_KEY is required.");
  console.error(
    "  Provide via --api-key option, DEPENDENCY_TRACK_API_KEY env var, or .env file.",
  );
  process.exit(1);
}

// Dynamic import ensures CLI processing completes before the server starts.
// server.ts calls dotenv.config() which does not override already-set env vars.
import("./server.js").catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
