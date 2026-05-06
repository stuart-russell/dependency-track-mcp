# Dependency Track MCP Server

An MCP (Model Context Protocol) server that provides **read-only** access to the OWASP Dependency-Track API through Claude and other MCP-compatible clients.

## Features

- **69 Read-Only Actions** — Comprehensive coverage of the Dependency-Track v4.14.1 API across 24 categories
- **Search + Execute Pattern** — Two tools keep the context window lean while providing full API access
- **API Key Authentication** — Secure authentication using Dependency-Track API keys via environment variables
- **Streamable HTTP Transport** — Compatible with Claude Desktop, Claude Code, and Claude.ai
- **Pagination Support** — All list endpoints support `offset` and `limit` parameters
- **Smart Response Handling** — Automatic `X-Total-Count` headers, intelligent truncation with guidance

## Architecture

This server implements the **search + execute pattern** recommended for wrapping large API surfaces:

1. **search_actions** — Discover available operations by describing your intent in plain English
2. **execute_action** — Run a specific action by ID with the required parameters

This approach keeps the MCP tool surface minimal (just 2 tools) while providing access to the full read-only Dependency-Track API.

## Available Action Categories

| Category | Actions | Examples |
|---|---|---|
| **Project** | 7 | `get_projects`, `get_project`, `get_project_by_name_version`, `get_latest_project`, `get_projects_by_tag`, `get_projects_by_classifier`, `get_children_projects` |
| **Component** | 6 | `get_components`, `get_component`, `get_component_by_hash`, `get_component_by_identity`, `get_dependency_graph`, `get_component_properties` |
| **Vulnerability** | 6 | `get_vulnerabilities_by_project`, `get_vulnerabilities_by_component`, `get_vulnerability`, `get_vulnerability_by_vuln_id`, `get_affected_projects`, `get_all_vulnerabilities` |
| **Finding** | 3 | `get_findings_by_project`, `get_all_findings`, `get_grouped_findings` |
| **Metrics** | 6 | `get_project_metrics`, `get_project_metrics_history`, `get_portfolio_metrics`, `get_portfolio_metrics_history`, `get_component_metrics`, `get_vulnerability_metrics` |
| **Policy Violation** | 3 | `get_violations_by_project`, `get_violations_by_component`, `get_all_violations` |
| **Policy** | 2 | `get_policies`, `get_policy` |
| **BOM** | 3 | `get_bom_cyclonedx`, `get_component_bom`, `check_bom_processing` |
| **VEX** | 1 | `get_vex` |
| **Analysis** | 1 | `get_analysis` |
| **Violation Analysis** | 1 | `get_violation_analysis` |
| **Calculator** | 2 | `get_cvss_scores`, `get_owasp_scores` |
| **Search** | 6 | `search_components`, `search_projects`, `search_vulnerabilities`, `search_licenses`, `search_services`, `aggregate_search` |
| **CWE** | 2 | `get_cwes`, `get_cwe` |
| **License** | 3 | `get_licenses`, `get_license`, `get_license_listing` |
| **Service** | 2 | `get_services`, `get_service` |
| **Tag** | 3 | `get_tags`, `get_tagged_projects`, `get_tagged_policies` |
| **Team** | 3 | `get_teams`, `get_team`, `get_self` |
| **Repository** | 3 | `get_repositories`, `get_repositories_by_type`, `get_latest_component_version` |
| **Dependency Graph** | 1 | `get_direct_dependencies` |
| **Project Property** | 1 | `get_project_properties` |
| **Config Property** | 2 | `get_config_properties`, `get_public_config_property` |
| **Integration** | 1 | `get_osv_ecosystems` |
| **Version** | 1 | `get_version` |

## Setup

### Prerequisites

- Node.js 18+
- Dependency-Track instance with API access
- API key for your Dependency-Track instance

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd dependency-track-mcp-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Dependency Track URL and API key
   ```

### Environment Variables

Create a `.env` file with:

```
DEPENDENCY_TRACK_BASE_URL=https://your-dependency-track-instance.com
DEPENDENCY_TRACK_API_KEY=your-api-key-here
PORT=3000  # Optional, defaults to 3000
```

### Development

```bash
npm run dev  # Start in development mode with auto-reload
```

### Production

```bash
npm run build  # Compile TypeScript to JavaScript
npm start    # Start the compiled server
```

## Usage with MCP Clients

### Claude Code

```bash
claude mcp add --transport http dependency-track http://localhost:3000/mcp
```

### Claude Desktop / Claude.ai

1. Go to Settings → Connectors
2. Click "Add custom connector"
3. Enter:
   - Name: Dependency Track
   - URL: http://localhost:3000/mcp
4. Click Connect

### OpenCode

Add the server to your OpenCode config (`.opencode/config.json` or via the UI):

```json
{
  "mcpServers": {
    "dependency-track": {
      "url": "http://localhost:3000/mcp",
      "transport": "http"
    }
  }
}
```

Or start OpenCode with the server already configured:

```bash
opencode --mcp dependency-track=http://localhost:3000/mcp
```

### Codex (OpenAI Codex CLI)

Add the server to your Codex MCP configuration:

```json
{
  "mcpServers": {
    "dependency-track": {
      "url": "http://localhost:3000/mcp",
      "transport": "streamable-http"
    }
  }
}
```

Then launch Codex — the Dependency-Track tools will be available automatically.

## Example Workflow

1. Search for project-related actions:
   ```
   search_actions({ intent: "get vulnerabilities for my project" })
   ```

2. Execute the returned action:
   ```
   execute_action({ action_id: "get_vulnerabilities_by_project", params: { uuid: "your-project-uuid" } })
   ```

## Deployment

### Cloudflare Workers (Recommended)

For the fastest deployment to a public URL, see the Cloudflare Workers deploy guide.

### Other Hosting Options

This server can be deployed to any Node.js hosting platform:
- Render
- Railway
- Fly.io
- AWS Elastic Beanstalk
- Traditional VPS

## Security Notes

- API keys are stored in environment variables, never hardcoded
- This server is **read-only** — no POST/PUT/DELETE operations are exposed
- Token passthrough is prohibited — if your server needs to call other services, use separate credentials
- Consider implementing CORS headers if browser clients will connect directly

## License

MIT
