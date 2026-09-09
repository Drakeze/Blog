import { z } from 'zod';

/** Email is optional in the body — signed-in users subscribe with their Clerk address. */
export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254).optional(),
});

/** Shared by `/confirm` and `/unsubscribe` — the token is the capability. */
export const tokenSchema = z.object({
  token: z.string().min(1).max(200),
});

export const listSubscribersQuerySchema = z.object({
  status: z.enum(['all', 'confirmed', 'pending']).optional(),
});
