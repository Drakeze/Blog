import { ObjectId } from 'mongodb';

export type PostStatus = 'draft' | 'published';

export interface Post {
  _id?: ObjectId;
  title: string;
  slug: string;
  /** Previous slugs, newest last. `/[slug]` 301s to the current slug when a request hits one of these. */
  slugHistory: string[];
  content: string; // raw markdown
  excerpt: string;
  coverImage?: string;
  tags: string[];
  status: PostStatus;
  authorId: string;
  authorName: string;
  authorImageUrl?: string;
  publishedAt?: Date;
  newsletterSentAt?: Date; // set once the post has been emailed to subscribers
  createdAt: Date;
  updatedAt: Date;
}

export type PostSummary = Omit<Post, 'content'>;
