import { z } from 'zod';

export const createCommentSchema = z.object({
  postId: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(2000),
  parentId: z.string().trim().min(1).max(50).nullish(),
});

export const listCommentsQuerySchema = z.object({
  postId: z.string().trim().min(1).max(200),
});
