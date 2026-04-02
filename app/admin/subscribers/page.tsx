import { countSubscribers, listSubscribers } from "@/data/subscribers"
import { requireAdmin } from "@/lib/auth"

export default async function AdminSubscribersPage() {
  await requireAdmin("/admin/subscribers")

  const [subscribers, totalSubscribers] = await Promise.all([
    listSubscribers(500),
    countSubscribers(),
  ])

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Admin</p>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Subscribers</h1>
        <p className="text-muted-foreground">
          {totalSubscribers} subscriber(s) stored in MongoDB.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Clerk User</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {subscribers.length ? (
              subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-6 py-4 font-medium text-foreground">{subscriber.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">{subscriber.clerkUserId ?? "Not linked"}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(subscriber.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(subscriber.updatedAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-6 py-8 text-muted-foreground" colSpan={4}>
                  No subscribers have been stored yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
