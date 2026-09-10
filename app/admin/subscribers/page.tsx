import { type SubscriberRow,SubscribersTable } from '@/components/admin/subscribers-table';
import { listSubscribers } from '@/lib/domains/subscribers/service';

export default async function AdminSubscribersPage() {
  const subs = await listSubscribers('all');
  const rows: SubscriberRow[] = subs.map((s) => ({
    id: String(s._id),
    email: s.email,
    confirmed: s.confirmed,
    fromAccount: !!s.userId,
    createdAt: new Date(s.createdAt).toISOString(),
    confirmedAt: s.confirmedAt ? new Date(s.confirmedAt).toISOString() : null,
  }));

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Subscribers</h1>
      <SubscribersTable rows={rows} />
    </div>
  );
}
