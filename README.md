<p align="center">
  <img src="timeforged.png" width="180" alt="TimeForged" />
</p>

<h1 align="center">TimeForged MCP</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/timeforged-mcp"><img src="https://img.shields.io/npm/v/timeforged-mcp.svg" alt="npm version" /></a>
  <a href="https://github.com/Blysspeak/timeforged-mcp/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/timeforged-mcp.svg" alt="license" /></a>
  <a href="https://modelcontextprotocol.io"><img src="https://img.shields.io/badge/MCP-compatible-blue" alt="MCP" /></a>
</p>

<p align="center">
  MCP server for <a href="https://github.com/Blysspeak/timeforged">TimeForged</a> — open-source time tracking for developers.<br/>
  Connect your AI assistant to your coding time data.
</p>

---

## Quick Start

```bash
npx timeforged-mcp
```

That's it. The server communicates over stdio using the [Model Context Protocol](https://modelcontextprotocol.io).

## Configuration

All configuration is done through environment variables:

| Variable | Description | Default |
|---|---|---|
| `TF_API_KEY` | Your TimeForged API key | _(none)_ |
| `TF_SERVER_URL` | TimeForged daemon URL | `http://127.0.0.1:6175` |

## Setup

### Claude Desktop

Add to `~/.config/claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "timeforged": {
      "command": "npx",
      "args": ["-y", "timeforged-mcp"],
      "env": {
        "TF_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add timeforged \
  --transport stdio \
  --env TF_API_KEY=your-api-key \
  -- npx -y timeforged-mcp
```

### Cursor / VS Code

Add to MCP settings:

```json
{
  "mcpServers": {
    "timeforged": {
      "command": "npx",
      "args": ["-y", "timeforged-mcp"],
      "env": {
        "TF_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Tools

| Tool | Description |
|---|---|
| `tf_status` | Check daemon status (version, user/event counts) |
| `tf_today` | Today's coding time with project & language breakdown |
| `tf_report` | Time summary for any date range with filters |
| `tf_sessions` | List coding sessions with durations |
| `tf_send` | Send a manual heartbeat/event |

### Examples

> "How much did I code today?"
> → AI calls `tf_today`

> "Show me last week's report for the timeforged project"
> → AI calls `tf_report` with `from`, `to`, `project`

> "List my sessions from yesterday"
> → AI calls `tf_sessions` with `from`, `to`

## Requirements

- Node.js >= 18
- Running [TimeForged](https://github.com/Blysspeak/timeforged) daemon

## License

[MIT](LICENSE)
