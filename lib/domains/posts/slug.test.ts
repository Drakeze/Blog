import { expect, test } from 'bun:test';

import { nextSlug } from './slug';

test('no requested slug → null (no slug write)', () => {
  expect(nextSlug('hello-world', undefined, [])).toBeNull();
});

test('unchanged slug → null', () => {
  expect(nextSlug('hello-world', 'hello-world', [])).toBeNull();
  // slugify normalises, so a differently-cased request that resolves to the
  // same slug is still a no-op
  expect(nextSlug('hello-world', 'Hello World', [])).toBeNull();
});

test('changed slug → pushes the old slug onto history', () => {
  expect(nextSlug('old-title', 'new-title', [])).toEqual({
    slug: 'new-title',
    slugHistory: ['old-title'],
  });
});

test('existing history is preserved and de-duplicated', () => {
  expect(nextSlug('b', 'c', ['a'])).toEqual({ slug: 'c', slugHistory: ['a', 'b'] });
  expect(nextSlug('b', 'b-again', ['a', 'b'])).toEqual({
    slug: 'b-again',
    slugHistory: ['a', 'b'],
  });
});

test('reverting to a former slug drops it from history', () => {
  expect(nextSlug('b', 'a', ['a'])).toEqual({ slug: 'a', slugHistory: ['b'] });
});

test('a request that slugifies to nothing throws', () => {
  expect(() => nextSlug('real-slug', '!!!', [])).toThrow();
});
