import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { tfFetch } from "../client.js";
import { formatSeconds } from "../utils.js";

interface ReportResponse {
  total_seconds: number;
  from: string;
  to: string;
  projects: Array<{ name: string; total_seconds: number; percent: number }>;
  languages: Array<{ name: string; total_seconds: number; percent: number }>;
  days: Array<{ date: string; total_seconds: number }>;
}

const schema = {
  from: z
    .string()
    .optional()
    .describe("Start datetime (ISO 8601). Defaults to 7 days ago."),
  to: z
    .string()
    .optional()
    .describe("End datetime (ISO 8601). Defaults to now."),
  project: z.string().optional().describe("Filter by project name"),
  language: z.string().optional().describe("Filter by language"),
};

const handler = async ({
  from,
  to,
  project,
  language,
}: {
  from?: string;
  to?: string;
  project?: string;
  language?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (project) params.set("project", project);
    if (language) params.set("language", language);

    const qs = params.toString();
    const data = (await tfFetch(
      `/api/v1/reports/summary${qs ? `?${qs}` : ""}`
    )) as ReportResponse;

    const lines: string[] = [
      `Total: ${formatSeconds(data.total_seconds)}`,
      `Period: ${data.from} → ${data.to}`,
    ];

    if (data.projects.length > 0) {
      lines.push(
        "",
        "Projects:",
        ...data.projects.map(
          (p) =>
            `  ${p.name}: ${formatSeconds(p.total_seconds)} (${p.percent.toFixed(0)}%)`
        )
      );
    }

    if (data.languages.length > 0) {
      lines.push(
        "",
        "Languages:",
        ...data.languages.map(
          (l) =>
            `  ${l.name}: ${formatSeconds(l.total_seconds)} (${l.percent.toFixed(0)}%)`
        )
      );
    }

    if (data.days.length > 0) {
      lines.push(
        "",
        "Daily:",
        ...data.days.map(
          (d) => `  ${d.date}: ${formatSeconds(d.total_seconds)}`
        )
      );
    }

    return {
      content: [{ type: "text" as const, text: lines.join("\n") }],
    };
  } catch (e) {
    return {
      content: [
        { type: "text" as const, text: `Error: ${(e as Error).message}` },
      ],
      isError: true,
    };
  }
};

export function registerReportTool(server: McpServer) {
  server.tool("tf_report", "Get coding time summary for a date range", schema, handler);
  server.tool("report", "Get coding time summary (alias)", schema, handler);
}
