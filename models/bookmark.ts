import { ObjectId } from "mongodb"

export interface Bookmark {
  _id?: ObjectId
  userId: string
  postSlug: string
  postTitle: string
  postExcerpt: string
  postCoverImage?: string
  createdAt: Date
}
