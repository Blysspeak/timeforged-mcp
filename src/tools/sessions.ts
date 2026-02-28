import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { tfFetch } from "../client.js";
import { formatSeconds } from "../utils.js";

interface Session {
  start: string;
  end: string;
  duration_seconds: number;
  project: string | null;
  event_count: number;
}

const schema = {
  from: z.string().optional().describe("Start datetime (ISO 8601)"),
  to: z.string().optional().describe("End datetime (ISO 8601)"),
  project: z.string().optional().describe("Filter by project name"),
};

const handler = async ({
  from,
  to,
  project,
}: {
  from?: string;
  to?: string;
  project?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (project) params.set("project", project);

    const qs = params.toString();
    const data = (await tfFetch(
      `/api/v1/reports/sessions${qs ? `?${qs}` : ""}`
    )) as Session[];

    if (data.length === 0) {
      return {
        content: [{ type: "text" as const, text: "No sessions found." }],
      };
    }

    const lines = data.map((s, i) => {
      const proj = s.project ? ` [${s.project}]` : "";
      return `${i + 1}. ${s.start} → ${s.end} (${formatSeconds(s.duration_seconds)}, ${s.event_count} events)${proj}`;
    });

    return {
      content: [
        {
          type: "text" as const,
          text: `Sessions (${data.length}):\n${lines.join("\n")}`,
        },
      ],
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

export function registerSessionsTool(server: McpServer) {
  server.tool("tf_sessions", "List coding sessions", schema, handler);
  server.tool("sessions", "List coding sessions (alias)", schema, handler);
}
