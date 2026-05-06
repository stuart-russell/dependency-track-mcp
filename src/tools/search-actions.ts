import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ACTIONS } from "../actions.js";
import { actionParamDescription, matchScore } from "../helpers.js";

/**
 * Register the search_actions tool on the MCP server.
 * Discovers available Dependency-Track actions by keyword matching.
 */
export function registerSearchActions(server: McpServer): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (server as any).tool(
    "search_actions",
    {
      intent: z
        .string()
        .describe(
          "Describe what you want to do, e.g. 'get vulnerabilities for a project', 'search for log4j', 'get portfolio metrics'",
        ),
    },
    {
      readOnlyHint: true,
      destructiveHint: false,
      title: "Search Dependency-Track Actions",
    },
    async ({ intent }: { intent: string }) => {
      const scored: Array<{
        id: string;
        description: string;
        category: string;
        params: string;
      }> = ACTIONS.map((a) => ({
        id: a.id,
        description: a.description,
        category: a.category,
        params: actionParamDescription(a),
        score: matchScore(a, intent),
      }))
        .filter((a) => a.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 15);

      console.log(`Search called: ${intent}`);

      if (scored.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No actions found for intent: "${intent}".\n\nTry broader terms like "projects", "vulnerabilities", "components", "metrics", "policies", "search", or "bom".`,
            },
          ],
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(scored, null, 2) }],
      };
    },
  );
}
