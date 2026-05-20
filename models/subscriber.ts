import { ObjectId } from "mongodb"

export interface Subscriber {
  _id?: ObjectId
  email: string
  userId?: string          // set when subscribed via Clerk account
  confirmed: boolean
  unsubscribeToken: string
  createdAt: Date
}
