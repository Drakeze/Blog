import { apiError, apiOk } from '@/lib/api';
import { requireAdminApi } from '@/lib/auth';
import { removeSubscriberById } from '@/lib/domains/subscribers/service';
import { Errors } from '@/lib/errors';

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { id } = await params;
    if (!(await removeSubscriberById(id))) throw Errors.notFound('Subscriber not found');
    return apiOk({ success: true });
  } catch (err) {
    return apiError(err);
  }
}
