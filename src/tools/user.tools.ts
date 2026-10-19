import * as z from "zod/v4";
import { userService } from "../services/user.service.js";
import type { ToolDefinition } from "./types.js";

export const userTools: ToolDefinition[] = [
    {
        name: "get_github_overview",
        description:
            "Returns a complete executive overview of the authenticated user's GitHub account: total repositories count, open PRs count, open issues count, and recent active repos.",
        inputSchema: z.object({}),
        execute: async () => {
            return userService.getUserOverview();
        },
    },
    {
        name: "get_authenticated_user",
        description: "Returns profile details for the currently authenticated GitHub user.",
        inputSchema: z.object({}),
        execute: async () => {
            return userService.getAuthenticatedUser();
        },
    },
];
