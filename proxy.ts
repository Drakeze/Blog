import { clerkMiddleware } from '@clerk/nextjs/server';

/**
 * Bare `clerkMiddleware` — it only has to run so `auth()` / `currentUser()` work
 * in server components and route handlers. Authorization is resource-based
 * (Clerk's own recommendation): `app/admin/layout.tsx` calls `isAdmin()` and
 * redirects, and every admin API route calls `requireAdminApi()`.
 *
 * The matcher is deliberately narrow — it skips the public reader routes (`/`,
 * `/[slug]`, `/search`, `/tags/*`, …) so those can be statically cached / ISR'd
 * instead of being forced dynamic by a middleware rewrite on every request.
 */
export default clerkMiddleware();

export const config = {
  matcher: ['/admin/:path*', '/bookmarks', '/sign-in/:path*', '/sign-up/:path*', '/(api)(.*)'],
};
