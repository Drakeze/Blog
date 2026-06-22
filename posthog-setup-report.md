# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Drakeze Blog. It installed `posthog-js` and `posthog-node`, wired up client-side initialization via `instrumentation-client.ts` (Next.js 15.3+ pattern — no provider component needed), added a reverse proxy through `next.config.ts` to route PostHog traffic through `/ingest`, created a server-side PostHog client singleton at `lib/posthog-server.ts`, and instrumented all key user actions across 9 files. Clerk user identity is linked to PostHog automatically whenever a user signs in, and `posthog.reset()` is called on sign-out.

| Event | Description | File |
|---|---|---|
| `newsletter_subscribed` | User successfully subscribes to the newsletter from any post page | `components/subscribe-form.tsx` |
| `newsletter_unsubscribed` | User confirms they want to unsubscribe from the newsletter | `app/(public)/unsubscribe/unsubscribe-card.tsx` |
| `post_liked` | User likes a blog post | `components/like-button.tsx` |
| `post_unliked` | User removes their like from a blog post | `components/like-button.tsx` |
| `post_bookmarked` | User saves a blog post to their bookmarks | `components/bookmark-button.tsx` |
| `post_bookmark_removed` | User removes a blog post from their bookmarks | `components/bookmark-button.tsx` |
| `comment_posted` | User submits a new top-level comment on a blog post | `components/comments-section.tsx` |
| `comment_reply_posted` | User posts a reply to an existing comment on a blog post | `components/comments-section.tsx` |
| `server_newsletter_subscribed` | Server confirms a new newsletter subscription was saved | `app/api/subscribers/route.ts` |
| `server_newsletter_unsubscribed` | Server confirms a subscriber was removed from the newsletter list | `app/api/subscribers/unsubscribe/route.ts` |
| `server_newsletter_sent` | Admin manually triggers a newsletter send for a published post | `app/api/newsletter/send/route.ts` |
| `server_post_published` | A new blog post is created with published status via the admin API | `app/api/posts/route.ts` |
| `server_comment_posted` | A new comment is successfully saved to the database server-side | `app/api/comments/route.ts` |

## Next steps

A dashboard and 5 insights have been created in PostHog to monitor user behavior:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/480792/dashboard/1743979)
- [Newsletter subscriptions over time](https://us.posthog.com/project/480792/insights/lG7sIKMR)
- [Reader engagement trend](https://us.posthog.com/project/480792/insights/LMI2QwER)
- [Subscriber growth vs churn](https://us.posthog.com/project/480792/insights/xndmQnEU)
- [Total engaged readers (30d)](https://us.posthog.com/project/480792/insights/uIesxOWD)
- [Like-to-subscribe conversion funnel](https://us.posthog.com/project/480792/insights/HzBmKcHE)

## Verify before merging

- [ ] Run a full production build (`bun run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any bootstrap scripts so collaborators know what to set. *(Already done — verify the values are documented for your deployment environment.)*
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog Error Tracking.
- [ ] Confirm the returning-visitor path also calls `identify` — the `PostHogIdentity` component in `app/providers.tsx` runs on every page load for signed-in users, so this should be covered, but verify a returning session correctly associates events to the Clerk user ID in PostHog.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
