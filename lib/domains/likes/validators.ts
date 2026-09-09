import { z } from 'zod';

/** `z.string()` on both fields replaces the legacy hand-rolled `readPair` guard. */
export const likeInputSchema = z.object({
  postSlug: z.string().trim().min(1).max(200),
  fingerprint: z.string().trim().min(1).max(100),
});
