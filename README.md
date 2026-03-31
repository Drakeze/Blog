# Blog Platform (v1)

Production-ready Next.js blog with:

- MongoDB-backed post CRUD
- Clerk authentication with server-side admin allowlist checks
- Admin dashboard for create/edit/delete/publish/feature
- Reddit as the only external content source

## Runtime

This repo uses **Bun**.

## Commands

```bash
bun install
bun dev
bun run lint
bun run type-check
bun run build
bun run seed
```

## Environment

Copy `.env.example` to `.env.local` and set values.

Required for production:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Recommended for admin security:

- `CLERK_ADMIN_EMAILS` and/or `CLERK_ADMIN_USER_IDS`

Required for Reddit sync:

- `REDDIT_CLIENT_ID`
- `REDDIT_CLIENT_SECRET`
- `REDDIT_USER_AGENT`
- `REDDIT_USERNAME` (optional default username for sync UI)

## Seed content

`bun run seed` inserts/updates two starter published posts:

1. Patreon update post
2. Soren Tech public Discord announcement

## Deployment notes

- Configure the same environment variables in Vercel.
- Ensure Clerk sign-in URLs include your deployed domain.
- MongoDB should be reachable from the deployed environment.
