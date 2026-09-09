import { apiError, apiOk } from '@/lib/api';
import { isAdmin, requireUserId } from '@/lib/auth';
import { remove } from '@/lib/domains/comments/service';

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    await remove(id, { userId, isAdmin: await isAdmin() });
    return apiOk({ success: true });
  } catch (err) {
    return apiError(err);
  }
}
