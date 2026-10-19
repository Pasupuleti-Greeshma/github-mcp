import { githubClient } from "../clients/github.client.js";

export class IssueService {
    async listRepoIssues(
        owner: string,
        repo: string,
        options: { state?: "open" | "closed" | "all"; sort?: string; direction?: string; per_page?: number; page?: number } = {}
    ) {
        return githubClient.get<any[]>(`/repos/${owner}/${repo}/issues`, {
            state: options.state || "open",
            sort: options.sort || "created",
            direction: options.direction || "desc",
            per_page: options.per_page || 30,
            page: options.page || 1,
        });
    }

    async getIssue(owner: string, repo: string, issueNumber: number) {
        return githubClient.get<any>(`/repos/${owner}/${repo}/issues/${issueNumber}`);
    }

    async createIssue(
        owner: string,
        repo: string,
        payload: { title: string; body?: string; labels?: string[]; assignees?: string[] }
    ) {
        return githubClient.post<any>(`/repos/${owner}/${repo}/issues`, payload);
    }

    async searchUserIssues(author?: string, state: "open" | "closed" | "all" = "open", query?: string) {
        let q = "is:issue";
        if (state !== "all") {
            q += ` is:${state}`;
        }
        if (author) {
            q += ` author:${author}`;
        }
        if (query) {
            q += ` ${query}`;
        }

        return githubClient.get<any>("/search/issues", {
            q,
            sort: "updated",
            order: "desc",
            per_page: 50,
        });
    }
}

export const issueService = new IssueService();
