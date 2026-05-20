import { ObjectId } from "mongodb"

export interface Comment {
  _id?: ObjectId
  postId: string          // post slug
  userId: string
  userDisplayName: string
  userImageUrl?: string
  content: string
  createdAt: Date
  updatedAt: Date
}
