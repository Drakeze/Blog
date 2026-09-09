import type { Like } from '@/models/like';

export type { Like };

export interface LikeInput {
  postSlug: string;
  fingerprint: string;
}
