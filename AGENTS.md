# AGENTS.md

Guidance for coding agents working in this repository.

## What this is

**Thinking Out Loud** — `blog.drakeze.com`. A single-author blog with a
Clerk-gated admin dashboard, a proper double-opt-in newsletter, Atlas Search, and
a remote MCP connector for drafting posts from Claude. Posts are Markdown stored
in MongoDB. **No Prisma, no ORM** — native `mongodb` driver only.

This is a fresh rebuild of the old `Blog` repo (kept at `../Blog-Legacy` until
cutover). Plan: `~/.claude/plans/so-what-i-want-imperative-hellman.md`.

## Runtime & commands

**Bun** for everything. Never `npm`/`yarn`/`pnpm`.

```bash
bun install
bun dev                 # http://localhost:3000
bun run build
bun run lint             # ESLint flat config
bun run type-check       # tsc --noEmit
bun run test             # lint + type-check + bun test
bun run verify-env       # presence + live validity of every env var
bun run verify-r2        # exercise the R2 client config
```

CI (`.github/workflows/ci.yml`) runs lint + type-check + test + build on every push.

## Architecture

- **`app/`** — App Router. `app/(public)/` reader-facing, `app/admin/` dashboard,
  `app/api/` route handlers. Post URLs are `/[slug]` (not `/blog/[slug]`).
- **`lib/`** — the only place that talks to infrastructure.
  - `lib/mongo.ts` — `getDb()`, the sole Mongo accessor. DB name comes from the
    `DATABASE_URL` path (`blog_db_dev` local/preview, `blog_db` prod).
  - `lib/auth.ts` — `isAdmin()` (Clerk userId / email allowlist) + `requireAdminApi()`.
  - `lib/env.ts` — all `process.env` access. Non-throwing (zod `safeParse` +
    defaults + `.configured` booleans). Never make it throw.
  - `lib/errors.ts` — `AppError` / `Errors` / `toErrorResponse` for uniform API errors.
  - `lib/markdown.ts` — `renderMarkdown()` = marked + sanitize-html. **All**
    rendered post HTML goes through this before `dangerouslySetInnerHTML`.
  - `lib/posthog-server.ts` — `captureServerEvent()` (flushes via `after()`).
  - `lib/api.ts` — `apiOk()` / `apiError()`; `apiError` funnels everything through
    `toErrorResponse` and logs 5xx.
  - `lib/domains/<entity>/{types,validators,service}.ts` — the write path shared by
    the admin UI and the MCP connector (Phase 4). `types` = TS interfaces,
    `validators` = zod (also the operator-injection guard), `service` = free
    functions on `getDb()`. Entities: `posts`, `subscribers`, `comments`, `likes`,
    `bookmarks`.
  - `lib/email/` — `sendEmail()` is the one outbound chokepoint; honors
    `EMAIL_DELIVERY_MODE` (`live`/`log`/`off`) and writes an `EmailLog` row.
    `newsletter.ts` (confirmed-only batch send + `sendNewsletterTest`),
    `notifications.ts` (subscription confirmation, reply notifications).
- **`emails/`** — React Email templates (`newsletter`, `comment-notification`,
  `confirm-subscription`).
- **`models/`** — plain TS interfaces for Mongo documents. No logic.
- **`scripts/`** — one-off Bun scripts.

## Conventions

- **API route** = `try { auth guard → zod.parse → service call → apiOk(...) }
  catch (e) { return apiError(e) }`. Services throw `Errors.*`; `apiError` maps them.
- **Admin gate**: route handlers call `requireAdminApi()` (early return); per-user
  routes call `requireUserId()` (throws 401 inside the `try`). Server components
  call `isAdmin()` then `redirect()`. `proxy.ts` only enforces *authentication* on `/admin`.
- Untrusted string input that reaches a Mongo filter must pass a `z.string()` in the
  entity's `validators.ts` (operator-injection guard).
- `@/*` → repo root. Keep files under 500 lines. Bun, not npm.
- Design tokens live in `app/globals.css` (warm paper / oxblood-claret,
  Newsreader / Hanken Grotesk / JetBrains Mono). Approved artifact:
  `claude.ai/code/artifact/10464f9a-99c0-4bfe-acdf-d5f0c653db06`.

## Stack

Next.js 16 · React 19 · TypeScript 5 (strict) · Tailwind v4 (`@tailwindcss/postcss`)
· MongoDB (native driver) · Clerk · Resend · PostHog · Cloudflare R2 · Vercel.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
