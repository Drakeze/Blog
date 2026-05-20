import { ObjectId } from "mongodb"

export type PostStatus = "draft" | "published"

export interface Post {
  _id?: ObjectId
  title: string
  slug: string
  content: string        // raw markdown
  excerpt: string
  coverImage?: string
  tags: string[]
  status: PostStatus
  authorId: string
  authorName: string
  authorImageUrl?: string
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export type PostSummary = Omit<Post, "content">
