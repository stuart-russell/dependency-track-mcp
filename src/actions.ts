/**
 * Action Catalog — single source of truth for all read-only Dependency-Track actions.
 */

export interface ActionDef {
  /** Unique action identifier used by execute_action */
  id: string;
  /** Human-readable description shown in search results */
  description: string;
  /** API tag/category for grouping */
  category: string;
  /** Endpoint path template — {param} placeholders are replaced from params */
  endpoint: string;
  /** HTTP method (all read-only actions are GET) */
  method: "GET";
  /** Parameter names that MUST be present in params */
  requiredParams: string[];
  /** Optional parameter name → description */
  optionalParams: Record<string, string>;
  /** Extra keywords for search matching beyond id/description */
  keywords: string[];
}

export const ACTIONS: ActionDef[] = [
  // ── Version ──────────────────────────────────────────────────────────────
  {
    id: "get_version",
    description: "Get the Dependency-Track server version",
    category: "version",
    endpoint: "/version",
    method: "GET",
    requiredParams: [],
    optionalParams: {},
    keywords: ["version", "about", "server info"],
  },

  // ── Projects ─────────────────────────────────────────────────────────────
  {
    id: "get_projects",
    description: "List all projects with pagination and filtering",
    category: "project",
    endpoint: "/v1/project",
    method: "GET",
    requiredParams: [],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return (default 100)",
      name: "Filter by project name",
      classifier: "Filter by classifier (APPLICATION, LIBRARY, etc.)",
      tag: "Filter by tag name",
      excludeInactive: "Exclude inactive projects (true/false)",
      onlyRoot: "Only return root projects (true/false)",
      sortName: "Field name to sort by",
      sortOrder: "Sort order: asc or desc",
    },
    keywords: ["projects", "portfolio", "list projects", "all projects"],
  },
  {
    id: "get_project",
    description: "Get a specific project by UUID",
    category: "project",
    endpoint: "/v1/project/{uuid}",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {},
    keywords: ["project details", "single project", "project by id"],
  },
  {
    id: "get_project_by_name_version",
    description: "Look up a project by name and version",
    category: "project",
    endpoint: "/v1/project/lookup",
    method: "GET",
    requiredParams: [],
    optionalParams: {
      name: "Project name (required for lookup)",
      version: "Project version",
    },
    keywords: ["find project", "lookup project", "project by name"],
  },
  {
    id: "get_latest_project",
    description: "Get the latest version of a project by name",
    category: "project",
    endpoint: "/v1/project/latest/{name}",
    method: "GET",
    requiredParams: ["name"],
    optionalParams: {},
    keywords: ["latest project", "newest version", "latest version"],
  },
  {
    id: "get_projects_by_tag",
    description: "List all projects assigned to a specific tag",
    category: "project",
    endpoint: "/v1/project/tag/{tag}",
    method: "GET",
    requiredParams: ["tag"],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
      excludeInactive: "Exclude inactive projects",
      onlyRoot: "Only return root projects",
    },
    keywords: ["projects by tag", "tagged projects"],
  },
  {
    id: "get_projects_by_classifier",
    description: "List all projects filtered by classifier type",
    category: "project",
    endpoint: "/v1/project/classifier/{classifier}",
    method: "GET",
    requiredParams: ["classifier"],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
      excludeInactive: "Exclude inactive projects",
      onlyRoot: "Only return root projects",
    },
    keywords: [
      "projects by classifier",
      "application projects",
      "library projects",
      "framework projects",
      "container projects",
      "operating system projects",
      "device projects",
      "file projects",
      "firmware projects",
    ],
  },
  {
    id: "get_children_projects",
    description: "Get child projects for a parent project",
    category: "project",
    endpoint: "/v1/project/{uuid}/children",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
    },
    keywords: ["sub projects", "child projects", "nested projects"],
  },

  // ── Components ───────────────────────────────────────────────────────────
  {
    id: "get_components",
    description:
      "List all components for a project with pagination and filtering",
    category: "component",
    endpoint: "/v1/component/project/{uuid}",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return (default 100)",
      onlyOutdated: "Only return outdated components (true/false)",
      onlyDirect: "Only return direct dependencies (true/false)",
      sortName: "Field name to sort by",
      sortOrder: "Sort order: asc or desc",
    },
    keywords: [
      "components",
      "dependencies",
      "bill of materials",
      "bom components",
      "project components",
    ],
  },
  {
    id: "get_component",
    description: "Get a specific component by UUID",
    category: "component",
    endpoint: "/v1/component/{uuid}",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {
      includeRepositoryMetaData:
        "Include third-party metadata from external repositories",
    },
    keywords: ["component details", "single component", "component by id"],
  },
  {
    id: "get_component_by_hash",
    description:
      "Find components by hash (MD5, SHA-1, SHA-256, SHA-384, SHA-512, SHA3-256, SHA3-384, SHA3-512, BLAKE2b-256, BLAKE2b-384, BLAKE2b-512, or BLAKE3)",
    category: "component",
    endpoint: "/v1/component/hash/{hash}",
    method: "GET",
    requiredParams: ["hash"],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
    },
    keywords: [
      "component by hash",
      "find by hash",
      "sha256",
      "md5",
      "sha1",
      "sha512",
    ],
  },
  {
    id: "get_component_by_identity",
    description:
      "Find components by identity coordinates (group, name, version) or purl, cpe, or swidTagId",
    category: "component",
    endpoint: "/v1/component/identity",
    method: "GET",
    requiredParams: [],
    optionalParams: {
      group: "Component group/organization",
      name: "Component name",
      version: "Component version",
      purl: "Package URL (purl)",
      cpe: "Common Platform Enumeration (cpe)",
      swidTagId: "SWID tag ID",
      project: "Filter to a specific project UUID",
      offset: "Skip N results",
      limit: "Max results to return",
    },
    keywords: [
      "component by identity",
      "find by purl",
      "find by cpe",
      "find by coordinates",
      "package url",
    ],
  },
  {
    id: "get_dependency_graph",
    description:
      "Get the expanded dependency graph for specific components within a project",
    category: "component",
    endpoint:
      "/v1/component/project/{projectUuid}/dependencyGraph/{componentUuids}",
    method: "GET",
    requiredParams: ["projectUuid", "componentUuids"],
    optionalParams: {},
    keywords: [
      "dependency graph",
      "transitive dependencies",
      "dependency tree",
      "component graph",
    ],
  },
  {
    id: "get_component_properties",
    description: "Get all properties for a specific component",
    category: "component",
    endpoint: "/v1/component/{uuid}/property",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {},
    keywords: ["component properties", "component metadata"],
  },

  // ── Vulnerabilities ──────────────────────────────────────────────────────
  {
    id: "get_vulnerabilities_by_project",
    description:
      "List all vulnerabilities affecting a specific project",
    category: "vulnerability",
    endpoint: "/v1/vulnerability/project/{uuid}",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
      suppressed: "Include suppressed vulnerabilities (true/false)",
      sortName: "Field name to sort by",
      sortOrder: "Sort order: asc or desc",
    },
    keywords: [
      "vulnerabilities",
      "vulns",
      "project vulnerabilities",
      "security issues",
      "cve",
    ],
  },
  {
    id: "get_vulnerabilities_by_component",
    description:
      "List all vulnerabilities affecting a specific component",
    category: "vulnerability",
    endpoint: "/v1/vulnerability/component/{uuid}",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
      suppressed: "Include suppressed vulnerabilities",
    },
    keywords: [
      "component vulnerabilities",
      "component vulns",
      "component cve",
    ],
  },
  {
    id: "get_vulnerability",
    description: "Get a specific vulnerability by UUID",
    category: "vulnerability",
    endpoint: "/v1/vulnerability/{uuid}",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {},
    keywords: [
      "vulnerability details",
      "single vulnerability",
      "vuln by id",
      "cve details",
    ],
  },
  {
    id: "get_vulnerability_by_vuln_id",
    description:
      "Get a specific vulnerability by source and vulnerability ID (e.g., source=NVD, vulnId=CVE-2024-1234)",
    category: "vulnerability",
    endpoint: "/v1/vulnerability/source/{source}/vuln/{vulnId}",
    method: "GET",
    requiredParams: ["source", "vulnId"],
    optionalParams: {},
    keywords: [
      "vulnerability by id",
      "cve lookup",
      "nvd",
      "ghsa",
      "osv",
      "vuln by source",
    ],
  },
  {
    id: "get_affected_projects",
    description:
      "List all projects affected by a specific vulnerability",
    category: "vulnerability",
    endpoint: "/v1/vulnerability/source/{source}/vuln/{vulnId}/projects",
    method: "GET",
    requiredParams: ["source", "vulnId"],
    optionalParams: {},
    keywords: [
      "affected projects",
      "impact analysis",
      "which projects affected",
      "vulnerability impact",
    ],
  },
  {
    id: "get_all_vulnerabilities",
    description:
      "List all vulnerabilities in the portfolio with pagination",
    category: "vulnerability",
    endpoint: "/v1/vulnerability",
    method: "GET",
    requiredParams: [],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
    },
    keywords: ["all vulnerabilities", "all vulns", "vulnerability list"],
  },

  // ── Findings ─────────────────────────────────────────────────────────────
  {
    id: "get_findings_by_project",
    description:
      "Get all findings (vulnerability-component mappings) for a specific project",
    category: "finding",
    endpoint: "/v1/finding/project/{uuid}",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {
      suppressed: "Include suppressed findings (true/false)",
    },
    keywords: [
      "findings",
      "project findings",
      "vulnerability findings",
      "risk findings",
    ],
  },
  {
    id: "get_all_findings",
    description:
      "List all findings across the entire portfolio",
    category: "finding",
    endpoint: "/v1/finding",
    method: "GET",
    requiredParams: [],
    optionalParams: {
      suppressed: "Include suppressed findings",
    },
    keywords: ["all findings", "portfolio findings", "global findings"],
  },
  {
    id: "get_grouped_findings",
    description:
      "List all findings grouped by vulnerability across the portfolio",
    category: "finding",
    endpoint: "/v1/finding/grouped",
    method: "GET",
    requiredParams: [],
    optionalParams: {
      suppressed: "Include suppressed findings",
    },
    keywords: [
      "grouped findings",
      "findings by vulnerability",
      "aggregated findings",
    ],
  },

  // ── Metrics ──────────────────────────────────────────────────────────────
  {
    id: "get_project_metrics",
    description: "Get current security metrics for a specific project",
    category: "metrics",
    endpoint: "/v1/metrics/project/{uuid}/current",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {},
    keywords: [
      "project metrics",
      "project security score",
      "project risk metrics",
      "current metrics",
    ],
  },
  {
    id: "get_project_metrics_history",
    description:
      "Get historical metrics for a project over the last N days",
    category: "metrics",
    endpoint: "/v1/metrics/project/{uuid}/days/{days}",
    method: "GET",
    requiredParams: ["uuid", "days"],
    optionalParams: {},
    keywords: [
      "project metrics history",
      "project trends",
      "historical metrics",
      "metrics over time",
    ],
  },
  {
    id: "get_portfolio_metrics",
    description: "Get current security metrics for the entire portfolio",
    category: "metrics",
    endpoint: "/v1/metrics/portfolio/current",
    method: "GET",
    requiredParams: [],
    optionalParams: {},
    keywords: [
      "portfolio metrics",
      "overall metrics",
      "portfolio security score",
      "portfolio risk",
    ],
  },
  {
    id: "get_portfolio_metrics_history",
    description:
      "Get historical portfolio metrics over the last N days",
    category: "metrics",
    endpoint: "/v1/metrics/portfolio/{days}/days",
    method: "GET",
    requiredParams: ["days"],
    optionalParams: {},
    keywords: [
      "portfolio metrics history",
      "portfolio trends",
      "portfolio over time",
    ],
  },
  {
    id: "get_component_metrics",
    description: "Get current metrics for a specific component",
    category: "metrics",
    endpoint: "/v1/metrics/component/{uuid}/current",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {},
    keywords: [
      "component metrics",
      "component risk",
      "component security score",
    ],
  },
  {
    id: "get_vulnerability_metrics",
    description:
      "Get the sum of all vulnerabilities in the database by year",
    category: "metrics",
    endpoint: "/v1/metrics/vulnerability",
    method: "GET",
    requiredParams: [],
    optionalParams: {},
    keywords: [
      "vulnerability metrics",
      "vuln count by year",
      "vulnerability statistics",
    ],
  },

  // ── Policy Violations ────────────────────────────────────────────────────
  {
    id: "get_violations_by_project",
    description:
      "List all policy violations for a specific project",
    category: "violation",
    endpoint: "/v1/violation/project/{uuid}",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
      state: "Filter by violation state",
      policyUuid: "Filter by specific policy UUID",
    },
    keywords: [
      "policy violations",
      "project violations",
      "compliance violations",
      "policy breaches",
    ],
  },
  {
    id: "get_violations_by_component",
    description:
      "List all policy violations for a specific component",
    category: "violation",
    endpoint: "/v1/violation/component/{uuid}",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
      state: "Filter by violation state",
      policyUuid: "Filter by specific policy UUID",
    },
    keywords: [
      "component violations",
      "component policy violations",
      "component compliance",
    ],
  },
  {
    id: "get_all_violations",
    description:
      "List all policy violations across the entire portfolio",
    category: "violation",
    endpoint: "/v1/violation",
    method: "GET",
    requiredParams: [],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
      state: "Filter by violation state",
      policyUuid: "Filter by specific policy UUID",
    },
    keywords: [
      "all violations",
      "portfolio violations",
      "all policy violations",
    ],
  },

  // ── Policies ─────────────────────────────────────────────────────────────
  {
    id: "get_policies",
    description: "List all policies",
    category: "policy",
    endpoint: "/v1/policy",
    method: "GET",
    requiredParams: [],
    optionalParams: {},
    keywords: ["policies", "policy list", "all policies"],
  },
  {
    id: "get_policy",
    description: "Get a specific policy by UUID",
    category: "policy",
    endpoint: "/v1/policy/{uuid}",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {},
    keywords: ["policy details", "single policy", "policy by id"],
  },

  // ── BOM ──────────────────────────────────────────────────────────────────
  {
    id: "get_bom_cyclonedx",
    description:
      "Export a project's BOM in CycloneDX format (JSON or XML)",
    category: "bom",
    endpoint: "/v1/bom/cyclonedx/project/{uuid}",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {
      format: "Output format: JSON or XML (default: JSON)",
      variant:
        "Export variant: inventory or withVulnerabilities (default: inventory)",
      version: "CycloneDX spec version (default: 1.5)",
    },
    keywords: [
      "bom export",
      "cyclonedx",
      "bill of materials export",
      "sbom",
      "software bill of materials",
    ],
  },
  {
    id: "get_component_bom",
    description:
      "Export a specific component's metadata in CycloneDX format",
    category: "bom",
    endpoint: "/v1/bom/cyclonedx/component/{uuid}",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {
      format: "Output format: JSON or XML (default: JSON)",
      version: "CycloneDX spec version (default: 1.5)",
    },
    keywords: [
      "component bom",
      "component cyclonedx",
      "component sbom",
    ],
  },
  {
    id: "check_bom_processing",
    description:
      "Check if a BOM upload token is still being processed",
    category: "bom",
    endpoint: "/v1/event/token/{uuid}",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {},
    keywords: [
      "bom processing",
      "bom upload status",
      "token status",
      "bom task",
    ],
  },

  // ── VEX ──────────────────────────────────────────────────────────────────
  {
    id: "get_vex",
    description:
      "Export a Vulnerability Exploitability eXchange (VEX) document for a project in CycloneDX format",
    category: "vex",
    endpoint: "/v1/vex/cyclonedx/project/{uuid}",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {},
    keywords: [
      "vex",
      "vex export",
      "vulnerability exploitability exchange",
      "vex document",
    ],
  },

  // ── Analysis ─────────────────────────────────────────────────────────────
  {
    id: "get_analysis",
    description:
      "Get the analysis trail for a component-vulnerability pair in a project",
    category: "analysis",
    endpoint: "/v1/analysis",
    method: "GET",
    requiredParams: ["component", "vulnerability"],
    optionalParams: {
      project: "Project UUID (optional)",
    },
    keywords: [
      "analysis trail",
      "vulnerability analysis",
      "analysis decision",
      "justification",
    ],
  },
  {
    id: "get_violation_analysis",
    description:
      "Get the violation analysis trail for a component-policy violation pair",
    category: "violationanalysis",
    endpoint: "/v1/violation/analysis",
    method: "GET",
    requiredParams: ["component", "policyViolation"],
    optionalParams: {
      project: "Project UUID (optional)",
    },
    keywords: [
      "violation analysis",
      "violation trail",
      "policy violation analysis",
    ],
  },

  // ── Calculators ──────────────────────────────────────────────────────────
  {
    id: "get_cvss_scores",
    description:
      "Calculate CVSS base score, impact sub-score, and exploitability sub-score from a CVSS vector string",
    category: "calculator",
    endpoint: "/v1/calculator/cvss",
    method: "GET",
    requiredParams: ["vector"],
    optionalParams: {},
    keywords: [
      "cvss",
      "cvss score",
      "cvss calculator",
      "severity score",
      "risk score",
    ],
  },
  {
    id: "get_owasp_scores",
    description:
      "Calculate OWASP Risk Rating likelihood, technical impact, and business impact scores from a vector string",
    category: "calculator",
    endpoint: "/v1/calculator/owasp",
    method: "GET",
    requiredParams: ["vector"],
    optionalParams: {},
    keywords: [
      "owasp",
      "owasp score",
      "owasp calculator",
      "owasp risk rating",
      "risk rating",
    ],
  },

  // ── Search ───────────────────────────────────────────────────────────────
  {
    id: "search_components",
    description:
      "Search for components across the portfolio using full-text search",
    category: "search",
    endpoint: "/v1/search/component",
    method: "GET",
    requiredParams: ["query"],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
    },
    keywords: [
      "search components",
      "find components",
      "component search",
      "full text search components",
    ],
  },
  {
    id: "search_projects",
    description:
      "Search for projects across the portfolio using full-text search",
    category: "search",
    endpoint: "/v1/search/project",
    method: "GET",
    requiredParams: ["query"],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
    },
    keywords: [
      "search projects",
      "find projects",
      "project search",
      "full text search projects",
    ],
  },
  {
    id: "search_vulnerabilities",
    description:
      "Search for vulnerabilities using full-text search",
    category: "search",
    endpoint: "/v1/search/vulnerability",
    method: "GET",
    requiredParams: ["query"],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
    },
    keywords: [
      "search vulnerabilities",
      "find vulnerabilities",
      "vulnerability search",
      "cve search",
    ],
  },
  {
    id: "search_licenses",
    description: "Search for licenses using full-text search",
    category: "search",
    endpoint: "/v1/search/license",
    method: "GET",
    requiredParams: ["query"],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
    },
    keywords: [
      "search licenses",
      "find licenses",
      "license search",
    ],
  },
  {
    id: "search_services",
    description: "Search for services using full-text search",
    category: "search",
    endpoint: "/v1/search/service",
    method: "GET",
    requiredParams: ["query"],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
    },
    keywords: [
      "search services",
      "find services",
      "service search",
    ],
  },
  {
    id: "aggregate_search",
    description:
      "Aggregate search across all entity types (components, projects, vulnerabilities, licenses, services)",
    category: "search",
    endpoint: "/v1/search",
    method: "GET",
    requiredParams: ["query"],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
    },
    keywords: [
      "aggregate search",
      "global search",
      "search all",
      "universal search",
    ],
  },

  // ── CWE ──────────────────────────────────────────────────────────────────
  {
    id: "get_cwes",
    description: "List all CWEs (Common Weakness Enumerations)",
    category: "cwe",
    endpoint: "/v1/cwe",
    method: "GET",
    requiredParams: [],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
    },
    keywords: ["cwe", "common weakness", "weakness enumeration"],
  },
  {
    id: "get_cwe",
    description: "Get a specific CWE by its ID",
    category: "cwe",
    endpoint: "/v1/cwe/{cweId}",
    method: "GET",
    requiredParams: ["cweId"],
    optionalParams: {},
    keywords: ["cwe details", "specific cwe", "weakness details"],
  },

  // ── Licenses ─────────────────────────────────────────────────────────────
  {
    id: "get_licenses",
    description:
      "List all licenses with complete metadata",
    category: "license",
    endpoint: "/v1/license",
    method: "GET",
    requiredParams: [],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
    },
    keywords: ["licenses", "license list", "all licenses"],
  },
  {
    id: "get_license",
    description: "Get a specific license by its ID",
    category: "license",
    endpoint: "/v1/license/{licenseId}",
    method: "GET",
    requiredParams: ["licenseId"],
    optionalParams: {},
    keywords: ["license details", "specific license", "license by id"],
  },
  {
    id: "get_license_listing",
    description: "Get a concise listing of all licenses (name + ID only)",
    category: "license",
    endpoint: "/v1/license/concise",
    method: "GET",
    requiredParams: [],
    optionalParams: {},
    keywords: [
      "license listing",
      "concise licenses",
      "license names",
      "license summary",
    ],
  },

  // ── Services ─────────────────────────────────────────────────────────────
  {
    id: "get_services",
    description: "List all services for a given project",
    category: "service",
    endpoint: "/v1/service/project/{uuid}",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
    },
    keywords: [
      "services",
      "project services",
      "external services",
      "service components",
    ],
  },
  {
    id: "get_service",
    description: "Get a specific service by UUID",
    category: "service",
    endpoint: "/v1/service/{uuid}",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {},
    keywords: [
      "service details",
      "single service",
      "service by id",
    ],
  },

  // ── Tags ─────────────────────────────────────────────────────────────────
  {
    id: "get_tags",
    description: "List all tags in the portfolio",
    category: "tag",
    endpoint: "/v1/tag",
    method: "GET",
    requiredParams: [],
    optionalParams: {},
    keywords: ["tags", "tag list", "all tags"],
  },
  {
    id: "get_tagged_projects",
    description: "List all projects assigned to a specific tag",
    category: "tag",
    endpoint: "/v1/tag/{name}/project",
    method: "GET",
    requiredParams: ["name"],
    optionalParams: {
      offset: "Skip N results",
      limit: "Max results to return",
    },
    keywords: ["tagged projects", "projects by tag name"],
  },
  {
    id: "get_tagged_policies",
    description: "List all policies assigned to a specific tag",
    category: "tag",
    endpoint: "/v1/tag/{name}/policy",
    method: "GET",
    requiredParams: ["name"],
    optionalParams: {},
    keywords: ["tagged policies", "policies by tag"],
  },

  // ── Teams ────────────────────────────────────────────────────────────────
  {
    id: "get_teams",
    description: "List all teams",
    category: "team",
    endpoint: "/v1/team",
    method: "GET",
    requiredParams: [],
    optionalParams: {},
    keywords: ["teams", "team list", "all teams"],
  },
  {
    id: "get_team",
    description: "Get a specific team by UUID",
    category: "team",
    endpoint: "/v1/team/{uuid}",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {},
    keywords: ["team details", "single team", "team by id"],
  },
  {
    id: "get_self",
    description: "Get information about the current authenticated team",
    category: "team",
    endpoint: "/v1/team/self",
    method: "GET",
    requiredParams: [],
    optionalParams: {},
    keywords: ["current team", "my team", "self", "whoami"],
  },

  // ── Repositories ─────────────────────────────────────────────────────────
  {
    id: "get_repositories",
    description: "List all configured repositories",
    category: "repository",
    endpoint: "/v1/repository",
    method: "GET",
    requiredParams: [],
    optionalParams: {},
    keywords: ["repositories", "repo list", "all repositories"],
  },
  {
    id: "get_repositories_by_type",
    description: "List repositories that support a specific ecosystem type",
    category: "repository",
    endpoint: "/v1/repository/{type}",
    method: "GET",
    requiredParams: ["type"],
    optionalParams: {},
    keywords: [
      "repositories by type",
      "maven repos",
      "npm repos",
      "pypi repos",
      "nuget repos",
    ],
  },
  {
    id: "get_latest_component_version",
    description:
      "Attempt to resolve the latest version of a component available in repositories",
    category: "repository",
    endpoint: "/v1/repository/latest",
    method: "GET",
    requiredParams: [],
    optionalParams: {
      group: "Component group",
      name: "Component name",
      type: "Repository type (e.g., NPM, MAVEN, PYPI)",
    },
    keywords: [
      "latest version",
      "component version check",
      "outdated check",
      "version lookup",
    ],
  },

  // ── Dependency Graph ─────────────────────────────────────────────────────
  {
    id: "get_direct_dependencies",
    description:
      "Get the direct dependencies (components and services) for a project",
    category: "dependencygraph",
    endpoint: "/v1/dependencyGraph/project/{uuid}/directDependencies",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {},
    keywords: [
      "direct dependencies",
      "project dependency graph",
      "first-level dependencies",
    ],
  },

  // ── Project Properties ───────────────────────────────────────────────────
  {
    id: "get_project_properties",
    description: "Get all properties for a specific project",
    category: "projectproperty",
    endpoint: "/v1/project/{uuid}/property",
    method: "GET",
    requiredParams: ["uuid"],
    optionalParams: {},
    keywords: ["project properties", "project metadata", "project custom fields"],
  },

  // ── Config Properties ────────────────────────────────────────────────────
  {
    id: "get_config_properties",
    description: "Get all configuration properties (requires SYSTEM_CONFIGURATION permission)",
    category: "configproperty",
    endpoint: "/v1/configProperty",
    method: "GET",
    requiredParams: [],
    optionalParams: {},
    keywords: ["config", "configuration", "settings", "system config"],
  },
  {
    id: "get_public_config_property",
    description: "Get a public configuration property by group and name",
    category: "configproperty",
    endpoint: "/v1/configProperty/public/{groupName}/{propertyName}",
    method: "GET",
    requiredParams: ["groupName", "propertyName"],
    optionalParams: {},
    keywords: ["public config", "public setting"],
  },

  // ── Integration ──────────────────────────────────────────────────────────
  {
    id: "get_osv_ecosystems",
    description: "List all ecosystems supported by OSV (Open Source Vulnerabilities)",
    category: "integration",
    endpoint: "/v1/integration/osv/ecosystem",
    method: "GET",
    requiredParams: [],
    optionalParams: {},
    keywords: ["osv", "ecosystems", "osv ecosystems", "open source vulnerabilities"],
  },
];
