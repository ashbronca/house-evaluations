# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

Personal repo for evaluating Australian residential properties before making an offer. The core workflow: add an address → get a detailed analysis saved to `evaluations/`.

## Git

Always commit as:
```
git config user.name "Claude"
git config user.email "noreply@anthropic.com"
```

Push to `main` via the GitHub MCP tool (`mcp__github__push_files`) — direct `git push` to main returns 503 in this environment.

## How to run a property evaluation

Paste any Australian street address into the chat. The `property-valuation-au` skill auto-invokes and saves a full Markdown report to `evaluations/[slug]-analysis.md`.

To invoke explicitly: `/property-valuation-au [address]`  
For a faster summary: `/property-valuation-au quick [address]`

## Architecture

```
properties/          ← add a .txt file here (content = address) to trigger auto-eval
evaluations/         ← generated analysis reports live here
.claude/skills/
  property-valuation-au/SKILL.md   ← the valuation skill definition
.github/workflows/
  evaluate-property.yml            ← GitHub Action: new file in properties/ → runs skill → commits eval
```

### Automated pipeline

When a new `.txt` file is pushed to `properties/` on `main`, the GitHub Action (`evaluate-property.yml`) fires: it installs Claude Code CLI, reads the address from the file, runs the `property-valuation-au` skill with `--dangerously-skip-permissions`, and commits the resulting report to `evaluations/`. Requires `ANTHROPIC_API_KEY` set as a GitHub Actions secret.

### Skill

The skill in `.claude/skills/property-valuation-au/SKILL.md` drives all analysis. It instructs Claude to use `WebSearch` and `WebFetch` to pull live data from Domain, realestate.com.au, myschool.edu.au, flood maps, and crime stats — then synthesise comps, suburb trends, risk factors, and a value estimate into a structured Markdown report. Output always goes to `evaluations/`.
