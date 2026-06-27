# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

Personal repo for evaluating Australian residential properties before making an offer.

## Running an evaluation

Just paste an address or a realestate.com.au / domain.com.au listing URL. The `property-valuation-au` skill auto-invokes, researches the property, and saves a full Markdown report to `evaluations/[slug]-analysis.md`.

Add `quick` for a shorter summary: `/property-valuation-au quick [address or URL]`

## Git

Always commit as:
```
git config user.name "Claude"
git config user.email "noreply@anthropic.com"
```

Push to `main` via `mcp__github__push_files` — direct `git push` returns 503 in this environment.

## Repo structure

```
evaluations/                              ← generated reports
.claude/skills/property-valuation-au/    ← skill definition (SKILL.md)
.github/workflows/evaluate-property.yml  ← optional: drop address in properties/*.txt to auto-eval via CI
```
