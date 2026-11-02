import { AlertTriangle } from "lucide-react";
import type { AdminBookingRow } from "@/lib/bookings.functions";
import { daysUntil } from "@/lib/admin-logic";

/** Departing within this many days counts as urgent. */
const URGENT_DAYS = 3;

function departureNote(ymd: string | null) {
  if (!ymd) return { text: "No travel date", urgent: false };
  const days = daysUntil(ymd);
  if (Number.isNaN(days)) return { text: ymd, urgent: false };
  if (days < 0) return { text: `Departed ${-days} day${days === -1 ? "" : "s"} ago`, urgent: true };
  if (days === 0) return { text: "Departs today", urgent: true };
  return {
    text: `Departs in ${days} day${days === 1 ? "" : "s"}`,
    urgent: days <= URGENT_DAYS,
  };
}

/** Bookings waiting for tickets: nearest departure first, so urgent ones sit on top. */
export function PnrQueue({
  rows,
  onOpen,
}: {
  rows: AdminBookingRow[];
  onOpen: (id: string) => void;
}) {
  const queue = rows
    .filter((b) => b.status === "pending")
    .sort((a, b) => (a.depart_date ?? "9999").localeCompare(b.depart_date ?? "9999"));
  const urgent = queue.filter((b) => departureNote(b.depart_date).urgent).length;

  return (
    <section id="pnr-queue" className="mt-6 rounded-2xl border border-border bg-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="font-display text-base font-semibold text-navy">PNR Queue</h2>
        <span className="text-xs text-muted-foreground">
          {queue.length} awaiting ticketing
          {urgent ? (
            <span className="ml-2 font-bold text-destructive">· {urgent} urgent</span>
          ) : null}
        </span>
      </div>
      {queue.length === 0 ? (
        <p className="px-4 py-6 text-center text-xs text-muted-foreground">
          Nothing waiting. Every booking is ticketed, cancelled or refunded.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {queue.map((b) => {
            const note = departureNote(b.depart_date);
            const blockers = [
              b.verification_status !== "verified" ? "not verified" : "",
              !b.captured_at ? "funds not captured" : "",
            ].filter(Boolean);
            return (
              <li key={b.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                <span className="whitespace-nowrap font-semibold text-navy">{b.pnr ?? "—"}</span>
                <span className="font-semibold">
                  {b.origin} → {b.destination}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold ${
                    note.urgent ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {note.urgent ? <AlertTriangle className="size-3.5" /> : null}
                  {note.text}
                </span>
                {blockers.length ? (
                  <span className="text-xs text-muted-foreground">({blockers.join(", ")})</span>
                ) : null}
                <button
                  onClick={() => onOpen(b.id)}
                  className="ml-auto rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-navy transition hover:border-gold"
                >
                  Open
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
