import {
    createServer as createHttpServer
} from "node:http";

import type {
    IncomingMessage,
    ServerResponse
} from "node:http";

import {
    createMcpHandler
} from "@modelcontextprotocol/server";

import {
    localhostHostValidation,
    localhostOriginValidation,
    toNodeHandler,
} from "@modelcontextprotocol/node";

import {
    env
} from "./config/env.js";

import {
    createMcpServer
} from "./server.js";

const handler = createMcpHandler(createMcpServer);

const nodeHandler = toNodeHandler(handler);
const validateHost = localhostHostValidation();
const validateOrigin = localhostOriginValidation();

function hasBearerAccessToken(
    req: IncomingMessage,
    res: ServerResponse
): boolean {
    if (!env.mcpAccessToken) {
        return true;
    }

    const header = req.headers.authorization ?? "";
    const expected = `Bearer ${env.mcpAccessToken}`;

    if (header === expected) {
        (req as IncomingMessage & {
            auth?: { clientId: string };
        }).auth = { clientId: "github-mcp-client" };
        return true;
    }

    res.writeHead(401, {
        "Content-Type": "application/json",
        "WWW-Authenticate": "Bearer",
    });
    res.end(
        JSON.stringify({ error: "unauthorized" })
    );

    return false;
}

const server = createHttpServer((req, res) => {
    if (!validateHost(req, res)) {
        return;
    }

    if (!validateOrigin(req, res)) {
        return;
    }

    if (!hasBearerAccessToken(req, res)) {
        return;
    }

    void nodeHandler(req, res);
});

server.listen(env.mcpPort, "127.0.0.1", () => {
    console.error(
        `GitHub MCP server listening on ` +
        `http://127.0.0.1:${env.mcpPort}/mcp`
    );
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, async () => {
        await handler.close();
        server.close(() => process.exit(0));
    });
}
