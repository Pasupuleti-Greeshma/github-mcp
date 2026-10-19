import { githubClient } from "./src/clients/github.client.js";

async function createRepo() {
    try {
        console.log("Creating repository 'github-mcp' on GitHub...");
        const newRepo = await githubClient.post<any>("/user/repos", {
            name: "github-mcp",
            description: "GitHub Model Context Protocol (MCP) server for repositories, pull requests, issues, and workflow runs",
            private: false,
            auto_init: false,
        });
        console.log("SUCCESS:", newRepo.html_url);
        console.log("CLONE_URL:", newRepo.clone_url);
    } catch (err: any) {
        if (err.message.includes("name already exists")) {
            console.log("EXISTS: Repository already exists on GitHub!");
        } else {
            console.error("FAILED:", err.message);
        }
    }
}

createRepo();
