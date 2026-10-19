import * as z from "zod/v4";
import { actionService } from "../services/action.service.js";
import type { ToolDefinition } from "./types.js";

export const actionTools: ToolDefinition[] = [
    {
        name: "list_workflow_runs",
        description: "List recent GitHub Actions CI/CD workflow runs for a repository.",
        inputSchema: z.object({
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            status: z.string().optional().describe("Filter by status (e.g. 'completed', 'success', 'failure')"),
            branch: z.string().optional().describe("Filter by branch"),
            per_page: z.number().int().min(1).max(100).optional(),
            page: z.number().int().min(1).optional(),
        }),
        execute: async (args) => {
            const { owner, repo, ...options } = args as any;
            return actionService.listWorkflowRuns(owner, repo, options);
        },
    },
    {
        name: "get_workflow_run",
        description: "Get detailed information about a specific CI/CD workflow run.",
        inputSchema: z.object({
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            run_id: z.number().int().describe("Workflow run ID"),
        }),
        execute: async (args) => {
            const { owner, repo, run_id } = args as any;
            return actionService.getWorkflowRun(owner, repo, run_id);
        },
    },
    {
        name: "list_workflow_run_jobs",
        description: "List individual jobs and steps in a GitHub Action workflow run to inspect errors.",
        inputSchema: z.object({
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            run_id: z.number().int().describe("Workflow run ID"),
        }),
        execute: async (args) => {
            const { owner, repo, run_id } = args as any;
            return actionService.listWorkflowRunJobs(owner, repo, run_id);
        },
    },
];
