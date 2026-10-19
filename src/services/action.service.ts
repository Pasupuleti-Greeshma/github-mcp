import { githubClient } from "../clients/github.client.js";

export class ActionService {
    async listWorkflowRuns(
        owner: string,
        repo: string,
        options: { status?: string; branch?: string; per_page?: number; page?: number } = {}
    ) {
        return githubClient.get<any>(`/repos/${owner}/${repo}/actions/runs`, {
            status: options.status,
            branch: options.branch,
            per_page: options.per_page || 30,
            page: options.page || 1,
        });
    }

    async getWorkflowRun(owner: string, repo: string, runId: number) {
        return githubClient.get<any>(`/repos/${owner}/${repo}/actions/runs/${runId}`);
    }

    async listWorkflowRunJobs(owner: string, repo: string, runId: number) {
        return githubClient.get<any>(`/repos/${owner}/${repo}/actions/runs/${runId}/jobs`);
    }
}

export const actionService = new ActionService();
