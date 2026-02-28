#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import "./config.js";
import {
  registerStatusTool,
  registerTodayTool,
  registerReportTool,
  registerSessionsTool,
  registerSendTool,
} from "./tools/index.js";

const server = new McpServer({
  name: "timeforged",
  version: "0.1.0",
});

registerStatusTool(server);
registerTodayTool(server);
registerReportTool(server);
registerSessionsTool(server);
registerSendTool(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
