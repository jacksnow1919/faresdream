import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download, Search } from "lucide-react";
import { listActivity, type ActivityRow } from "@/lib/admin-ops.functions";
import { toCsv } from "@/lib/admin-logic";
import { downloadCsv, fileDate } from "@/components/admin/csv-download";

const ENTITY_LABELS: Record<string, string> = {
  booking: "Booking",
  ticket: "Ticket",
  refund: "Refund",
  deal: "Deal",
  lead: "Lead",
  staff: "Staff",
  verification: "ID check",
  provider: "Flight API",
};

const CSV_COLUMNS: { header: string; value: (r: ActivityRow) => unknown }[] = [
  { header: "When", value: (r) => r.created_at },
  { header: "Staff", value: (r) => r.staff_email },
  { header: "Role", value: (r) => r.staff_role },
  { header: "Area", value: (r) => ENTITY_LABELS[r.entity] ?? r.entity },
  { header: "Action", value: (r) => r.action },
  { header: "What happened", value: (r) => r.summary },
];

/** Who did what in the admin console, newest first (latest 200). Managers and up. */
export function ActivitySection() {
  const fetchActivity = useServerFn(listActivity);
  const activity = useQuery({ queryKey: ["admin-activity"], queryFn: () => fetchActivity() });
  const [q, setQ] = useState("");
  const data = activity.data;

  const rows = useMemo(() => {
    const all = data?.ok ? data.rows : [];
    const needle = q.trim().toLowerCase();
    return needle
      ? all.filter((r) =>
          `${r.staff_email} ${r.summary} ${r.action}`.toLowerCase().includes(needle),
        )
      : all;
  }, [data, q]);

  return (
    <section id="activity" className="mt-6 rounded-2xl border border-border bg-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="font-display text-base font-semibold text-navy">Activity log</h2>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <span className="sr-only">Search activity</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Staff, reference or action"
              className="h-9 w-56 rounded-xl border border-input bg-background pl-9 pr-3 text-sm text-navy outline-none focus:border-gold"
            />
          </label>
          <button
            onClick={() =>
              downloadCsv(`faresdream-activity-${fileDate()}.csv`, toCsv(rows, CSV_COLUMNS))
            }
            disabled={rows.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-navy transition hover:border-gold disabled:opacity-50"
          >
            <Download className="size-3.5" /> Export CSV
          </button>
        </div>
      </div>
      {activity.isPending ? (
        <p className="px-4 py-6 text-center text-xs text-muted-foreground">Loading activity…</p>
      ) : data && !data.ok ? (
        <p className="px-4 py-6 text-center text-xs text-destructive">{data.message}</p>
      ) : data?.ok && !data.ready ? (
        <p className="px-4 py-6 text-center text-xs text-muted-foreground">
          The activity log needs a one-time database update (the admin refunds migration).
        </p>
      ) : rows.length === 0 ? (
        <p className="px-4 py-6 text-center text-xs text-muted-foreground">
          {q ? "Nothing matches that search." : "No activity recorded yet."}
        </p>
      ) : (
        <ul className="max-h-[30rem] divide-y divide-border overflow-y-auto">
          {rows.map((r) => (
            <li
              key={r.id}
              className="grid gap-1 px-4 py-2.5 text-sm sm:grid-cols-[9.375rem_12.5rem_minmax(0,1fr)] sm:gap-4"
            >
              <span className="text-xs text-muted-foreground">
                {new Date(r.created_at).toLocaleString()}
              </span>
              <span className="truncate text-xs font-semibold text-navy" title={r.staff_email}>
                {r.staff_email} · {r.staff_role}
              </span>
              <span className="text-navy">
                <span className="mr-2 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                  {ENTITY_LABELS[r.entity] ?? r.entity}
                </span>
                {r.summary}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
