# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Runtime & Package Manager

This project uses **Bun** as both the runtime and package manager. All commands should use `bun` instead of `npm`, `yarn`, or `pnpm`.

## Development Commands

### Setup & Dependencies
```bash
bun install                    # Install dependencies
```

### Development Server
```bash
bun dev                        # Start Next.js development server (default: http://localhost:3000)
```

### Building
```bash
bun run build                  # Production build (Next.js)
bun start                      # Start production server after build
```

### Code Quality
```bash
bun run lint                   # Run ESLint
```

**Note**: The CI workflow references `bun run type-check` and `bun run test` scripts, but these are not defined in package.json. If these commands are needed, they must be added to package.json first.

### Database (Prisma)
```bash
bunx prisma generate           # Generate Prisma client after schema changes
bunx prisma db push            # Push schema changes to MongoDB (development)
bunx prisma studio             # Open Prisma Studio to browse data
```

## High-Level Architecture

### Data Flow & External Integrations

This is a **content aggregation platform** that pulls posts from multiple external sources (Patreon, LinkedIn, Reddit, Twitter) and stores them in a MongoDB database alongside manually created blog posts.

**Key architectural pattern**: Each external platform has:
1. An integration module in `src/lib/social/[platform].ts` that handles API communication and data transformation
2. A corresponding API route in `src/app/api/integrations/[platform]/route.ts` that triggers sync operations
3. Platform-specific API credentials managed through `src/lib/env.ts` with a graceful degradation pattern (missing credentials disable the platform but don't break the app)

### Source Directory Structure

- **`src/app/`** — Next.js App Router pages and API routes
  - `src/app/api/` — API endpoints for posts, integrations, admin auth, subscriptions, health checks
  - `src/app/admin/` — Admin UI pages for creating/editing posts
  - `src/app/blog/` — Public blog pages
  
- **`src/lib/`** — Shared utilities and configuration
  - `src/lib/social/` — External platform integrations (linkedin.ts, patreon.ts, reddit.ts, twitter.ts)
  - `src/lib/env.ts` — Environment variable validation and social platform config management (uses Zod)
  - `src/lib/auth.ts` — Simple cookie-based admin authentication
  - `src/lib/mongo.ts` — MongoDB connection management
  - `src/lib/prisma.ts` — Prisma client singleton
  
- **`src/data/`** — Data access layer
  - `src/data/posts.ts` — CRUD operations for blog posts with filtering
  - `src/data/subscribers.ts` — Email subscription management
  
- **`src/models/`** — Data models and MongoDB collection management
  - `src/models/BlogPost.ts` — BlogPost document interface and collection setup
  
- **`src/components/`** — React components
  - `src/components/ui/` — Shadcn/Radix UI components
  - `src/components/admin/` — Admin-specific components

### Database Schema (Prisma + MongoDB)

The schema defines two main models:
- **Post** — Unified post model supporting multiple sources (blog, reddit, linkedin, patreon, twitter)
  - Has slug-based routing and status (draft/published)
  - Tracks external IDs and URLs for synced content
  - Uses composite unique index on (source, externalId) to prevent duplicate imports
  
- **Subscriber** — Email subscription tracking

### Environment Variables & Configuration

Environment variables are validated using Zod schemas in `src/lib/env.ts`. The app distinguishes between:
- **Server-only**: `DATABASE_URL`, `ADMIN_PASSWORD`, API tokens for external platforms
- **Public** (NEXT_PUBLIC_*): Site URL and public profile links

**Important**: External platform integrations use a `socialConfig` pattern that checks for missing keys and disables features gracefully rather than crashing the app.

### Authentication

Simple cookie-based admin authentication:
- Admin password verified via `/api/admin/auth`
- 6-hour session with httpOnly cookies
- Cookie scoped to `/admin` path
- No user accounts or complex auth flows

### API Testing

A Postman collection is available at `postman/collections/` for testing API endpoints locally.

## Path Aliases

TypeScript path alias `@/*` maps to `src/*` (configured in tsconfig.json).

## Deployment

The application is deployed on Vercel (referenced in README).

## Important Notes

- **No test framework is currently configured** despite CI workflow references
- **Type checking script is missing** from package.json but referenced in CI
- ESLint uses flat config format (eslint.config.mjs)
- The project uses Next.js 16.x with React 19.x
- MongoDB is accessed both directly (via mongodb driver in src/models/) and through Prisma
