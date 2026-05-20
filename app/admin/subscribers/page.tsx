import { getDb } from "@/lib/mongo"
import type { Subscriber } from "@/models/subscriber"
import { formatDate } from "@/lib/utils"

export const metadata = { title: "Subscribers" }

export default async function SubscribersPage() {
  const db = await getDb()
  const subscribers = await db
    .collection<Subscriber>("subscribers")
    .find()
    .sort({ createdAt: -1 })
    .toArray()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscribers</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {subscribers.filter((s) => s.confirmed).length} confirmed
        </p>
      </div>

      <div className="rounded-lg border border-border">
        {subscribers.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No subscribers yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Email</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Account</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Status</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscribers.map((sub) => (
                <tr key={String(sub._id)} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{sub.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{sub.userId ? "Yes" : "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        sub.confirmed
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {sub.confirmed ? "Confirmed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(sub.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
