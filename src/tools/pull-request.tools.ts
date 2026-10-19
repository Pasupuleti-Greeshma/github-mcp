import * as z from "zod/v4";
import { pullRequestService } from "../services/pull-request.service.js";
import type { ToolDefinition } from "./types.js";

export const pullRequestTools: ToolDefinition[] = [
    {
        name: "list_pull_requests",
        description: "List pull requests (MRs) for a specific GitHub repository.",
        inputSchema: z.object({
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            state: z.enum(["open", "closed", "all"]).optional().describe("PR state"),
            head: z.string().optional().describe("Filter by head branch/user"),
            base: z.string().optional().describe("Filter by target base branch"),
            per_page: z.number().int().min(1).max(100).optional(),
            page: z.number().int().min(1).optional(),
        }),
        execute: async (args) => {
            const { owner, repo, ...options } = args as any;
            return pullRequestService.listRepoPullRequests(owner, repo, options);
        },
    },
    {
        name: "get_pull_request",
        description: "Get comprehensive details of a specific Pull Request / MR.",
        inputSchema: z.object({
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            pull_number: z.number().int().describe("Pull request number"),
        }),
        execute: async (args) => {
            const { owner, repo, pull_number } = args as any;
            return pullRequestService.getPullRequest(owner, repo, pull_number);
        },
    },
    {
        name: "get_pull_request_files",
        description: "Get list of modified files, additions, deletions and patches in a PR.",
        inputSchema: z.object({
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            pull_number: z.number().int().describe("Pull request number"),
        }),
        execute: async (args) => {
            const { owner, repo, pull_number } = args as any;
            return pullRequestService.getPullRequestFiles(owner, repo, pull_number);
        },
    },
    {
        name: "search_pull_requests",
        description:
            "Search pull requests across all accessible repositories. Perfect for finding all open PRs created by the user or across the org.",
        inputSchema: z.object({
            author: z.string().optional().describe("GitHub username of the author"),
            state: z.enum(["open", "closed", "all"]).optional().describe("State of the PR"),
            query: z.string().optional().describe("Additional search query keywords"),
        }),
        execute: async (args) => {
            const { author, state, query } = args as any;
            return pullRequestService.searchUserPullRequests(author, state, query);
        },
    },
    {
        name: "create_pull_request",
        description: "Create a new Pull Request in a repository.",
        inputSchema: z.object({
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            title: z.string().describe("Title of the PR"),
            head: z.string().describe("Branch with changes"),
            base: z.string().describe("Branch to merge into (e.g. main)"),
            body: z.string().optional().describe("Description of the PR"),
            draft: z.boolean().optional().describe("Create as draft PR"),
        }),
        execute: async (args) => {
            const { owner, repo, ...payload } = args as any;
            return pullRequestService.createPullRequest(owner, repo, payload);
        },
    },
    {
        name: "update_pull_request",
        description: "Update title, description, or state (close/reopen) of a pull request.",
        inputSchema: z.object({
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            pull_number: z.number().int().describe("Pull request number"),
            title: z.string().optional(),
            body: z.string().optional(),
            state: z.enum(["open", "closed"]).optional(),
            base: z.string().optional(),
        }),
        execute: async (args) => {
            const { owner, repo, pull_number, ...payload } = args as any;
            return pullRequestService.updatePullRequest(owner, repo, pull_number, payload);
        },
    },
];
