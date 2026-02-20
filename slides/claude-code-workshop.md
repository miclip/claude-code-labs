---
slug: claude-code-workshop
title: Hands on with Claude Code
description: Agentic Coding in Practice
---

<!-- slide: {"type": "welcome", "theme": "light"} -->
# Welcome!

**Install Claude Code:**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**WiFi:** {{wifi_ssid}} &nbsp;|&nbsp; **Password:** {{wifi_password}}

**API Credits:** {{api_credit_url}}

---

<!-- slide: {"type": "title", "theme": "dark"} -->
# Hands on with Claude Code

### Agentic Coding in Practice

**{{event_name}}**

---

<!-- slide: {"type": "speakers", "theme": "light"} -->
## Your Presenters

{{speakers}}

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Agenda

- Introductions
- Claude Code Overview
- Hands-on Building Pt.1
- Deeper Dive
- Hands-on Building Pt.2
- Show & Tell
- Q & A

---

<!-- slide: {"type": "section", "theme": "orange"} -->
# What is Claude Code?

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Claude Opus 4.5

Our most intelligent model — sets a new standard across coding, agents, and office tasks.

- **3x cheaper than Opus 4.1** at the same frontier intelligence level
- Excels at professional software engineering tasks
- Best model for **production code** and **sophisticated agents**
- Produces documents, spreadsheets, and presentations with professional polish

> "Opus 4.5 is now at a price point where it can be your go-to model for most tasks. It's the clear winner and exhibits the best frontier task planning and tool calling we've seen yet." — Jeff Wang, CEO

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Claude Sonnet 4.5

Leading model for complex agents and coding — **77.2% on SWE-bench Verified**.

- Balances high quality, cost-effectiveness, and responsiveness
- Ideal for most AI applications and enterprise workflows
- Handles tools, memory, and context better than any prior Claude model

**Target use cases:** Long-running agents, coding, cybersecurity, financial services, browser and computer use, office tasks, research

> "We're seeing state-of-the-art coding performance, with significant improvements on longer horizon tasks. It reinforces why many developers using Cursor choose Claude for their most complex problems." — Michael Truell, CEO, Cursor

---

<!-- slide: {"type": "two-col", "theme": "light"} -->
## On the Frontier of Agentic Coding

**Workflows**

- Summarization, classification, extraction
- LLMs orchestrated by code

**Agents**

- LLMs deciding their own trajectories
- Agency ↑
- Capability ↑
- Flexibility ↑

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Introducing Claude Code

An **agentic command-line tool** that lets developers delegate complex tasks while maintaining transparency and control.

- Reads, edits, and writes files across your entire codebase
- Runs tests, builds, and shell commands — interprets results
- Searches the web and fetches documentation
- Manages git workflows end-to-end
- Connects to external tools and services via MCP

> Optimized to work with Anthropic's frontier models, Claude Code can handle a broad range of coding tasks, accelerating dev work.

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Not Just for Writing Code

Claude Code helps at every step of a project:

**1. Discover** — Explore codebase, search docs, onboard & setup

**2. Design** — Plan projects, develop tech specs, define architecture

**3. Build** — Implement code, write & execute tests, create commits & PRs

**4. Deploy** — Automate CI/CD, configure environments, manage deployments

**5. Support & Scale** — Debug errors, large-scale refactors, monitor usage & performance

---

<!-- slide: {"type": "section", "theme": "orange"} -->
# Give Claude Context

---

<!-- slide: {"type": "content", "theme": "light"} -->
## More Context = Better Performance

Ways to give Claude more context:

- **CLAUDE.md** — project-level instructions and conventions
- **@mention filenames** — focus Claude on specific files
- **@mention MCP resources** — connect to external data sources
- **Paste errors and logs** — let Claude see exactly what you see
- **Share screenshots** — visual context for UI issues (`Ctrl+V`)

---

<!-- slide: {"type": "content", "theme": "light"} -->
## CLAUDE.md — Project Memory

A readme that gives Claude instructions on project structure, common commands, and styling conventions — read at the start of every session.

```markdown
# Project Context

## Stack
- SvelteKit + TypeScript frontend
- Supabase (PostgreSQL + RLS) backend

## Commands
- `npm run dev` — start dev server
- `npm test` — run vitest suite

## Conventions
- Use named exports, not default exports
- Prefer `$state` runes over writable stores
```

---

<!-- slide: {"type": "content", "theme": "light"} -->
## CLAUDE.md — Hierarchical

Manage instructions across repositories and users:

- **Monorepo/CLAUDE.md** — System overview, modernization strategy, team structure
- **Repo/CLAUDE.md** — Component architecture, technical debt, migration plans
- **Submodule/frontend/CLAUDE.md** — UI patterns, component library, test strategy
- **Submodule/backend/CLAUDE.md** — API design, data modules, service architecture
- **~/.claude/CLAUDE.md** — Personal preferences, error handling, global instructions

---

<!-- slide: {"type": "section", "theme": "orange"} -->
# Extend Claude Code

---

<!-- slide: {"type": "content", "theme": "dark"} -->
## Model Context Protocol (MCP)

Connect Claude Code to external tools and data sources:

```bash
# Add a server
claude mcp add postgres -- npx @modelcontextprotocol/server-postgres $DATABASE_URL

# Manage servers in session
/mcp

# Use it
claude "show me all users who signed up this week"
```

Server configurations are written to `.mcp.json`.

**Popular servers:** postgres, github, slack, filesystem

---

<!-- slide: {"type": "section", "theme": "orange"} -->
# Hands-on Workshop
### Part 1

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Today's Lab: {{lab_title}}

Open your lab in the browser and follow the steps:

**Session URL:** provided by your presenter

**Questions?** Raise your hand or ask in the chat.

**Goal:** Complete as many steps as you can — bonus points for going beyond the instructions!

---

<!-- slide: {"type": "section", "theme": "orange"} -->
# Advanced Workflows
### Mastering Claude Code

---

<!-- slide: {"type": "content", "theme": "dark"} -->
## Curate Context

```
/context                  — visualize what's in your context window
                            Check at startup for tools/MCPs in particular

/compact {instructions}   — summarize and compact to smaller size

/clear                    — clear the current context window
```

> Keep context focused — a leaner context means faster, more accurate responses.

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Hooks

Extend Claude Code behavior with shell commands triggered at lifecycle events:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{"type": "command", "command": "npm run lint"}]
    }],
    "Stop": [{
      "hooks": [{"type": "command", "command": "say 'Claude is done'"}]
    }]
  }
}
```

**Use cases:** Notifications (Slack, text), auto-formatting, logging, correcting Claude behavior

---

<!-- slide: {"type": "section", "theme": "orange"} -->
# Modify Context

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Custom Slash Commands

Create reusable prompt templates in `.claude/commands/` or `~/.claude/commands/`:

```markdown
<!-- .claude/commands/code-review.md -->
# Code Review

Run a thorough review of staged changes:
1. Check for security vulnerabilities
2. Verify test coverage
3. Confirm conventions match CLAUDE.md
4. Suggest improvements
```

Use `/code-review` in any Claude Code session in this repo.

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Sub-Agents

Claude Code can spin up sub-agents with isolated context:

- **Context** — Sub-agents have their own context, preserving the main agent's window
- **Specialization** — Provide specialized system prompts to each sub-agent
- **Permissions** — Each sub-agent can have different tool access levels

```
/agents   — configure sub-agents (have Claude help create them)
```

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Skills

Claude loads **specialized knowledge only when needed** — keeping context clean while accessing expertise on-demand.

Store skills as markdown files in `.claude/` and reference them in prompts or CLAUDE.md. Claude activates the right skill for the task at hand.

---

<!-- slide: {"type": "section", "theme": "orange"} -->
# More!

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Claude Code in GitHub Actions

Bring Claude Code into your CI/CD pipeline:

```bash
# Get started from within Claude Code
/install-github-app
```

- Tag **@claude** on issues and PRs to trigger edits remotely
- Automatically review pull requests for vulnerabilities before merging
- Add Claude to any step of your CI/CD process
- Customize and deploy workflows using the Agent SDK

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Parallel Claude

Run multiple Claude Code instances simultaneously on independent tasks — each with its own context, working in separate branches or directories.

- Coordinate parallel workstreams from a single orchestrating session
- Use sub-agents to aggregate results back to the parent
- Ideal for large codebases with independent modules

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Plugins

Share and distribute Claude Code extensions in a single format:

- **MCP servers** — data sources and external tool connections
- **Slash commands** — reusable prompt templates
- **Sub-agents** — specialized agents with custom prompts and permissions
- **Hooks** — automated lifecycle behaviors

**Enterprise Marketplaces** — Organizations can create internal marketplaces to distribute approved plugins across teams, standardizing workflows.

---

<!-- slide: {"type": "content", "theme": "dark"} -->
## Optimize Your Setup

```
/theme              — enable light/dark mode
/permissions        — customize tool permissions
/config             — turn on notifications
/add-dir            — give Claude access to more folders
/statusline         — add a custom status line (e.g. current git branch)
/install-github-app — tag @claude on your issues & PRs
```

**Tip:** Enable macOS dictation to talk to Claude hands-free.

---

<!-- slide: {"type": "content", "theme": "dark"} -->
## Keybindings

Key combos for common tasks:

```
Shift+Tab     — auto-accept edits
#             — create a memory
!             — enter bash mode
@             — add a file/folder to context
Esc           — cancel current action
Double-Esc    — jump back in history (--resume to resume)
Ctrl+R        — verbose output
/             — slash commands
```

---

<!-- slide: {"type": "section", "theme": "orange"} -->
# Lab Time
### Part 2

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Lab Tips

- Read each step fully before starting
- Use `CLAUDE.md` to give Claude context about the project
- If something fails, describe the error to Claude — don't fix it manually
- Work through the steps in order; later steps build on earlier ones
- **Bonus steps** are optional but worth extra points

---

<!-- slide: {"type": "section", "theme": "orange"} -->
# Wrap Up

---

<!-- slide: {"type": "content", "theme": "light"} -->
## What We Covered

- Claude Opus 4.5 and Sonnet 4.5 — the frontier models powering Claude Code
- Claude Code: agentic across the full SDLC, not just a copilot
- CLAUDE.md for project memory (hierarchical across repos and users)
- Context management: /context, /compact, /clear
- MCP servers for external integrations
- Hooks, custom slash commands, sub-agents, skills
- GitHub Actions integration and parallel Claude
- Plugins, setup tips, and keybindings

---

<!-- slide: {"type": "content", "theme": "light"} -->
## Resources

- **Docs:** [docs.anthropic.com/claude-code](https://docs.anthropic.com/claude-code)
- **MCP Servers:** [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **API Reference:** [docs.anthropic.com](https://docs.anthropic.com)
- **Community:** [claude.ai/community](https://claude.ai/community)

Feedback form — link in chat.

---

<!-- slide: {"type": "content", "theme": "dark"} -->
## API Access

Get API credits for today's workshop:

**{{api_credit_url}}**

Your Claude Code already uses your personal account. These credits are for building your own apps with the Anthropic API directly.

```bash
npm install @anthropic-ai/sdk
export ANTHROPIC_API_KEY=sk-...
```

---

<!-- slide: {"type": "title", "theme": "dark"} -->
# Thank You!

### Questions?

**{{event_name}}** — {{company_name}}

{{speakers}}
