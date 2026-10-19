import { env } from "../config/env.js";

const TOKEN_PATTERNS = [
    /ghp_[A-Za-z0-9_]{36,}/g,
    /github_pat_[A-Za-z0-9_]{82}/g,
    /gho_[A-Za-z0-9_]{36,}/g,
    /ghu_[A-Za-z0-9_]{36,}/g,
    /ghs_[A-Za-z0-9_]{36,}/g,
    /ghr_[A-Za-z0-9_]{36,}/g,
    /Bearer\s+[A-Za-z0-9._~+/-]+=*/gi,
];

export function redactSecrets(text: string): string {
    let result = text;

    try {
        const token = env.githubToken;
        if (token && token.length > 4) {
            result = result.split(token).join("***REDACTED***");
        }
    } catch {
        // Token might not be set yet
    }

    for (const pattern of TOKEN_PATTERNS) {
        result = result.replace(pattern, "***REDACTED***");
    }

    return result;
}

export function truncateOutput(text: string): string {
    if (text.length <= env.maxOutputChars) {
        return text;
    }
    return (
        text.slice(0, env.maxOutputChars) +
        `\n\n... [Output truncated at ${env.maxOutputChars} characters]`
    );
}
