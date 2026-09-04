# Blog — Dev Log

Running log of changes made to the blog project. Most recent first.

---

## 2026-09-04

### Production Hardening Pass
**Commits:** `4ea4cc2`, `2bc511a`, `2efa2ea`, `6265001`, `daa919f`, `8d6dadd` (branch `hardening-pass`, merged to `main` via PR #32 + a follow-up merge)

Full pass to fix prod 500s, unblock the draft-push API, and clean up backend/admin rough edges, followed by two reader-facing UI additions.

**Prod 500 fixes:**
- `4ea4cc2` — dropped jsdom from the post-page render path (was crashing post pages in prod)
- `2bc511a` — `lib/mongo.ts` now connects lazily and clears its cached connection promise on a failed connect, instead of leaving an unhandled rejection that poisoned the whole serverless instance
- `2efa2ea` — `feed.xml` and `sitemap.ts` no longer hit the DB during the build (were failing static builds)

**Draft-push API unblocked** (`6265001`):
- `POST /api/posts/draft` already existed (bearer-token auth, timing-safe compare, 409 on slug collision) but `DRAFT_API_SECRET` was never set and the endpoint was undocumented — that was the actual gap, not a missing feature
- Documented the endpoint in `AGENTS.md` (URL, header, body shape, curl example)
- Set `DRAFT_API_SECRET` in `.env.local` and pushed it to Vercel production via `vercel env add`
- Verified end-to-end: create → `201`, duplicate slug → `409`, bad token → `401`

**Newsletter + seed QoL** (`6265001`):
- `components/admin/newsletter-send-form.tsx` — exposed the existing `force` resend flag (the API already supported it; the UI never sent it); shows sent-status and a "Resend anyway" action on a `409`
- `app/admin/newsletter/page.tsx` — passes `newsletterSentAt` through so the post picker shows which posts were already sent
- `scripts/seed.ts` — now also seeds 2 test subscribers (idempotent, same `deleteMany`-then-`insertMany` pattern already used for posts)

**Admin usability/a11y fixes** (`6265001`):
- `components/admin/admin-nav-link.tsx` (new) — client component using `usePathname()` for active-route highlighting (the nav's `exact` prop existed but was never read) plus `aria-label` on the icon-only collapsed nav links
- `app/(public)/blog/[slug]/page.tsx` — header row wraps instead of clipping on narrow screens; cover image got a proper `sizes` prop instead of always fetching the largest breakpoint

**Design-system cleanup** (`6265001`):
- `components/ui/card.tsx` (new) — shared Card primitive, replacing 4+ duplicated `rounded-.. border border-border bg-card` class strings (admin stat tiles, likes analytics, newsletter/Patreon boxes)
- Hand-rolled status-pill `<span>`s in `app/admin/page.tsx` and `app/admin/subscribers/page.tsx` replaced with the existing `Badge` component, matching the pattern already used in `app/admin/posts/page.tsx`
- `components/comments-section.tsx` — the error state gets a "Try again" retry button, matching the pattern used elsewhere

**Reader-facing additions** (`daa919f`):
- `components/reading-progress.tsx` (new) — fixed scroll-progress bar under the navbar on post pages
- `app/(public)/blog/[slug]/page.tsx` — "Read next" section: a Mongo aggregation matches posts by shared tags, sorted by overlap count then recency, top 3, rendered with the existing `PostCard`. Omitted entirely when there's no tag overlap with the current post

**Incident — seed script wrote to production** (`8d6dadd`):
- While testing the newsletter QoL work, `bun run seed` was run against `.env.local`'s `DATABASE_URL` — which turned out to be the live production database, since this project has no separate dev/staging DB. This inserted 4 fake placeholder posts (published, backdated) and 2 fake subscribers directly into prod. No real newsletter email was ever sent. Caught and cleaned up in the same session — `deleteMany` on the seed markers (`authorId: "seed_author"`, `@seed.example` emails) — verified back to exactly the original 12 real posts and 3 real subscribers
- Fix: `scripts/seed.ts` now prints the target DB host and pauses 5s before writing anything, so seeding the wrong database is loud and interruptible instead of silent
- Not fixed: there's still no actual dev/staging database, so this can recur. Flagged as a real follow-up, not just a nice-to-have

---

## 2026-06-15

### Like Button + Admin Analytics
**Commits:** `ee3e144`

Added a fingerprint-based like system across the blog.

**New files:**
- `models/like.ts` — Like interface (`fingerprint`, `postSlug`, `createdAt`)
- `app/api/likes/route.ts` — POST (like) and DELETE (unlike) endpoints. Uses upsert to prevent duplicate likes per fingerprint
- `app/api/admin/likes/stats/route.ts` — Admin-only endpoint. Returns all-time total, period total, top 5 posts by likes, and daily breakdown. Accepts `?days=7|30`
- `components/like-button.tsx` — Heart icon button. Fingerprint generated via `crypto.randomUUID()` and stored in localStorage. Liked state tracked in `localStorage.liked_posts`. No count shown publicly
- `components/admin/likes-analytics.tsx` — Client component on the admin dashboard. 7d/30d toggle, all-time + period totals, top posts ranked by likes with titles

**Modified files:**
- `components/comments-section.tsx` — Added `<LikeButton>` to the right side of the comments header row
- `app/admin/page.tsx` — Added `<LikesAnalytics>` section above Recent Posts

**How it works:** Any visitor (no login required) can like a post. A UUID fingerprint is generated on first like and stored in localStorage. Likes are stored in MongoDB `likes` collection with the fingerprint + slug. You can't see your own like count or others' — only the admin dashboard shows it.

---

### R2 Image Migration
**Commits:** `49739ee`, `289e145`

All 5 published post cover images were stored as external Pinterest URLs. Pinterest hotlink-blocks those, causing 404s on post cards.

**Root cause:** Posts were created by pasting Pinterest URLs directly into the cover image text field in the admin editor, bypassing the R2 upload flow entirely.

**Fix:** Created `scripts/migrate-images-to-r2.ts` — downloads each Pinterest image, re-uploads it to R2, and updates the MongoDB record with the new R2 URL. Script is idempotent (skips posts already pointing at R2).

**Result:** All 5 posts now serve images from `the R2 public bucket URL`. Pinterest dependency eliminated.

**TypeScript fix (`289e145`):** The MongoDB query used duplicate `$ne` keys in the same object literal which TypeScript correctly rejects. Fixed by replacing `{ $ne: null, $ne: "" }` with `{ $nin: [null, ""] }`.

---

### R2 Bucket Verification
**No code changes**

Diagnosed the "Error 404 — Object not found" error showing on R2 image URLs.

**Findings:**
- R2 bucket `blog-images` credentials are valid — uploads and reads work
- Public access was already enabled; `the R2 public bucket URL` serves correctly
- Bucket was essentially empty (only a test file) — the real issue was Pinterest URLs in the DB, not R2

**R2 config confirmed working:**
- `CLOUDFLARE_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `NEXT_PUBLIC_R2_PUBLIC_URL` all set correctly in `.env.local` and Vercel
- Upload route at `app/api/upload/route.ts` is correctly wired — Browse button in admin editor calls it

---

### .env.local — Duplicate Clerk Keys Fixed
**Not committed (env file is gitignored)**

`.env.local` had both live and dev Clerk keys uncommented. The dev keys came second and were overriding the live keys, breaking auth on local dev.

**Fix:** Commented out the dev key block. Live keys (`pk_live_*`, `sk_live_*`) now take effect.

---

### blog.drakeze.com DNS Fix
**No code changes — Cloudflare DNS update required**

`blog.drakeze.com` was returning 404. The Vercel deployment was `READY` and the domain was assigned to the project, but the DNS was wrong.

**Root cause:** The `blog` DNS record in Cloudflare was an A record pointing at Cloudflare proxy IPs instead of Vercel.

**Fix (done in Cloudflare dashboard):**
- Changed `blog` record to CNAME → `cname.vercel-dns.com`
- Set proxy status to **DNS only** (grey cloud) — Vercel manages its own SSL, Cloudflare proxying conflicts with it

---

## Stack Reference

| Layer | Tech |
|---|---|
| Framework | Next.js 16, React 19, TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Database | MongoDB (native driver) |
| Auth | Clerk (live keys on prod) |
| Image storage | Cloudflare R2 |
| Email | Resend |
| Deployment | Vercel |
| Package manager | Bun |

**Key env vars:** see `.env.example`.
