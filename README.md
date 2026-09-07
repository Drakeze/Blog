# Thinking Out Loud

The blog at [blog.drakeze.com](https://blog.drakeze.com) — software, systems, and
the craft of building things.

Next.js 16 · React 19 · TypeScript · Tailwind v4 · MongoDB (native driver) ·
Clerk · Resend · Cloudflare R2 · deployed on Vercel.

```bash
bun install
cp .env.example .env   # then fill it in — see docs/ENV.md
bun run verify-env
bun dev
```

> CI workflow (`.github/workflows/ci.yml`) is on disk but **not yet committed** —
> the push token lacks `workflow` scope. Run `gh auth refresh -h github.com -s workflow`
> then `git add .github && git commit -m "Add CI workflow" && git push`.

Coding-agent notes: [`AGENTS.md`](./AGENTS.md). Rebuild plan:
`~/.claude/plans/so-what-i-want-imperative-hellman.md`. Previous version kept at
`../Blog-Legacy` until cutover.
