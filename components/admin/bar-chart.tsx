import type { DayCount } from '@/lib/domains/stats/service';

/** Tiny dependency-free bar chart for a daily-count series. */
export function BarChart({ data, caption }: { data: DayCount[]; caption?: string }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div>
      <div className="flex h-24 items-end gap-0.5">
        {data.map((d) => (
          <div
            key={d.day}
            title={`${d.day}: ${d.count}`}
            className="flex-1 rounded-t-sm bg-primary/70 transition-colors hover:bg-primary"
            style={{ height: `${Math.max(2, (d.count / max) * 100)}%` }}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {caption ?? `${total} total over ${data.length} days`}
      </p>
    </div>
  );
}
