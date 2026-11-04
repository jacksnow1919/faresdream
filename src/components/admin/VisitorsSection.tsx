import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ChevronRight,
  Footprints,
  History,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";
import {
  getVisitorJourney,
  getVisitorPanel,
  type JourneyEvent,
  type VisitorRow,
} from "@/lib/visitors.functions";
import { GUARD_REASON_LABELS, VISITOR_EVENT_LABELS, type GuardReason } from "@/lib/visitor-events";

const PERIODS = [7, 30, 90] as const;
type Days = (typeof PERIODS)[number];

const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Users }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <span className="grid size-8 place-items-center rounded-lg bg-navy text-navy-foreground">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold text-navy">{value.toLocaleString()}</p>
    </div>
  );
}

function eventText(e: JourneyEvent) {
  const d = e.detail ?? {};
  switch (e.event_type) {
    case "page_view":
      return e.path ?? "";
    case "search_run":
      return [e.route, d["date"], d["cabin"]].filter(Boolean).join(" · ");
    case "search_result":
      return `${e.route ?? ""} · ${String(d["fares"] ?? 0)} fares`;
    case "fare_selected":
      return [d["airline"], d["price"] ? `$${String(d["price"])}` : "", d["api"]]
        .filter(Boolean)
        .join(" · ");
    default:
      return e.path ?? "";
  }
}

function Journey({ visitorId }: { visitorId: string }) {
  const fetchJourney = useServerFn(getVisitorJourney);
  const query = useQuery({
    queryKey: ["admin-visitor-journey", visitorId],
    queryFn: () => fetchJourney({ data: { visitorId } }),
  });
  const data = query.data;

  if (query.isPending) {
    return (
      <p className="flex items-center gap-2 px-4 pb-4 text-xs text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" /> Loading journey…
      </p>
    );
  }
  if (query.isError || !data?.ok) {
    return (
      <p className="px-4 pb-4 text-xs text-destructive">
        {data && !data.ok ? data.message : "Couldn't load this visitor's journey."}
      </p>
    );
  }
  return (
    <ol className="space-y-1.5 border-t border-border px-4 py-3">
      {data.events.map((e, i) => (
        <li key={`${e.occurred_at}-${i}`}>
          {i > 0 && data.events[i - 1]?.visit_id !== e.visit_id ? (
            <p className="mb-1.5 mt-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              New visit
            </p>
          ) : null}
          <div className="grid gap-x-3 text-xs sm:grid-cols-[7.5rem_9rem_minmax(0,1fr)]">
            <span className="text-muted-foreground">{when(e.occurred_at)}</span>
            <span className="font-semibold text-navy">{VISITOR_EVENT_LABELS[e.event_type]}</span>
            <span className="break-words text-muted-foreground">{eventText(e)}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

function VisitorItem({ row }: { row: VisitorRow }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="rounded-xl border border-border bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <ChevronRight
          className={`size-4 shrink-0 text-muted-foreground transition ${open ? "rotate-90" : ""}`}
        />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <code className="rounded-md bg-secondary px-2 py-0.5 text-xs font-bold text-navy">
              {row.visitor_id}
            </code>
            <span className="text-xs font-semibold text-navy">
              {row.visits} {Number(row.visits) === 1 ? "visit" : "visits"}
            </span>
            {row.country ? (
              <span className="text-xs text-muted-foreground">{row.country}</span>
            ) : null}
            {row.searched ? (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                Searched
              </span>
            ) : null}
            {row.booked ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                Booked
              </span>
            ) : null}
          </span>
          <span className="mt-1 block text-xs text-muted-foreground">
            First seen {when(row.first_seen)} · Last seen {when(row.last_seen)}
            {row.landing ? ` · Landed on ${row.landing}` : ""}
          </span>
        </span>
      </button>
      {open ? <Journey visitorId={row.visitor_id} /> : null}
    </li>
  );
}

function Tally({ rows }: { rows: { label: string; count: number }[] }) {
  return (
    <ul className="space-y-1.5">
      {rows.map((r) => (
        <li key={r.label} className="flex items-baseline justify-between gap-3 text-sm">
          <span className="text-muted-foreground">{r.label}</span>
          <span className="font-semibold text-navy">{r.count.toLocaleString()}</span>
        </li>
      ))}
    </ul>
  );
}

/** What anonymous visitors did, and what the search guard stopped. Managers and up. */
export function VisitorsSection() {
  const fetchPanel = useServerFn(getVisitorPanel);
  const [days, setDays] = useState<Days>(7);
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");

  const range = useMemo(() => {
    if (date) {
      const start = new Date(`${date}T00:00:00`);
      return { since: start.toISOString(), until: new Date(start.getTime() + 864e5).toISOString() };
    }
    const now = Date.now();
    return {
      since: new Date(now - days * 864e5).toISOString(),
      // A little ahead, so a visit recorded while this is open still counts on Refresh.
      until: new Date(now + 864e5).toISOString(),
    };
  }, [days, date]);

  const term = search.trim();
  const panel = useQuery({
    queryKey: ["admin-visitors", days, date, term],
    queryFn: () => fetchPanel({ data: { ...range, ...(term ? { search: term } : {}) } }),
  });
  const data = panel.data;

  return (
    <section id="visitors" className="mt-6 rounded-2xl border border-border bg-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <h2 className="font-display text-base font-semibold text-navy">Visitors</h2>
          <p className="text-xs text-muted-foreground">
            Each visitor's visits under one ID: where they landed and what they did. No names or
            contact details.
          </p>
        </div>
        <button
          onClick={() => void panel.refetch()}
          disabled={panel.isFetching}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-bold text-navy transition hover:border-gold disabled:opacity-50"
        >
          <RefreshCw className={`size-3.5 ${panel.isFetching ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <span className="sr-only">Find a visitor ID</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              maxLength={14}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Visitor ID, e.g. V-7K3M9QTA"
              className="h-9 w-64 rounded-xl border border-input bg-background pl-9 pr-3 text-sm text-navy outline-none focus:border-gold"
            />
          </label>
          <div className="inline-flex rounded-xl border border-border p-0.5">
            {PERIODS.map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDate("");
                  setDays(d);
                }}
                aria-pressed={!date && days === d}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  !date && days === d ? "bg-navy text-navy-foreground" : "text-navy"
                }`}
              >
                {d} days
              </button>
            ))}
          </div>
          <label className="inline-flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-xs font-bold text-navy">
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-xs font-normal outline-none"
            />
          </label>
        </div>

        {panel.isPending ? (
          <p className="py-6 text-center text-xs text-muted-foreground">Loading visitors…</p>
        ) : panel.isError ? (
          <p className="py-6 text-center text-xs text-destructive">
            Couldn't load visitors. Try Refresh.
          </p>
        ) : data && !data.ok ? (
          <p className="py-6 text-center text-xs text-destructive">{data.message}</p>
        ) : data?.ok ? (
          <>
            {!data.ready ? (
              <p className="mt-3 rounded-lg bg-amber-100 px-3 py-2 text-xs font-medium text-amber-900">
                Visitors need a one-time database update before anything can be recorded.
              </p>
            ) : null}

            <div className="mt-4 rounded-2xl border border-border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    <ShieldCheck className="size-4 text-primary" /> Spam stopped
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold text-navy">
                    {data.guard.total.toLocaleString()}
                  </p>
                </div>
                <p className="max-w-xl text-xs text-muted-foreground">
                  Automated fare searches refused before they could use your flight APIs. These
                  never appear as visitors.
                  {data.guard.last_at ? ` Last one ${when(data.guard.last_at)}.` : ""}
                </p>
              </div>
              {data.guard.total > 0 ? (
                <div className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  <Tally
                    rows={data.guard.by_reason.map((r) => ({
                      label: GUARD_REASON_LABELS[r.value as GuardReason] ?? r.value,
                      count: r.count,
                    }))}
                  />
                  <Tally
                    rows={data.guard.by_country.map((r) => ({ label: r.value, count: r.count }))}
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Stat label="Visitors" value={data.summary.visitors} icon={Users} />
              <Stat label="Returning" value={data.summary.returning} icon={History} />
              <Stat label="Searched" value={data.summary.searched} icon={Search} />
              <Stat label="Booked" value={data.summary.booked} icon={Ticket} />
              <Stat label="Total actions" value={data.summary.actions} icon={Footprints} />
            </div>

            <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-sm font-semibold text-navy">Recent visitors</h3>
              <p className="text-xs text-muted-foreground">
                Showing latest {data.rows.length} of {data.summary.visitors.toLocaleString()}
              </p>
            </div>
            {data.rows.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                {term ? "No visitor matches that ID." : "No visitors in this period yet."}
              </p>
            ) : (
              <ul className="mt-2 max-h-[40rem] space-y-2 overflow-y-auto">
                {data.rows.map((row) => (
                  <VisitorItem key={row.visitor_id} row={row} />
                ))}
              </ul>
            )}
          </>
        ) : null}
      </div>
    </section>
  );
}
