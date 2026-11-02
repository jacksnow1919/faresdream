import { useMemo, useState } from "react";
import { Download, Search, X } from "lucide-react";
import type { AdminBookingRow } from "@/lib/bookings.functions";
import {
  STATUS_LABELS,
  bookingSource,
  emptyBookingFilter,
  formatMoney,
  matchesBooking,
  toCsv,
  type BookingFilter,
} from "@/lib/admin-logic";
import { downloadCsv, fileDate } from "@/components/admin/csv-download";
import { DatePicker } from "@/components/site/DatePicker";

export function SourceBadge({ source }: { source: string }) {
  const cls =
    source === "EAZAIR"
      ? "bg-emerald-100 text-emerald-700"
      : source === "DIRECT"
        ? "bg-gold/15 text-navy ring-1 ring-gold/40"
        : "bg-secondary text-muted-foreground";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${cls}`}>
      {source}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "issued"
      ? "bg-emerald-100 text-emerald-700"
      : status === "pending"
        ? "bg-gold/15 text-navy ring-1 ring-gold/40"
        : status === "refunded"
          ? "bg-sky-100 text-sky-800"
          : "bg-secondary text-muted-foreground";
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${cls}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

const CSV_COLUMNS: { header: string; value: (b: AdminBookingRow) => unknown }[] = [
  { header: "Reference", value: (b) => b.pnr },
  { header: "Booked on", value: (b) => b.created_at },
  { header: "Status", value: (b) => STATUS_LABELS[b.status] ?? b.status },
  { header: "Verification", value: (b) => b.verification_status },
  { header: "Customer", value: (b) => b.lead_name },
  { header: "Email", value: (b) => b.guest_email },
  { header: "Phone", value: (b) => b.guest_phone },
  { header: "From", value: (b) => b.origin },
  { header: "To", value: (b) => b.destination },
  { header: "Airline", value: (b) => b.airline },
  { header: "Cabin", value: (b) => b.cabin_class },
  { header: "Departs", value: (b) => b.depart_date },
  { header: "Returns", value: (b) => b.return_date },
  { header: "Currency", value: (b) => b.currency },
  { header: "Total", value: (b) => Number(b.total_price) },
  { header: "Promo code", value: (b) => b.promo_code },
  { header: "Promo discount", value: (b) => Number(b.promo_discount) },
  { header: "Source", value: (b) => bookingSource(b) },
  { header: "Click ID", value: (b) => b.click_id },
  { header: "Funds captured", value: (b) => b.captured_at },
];

const inputCls =
  "h-9 rounded-xl border border-input bg-background px-3 text-sm text-navy outline-none focus:border-gold";

/** All bookings with search, status, verification and date filters, and CSV export. */
export function BookingsSection({
  rows,
  onOpen,
}: {
  rows: AdminBookingRow[];
  onOpen: (id: string) => void;
}) {
  const [filter, setFilter] = useState<BookingFilter>(emptyBookingFilter);
  const set = <K extends keyof BookingFilter>(key: K, value: BookingFilter[K]) =>
    setFilter((f) => ({ ...f, [key]: value }));

  const shown = useMemo(() => rows.filter((b) => matchesBooking(b, filter)), [rows, filter]);
  const filtered =
    filter.q.trim() !== "" ||
    filter.status !== "all" ||
    filter.verification !== "all" ||
    filter.from !== "" ||
    filter.to !== "";

  return (
    <section
      id="reconciliation"
      className="mt-6 rounded-2xl border border-border bg-card shadow-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="font-display text-base font-semibold text-navy">All Bookings</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {filtered ? `${shown.length} of ${rows.length}` : `${rows.length}`} bookings
          </span>
          <button
            onClick={() =>
              downloadCsv(`faresdream-bookings-${fileDate()}.csv`, toCsv(shown, CSV_COLUMNS))
            }
            disabled={shown.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-navy transition hover:border-gold disabled:opacity-50"
          >
            <Download className="size-3.5" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid gap-2 border-b border-border px-4 py-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))_auto]">
        <label className="relative sm:col-span-2 xl:col-span-1">
          <span className="sr-only">Search bookings</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={filter.q}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Reference, name, email, phone or route"
            className={`${inputCls} w-full pl-9`}
          />
        </label>
        <select
          aria-label="Booking status"
          value={filter.status}
          onChange={(e) => set("status", e.target.value as BookingFilter["status"])}
          className={`${inputCls} cursor-pointer`}
        >
          <option value="all">Any status</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <select
          aria-label="Verification"
          value={filter.verification}
          onChange={(e) => set("verification", e.target.value as BookingFilter["verification"])}
          className={`${inputCls} cursor-pointer`}
        >
          <option value="all">Any verification</option>
          <option value="pending">Awaiting verification</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          From
          <div className="min-w-0 flex-1">
            <DatePicker
              ariaLabel="Booked from"
              value={filter.from}
              max={filter.to || undefined}
              onChange={(v) => set("from", v)}
              className={`${inputCls} w-full`}
            />
          </div>
        </div>
        <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          To
          <div className="min-w-0 flex-1">
            <DatePicker
              ariaLabel="Booked to"
              value={filter.to}
              min={filter.from || undefined}
              onChange={(v) => set("to", v)}
              className={`${inputCls} w-full`}
            />
          </div>
        </div>
        {filtered ? (
          <button
            onClick={() => setFilter(emptyBookingFilter)}
            className="inline-flex h-9 items-center justify-center gap-1 rounded-xl px-3 text-xs font-bold text-navy hover:bg-secondary"
          >
            <X className="size-3.5" /> Clear
          </button>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-secondary text-[11px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Reference</th>
              <th className="px-4 py-2.5 font-semibold">Booked</th>
              <th className="px-4 py-2.5 font-semibold">Route</th>
              <th className="px-4 py-2.5 font-semibold">Customer</th>
              <th className="px-4 py-2.5 font-semibold">Total</th>
              <th className="px-4 py-2.5 font-semibold">Source</th>
              <th className="px-4 py-2.5 font-semibold">Status</th>
              <th className="px-4 py-2.5 font-semibold">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-xs text-muted-foreground">
                  {rows.length === 0
                    ? "No bookings yet. Direct and partner-referred checkouts both land here."
                    : "No bookings match these filters."}
                </td>
              </tr>
            ) : (
              shown.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold text-navy">{b.pnr ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(b.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {b.origin} → {b.destination}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {b.lead_name ?? b.guest_email ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-navy">
                    {formatMoney(Number(b.total_price), b.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <SourceBadge source={bookingSource(b)} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onOpen(b.id)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-navy transition hover:border-gold"
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
