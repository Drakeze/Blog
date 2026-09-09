import { expect, mock, test } from 'bun:test';

// The claim filters on `newsletterSentAt: { $exists: false }`, so once it's set
// the same filter no longer matches — model that with a one-shot fake.
let claimed = false;

mock.module('@/lib/mongo', () => ({
  blogCollectionNames: { posts: 'posts' },
  getDb: async () => ({
    collection: () => ({
      findOneAndUpdate: async () => {
        if (claimed) return null;
        claimed = true;
        return { slug: 'a-post' }; // the pre-update doc — non-null means "claimed"
      },
    }),
  }),
}));

const { claimNewsletterSend } = await import('./service');

test('claimNewsletterSend succeeds once, then 409s the racing caller', async () => {
  claimed = false;
  expect(await claimNewsletterSend('a-post')).toBe(true);
  expect(await claimNewsletterSend('a-post')).toBe(false);
});
