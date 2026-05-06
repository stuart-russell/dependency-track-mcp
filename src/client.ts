/**
 * Dependency-Track API Client (read-only).
 * Generic GET with pagination support and X-Total-Count header extraction.
 */
export class DependencyTrackClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    this.apiKey = apiKey;
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, unknown>,
  ): Promise<{ data: T; totalCount?: number }> {
    const url = new URL(
      endpoint.startsWith("http") ? endpoint : `${this.baseUrl}/api${endpoint}`,
    );

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, String(value));
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        "X-API-Key": this.apiKey,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      let detail = response.statusText;
      try {
        const body = await response.text();
        if (body) detail = body.slice(0, 500);
      } catch {
        /* ignore */
      }
      throw new Error(
        `Dependency-Track API error ${response.status} ${response.statusText}: ${detail}`,
      );
    }

    const totalCountHeader = response.headers.get("X-Total-Count");
    const totalCount = totalCountHeader
      ? parseInt(totalCountHeader, 10)
      : undefined;

    const contentType = response.headers.get("content-type") || "";
    let data: T;
    if (contentType.includes("application/json")) {
      data = (await response.json()) as T;
    } else {
      // For non-JSON responses (SVG badges, CycloneDX XML, etc.)
      data = (await response.text()) as unknown as T;
    }

    return { data, totalCount };
  }
}
