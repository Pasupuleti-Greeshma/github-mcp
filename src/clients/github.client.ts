import { env } from "../config/env.js";
import { RateLimiter } from "../security/rate-limit.js";

const githubRateLimiter = new RateLimiter(env.rateLimitRps, env.rateLimitRps);

export class GitHubClient {
    private get baseUrl(): string {
        return env.githubApiUrl.replace(/\/+$/, "");
    }

    private get token(): string {
        return env.githubToken;
    }

    private get headers(): Record<string, string> {
        return {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${this.token}`,
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "github-mcp-server/1.0.0",
        };
    }

    private buildUrl(path: string, query?: Record<string, unknown>): string {
        const normalizedPath = path.startsWith("/") ? path : `/${path}`;
        const url = new URL(`${this.baseUrl}${normalizedPath}`);

        if (query) {
            for (const [key, value] of Object.entries(query)) {
                if (value !== undefined && value !== null && value !== "") {
                    url.searchParams.append(key, String(value));
                }
            }
        }

        return url.toString();
    }

    private async request<T>(
        method: string,
        path: string,
        query?: Record<string, unknown>,
        body?: unknown
    ): Promise<T> {
        await githubRateLimiter.acquire();

        const url = this.buildUrl(path, query);
        const headers: Record<string, string> = { ...this.headers };

        const options: RequestInit = {
            method,
            headers,
        };

        if (body !== undefined) {
            headers["Content-Type"] = "application/json";
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            let errorText = "";
            try {
                const errorJson = await response.json();
                errorText = errorJson.message || JSON.stringify(errorJson);
            } catch {
                errorText = await response.text();
            }
            throw new Error(`GitHub API Error [${response.status} ${response.statusText}]: ${errorText}`);
        }

        if (response.status === 204) {
            return undefined as T;
        }

        return (await response.json()) as T;
    }

    async get<T>(path: string, query?: Record<string, unknown>): Promise<T> {
        return this.request<T>("GET", path, query);
    }

    async post<T>(path: string, body?: unknown, query?: Record<string, unknown>): Promise<T> {
        return this.request<T>("POST", path, query, body);
    }

    async patch<T>(path: string, body?: unknown, query?: Record<string, unknown>): Promise<T> {
        return this.request<T>("PATCH", path, query, body);
    }

    async put<T>(path: string, body?: unknown, query?: Record<string, unknown>): Promise<T> {
        return this.request<T>("PUT", path, query, body);
    }

    async delete<T>(path: string, query?: Record<string, unknown>): Promise<T> {
        return this.request<T>("DELETE", path, query);
    }
}

export const githubClient = new GitHubClient();
