import { z } from 'zod';

/**
 * zod is the operator-injection guard: every string that can reach a Mongo
 * filter (`slug`, `tag`) is `z.string()`, so an object like `{ $ne: null }`
 * fails `parse` before it touches the driver.
 */

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const postInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(200).regex(slugPattern, 'Invalid slug').optional(),
  content: z.string().min(1),
  excerpt: z.string().trim().min(1).max(500),
  coverImage: z.string().url().max(2000).optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
  status: z.enum(['draft', 'published']).optional(),
  authorId: z.string().min(1).max(200),
  authorName: z.string().trim().min(1).max(200),
  authorImageUrl: z.string().url().max(2000).optional(),
});

export const postUpdateSchema = postInputSchema
  .partial()
  .refine((v) => Object.keys(v).length > 0, 'At least one field is required');

export const listPostsQuerySchema = z.object({
  status: z.enum(['draft', 'published', 'all']).optional(),
  tag: z.string().trim().min(1).max(50).optional(),
  page: z.coerce.number().int().min(1).max(10_000).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});
