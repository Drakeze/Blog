# Environment variables

Single source of truth for what this app needs and where each value must live.

**Two places must always agree:** local `.env.local` and Vercel (Production +
Preview). After rotating any key:

1. Update `.env.local`.
2. Update Vercel → blog → Settings → Environment Variables (Production **and**
   Preview).
3. `bun run verify-env` — confirms presence + live validity (Clerk, R2, Mongo).
4. Redeploy production (env changes don't apply to existing deployments).

Local dev loads `.env.local` only. There is **no committed `.env`** — a second
local env file silently merges with `.env.local` and is how prod auth + uploads
drifted out of sync in Sept 2026 (see [DEVLOG](./DEVLOG.md)). If you see a
`.env.stale-backup-*` file, it's the old one, kept for reference; don't restore it.

## Required

| Var | Public? | Purpose | Get a fresh value from |
|---|---|---|---|
| `DATABASE_URL` | no | MongoDB Atlas connection string (`blog_db`). Prod + local use the **`portfolio-projects-at`** cluster. | Atlas → Database → Connect |
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical site origin. Local: `http://localhost:3000`. Prod: `https://www.blog.drakeze.com`. | — |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | yes | Clerk frontend key. Must be from the **same instance** as the secret key (host: `clerk.blog.drakeze.com`). | Clerk dashboard → API keys |
| `CLERK_SECRET_KEY` | no | Clerk backend key. Mismatch → `secret-key-invalid` handshake failure, sign-in dead. | Clerk dashboard → API keys |
| `CLERK_ADMIN_EMAILS` | no | Comma list; grants `/admin`. Instance-independent — the reliable allowlist. | you |
| `CLOUDFLARE_ACCOUNT_ID` | no | R2 account id. | Cloudflare → R2 |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | no | R2 API token pair (Object Read & Write, bucket `blog-images`). Must be a **matched pair** — mismatch → `403 SignatureDoesNotMatch` on upload. | Cloudflare → R2 → Manage API Tokens |
| `R2_BUCKET_NAME` | no | `blog-images`. | — |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | yes | Public base for uploaded images: `https://images.drakeze.com`. Must be in the `next.config.ts` image host allowlist. | — |
| `RESEND_API_KEY` | no | Resend API key for subscriber + comment email. | Resend dashboard → API Keys |
| `RESEND_FROM_EMAIL` | no | Verified sender, e.g. `Blog <...>`. | Resend → Domains |
| `DRAFT_API_SECRET` | no | Bearer token for `POST /api/posts/draft`. `openssl rand -hex 32`. | self-generated |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | yes | PostHog ingestion token. | PostHog → Project settings |
| `NEXT_PUBLIC_POSTHOG_HOST` | yes | `https://us.i.posthog.com`. | — |

## Optional (have code defaults; don't fail verify-env)

`RESEND_REPLY_TO_EMAIL`, `AUTO_SEND_POST_EMAILS` (default `false`),
`CLERK_ADMIN_USER_IDS` (instance-specific; `CLERK_ADMIN_EMAILS` is enough),
`NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (default
`/sign-in`, `/sign-up`).

## Gotchas

- **Paste carefully.** A trailing newline/space in a Vercel value breaks it;
  `verify-env` flags whitespace on local values.
- **Clerk pk and sk must be from one instance.** `verify-env` prints the
  publishable key's decoded host so a cross-instance mix is visible.
- **`pk_test_` / `sk_test_`** keys in `.env.local` (commented out) are a separate
  Clerk dev instance. Leaving them uncommented overrides the live keys.
