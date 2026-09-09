import type { Bookmark } from '@/models/bookmark';

export type { Bookmark };

export interface BookmarkInput {
  postSlug: string;
  postTitle: string;
  postExcerpt: string;
  postCoverImage?: string;
}
