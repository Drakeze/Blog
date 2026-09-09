import { Errors } from '@/lib/errors';
import { slugify } from '@/lib/utils';

/**
 * Decide the slug fields to persist when a post is edited. Pure — no DB — so the
 * slug-history rule is unit-testable.
 *
 * - `requested` absent or unchanged → `null` (no slug write).
 * - slug changes → push the *old* slug onto `slugHistory` (deduped) so
 *   `resolveSlug` can 301 the old URL. If the new slug was itself a former slug,
 *   drop it from history.
 *
 * Uniqueness of the new slug is the caller's job (needs a DB lookup).
 */
export function nextSlug(
  current: string,
  requested: string | undefined,
  history: string[]
): { slug: string; slugHistory: string[] } | null {
  if (!requested) return null;
  const slug = slugify(requested);
  if (!slug) throw Errors.badRequest('Could not derive a slug');
  if (slug === current) return null;

  const withOld = history.includes(current) ? history : [...history, current];
  return { slug, slugHistory: withOld.filter((s) => s !== slug) };
}
