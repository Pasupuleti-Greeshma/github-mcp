import { githubClient } from "../clients/github.client.js";

export interface GitHubUser {
    login: string;
    id: number;
    name: string;
    avatar_url: string;
    html_url: string;
    public_repos: number;
    total_private_repos?: number;
    owned_private_repos?: number;
    followers: number;
    following: number;
}

export interface GitHubOverview {
    user: {
        login: string;
        name: string;
        html_url: string;
        public_repos: number;
        total_private_repos?: number;
    };
    repositories_count: number;
    open_pull_requests_count: number;
    open_issues_count: number;
    recent_repositories: Array<{
        name: string;
        full_name: string;
        private: boolean;
        stars: number;
        forks: number;
        open_issues: number;
        updated_at: string;
    }>;
}

export class UserService {
    async getAuthenticatedUser(): Promise<GitHubUser> {
        return githubClient.get<GitHubUser>("/user");
    }

    async getUserOverview(): Promise<GitHubOverview> {
        const user = await this.getAuthenticatedUser();

        // 1. Fetch user repositories (up to 100)
        const repos = await githubClient.get<any[]>("/user/repos", {
            per_page: 100,
            sort: "updated",
            affiliation: "owner,collaborator,organization_member",
        });

        // 2. Fetch search count for user's open PRs
        const prSearch = await githubClient.get<{ total_count: number }>("/search/issues", {
            q: `is:pr author:${user.login} is:open`,
        });

        // 3. Fetch search count for user's open issues
        const issueSearch = await githubClient.get<{ total_count: number }>("/search/issues", {
            q: `is:issue author:${user.login} is:open`,
        });

        const recentRepositories = (repos || []).slice(0, 10).map((r) => ({
            name: r.name,
            full_name: r.full_name,
            private: r.private,
            stars: r.stargazers_count,
            forks: r.forks_count,
            open_issues: r.open_issues_count,
            updated_at: r.updated_at,
        }));

        return {
            user: {
                login: user.login,
                name: user.name,
                html_url: user.html_url,
                public_repos: user.public_repos,
                total_private_repos: user.total_private_repos,
            },
            repositories_count: repos?.length || 0,
            open_pull_requests_count: prSearch?.total_count || 0,
            open_issues_count: issueSearch?.total_count || 0,
            recent_repositories: recentRepositories,
        };
    }
}

export const userService = new UserService();
