import { ObjectId } from "mongodb"

export interface Like {
  _id?: ObjectId
  fingerprint: string
  postSlug: string
  createdAt: Date
}
