import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ACTIONS } from "../actions.js";
import { DependencyTrackClient } from "../client.js";
import {
  actionParamDescription,
  buildEndpoint,
  formatResponse,
} from "../helpers.js";

/**
 * Register the execute_action tool on the MCP server.
 * Executes a Dependency-Track action by ID with dynamic endpoint building.
 */
export function registerExecuteAction(server: McpServer): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (server as any).tool(
    "execute_action",
    {
      action_id: z
        .string()
        .describe(
          "The action ID to execute (from search_actions results), e.g. 'get_projects', 'get_vulnerabilities_by_project'",
        ),
      params: z
        .record(z.string().or(z.number()).or(z.boolean()).or(z.null()))
        .optional()
        .describe(
          "Parameters for the action. Required and optional params vary by action — check search_actions results.",
        ),
    },
    {
      readOnlyHint: true,
      destructiveHint: false,
      title: "Execute Dependency-Track Action",
    },
    async ({
      action_id,
      params,
    }: {
      action_id: string;
      params?: Record<string, string | number | boolean | null>;
    }) => {
      const p = params || {};
      const action = ACTIONS.find((a) => a.id === action_id);
      if (!action) {
        const similar = ACTIONS.filter((a) =>
          a.id.toLowerCase().includes(action_id.toLowerCase()),
        )
          .slice(0, 5)
          .map((a) => a.id);
        const hint =
          similar.length > 0 ? ` Did you mean: ${similar.join(", ")}?` : "";
        return {
          content: [
            {
              type: "text",
              text: `Unknown action: "${action_id}".${hint}\n\nUse search_actions to discover available actions.`,
            },
          ],
          isError: true,
        };
      }

      // Validate required parameters
      const missing = action.requiredParams.filter(
        (r) => !p[r] || (typeof p[r] === "string" && p[r] === ""),
      );
      if (missing.length > 0) {
        return {
          content: [
            {
              type: "text",
              text: `Action "${action_id}" requires: ${missing.join(", ")}.\n\n${actionParamDescription(action)}`,
            },
          ],
          isError: true,
        };
      }

      // Get API credentials
      const baseUrl = process.env.DEPENDENCY_TRACK_BASE_URL;
      const apiKey = process.env.DEPENDENCY_TRACK_API_KEY;

      if (!baseUrl || !apiKey) {
        return {
          content: [
            {
              type: "text",
              text: "Dependency-Track API credentials not configured. Set DEPENDENCY_TRACK_BASE_URL and DEPENDENCY_TRACK_API_KEY environment variables.",
            },
          ],
          isError: true,
        };
      }

      const client = new DependencyTrackClient(baseUrl, apiKey);

      try {
        const { path, queryParams } = buildEndpoint(action.endpoint, p);
        const mergedParams = { ...queryParams };

        const { data, totalCount } = await client.get(path, mergedParams);
        console.log(
          `Execute called: ${action_id}, ${path}, ${JSON.stringify(mergedParams)}`,
        );
        return formatResponse(data, totalCount);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: `Error executing "${action_id}": ${message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
