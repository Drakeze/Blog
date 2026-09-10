import { apiError, apiOk } from '@/lib/api';
import { requireAdminApi } from '@/lib/auth';
import { refreshConfirmToken } from '@/lib/domains/subscribers/service';
import { sendSubscriptionConfirmation } from '@/lib/email/notifications';
import { Errors } from '@/lib/errors';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Ctx) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { id } = await params;
    const result = await refreshConfirmToken(id);
    if (!result) throw Errors.notFound('No pending subscriber with that id');
    await sendSubscriptionConfirmation(result.email, result.token);
    return apiOk({ success: true, email: result.email });
  } catch (err) {
    return apiError(err);
  }
}
