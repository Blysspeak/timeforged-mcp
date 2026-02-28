import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { tfFetch } from "../client.js";

interface StatusResponse {
  status: string;
  version: string;
  user_count: number;
  event_count: number;
}

export function registerStatusTool(server: McpServer) {
  const handler = async () => {
    try {
      const data = (await tfFetch("/api/v1/status")) as StatusResponse;
      return {
        content: [
          {
            type: "text" as const,
            text: [
              `Status: ${data.status}`,
              `Version: ${data.version}`,
              `Users: ${data.user_count}`,
              `Events: ${data.event_count}`,
            ].join("\n"),
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

  server.tool("tf_status", "Check TimeForged daemon status", {}, handler);
  server.tool("status", "Check TimeForged daemon status (alias)", {}, handler);
}
