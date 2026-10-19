import { McpServer } from "@modelcontextprotocol/server";
import { userTools } from "./tools/user.tools.js";
import { repoTools } from "./tools/repo.tools.js";
import { pullRequestTools } from "./tools/pull-request.tools.js";
import { issueTools } from "./tools/issue.tools.js";
import { actionTools } from "./tools/action.tools.js";
import type { ToolDefinition } from "./tools/types.js";
import { registerPrompts } from "./prompts.js";
import { audit } from "./security/audit.js";
import { redactSecrets, truncateOutput } from "./security/redact.js";

const tools: ToolDefinition[] = [
    ...userTools,
    ...repoTools,
    ...pullRequestTools,
    ...issueTools,
    ...actionTools,
];

function serializeResult(value: unknown): string {
    if (value === undefined || value === null) {
        return "Success";
    }

    if (typeof value === "string") {
        return truncateOutput(redactSecrets(value));
    }

    return truncateOutput(redactSecrets(JSON.stringify(value, null, 2)));
}

function safeArgs(args: unknown): string {
    return redactSecrets(
        typeof args === "object" && args !== null ? JSON.stringify(args) : ""
    );
}

export function createMcpServer(): McpServer {
    const server = new McpServer({
        name: "github-mcp",
        version: "1.0.0",
    });

    for (const tool of tools) {
        server.registerTool(
            tool.name,
            {
                description: tool.description,
                inputSchema: tool.inputSchema,
            },
            async (args) => {
                const startedAt = Date.now();
                const timestamp = new Date().toISOString();

                try {
                    const result = await tool.execute(args);

                    audit({
                        ts: timestamp,
                        kind: "tool",
                        detail: `tool=${tool.name} args=${safeArgs(args)} ok=true ms=${Date.now() - startedAt}`,
                    });

                    return {
                        content: [
                            {
                                type: "text",
                                text: serializeResult(result),
                            },
                        ],
                    };
                } catch (error) {
                    const message = error instanceof Error ? error.message : "Unknown error";

                    audit({
                        ts: timestamp,
                        kind: "tool",
                        detail: `tool=${tool.name} args=${safeArgs(args)} ok=false ms=${Date.now() - startedAt} error=${redactSecrets(message)}`,
                    });

                    return {
                        content: [
                            {
                                type: "text",
                                text: redactSecrets(message),
                            },
                        ],
                        isError: true,
                    };
                }
            }
        );
    }

    registerPrompts(server);

    return server;
}
