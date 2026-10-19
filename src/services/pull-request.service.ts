import { githubClient } from "../clients/github.client.js";

export interface ListPullRequestsOptions {
    state?: "open" | "closed" | "all";
    head?: string;
    base?: string;
    sort?: "created" | "updated" | "popularity" | "long-running";
    direction?: "asc" | "desc";
    per_page?: number;
    page?: number;
}

export class PullRequestService {
    async listRepoPullRequests(owner: string, repo: string, options: ListPullRequestsOptions = {}) {
        return githubClient.get<any[]>(`/repos/${owner}/${repo}/pulls`, {
            state: options.state || "open",
            head: options.head,
            base: options.base,
            sort: options.sort || "created",
            direction: options.direction || "desc",
            per_page: options.per_page || 30,
            page: options.page || 1,
        });
    }

    async getPullRequest(owner: string, repo: string, pullNumber: number) {
        return githubClient.get<any>(`/repos/${owner}/${repo}/pulls/${pullNumber}`);
    }

    async getPullRequestFiles(owner: string, repo: string, pullNumber: number) {
        return githubClient.get<any[]>(`/repos/${owner}/${repo}/pulls/${pullNumber}/files`);
    }

    async createPullRequest(
        owner: string,
        repo: string,
        payload: { title: string; head: string; base: string; body?: string; draft?: boolean }
    ) {
        return githubClient.post<any>(`/repos/${owner}/${repo}/pulls`, payload);
    }

    async updatePullRequest(
        owner: string,
        repo: string,
        pullNumber: number,
        payload: { title?: string; body?: string; state?: "open" | "closed"; base?: string }
    ) {
        return githubClient.patch<any>(`/repos/${owner}/${repo}/pulls/${pullNumber}`, payload);
    }

    async searchUserPullRequests(author?: string, state: "open" | "closed" | "all" = "open", query?: string) {
        let q = "is:pr";
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

export const pullRequestService = new PullRequestService();
