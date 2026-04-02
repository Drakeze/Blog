# Blog System Notes

## Responsibility split

- Clerk authenticates admins only.
- MongoDB stores posts and newsletter subscribers.
- Resend sends emails.

These responsibilities are intentionally separated so the public subscribe flow stays simple and the admin auth flow stays isolated.

## Public flow

1. Visitors land on `/` or `/blog`.
2. Posts are loaded from MongoDB.
3. If MongoDB is empty or temporarily unavailable, the public site falls back to starter posts.
4. Visitors can subscribe from `/subscribe` with email only.

## Subscribe flow

1. The form submits to `/api/subscribe`.
2. The API validates the email with Zod.
3. The address is normalized to lowercase before storage.
4. Duplicate subscriptions are treated safely and kept active instead of creating extra records.
5. If Resend is configured, the app sends a confirmation email.
6. If Resend is missing or fails, the subscription still succeeds and the API returns a clear message.

## Admin flow

1. `/admin` requires a Clerk session.
2. After sign-in, the app checks the Clerk user against `CLERK_ADMIN_EMAILS` and `CLERK_ADMIN_USER_IDS`.
3. If the user is not allowlisted, they are denied access through `/admin/unauthorized`.
4. Admins can create and edit posts, view subscribers, and run Reddit syncs.

## Post email flow

- `sendPostEmailToSubscribers(post)` lives in [`lib/email.ts`](/Users/zen/Dev/repos/Blog/lib/email.ts).
- It only sends for published blog posts.
- It skips safely if Resend is not configured.
- Automatic sending is controlled by `AUTO_SEND_POST_EMAILS`.
- The helper is ready to be reused later from admin actions, background jobs, or workflows.

## Reddit debugging

- The app uses Reddit OAuth before requesting `/user/{username}/submitted`.
- Missing credentials are surfaced through the admin UI and the API response.
- Authentication failures now return troubleshooting steps.
- A live diagnostic request in this finalization pass returned `401 Unauthorized` at Reddit's token endpoint, which points to invalid or outdated Reddit credentials rather than a rendering bug.

## Extension points

- Add unsubscribe support before sending larger newsletter campaigns.
- Add a dedicated admin action to trigger `sendPostEmailToSubscribers(post)` manually.
- Extend `lib/social/` with additional sources using the same integration pattern as Reddit.
- Move broadcast email work to a queue or workflow once subscriber volume grows beyond simple request-time sending.
