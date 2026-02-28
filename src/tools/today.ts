import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { tfFetch } from "../client.js";
import { formatSeconds } from "../utils.js";

interface SummaryResponse {
  total_seconds: number;
  projects: Array<{ name: string; total_seconds: number; percent: number }>;
  languages: Array<{ name: string; total_seconds: number; percent: number }>;
}

export function registerTodayTool(server: McpServer) {
  const handler = async () => {
    try {
      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const from = startOfDay.toISOString();
      const to = now.toISOString();

      const data = (await tfFetch(
        `/api/v1/reports/summary?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      )) as SummaryResponse;

      const lines: string[] = [`Today: ${formatSeconds(data.total_seconds)}`];

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

  server.tool("tf_today", "Get today's coding time summary", {}, handler);
  server.tool("today", "Get today's coding time summary (alias)", {}, handler);
}
