import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { tfFetch } from "../client.js";
import { inferLanguage } from "../language.js";

interface EventResponse {
  id: number;
  timestamp: string;
  event_type: string;
  entity: string;
}

const schema = {
  entity: z.string().describe("File path or entity name"),
  event_type: z
    .enum(["file", "terminal", "browser", "meeting", "custom"])
    .optional()
    .default("file")
    .describe("Event type"),
  project: z.string().optional().describe("Project name"),
  language: z.string().optional().describe("Language"),
  activity: z
    .enum([
      "coding",
      "browsing",
      "debugging",
      "building",
      "communicating",
      "designing",
      "other",
    ])
    .optional()
    .default("coding")
    .describe("Activity type"),
};

const handler = async ({
  entity,
  event_type,
  project,
  language,
  activity,
}: {
  entity: string;
  event_type: string;
  project?: string;
  language?: string;
  activity: string;
}) => {
  try {
    const detectedLanguage = language || inferLanguage(entity);
    const payload = {
      timestamp: new Date().toISOString(),
      event_type,
      entity,
      activity,
      ...(project ? { project } : {}),
      ...(detectedLanguage ? { language: detectedLanguage } : {}),
      metadata: { source: "mcp" },
    };

    const data = (await tfFetch("/api/v1/events", {
      method: "POST",
      body: JSON.stringify(payload),
    })) as EventResponse;

    return {
      content: [
        {
          type: "text" as const,
          text: `Event sent: id=${data.id}, entity=${data.entity}, type=${data.event_type}`,
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

export function registerSendTool(server: McpServer) {
  server.tool("tf_send", "Send an event/heartbeat to TimeForged", schema, handler);
  server.tool("send", "Send an event/heartbeat (alias)", schema, handler);
}
