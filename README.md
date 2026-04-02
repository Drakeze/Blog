# Blog Platform (v1)

Production-ready Next.js blog with:

- MongoDB-backed post CRUD
- Clerk authentication with server-side admin allowlist checks
- Admin dashboard for create/edit/delete/publish/feature
- Reddit as the only external content source
- MongoDB-backed newsletter subscribers with Resend email delivery

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

## Architecture

- Public site: content-first blog pages plus an email-only subscribe flow
- Admin site: `/admin` routes protected by Clerk and a required allowlist (`CLERK_ADMIN_EMAILS` and/or `CLERK_ADMIN_USER_IDS`)
- MongoDB: stores posts and newsletter subscribers
- Resend: sends confirmation emails and can send published-post emails to subscribers
- Reddit: optional sync source for importing posts into MongoDB

## Environment

Copy `.env.example` to `.env.local` and set values.

Required for production:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_ADMIN_EMAILS` and/or `CLERK_ADMIN_USER_IDS`

Required for Resend email delivery:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

Optional Resend settings:

- `RESEND_REPLY_TO_EMAIL`
- `AUTO_SEND_POST_EMAILS=true` if you want published blog posts to notify subscribers automatically

Required for Reddit sync:

- `REDDIT_CLIENT_ID`
- `REDDIT_CLIENT_SECRET`
- `REDDIT_USER_AGENT`
- `REDDIT_USERNAME` (optional default username for sync UI)

## Auth vs subscriptions

- **Clerk** handles authentication only for the admin side.
- **Subscribers collection** stores newsletter recipients in MongoDB (`email`, `createdAt`, `updatedAt`, optional `clerkUserId`).
- **Resend** delivers confirmation emails and can deliver post announcements.

## Subscribe flow

1. The public `/subscribe` page only asks for an email.
2. The `/api/subscribe` route validates and normalizes the email address.
3. The subscriber is stored in MongoDB without creating duplicates.
4. If Resend is configured, a confirmation email is sent.
5. If Resend is missing, the subscription still succeeds and returns a clear safe-failure message.

## Seed content

`bun run seed` inserts/updates two starter published posts:

1. Patreon update post
2. Soren Tech public Discord announcement

## Deployment notes

- Configure the same environment variables in Vercel.
- Ensure Clerk sign-in URLs include your deployed domain.
- Published blog posts fall back to starter content on the public site if MongoDB is temporarily unavailable.
- `bun run build` uses Webpack for a more stable Next.js 16 production build in this repo.
- MongoDB should be reachable from the deployed environment.

## Notes and debugging

- Admin access requires both Clerk keys and an explicit allowlist.
- `/api/health` reports whether database, Clerk, Resend, and Reddit are configured.
- The Reddit sync endpoint now returns troubleshooting steps instead of failing silently.
- If Reddit OAuth returns `401 Unauthorized`, the current client ID or secret is invalid or no longer accepted by Reddit.
