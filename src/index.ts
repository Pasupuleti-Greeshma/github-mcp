import {
    serveStdio
} from "@modelcontextprotocol/server/stdio";

import {
    createMcpServer
} from "./server.js";

void serveStdio(createMcpServer);

console.error(
    "GitHub MCP server running (stdio)"
);
