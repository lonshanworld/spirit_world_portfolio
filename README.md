# spirit_world_portfolio

Repository: `spirit_world_portfolio`

This repository contains the full living portfolio experience for Lon Shan. It is a monorepo with a realtime NestJS backend and an interactive Next.js frontend that present the portfolio as a magical spirit world instead of a static resume site.

## Project Structure

- `lonshan_portfolio_magic_spirits/` - Next.js frontend, visual world, spirit interactions, portfolio UI, Cloudflare Workers deployment
- `lonshan_portfolio_backend/` - NestJS backend, spirit AI, dialogue engine, realtime events, memory, world state
- `old-portfolio/` - legacy Vite portfolio kept for reference

## What The Portfolio Does

The current portfolio turns a personal CV into an interactive spirit ecosystem. Visitors can explore sections as a living world, interact with elemental spirits, watch theme changes ripple through the page, and read AI-driven dialogue that reacts to the current context.

Core ideas:

- The frontend is cinematic and highly interactive.
- The backend owns business logic, AI reasoning, memory, and realtime event delivery.
- WebSocket updates keep the experience alive instead of feeling static.
- Visual themes, particle effects, and magic seals change with the active spirit.

## Frontend Features

The frontend lives in `lonshan_portfolio_magic_spirits/` and includes:

- Hero, projects, skills, experience, contact, and AI chat sections
- Spirit selection and animated spirit orbs
- Dialogue bubbles and dialogue stack presentation
- Magic effects, aura effects, and spell timing logic
- Theme transitions driven by the active elemental spirit
- World map / particle field visual systems
- A responsive mobile-friendly layout with motion-based UI
- Cloudflare Workers deployment with OpenNext

Important frontend systems:

- `app/` - app router pages and layout
- `components/portfolio/` - section components for the CV/portfolio content
- `components/spirits/` - spirit renderers and interactions
- `components/dialogue/` - dialogue UI
- `components/effects/` and `components/magic/` - spell and seal effects
- `components/theme/` - theme transitions and provider
- `components/world/` - world background and particle visuals
- `systems/` - stateful frontend logic for themes, magic, dialogue, sound, and message batching
- `store/` - Zustand stores for dialogue, theme, and world state
- `hooks/` - socket, sound, scroll, theme, and dialogue hooks

## Backend Features

The backend lives in `lonshan_portfolio_backend/` and is a NestJS service that powers the living world.

Backend modules include:

- `ai/` - Gemini-based AI generation and prompt orchestration
- `dialogue/` - dialogue scripting and response coordination
- `spirits/` - spirit lifecycle, behavior, and world-facing state
- `emotion/` - emotional state and transitions
- `events/` - event definitions and routing
- `memory/` - conversation and context memory
- `world/` - world state and section context
- `database/` - persistence layer

The backend also exposes realtime transport through Socket.IO so the frontend can react to spirit state, dialogue, and world events.

## Spirit Catalog

There are 42 named spirits in the current world, 3 for each of the 14 elemental types.

Element families:

- Fire - Emberlyn, Scorchfang, Cindra. Warm, fierce, and chaotic fire personalities.
- Water - Ripplefin, Splashara, Murmosa. Calm, energetic, and reflective water personalities.
- Ice - Frostwyn, Glacius, Shiverkin. Elegant, stoic, and shy ice personalities.
- Wind - Zephyrelle, Gustavo, Breezewick. Adventurous, dramatic, and peaceful wind personalities.
- Soil - Mossroot, Grumbleclod, Pebblehop. Ancient, grumpy, and curious earth personalities.
- Trees - Willowshade, Thornwick, Blossomara. Meditative, protective, and joyful nature spirits.
- Lightning - Voltara, Strikx, Zappli. Fast, precise, and mischievous lightning spirits.
- Dark - Shadowmere, Duskella, Vexhorn. Cryptic, melancholic, and guarded dark spirits.
- Light - Lumisol, Auroryn, Glimmerwick. Hopeful, theatrical, and quietly powerful light spirits.
- Healing - Tendrel, Mendara, Solacen. Compassionate, practical, and serene healing spirits.
- Void - Nullith, Erasyn, Voidra. Silent, ironic, and existential void spirits.
- Space - Cosmoryn, Nebulex, Stardrift. Dreamy, ancient, and poetic space spirits.
- Time - Chrona, Fleetwick, Anciena. Careful, frantic, and ancient time spirits.
- Robot - Circuitex, Gearbit, Nullbyte. Logical, curious, and deadpan robot spirits.

## Current Interactive Systems

- Theme engine that changes gradients, text colors, cards, glows, and particle colors
- Spirit magic seal rendering with per-element shape differences
- Realtime dialogue and emotion updates from the backend
- Sound engine for spirit clicks, theme changes, and combination moments
- Scroll-based section tracking for narrative progression
- Mobile-friendly responsive layout for the portfolio sections

## Local Development

Frontend:

```bash
cd lonshan_portfolio_magic_spirits
npm install
npm run dev
```

Backend:

```bash
cd lonshan_portfolio_backend
npm install
npm run start:dev
```

## Build And Deploy

Frontend build:

```bash
cd lonshan_portfolio_magic_spirits
npm run build
```

Cloudflare deployment for the frontend:

```bash
cd lonshan_portfolio_magic_spirits
npm run deploy
```

The GitHub Actions workflow in `.github/workflows/deploy-frontend-cloudflare.yml` only triggers when files under `lonshan_portfolio_magic_spirits/` change, so backend changes do not redeploy the frontend.

## Environment Variables

Frontend variables:

- `NEXT_PUBLIC_BACKEND_URL` - backend WebSocket / API base URL
- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` - contact form access key
- `NEXT_PUBLIC_CV_DOWNLOAD_URL` - CV download link

Backend variables typically include the Gemini key and any database or platform settings required by NestJS.

## Notes For Contributors

- Keep backend logic in NestJS.
- Keep rendering and cinematic UI in Next.js.
- Use the frontend systems and stores for client-side orchestration.
- Update the spirit catalog in the dedicated data files when changing character behavior.
- Update this README when adding a new major world system or deployment path.
