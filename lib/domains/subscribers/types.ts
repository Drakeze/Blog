import type { Subscriber } from '@/models/subscriber';

export type { Subscriber };

export interface SubscribeInput {
  email: string;
  /** Set when the subscribe came from a signed-in Clerk account. */
  userId?: string;
}

export type SubscriberStatus = 'all' | 'confirmed' | 'pending';
