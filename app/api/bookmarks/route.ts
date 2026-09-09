import { apiError, apiOk } from '@/lib/api';
import { requireUserId } from '@/lib/auth';
import { add, listByUser, remove } from '@/lib/domains/bookmarks/service';
import { bookmarkDeleteQuerySchema, bookmarkInputSchema } from '@/lib/domains/bookmarks/validators';

export async function GET() {
  try {
    const userId = await requireUserId();
    return apiOk(await listByUser(userId));
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const input = bookmarkInputSchema.parse(await req.json());
    return apiOk(await add(userId, input), 201);
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await requireUserId();
    const { searchParams } = new URL(req.url);
    const { postSlug } = bookmarkDeleteQuerySchema.parse(Object.fromEntries(searchParams));
    await remove(userId, postSlug);
    return apiOk({ success: true });
  } catch (err) {
    return apiError(err);
  }
}
