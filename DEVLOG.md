# Blog — Dev Log

Running log of changes made to the blog project. Most recent first.

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

**Result:** All 5 posts now serve images from `pub-196fa866c9204ea18c2dc7ae564f3bad.r2.dev`. Pinterest dependency eliminated.

**TypeScript fix (`289e145`):** The MongoDB query used duplicate `$ne` keys in the same object literal which TypeScript correctly rejects. Fixed by replacing `{ $ne: null, $ne: "" }` with `{ $nin: [null, ""] }`.

---

### R2 Bucket Verification
**No code changes**

Diagnosed the "Error 404 — Object not found" error showing on R2 image URLs.

**Findings:**
- R2 bucket `blog-images` credentials are valid — uploads and reads work
- Public access was already enabled; `pub-196fa866c9204ea18c2dc7ae564f3bad.r2.dev` serves correctly
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

**Root cause:** The `blog` DNS record in Cloudflare was set as an A record pointing to Cloudflare proxy IPs (`104.21.85.50`, `172.67.202.119`) instead of Vercel.

**Fix (done in Cloudflare dashboard):**
- Changed `blog` record to CNAME → `cname.vercel-dns.com`
- Set proxy status to **DNS only** (grey cloud) — Vercel manages its own SSL, Cloudflare proxying conflicts with it

---

## Stack Reference

| Layer | Tech |
|---|---|
| Framework | Next.js 15, React 19, TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Database | MongoDB (native driver) |
| Auth | Clerk (live keys on prod) |
| Image storage | Cloudflare R2 (`blog-images` bucket) |
| Email | Resend |
| Deployment | Vercel (SorenLab team) |
| Package manager | Bun |

**Key env vars:**
- `NEXT_PUBLIC_R2_PUBLIC_URL` — R2 public base URL
- `R2_BUCKET_NAME` — `blog-images`
- `CLOUDFLARE_ACCOUNT_ID` — used to build the S3-compatible endpoint
- `CLERK_ADMIN_EMAILS` / `CLERK_ADMIN_USER_IDS` — gates admin access
