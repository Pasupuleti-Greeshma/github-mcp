import { githubClient } from "../clients/github.client.js";

export interface ListReposOptions {
    visibility?: "all" | "public" | "private";
    affiliation?: string;
    sort?: "created" | "updated" | "pushed" | "full_name";
    direction?: "asc" | "desc";
    per_page?: number;
    page?: number;
}

export class RepoService {
    async listUserRepositories(options: ListReposOptions = {}) {
        return githubClient.get<any[]>("/user/repos", {
            visibility: options.visibility || "all",
            affiliation: options.affiliation || "owner,collaborator,organization_member",
            sort: options.sort || "updated",
            direction: options.direction || "desc",
            per_page: options.per_page || 30,
            page: options.page || 1,
        });
    }

    async getRepository(owner: string, repo: string) {
        return githubClient.get<any>(`/repos/${owner}/${repo}`);
    }

    async searchRepositories(query: string, sort?: string, order?: string, per_page?: number, page?: number) {
        return githubClient.get<any>("/search/repositories", {
            q: query,
            sort,
            order,
            per_page: per_page || 30,
            page: page || 1,
        });
    }

    async listBranches(owner: string, repo: string, per_page?: number, page?: number) {
        return githubClient.get<any[]>(`/repos/${owner}/${repo}/branches`, {
            per_page: per_page || 30,
            page: page || 1,
        });
    }

    async getFileContent(owner: string, repo: string, path: string, ref?: string) {
        return githubClient.get<any>(`/repos/${owner}/${repo}/contents/${path}`, {
            ref,
        });
    }
}

export const repoService = new RepoService();
