import { ObjectId } from "mongodb"

export interface Comment {
  _id?: ObjectId
  postId: string          // post slug
  userId: string
  userDisplayName: string
  userImageUrl?: string
  content: string
  parentId?: string       // ObjectId string of parent comment; absent = top-level
  createdAt: Date
  updatedAt: Date
}
