import dotenv from "dotenv";

dotenv.config();

function getRequiredEnv(name: string): string {
    const value = process.env[name]?.trim();
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

function getOptionalEnv(name: string, fallback: string): string {
    const value = process.env[name]?.trim();
    return value || fallback;
}

function getOptionalInt(name: string, fallback: number): number {
    const value = process.env[name]?.trim();
    if (!value) return fallback;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const env = {
    get githubToken(): string {
        return getRequiredEnv("GITHUB_TOKEN");
    },
    githubApiUrl: getOptionalEnv("GITHUB_API_URL", "https://api.github.com"),
    rateLimitRps: getOptionalInt("RATE_LIMIT_RPS", 10),
    maxOutputChars: getOptionalInt("MAX_OUTPUT_CHARS", 100000),
    mcpPort: getOptionalInt("MCP_PORT", 3009),
    mcpAccessToken: process.env.MCP_ACCESS_TOKEN?.trim() || "",
    auditLogPath: process.env.GITHUB_AUDIT_LOG?.trim() || "",
};
