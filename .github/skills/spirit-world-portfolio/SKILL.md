---
name: spirit-world-portfolio
description: 'Repository-specific agent instructions for the spirit_world_portfolio monorepo. Use when editing the root documentation, frontend Next.js app, backend NestJS app, Cloudflare deployment, spirit catalog, portfolio content, or any repo-wide architecture decision.'
argument-hint: 'Describe the area to work on, such as frontend deployment, backend module, README updates, or spirit systems.'
---

# spirit_world_portfolio Repository Guide

## Scope

This skill applies to the full monorepo at `d:\magic-portfolio`.

### Workspace layout

- `lonshan_portfolio_magic_spirits/` - Next.js frontend
- `lonshan_portfolio_backend/` - NestJS backend
- `old-portfolio/` - legacy reference app
- `.github/workflows/` - CI and deployment automation
- `.github/skills/` - repo-specific instructions for future agents

## Non-Negotiable Architecture Rules

- Keep business logic, AI reasoning, memory, and realtime orchestration in NestJS.
- Keep rendering, motion, world presentation, and client UI in Next.js.
- Do not move backend logic into the Next.js app router.
- Use WebSockets or REST for frontend-backend communication; do not invent direct coupling.
- Preserve the current monorepo separation when adding features or documentation.

## Frontend Build And Deploy Context

Frontend root: `lonshan_portfolio_magic_spirits/`

Common commands:

- `npm run dev` - Next.js development server
- `npm run build` - production build
- `npm run deploy` - OpenNext build and Cloudflare Workers deployment
- `npm run preview` - local Cloudflare Workers preview

Cloudflare deployment files:

- `open-next.config.ts` - OpenNext Cloudflare config
- `wrangler.jsonc` - Worker configuration
- `public/_headers` - static asset caching headers
- `.github/workflows/deploy-frontend-cloudflare.yml` - GitHub Actions deploy job

## Backend Build Context

Backend root: `lonshan_portfolio_backend/`

Common commands:

- `npm run start:dev`
- `npm run build`
- `npm run test`

Backend modules currently include:

- `ai/`
- `dialogue/`
- `spirits/`
- `emotion/`
- `events/`
- `memory/`
- `world/`
- `database/`

## Documentation Expectations

When updating documentation:

- Root README should describe the whole monorepo and the live portfolio experience.
- Frontend README should focus on the Next.js app, its UI systems, and deployment.
- Mention the spirit catalog, realtime interaction model, and environment variables when relevant.
- Use the repository slug `spirit_world_portfolio` when referring to the GitHub project landing page.

## Useful Reference Files

- `lonshan_portfolio_magic_spirits/data/spiritPersonalities.ts` - named spirit personalities
- `lonshan_portfolio_magic_spirits/data/portfolio_data.ts` - portfolio content source of truth
- `lonshan_portfolio_magic_spirits/systems/` - frontend systems logic
- `lonshan_portfolio_backend/src/modules/` - backend domain modules
- `.github/skills/fullstack-architect/SKILL.md` - architecture rules for code changes

## Editing Guidance

- Keep edits scoped to the affected subdirectory.
- Prefer updating the source-of-truth data files rather than hardcoding copy in components.
- For deployment changes, validate the frontend build and the OpenNext build.
- For docs changes, make sure the root README and repo-specific instructions stay consistent.
