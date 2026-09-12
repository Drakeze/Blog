# Thinking Out Loud

The blog at [blog.drakeze.com](https://blog.drakeze.com) - software, systems, and
the craft of building things.

Next.js 16 · React 19 · TypeScript · Tailwind v4 · MongoDB (native driver) ·
Clerk · Resend · Cloudflare R2 · deployed on Vercel.

```bash
bun install
cp .env.example .env   # then fill it in - see docs/ENV.md
bun run verify-env
bun dev
```

## Scripts

| Command | What it does |
| --- | --- |
| `bun dev` | Dev server at `http://localhost:3000` |
| `bun run build` | Production build |
| `bun run lint` | ESLint |
| `bun run type-check` | `tsc --noEmit` |
| `bun run test` | lint + type-check + `bun test` |
| `bun run verify-env` | Checks every env var is present and live-valid |

CI (`.github/workflows/ci.yml`) runs lint, type-check, test, and build on every push.

## License

[Apache 2.0](./LICENSE).

Coding-agent notes: [`AGENTS.md`](./AGENTS.md).
