# Environment variables

`bun run verify-env` checks presence + live validity. `.env` locally; the same
keys go in Vercel (Preview and Production separately).

| Var | What | Local (`.env`) | Vercel Preview | Vercel Production |
|---|---|---|---|---|
| `DATABASE_URL` | Mongo Atlas URI. **DB name in the path picks the target.** | `.../blog_db_dev` | `.../blog_db_dev` | `.../blog_db` |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin | `http://localhost:3000` | preview URL | `https://blog.drakeze.com` |
| `RESEND_API_KEY` | Resend API key | ✓ | ✓ | ✓ |
| `RESEND_FROM_EMAIL` | Verified sender, e.g. `Thinking Out Loud <hello@blog.drakeze.com>` | ✓ | ✓ | ✓ |
| `RESEND_REPLY_TO_EMAIL` | optional reply-to | - | - | opt |
| `EMAIL_DELIVERY_MODE` | `live` \| `log` \| `off`. Guards every send. | `log` | `log` | `live` |
| `AUTO_SEND_POST_EMAILS` | auto-email subscribers on publish | `false` | `false` | `false` until wanted |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk pk. **Must match sk mode.** | `pk_test_` | `pk_test_` | `pk_live_` |
| `CLERK_SECRET_KEY` | Clerk sk | `sk_test_` | `sk_test_` | `sk_live_` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `_SIGN_UP_URL` | routes | `/sign-in` / `/sign-up` | same | same |
| `CLERK_ADMIN_EMAILS` | comma list; match → admin | ✓ | ✓ | ✓ |
| `CLERK_ADMIN_USER_IDS` | comma list of Clerk user ids | opt | opt | opt |
| `CLOUDFLARE_ACCOUNT_ID` | shown on the R2 API-token page | ✓ | ✓ | ✓ |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | R2 API token (Object Read & Write, scoped to `blog`) | ✓ | ✓ | ✓ |
| `R2_BUCKET_NAME` | `blog` (exists, WNAM) | `blog` | `blog` | `blog` |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | the `blog` bucket's r2.dev Public Development URL (`https://pub-…r2.dev`); a custom domain is a later upgrade | ✓ | ✓ | ✓ |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` / `_HOST` | analytics | opt | opt | ✓ |
| `MCP_SERVICE_SECRET` | shared secret: MCP Worker → `/api/mcp/*`. `openssl rand -hex 32` | opt | ✓ | ✓ |
| `DRAFT_API_SECRET` | legacy bearer for `POST /api/posts/draft` | opt | opt | opt |
| `ATLAS_PUBLIC_KEY` / `ATLAS_PRIVATE_KEY` / `ATLAS_GROUP_ID` / `ATLAS_CLUSTER_NAME` | Atlas Admin API - only `scripts/ensure-atlas-search.ts` (Phase 2) | opt | - | - |

## Rules learned the hard way

- **One `.env` file.** A stray second env file silently merged and took prod auth
  + uploads down (Sept 2026). If `verify-env` shows something you didn't set, look
  for another `.env*`.
- **No shared prod DB.** Local + Preview point at `blog_db_dev`. `verify-env`
  warns loudly if the target is `blog_db`.
- **Clerk pk/sk must be the same mode.** A `pk_live` + `sk_test` mix is a silent
  handshake 500. `lib/env.ts` detects the mismatch; `/api/health` surfaces it.
