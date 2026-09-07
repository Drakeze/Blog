import { ObjectId } from 'mongodb';

export interface Subscriber {
  _id?: ObjectId;
  email: string;
  userId?: string; // set when subscribed via a Clerk account
  /** Double opt-in: false until the confirmation link is clicked. Newsletters go to confirmed only. */
  confirmed: boolean;
  confirmToken?: string; // present while unconfirmed; cleared on confirm
  confirmedAt?: Date;
  unsubscribeToken: string;
  createdAt: Date;
}
