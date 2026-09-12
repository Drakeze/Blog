import { auth } from '@clerk/nextjs/server';

import { isAdmin } from '@/lib/auth';

/**
 * Tiny identity endpoint for the client chrome (header). Returns only booleans
 * about the *current* caller, so it leaks nothing - and it keeps the public
 * layout static/ISR instead of forcing every page dynamic via a server
 * `isAdmin()` call in the layout.
 */
export async function GET() {
  const { userId } = await auth();
  return Response.json({ signedIn: !!userId, isAdmin: userId ? await isAdmin() : false });
}
