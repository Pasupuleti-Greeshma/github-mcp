# GitHub MCP Server (`github-mcp`)

GitHub Model Context Protocol (MCP) server designed for AI assistants (Antigravity IDE, Claude Desktop, Cursor).

This server allows AI agents to inspect your GitHub account in real time:
- **How many Pull Requests (MRs)** you have open, closed, or pending review across all your repos.
- **How many Projects / Repositories** you have (public, private, orgs).
- **Issue Tracking**, **File Content Browsing**, and **GitHub Actions CI/CD Runs**.

---

## 🚀 Features & Tools

### 1. Executive Account Overview
- `get_github_overview`: Single-call summary showing total repositories, count of open PRs/MRs, open issues, and recently active repos.
- `get_authenticated_user`: Complete user profile details.

### 2. Projects & Repositories
- `list_repositories`: Lists all repositories with stars, forks, visibility, and open issues.
- `get_repository`: Detailed repository metadata.
- `search_repositories`: Search repositories using GitHub query syntax.
- `list_branches`: View active branches in a repo.
- `get_file_content`: Read any file from a repo at a given branch or commit.

### 3. Pull Requests (MRs)
- `search_pull_requests`: Find all PRs/MRs across your repos (filter by `author`, `state="open"`, etc.).
- `list_pull_requests`: List PRs in a specific repository.
- `get_pull_request`: In-depth details, assignees, reviews, and status of a PR.
- `get_pull_request_files`: Modified files, diffs, additions, deletions.
- `create_pull_request`: Open a new PR.
- `update_pull_request`: Edit PR title, body, or state.

### 4. Issues & CI/CD Actions
- `search_issues` & `list_issues` & `get_issue` & `create_issue`.
- `list_workflow_runs` & `get_workflow_run` & `list_workflow_run_jobs`.

---

## 🛠️ Setup & Configuration

### 1. Create a GitHub Personal Access Token (PAT)
1. Go to [GitHub Settings -> Developer Settings -> Personal access tokens](https://github.com/settings/tokens).
2. Generate a token (Classic or Fine-grained) with scopes:
   - `repo` (Full control of private repositories)
   - `read:user`
   - `read:org`
3. Copy the token.

### 2. Configure `.env`
In `f:/mcp server/github-mcp/.env`:
```env
GITHUB_TOKEN=ghp_your_personal_access_token_here
GITHUB_API_URL=https://api.github.com
MCP_PORT=3009
RATE_LIMIT_RPS=10
MAX_OUTPUT_CHARS=100000
```

### 3. Run the Server
```bash
# Development mode (Stdio)
npm run dev

# HTTP Web server mode (localhost:3009/mcp)
npm run dev:http

# Build for production
npm run build
npm start
```

---

## 🔌 Connecting to Antigravity IDE / Claude Desktop

Add this to your MCP configuration (`mcp_config.json`):

```json
{
  "mcpServers": {
    "github-mcp": {
      "command": "node",
      "args": ["f:/mcp server/github-mcp/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "your_github_token_here"
      }
    }
  }
}
```
