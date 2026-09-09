import { expect, test } from 'bun:test';

import { bookmarkInputSchema } from './bookmarks/validators';
import { createCommentSchema } from './comments/validators';
import { likeInputSchema } from './likes/validators';
import { listPostsQuerySchema, postInputSchema } from './posts/validators';
import { tokenSchema } from './subscribers/validators';

// An operator object must never survive validation into a Mongo filter.
const operator = { $ne: null };

test('like fields reject operator objects', () => {
  expect(likeInputSchema.safeParse({ postSlug: operator, fingerprint: 'x' }).success).toBe(false);
  expect(likeInputSchema.safeParse({ postSlug: 'x', fingerprint: operator }).success).toBe(false);
  expect(likeInputSchema.safeParse({ postSlug: 'a', fingerprint: 'b' }).success).toBe(true);
});

test('comment postId / parentId reject operator objects', () => {
  expect(createCommentSchema.safeParse({ postId: operator, content: 'hi' }).success).toBe(false);
  expect(
    createCommentSchema.safeParse({ postId: 'p', content: 'hi', parentId: operator }).success
  ).toBe(false);
});

test('subscriber token rejects operator objects', () => {
  expect(tokenSchema.safeParse({ token: operator }).success).toBe(false);
});

test('bookmark postSlug rejects operator objects', () => {
  expect(bookmarkInputSchema.safeParse({ postSlug: operator, postTitle: 't' }).success).toBe(false);
});

test('post slug + list filters reject operator objects', () => {
  expect(
    postInputSchema.safeParse({
      title: 't',
      slug: operator,
      content: 'c',
      excerpt: 'e',
      authorId: 'a',
      authorName: 'n',
    }).success
  ).toBe(false);
  expect(listPostsQuerySchema.safeParse({ tag: operator }).success).toBe(false);
  expect(listPostsQuerySchema.safeParse({ status: 'sneaky' }).success).toBe(false);
});
