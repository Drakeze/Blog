# AGENTS.md

Guidance for coding agents working in this repository.

## Runtime & package manager

**Bun** for everything — runtime, package manager, script runner. Never `npm`/`yarn`/`pnpm`.

## Commands

```bash
bun install
bun dev                 # Next.js dev server (http://localhost:3000)
bun run build           # production build
bun run lint            # ESLint (flat config, eslint.config.mjs)
bun run type-check      # tsc --noEmit
bun run test            # lint + type-check (no test framework)
bun run seed            # seed starter posts (needs DATABASE_URL)
bun run ensure-indexes  # create the MongoDB indexes the app assumes
```

CI (`.github/workflows/ci.yml`) runs lint + type-check + test + build on every push.

## Architecture

A single-author blog with a Clerk-gated admin dashboard. Posts are written in
Markdown in the admin editor and stored in MongoDB. There is **no** content
aggregation, **no** Prisma, **no** ORM.

- **`app/`** — App Router. `app/(public)/` is the reader-facing site,
  `app/admin/` is the dashboard, `app/api/` holds route handlers.
- **`lib/`** — the only place that talks to infrastructure.
  - `lib/mongo.ts` — `getDb()`, the sole MongoDB accessor (native `mongodb` driver).
  - `lib/auth.ts` — `isAdmin()` (Clerk userId / email allowlist) and
    `requireAdminApi()` (returns a 401 `NextResponse` for route handlers).
  - `lib/env.ts` — env access, split into `env` (server) and `publicEnv`.
  - `lib/email.ts` — Resend; newsletter send lives here.
  - `lib/markdown.ts` — `renderMarkdown()` = marked + DOMPurify. **All** rendered
    post HTML must go through this before `dangerouslySetInnerHTML`.
  - `lib/posthog-server.ts` — `captureServerEvent()` (flushes via `after()`).
- **`models/`** — plain TypeScript interfaces for the MongoDB documents
  (`post.ts`, `subscriber.ts`, `comment.ts`, `bookmark.ts`, `like.ts`). No logic.
- **`emails/`** — React Email templates.
- **`components/ui/`** — shadcn/Radix primitives. `components/admin/` — dashboard-only.
- **`scripts/`** — one-off Bun scripts (`seed.ts`, `ensure-indexes.ts`,
  `migrate-images-to-r2.ts`).

## Draft post API

`POST /api/posts/draft` creates a draft post programmatically (e.g. from a
Claude session that doesn't have DB/Clerk access). Auth is a bearer token
compared against `DRAFT_API_SECRET` (`lib/env.ts`), not Clerk — set the env
var locally and in Vercel before using this.

```bash
curl -X POST "$SITE_URL/api/posts/draft" \
  -H "Authorization: Bearer $DRAFT_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"title":"My post","slug":"my-post","content":"# My post\n\nBody in markdown.","series":"optional"}'
```

`title`, `slug`, `content` are required strings; `series` is optional. Returns
`201 { id }` on success, `409` if the slug already exists, `401` if the
token is missing/wrong. The post is inserted with `status: "draft"` — review
and publish it from `/admin/posts` as normal. This is create-only: there's no
list/update via this token, so check `/admin/posts` (or ask the site owner)
before pushing a slug to avoid a blind 409.

## Conventions

- **Admin gate**: route handlers call `requireAdminApi()`; server components call
  `isAdmin()` then `redirect()`. `proxy.ts` only enforces authentication on
  `/admin` — real admin checks are per-route.
- **DB access** goes through `getDb()`. Route handlers may query inline; there is
  no shared query layer.
- Validate untrusted input at the boundary — request-body values that reach a
  Mongo filter must be `typeof`-checked (operator-injection guard).
- `@/*` path alias → repo root.
- Keep files under 500 lines.

## Stack

Next.js 16 · React 19 · TypeScript 5 (strict) · Tailwind v4 (`@tailwindcss/postcss`)
· MongoDB (native driver) · Clerk · Resend · PostHog · Cloudflare R2 (uploads via
`@aws-sdk/client-s3`) · deployed on Vercel.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
