import type { McpServer } from "@modelcontextprotocol/server";

export function registerPrompts(server: McpServer): void {
    server.registerPrompt(
        "summarize-github-status",
        {
            description: "Summarizes the user's active GitHub projects, open PRs/MRs, and pending review work.",
        },
        async () => {
            return {
                messages: [
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: "Please use `get_github_overview` and `search_pull_requests` to provide a concise executive dashboard of my GitHub projects, total repositories, and all open PRs needing attention.",
                        },
                    },
                ],
            };
        }
    );

    server.registerPrompt(
        "analyze-pr",
        {
            description: "Provides an automated code review and summary of changes for a specific Pull Request.",
        },
        async () => {
            return {
                messages: [
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: "Please use `get_pull_request` and `get_pull_request_files` to analyze the pull request, summarize the changes, identify potential bugs or performance issues, and suggest improvements.",
                        },
                    },
                ],
            };
        }
    );
}
