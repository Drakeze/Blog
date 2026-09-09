import type { Post, PostStatus, PostSummary } from '@/models/post';

export type { Post, PostStatus, PostSummary };

/** Fields a caller (admin UI or MCP connector) may supply on create. */
export interface PostInput {
  title: string;
  /** Optional explicit slug; defaults to `slugify(title)`. */
  slug?: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
  status?: PostStatus;
  authorId: string;
  authorName: string;
  authorImageUrl?: string;
}

export type PostUpdateInput = Partial<PostInput>;

export interface ListPostsParams {
  status?: PostStatus | 'all';
  tag?: string;
  page?: number;
  limit?: number;
}

export interface ListPostsResult {
  posts: PostSummary[];
  total: number;
  page: number;
  limit: number;
}
