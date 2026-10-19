import * as z from "zod/v4";
import { issueService } from "../services/issue.service.js";
import type { ToolDefinition } from "./types.js";

export const issueTools: ToolDefinition[] = [
    {
        name: "list_issues",
        description: "List issues for a specific GitHub repository.",
        inputSchema: z.object({
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            state: z.enum(["open", "closed", "all"]).optional(),
            sort: z.string().optional(),
            direction: z.enum(["asc", "desc"]).optional(),
            per_page: z.number().int().min(1).max(100).optional(),
            page: z.number().int().min(1).optional(),
        }),
        execute: async (args) => {
            const { owner, repo, ...options } = args as any;
            return issueService.listRepoIssues(owner, repo, options);
        },
    },
    {
        name: "get_issue",
        description: "Get details of an issue.",
        inputSchema: z.object({
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            issue_number: z.number().int().describe("Issue number"),
        }),
        execute: async (args) => {
            const { owner, repo, issue_number } = args as any;
            return issueService.getIssue(owner, repo, issue_number);
        },
    },
    {
        name: "search_issues",
        description: "Search issues across GitHub repositories.",
        inputSchema: z.object({
            author: z.string().optional().describe("Issue author username"),
            state: z.enum(["open", "closed", "all"]).optional(),
            query: z.string().optional().describe("Search keywords"),
        }),
        execute: async (args) => {
            const { author, state, query } = args as any;
            return issueService.searchUserIssues(author, state, query);
        },
    },
    {
        name: "create_issue",
        description: "Create a new issue in a repository.",
        inputSchema: z.object({
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            title: z.string().describe("Title of the issue"),
            body: z.string().optional().describe("Body content"),
            labels: z.array(z.string()).optional().describe("List of labels"),
            assignees: z.array(z.string()).optional().describe("List of assignees"),
        }),
        execute: async (args) => {
            const { owner, repo, ...payload } = args as any;
            return issueService.createIssue(owner, repo, payload);
        },
    },
];
