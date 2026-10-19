import type * as z from "zod/v4";

export interface ToolDefinition {
    name: string;
    description: string;
    inputSchema: z.ZodType;
    execute: (args: unknown) => Promise<unknown>;
}
