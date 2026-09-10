'use client';

import { Download, Loader2, Mail, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn, formatDate } from '@/lib/utils';

export interface SubscriberRow {
  id: string;
  email: string;
  confirmed: boolean;
  fromAccount: boolean;
  createdAt: string;
  confirmedAt: string | null;
}

type Filter = 'all' | 'confirmed' | 'pending';
const FILTERS: Filter[] = ['all', 'confirmed', 'pending'];

function toCsv(rows: SubscriberRow[]): string {
  const head = 'email,status,source,subscribed,confirmed_at';
  const body = rows.map((r) =>
    [
      r.email,
      r.confirmed ? 'confirmed' : 'pending',
      r.fromAccount ? 'account' : 'form',
      r.createdAt,
      r.confirmedAt ?? '',
    ]
      .map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v))
      .join(',')
  );
  return [head, ...body].join('\n');
}

export function SubscribersTable({ rows }: { rows: SubscriberRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  const shown = useMemo(() => {
    if (filter === 'confirmed') return rows.filter((r) => r.confirmed);
    if (filter === 'pending') return rows.filter((r) => !r.confirmed);
    return rows;
  }, [rows, filter]);

  const counts = useMemo(
    () => ({
      all: rows.length,
      confirmed: rows.filter((r) => r.confirmed).length,
      pending: rows.filter((r) => !r.confirmed).length,
    }),
    [rows]
  );

  function exportCsv() {
    const blob = new Blob([toCsv(shown)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${filter}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function act(id: string, kind: 'delete' | 'resend', email: string) {
    if (kind === 'delete' && !confirm(`Remove ${email}?`)) return;
    setBusyId(id);
    try {
      const res = await fetch(
        kind === 'delete' ? `/api/subscribers/${id}` : `/api/subscribers/${id}/resend`,
        { method: kind === 'delete' ? 'DELETE' : 'POST' }
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message ?? 'Request failed');
      }
      toast.success(kind === 'delete' ? 'Subscriber removed' : `Confirmation resent to ${email}`);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-md border border-border p-0.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'rounded px-3 py-1 text-sm font-medium capitalize transition-colors',
                filter === f
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {f} <span className="tabular-nums opacity-60">{counts[f]}</span>
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={exportCsv} disabled={shown.length === 0}>
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      {shown.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">No subscribers here yet.</Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Subscribed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shown.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">
                    {r.email}
                    {r.fromAccount ? (
                      <span className="ml-2 text-[11px] text-muted-foreground">account</span>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.confirmed ? 'ok' : 'warn'}>
                      {r.confirmed ? 'confirmed' : 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap text-xs text-muted-foreground sm:table-cell">
                    {formatDate(r.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {!r.confirmed ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={busyId === r.id}
                          onClick={() => act(r.id, 'resend', r.email)}
                          title="Resend confirmation email"
                        >
                          {busyId === r.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Mail className="size-4" />
                          )}
                        </Button>
                      ) : null}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        disabled={busyId === r.id}
                        onClick={() => act(r.id, 'delete', r.email)}
                        title="Remove subscriber"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
