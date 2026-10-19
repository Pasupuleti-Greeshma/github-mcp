import { userService } from "./src/services/user.service.js";
import { repoService } from "./src/services/repo.service.js";
import { pullRequestService } from "./src/services/pull-request.service.js";

async function testGitHubMcp() {
    console.log("🚀 Testing GitHub MCP Services...\n");

    try {
        // 1. Authenticated User Profile
        console.log("1️⃣ Fetching Authenticated User Profile...");
        const user = await userService.getAuthenticatedUser();
        console.log(`   ✅ Logged in as: ${user.name || user.login} (@${user.login})`);
        console.log(`   🔗 Profile URL: ${user.html_url}`);
        console.log(`   📦 Public Repos: ${user.public_repos}, Total Private: ${user.total_private_repos ?? "N/A"}\n`);

        // 2. Executive Overview
        console.log("2️⃣ Fetching GitHub Executive Overview (Total Repos & Open PRs count)...");
        const overview = await userService.getUserOverview();
        console.log(`   📊 Total Repositories accessible: ${overview.repositories_count}`);
        console.log(`   🔀 Total Open PRs / MRs: ${overview.open_pull_requests_count}`);
        console.log(`   🐛 Total Open Issues: ${overview.open_issues_count}\n`);

        // 3. List recent repositories
        console.log("3️⃣ Recent 5 Repositories:");
        const repos = await repoService.listUserRepositories({ per_page: 5 });
        if (repos.length === 0) {
            console.log("   (No repositories found)");
        } else {
            repos.forEach((r, idx) => {
                console.log(`   ${idx + 1}. ${r.full_name} (${r.private ? "Private" : "Public"}) - ⭐ ${r.stargazers_count}`);
            });
        }
        console.log("");

        // 4. Open PRs
        console.log("4️⃣ User's Open PRs / MRs:");
        const prs = await pullRequestService.searchUserPullRequests(user.login, "open");
        if (!prs.items || prs.items.length === 0) {
            console.log("   (No open PRs currently found)");
        } else {
            prs.items.slice(0, 5).forEach((pr: any, idx: number) => {
                console.log(`   ${idx + 1}. #${pr.number}: ${pr.title} (${pr.html_url})`);
            });
        }

        console.log("\n🎉 All GitHub MCP tests passed successfully!");
    } catch (error: any) {
        console.error("\n❌ Error while testing GitHub MCP:", error.message);
    }
}

testGitHubMcp();
