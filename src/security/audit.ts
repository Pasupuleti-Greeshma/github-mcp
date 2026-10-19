import fs from "node:fs";
import { env } from "../config/env.js";

export interface AuditEntry {
    ts: string;
    kind: "tool" | "auth" | "system";
    detail: string;
}

export function audit(entry: AuditEntry): void {
    const line = `[audit] ${entry.ts} kind=${entry.kind} ${entry.detail}\n`;
    console.error(line.trimEnd());

    if (env.auditLogPath) {
        try {
            fs.appendFileSync(env.auditLogPath, line, "utf-8");
        } catch (err) {
            console.error(`[audit-error] Failed to append to ${env.auditLogPath}:`, err);
        }
    }
}
