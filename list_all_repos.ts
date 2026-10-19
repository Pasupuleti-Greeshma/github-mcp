import { repoService } from "./src/services/repo.service.js";

async function showAllRepos() {
    try {
        const repos = await repoService.listUserRepositories({ per_page: 100 });
        console.log(`TOTAL_REPOS: ${repos.length}`);
        repos.forEach((r, idx) => {
            console.log(`- [${r.private ? "PRIVATE" : "PUBLIC"}] ${r.name} (${r.html_url})`);
        });
    } catch (err: any) {
        console.error("Error:", err.message);
    }
}

showAllRepos();
