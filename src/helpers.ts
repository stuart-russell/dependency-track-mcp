import { ActionDef } from "./actions.js";

/** Build a parameter schema description string for an action */
export function actionParamDescription(action: ActionDef): string {
  const parts: string[] = [];
  if (action.requiredParams.length > 0) {
    parts.push(`Required: ${action.requiredParams.join(", ")}`);
  }
  const optEntries = Object.entries(action.optionalParams);
  if (optEntries.length > 0) {
    parts.push(
      `Optional: ${optEntries.map(([k, v]) => `${k} (${v})`).join(", ")}`
    );
  }
  return parts.join(". ") || "No parameters required";
}

/**
 * Build the final endpoint URL by replacing {param} placeholders
 * with values from params, then appending remaining params as query string.
 */
export function buildEndpoint(
  template: string,
  params: Record<string, unknown>
): { path: string; queryParams: Record<string, unknown> } {
  let path = template;
  const queryParams: Record<string, unknown> = {};

  // Replace path parameters
  const pathParamRegex = /\{(\w+)\}/g;
  let match: RegExpExecArray | null;
  const pathParams = new Set<string>();
  while ((match = pathParamRegex.exec(template)) !== null) {
    pathParams.add(match[1]);
  }

  for (const [key, value] of Object.entries(params)) {
    if (pathParams.has(key)) {
      path = path.replace(`{${key}}`, encodeURIComponent(String(value)));
    } else if (value !== undefined && value !== null && value !== "") {
      queryParams[key] = value;
    }
  }

  return { path, queryParams };
}

/** Score how well an action matches a search intent */
export function matchScore(action: ActionDef, intent: string): number {
  const lowerIntent = intent.toLowerCase();
  const words = lowerIntent.split(/\s+/).filter((w) => w.length > 1);
  let score = 0;

  const searchableText = [
    action.id,
    action.description,
    action.category,
    ...action.keywords,
  ]
    .join(" ")
    .toLowerCase();

  // Exact phrase match in description
  if (action.description.toLowerCase().includes(lowerIntent)) score += 10;

  // Word matches
  for (const word of words) {
    if (searchableText.includes(word)) score += 1;
    // Bonus for matching the action id
    if (action.id.toLowerCase().includes(word)) score += 2;
  }

  return score;
}

/** Format a response with totalCount info and smart truncation */
export function formatResponse(
  data: unknown,
  totalCount?: number,
  maxChars: number = 50000
): { content: Array<{ type: "text"; text: string }> } {
  let jsonResult = JSON.stringify(data, null, 2);

  const header = totalCount
    ? `Total: ${totalCount} results\n\n`
    : "";

  if ((header + jsonResult).length > maxChars) {
    const available = maxChars - header.length - 200;
    const truncated = jsonResult.slice(0, available);
    // Try to end at a clean boundary
    const lastComma = truncated.lastIndexOf(",");
    const lastBrace = truncated.lastIndexOf("}");
    const cutPoint = Math.max(lastComma, lastBrace, available - 100);
    const cleanTrunc = truncated.slice(0, cutPoint);

    return {
      content: [
        {
          type: "text",
          text: `${header}${cleanTrunc}\n\n... (response truncated, ${jsonResult.length} total characters). Refine your query with more specific parameters or use a smaller limit.)`,
        },
      ],
    };
  }

  return {
    content: [{ type: "text", text: header + jsonResult }],
  };
}
