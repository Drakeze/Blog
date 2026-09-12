import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { authConfig } from './env';
import { Errors } from './errors';

export async function isAdmin(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  if (authConfig.adminUserIds.includes(userId)) return true;

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress.toLowerCase();
  return !!email && authConfig.adminEmails.includes(email);
}

/**
 * Route-handler admin gate. Returns a 401 `NextResponse` to return early, or
 * `null` when the caller is an admin. Use this in `app/api/**`; server
 * components should call `isAdmin()` and `redirect()` themselves.
 */
export async function requireAdminApi(): Promise<NextResponse | null> {
  if (await isAdmin()) return null;
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

/** Per-user gate for the route `try` block - throws `AppError` 401 when signed out. */
export async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw Errors.unauthorized();
  return userId;
}
