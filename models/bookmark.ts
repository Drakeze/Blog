import { ObjectId } from 'mongodb';

/** Denormalized snapshot — `/bookmarks` renders without a join back to `posts`. */
export interface Bookmark {
  _id?: ObjectId;
  userId: string;
  postSlug: string;
  postTitle: string;
  postExcerpt: string;
  postCoverImage?: string;
  createdAt: Date;
}
