import crypto from 'crypto';
import { ObjectId } from 'mongodb';

import { blogCollectionNames, getDb } from '@/lib/mongo';

import type { SubscribeInput, Subscriber, SubscriberStatus } from './types';

const FILTER: Record<SubscriberStatus, Record<string, unknown>> = {
  all: {},
  confirmed: { confirmed: true },
  pending: { confirmed: false },
};

function subsCol() {
  return getDb().then((db) => db.collection<Subscriber>(blogCollectionNames.subscribers));
}

export async function listSubscribers(status: SubscriberStatus = 'all'): Promise<Subscriber[]> {
  const col = await subsCol();
  return col.find(FILTER[status]).sort({ createdAt: -1 }).toArray();
}

export async function countConfirmed(): Promise<number> {
  const col = await subsCol();
  return col.countDocuments({ confirmed: true });
}

/**
 * Double opt-in step 1: insert a pending (`confirmed: false`) subscriber with a
 * fresh `confirmToken`. Idempotent - an existing row is returned untouched with
 * `created: false` so the caller knows whether to send a confirmation email.
 */
export async function subscribe(
  input: SubscribeInput
): Promise<{ created: boolean; subscriber: Subscriber }> {
  const col = await subsCol();
  const email = input.email.trim().toLowerCase();

  const existing = await col.findOne({ email });
  if (existing) return { created: false, subscriber: existing };

  const subscriber: Subscriber = {
    email,
    userId: input.userId,
    confirmed: false,
    confirmToken: crypto.randomUUID(),
    unsubscribeToken: crypto.randomUUID(),
    createdAt: new Date(),
  };

  try {
    const res = await col.insertOne(subscriber);
    return { created: true, subscriber: { ...subscriber, _id: res.insertedId } };
  } catch (err) {
    // Unique index on email - a racing duplicate submit lands here.
    if (err && typeof err === 'object' && 'code' in err && err.code === 11000) {
      const row = await col.findOne({ email });
      if (row) return { created: false, subscriber: row };
    }
    throw err;
  }
}

/**
 * Double opt-in step 2: flip `confirmed` and clear the token. Returns `null` for
 * an unknown/spent token (a second click on the same link also lands here - the
 * token was `$unset` on the first).
 */
export async function confirmSubscriber(token: string): Promise<Subscriber | null> {
  const col = await subsCol();
  return col.findOneAndUpdate(
    { confirmToken: token },
    { $set: { confirmed: true, confirmedAt: new Date() }, $unset: { confirmToken: '' } },
    { returnDocument: 'after' }
  );
}

/** Atomic - a double-click can't race findOne against deleteOne. */
export async function unsubscribe(token: string): Promise<Subscriber | null> {
  const col = await subsCol();
  return col.findOneAndDelete({ unsubscribeToken: token });
}

/** Admin: hard-delete one subscriber by id. Returns false for an unknown/invalid id. */
export async function removeSubscriberById(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const col = await subsCol();
  const res = await col.deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount === 1;
}

/**
 * Admin: re-issue the confirmation email for a pending subscriber. Regenerates
 * `confirmToken` (covers rows whose token was already cleared) and returns the
 * address + token for the caller to send. `null` = unknown id or already confirmed.
 */
export async function refreshConfirmToken(
  id: string
): Promise<{ email: string; token: string } | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await subsCol();
  const token = crypto.randomUUID();
  const row = await col.findOneAndUpdate(
    { _id: new ObjectId(id), confirmed: false },
    { $set: { confirmToken: token } },
    { returnDocument: 'after' }
  );
  return row ? { email: row.email, token } : null;
}
