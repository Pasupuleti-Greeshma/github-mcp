import * as z from "zod/v4";
import { repoService } from "../services/repo.service.js";
import type { ToolDefinition } from "./types.js";

export const repoTools: ToolDefinition[] = [
    {
        name: "list_repositories",
        description:
            "List all repositories accessible to the user (owned, member, or orgs) with stats like stars, forks, open issues count, and visibility.",
        inputSchema: z.object({
            visibility: z
                .enum(["all", "public", "private"])
                .optional()
                .describe("Filter by repo visibility"),
            sort: z
                .enum(["created", "updated", "pushed", "full_name"])
                .optional()
                .describe("Sort order"),
            direction: z.enum(["asc", "desc"]).optional(),
            per_page: z.number().int().min(1).max(100).optional().describe("Number of items per page"),
            page: z.number().int().min(1).optional(),
        }),
        execute: async (args) => {
            return repoService.listUserRepositories(args as any);
        },
    },
    {
        name: "get_repository",
        description: "Get detailed information about a specific GitHub repository.",
        inputSchema: z.object({
            owner: z.string().describe("Owner/username or organization"),
            repo: z.string().describe("Repository name"),
        }),
        execute: async (args) => {
            const { owner, repo } = args as { owner: string; repo: string };
            return repoService.getRepository(owner, repo);
        },
    },
    {
        name: "search_repositories",
        description: "Search for GitHub repositories using GitHub search syntax.",
        inputSchema: z.object({
            query: z.string().describe("Search query string"),
            sort: z.string().optional().describe("Sort field, e.g. 'stars', 'forks', 'updated'"),
            order: z.enum(["asc", "desc"]).optional(),
            per_page: z.number().int().min(1).max(100).optional(),
            page: z.number().int().min(1).optional(),
        }),
        execute: async (args) => {
            const { query, sort, order, per_page, page } = args as any;
            return repoService.searchRepositories(query, sort, order, per_page, page);
        },
    },
    {
        name: "list_branches",
        description: "List branches of a repository.",
        inputSchema: z.object({
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            per_page: z.number().int().min(1).max(100).optional(),
            page: z.number().int().min(1).optional(),
        }),
        execute: async (args) => {
            const { owner, repo, per_page, page } = args as any;
            return repoService.listBranches(owner, repo, per_page, page);
        },
    },
    {
        name: "get_file_content",
        description: "Retrieve a file or directory content from a repository.",
        inputSchema: z.object({
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            path: z.string().describe("File path inside the repo"),
            ref: z.string().optional().describe("Branch, tag, or commit SHA"),
        }),
        execute: async (args) => {
            const { owner, repo, path, ref } = args as any;
            return repoService.getFileContent(owner, repo, path, ref);
        },
    },
];
