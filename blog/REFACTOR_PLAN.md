# Refactor Plan

1. [HIGH][High] Replace client-side fetching on the home page with server components and `fetch` caching to remove waterfalls and avoid unnecessary re-renders. Suggested commit: `refactor: move homepage data fetching server-side`.
2. [HIGH][Medium] Add typed API handlers with input validation (e.g., zod) and real error responses for `/api/*` routes to harden against malformed requests. Suggested commit: `feat: validate api payloads and errors`.
3. [MEDIUM][Medium] Introduce reusable UI primitives (Button, Card, Section) under `src/components/ui/` to reduce repetitive Tailwind markup and improve consistency. Suggested commit: `refactor: add ui primitives`.
4. [MEDIUM][Low] Add error and loading boundaries for major routes (home, blog index, blog detail) to improve UX and resilience. Suggested commit: `feat: add route boundaries`.
5. [LOW][Low] Wire up analytics/SEO helpers (OpenGraph, Twitter cards) via centralized config in `src/config/seo.ts`. Suggested commit: `chore: centralize seo config`.
