import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle } from "lucide-react";
import { listOpenRefunds } from "@/lib/admin-ops.functions";
import { formatMoney, refundFilingDeadline } from "@/lib/admin-logic";

/** Refunds still in progress, oldest first, with the 3-business-day filing deadline. */
export function RefundsSection({ onOpen }: { onOpen: (bookingId: string) => void }) {
  const fetchRefunds = useServerFn(listOpenRefunds);
  const refunds = useQuery({ queryKey: ["admin-refunds"], queryFn: () => fetchRefunds() });
  const data = refunds.data;
  const rows = data?.ok ? data.rows : [];

  return (
    <section id="refunds" className="mt-6 rounded-2xl border border-border bg-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="font-display text-base font-semibold text-navy">Refunds in progress</h2>
        <span className="text-xs text-muted-foreground">{rows.length} open</span>
      </div>
      {refunds.isPending ? (
        <p className="px-4 py-6 text-center text-xs text-muted-foreground">Loading refunds…</p>
      ) : data && !data.ok ? (
        <p className="px-4 py-6 text-center text-xs text-destructive">{data.message}</p>
      ) : data?.ok && !data.ready ? (
        <p className="px-4 py-6 text-center text-xs text-muted-foreground">
          Refunds need a one-time database update (the admin refunds migration).
        </p>
      ) : rows.length === 0 ? (
        <p className="px-4 py-6 text-center text-xs text-muted-foreground">
          No refunds in progress. Start one from a booking&apos;s details.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {rows.map((r) => {
            const deadline = refundFilingDeadline(r.created_at);
            const overdue = r.status === "requested" && Date.now() > deadline.getTime();
            return (
              <li
                key={r.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm"
              >
                <span className="whitespace-nowrap font-semibold text-navy">{r.pnr ?? "—"}</span>
                <span className="text-xs text-muted-foreground">{r.lead_name ?? ""}</span>
                <span className="font-semibold text-navy">
                  {formatMoney(Number(r.refund_amount), r.currency)}
                </span>
                <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-bold text-sky-800">
                  {r.status === "requested" ? "Requested" : "Filed with airline"}
                </span>
                {r.status === "requested" ? (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      overdue ? "text-destructive" : "text-muted-foreground"
                    }`}
                  >
                    {overdue ? <AlertTriangle className="size-3.5" /> : null}
                    File by {deadline.toLocaleDateString()}
                    {overdue ? " (overdue)" : ""}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Airline ref {r.airline_reference} · waiting for the airline
                  </span>
                )}
                <button
                  onClick={() => onOpen(r.booking_id)}
                  className="ml-auto rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-navy transition hover:border-gold"
                >
                  Open booking
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
