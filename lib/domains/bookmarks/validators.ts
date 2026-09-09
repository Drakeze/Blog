import { z } from 'zod';

export const bookmarkInputSchema = z.object({
  postSlug: z.string().trim().min(1).max(200),
  postTitle: z.string().trim().min(1).max(300),
  postExcerpt: z.string().max(1000).optional().default(''),
  postCoverImage: z.string().url().max(2000).optional(),
});

export const bookmarkDeleteQuerySchema = z.object({
  postSlug: z.string().trim().min(1).max(200),
});
