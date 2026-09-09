import type { Comment } from '@/models/comment';

export type { Comment };

export interface CreateCommentInput {
  postId: string; // post slug
  userId: string;
  userDisplayName: string;
  userImageUrl?: string;
  content: string;
  parentId?: string | null;
}
