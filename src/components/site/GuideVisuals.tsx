import { useState } from "react";
import { CalendarDays, CalendarX2, PiggyBank, Sun, TrendingDown, TrendingUp } from "lucide-react";
import type { GuideRouteRow } from "@/lib/guides";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
/** "Los Angeles (LAX) – New York" -> "Los Angeles (LAX)" */
export const routeOrigin = (route: string) => route.split(" – ")[0] ?? route;

/** Short labels for a set of routes: the origin, or the whole route when two share an origin. */
function routeLabels(rows: GuideRouteRow[]): string[] {
  const origins = rows.map((r) => routeOrigin(r.route));
  const unique = new Set(origins).size === origins.length;
  return unique ? origins : rows.map((r) => r.route.replace(/ \([A-Z]{3}\)/g, "").replace(" – ", " → "));
}

type Charted = GuideRouteRow & { monthly: number[] };
const charted = (rows: GuideRouteRow[]): Charted[] =>
  rows.filter((r): r is Charted => Array.isArray(r.monthly) && r.monthly.length === 12);

const argMin = (v: number[]) => v.indexOf(Math.min(...v));
const argMax = (v: number[]) => v.indexOf(Math.max(...v));

/** Most common value and how many times it appears. */
function mode<T>(items: T[]): [T, number] {
  const counts = new Map<T, number>();
  for (const i of items) counts.set(i, (counts.get(i) ?? 0) + 1);
  let best = items[0] as T;
  let n = 0;
  for (const [k, c] of counts) if (c > n) [best, n] = [k, c];
  return [best, n];
}

/** Four headline numbers, all computed from the sourced route rows (nothing typed in by hand). */
export function GuideStatTiles({ rows }: { rows: GuideRouteRow[] }) {
  const data = charted(rows);
  if (data.length === 0) return null;
  const total = data.length;
  const [lowM, lowN] = mode(data.map((r) => argMin(r.monthly)));
  const [highM, highN] = mode(data.map((r) => argMax(r.monthly)));
  const savings = data.map((r) => {
    const lo = Math.min(...r.monthly);
    const hi = Math.max(...r.monthly);
    return { pct: Math.round(((hi - lo) / hi) * 100), route: routeOrigin(r.route) };
  });
  const best = savings.reduce((a, b) => (b.pct > a.pct ? b : a));
  const [day, dayN] = mode(rows.map((r) => r.cheapestDay.split(/[\s(]/)[0] ?? r.cheapestDay));

  const tiles = [
    {
      icon: TrendingDown,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      label: "Cheapest month",
      value: MONTHS_LONG[lowM],
      note: `Lowest on ${lowN} of ${total} routes`,
    },
    {
      icon: TrendingUp,
      tone: "bg-rose-50 text-rose-700 ring-rose-200",
      label: "Most expensive",
      value: MONTHS_LONG[highM],
      note: `Highest on ${highN} of ${total} routes`,
    },
    {
      icon: PiggyBank,
      tone: "bg-amber-50 text-amber-700 ring-amber-200",
      label: "Cheapest vs peak month",
      value: `Up to ${best.pct}% less`,
      note: `From ${best.route}`,
    },
    {
      icon: CalendarDays,
      tone: "bg-sky-50 text-sky-700 ring-sky-200",
      label: "Cheapest day to fly",
      value: day,
      note: `Cheapest on ${dayN} of ${rows.length} routes`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <span className={`grid size-10 place-items-center rounded-xl ring-1 ${t.tone}`}>
            <t.icon className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t.label}
          </p>
          <p className="mt-0.5 font-display text-xl font-bold text-navy sm:text-2xl">{t.value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{t.note}</p>
        </div>
      ))}
    </div>
  );
}

/** Bar chart of the 12 monthly medians for one route at a time, with route tabs. */
export function MonthlyFareChart({ rows, title }: { rows: GuideRouteRow[]; title: string }) {
  const data = charted(rows);
  const [active, setActive] = useState(0);
  if (data.length === 0) return null;
  const labels = routeLabels(data);
  const r = data[Math.min(active, data.length - 1)] as Charted;
  const lo = argMin(r.monthly);
  const hi = argMax(r.monthly);
  const max = Math.max(...r.monthly);

  return (
    <section aria-labelledby="fare-chart" className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="fare-chart" className="font-display text-lg font-bold text-navy">{title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Median round-trip economy fare by month. Pick your departure city.
          </p>
        </div>
      </div>

      <div role="tablist" aria-label="Departure city" className="mt-4 flex flex-wrap gap-2">
        {data.map((d, i) => (
          <button
            key={d.route}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
              i === active
                ? "border-navy bg-navy text-white"
                : "border-border bg-card text-navy hover:border-navy/40"
            }`}
          >
            {labels[i]}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className="rounded-xl bg-emerald-50 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-800">Cheapest</p>
          <p className="font-display text-lg font-bold text-emerald-900">
            {MONTHS_LONG[lo]} · {usd(r.monthly[lo] as number)}
          </p>
        </div>
        <div className="rounded-xl bg-rose-50 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-800">Most expensive</p>
          <p className="font-display text-lg font-bold text-rose-900">
            {MONTHS_LONG[hi]} · {usd(r.monthly[hi] as number)}
          </p>
        </div>
        <div className="col-span-2 rounded-xl bg-secondary px-3 py-2 sm:col-span-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">You save</p>
          <p className="font-display text-lg font-bold text-navy">
            {usd((r.monthly[hi] as number) - (r.monthly[lo] as number))} (
            {Math.round((((r.monthly[hi] as number) - (r.monthly[lo] as number)) / (r.monthly[hi] as number)) * 100)}%)
          </p>
        </div>
      </div>

      <div
        role="img"
        aria-label={`${r.route}: ${r.monthly.map((v, i) => `${MONTHS[i]} ${usd(v)}`).join(", ")}`}
        className="mt-6 flex h-56 items-end gap-1 border-b border-border sm:gap-2"
      >
        {r.monthly.map((v, i) => {
          const tone =
            i === lo ? "bg-emerald-500" : i === hi ? "bg-rose-500" : "bg-sky-300 group-hover:bg-sky-400";
          return (
            <div key={MONTHS[i]} className="group flex h-full flex-1 flex-col justify-end">
              <span
                className={`mb-1 text-center text-[10px] font-semibold sm:text-xs ${
                  i === lo ? "text-emerald-700" : i === hi ? "text-rose-700" : "text-muted-foreground"
                }`}
              >
                {usd(v)}
              </span>
              <div
                className={`w-full rounded-t-md transition-all ${tone}`}
                style={{ height: `${Math.max(8, (v / max) * 82)}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex gap-1 sm:gap-2" aria-hidden="true">
        {MONTHS.map((m) => (
          <span key={m} className="flex-1 text-center text-[10px] font-medium text-muted-foreground sm:text-xs">
            {m}
          </span>
        ))}
      </div>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-emerald-500" /> Cheapest month</span>
        <span className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-rose-500" /> Most expensive month</span>
        <span>Source: KAYAK 12-month medians. Typical, not live, prices.</span>
      </p>
    </section>
  );
}

const heat = (t: number) =>
  t < 0.2
    ? "bg-emerald-200 text-emerald-950"
    : t < 0.4
      ? "bg-emerald-50 text-emerald-900"
      : t < 0.6
        ? "bg-amber-50 text-amber-900"
        : t < 0.8
          ? "bg-orange-100 text-orange-900"
          : "bg-rose-200 text-rose-950";

/** Routes x months heat map: green = cheap for that route, red = expensive. */
export function FareCalendar({ rows, title }: { rows: GuideRouteRow[]; title: string }) {
  const data = charted(rows);
  if (data.length === 0) return null;
  const labels = routeLabels(data);
  return (
    <section aria-labelledby="fare-calendar" className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-6">
      <h2 id="fare-calendar" className="font-display text-lg font-bold text-navy">{title}</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">
        Each row is coloured against itself: green is a cheap month for that route, red an expensive one.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-1 text-center text-xs">
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 bg-card px-2 py-1 text-left font-semibold text-muted-foreground">
                From
              </th>
              {MONTHS.map((m) => (
                <th key={m} scope="col" className="px-1 py-1 font-semibold text-muted-foreground">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((r, ri) => {
              const lo = Math.min(...r.monthly);
              const hi = Math.max(...r.monthly);
              return (
                <tr key={r.route}>
                  <th scope="row" className="sticky left-0 whitespace-nowrap bg-card px-2 py-1 text-left font-semibold text-navy">
                    {labels[ri]}
                  </th>
                  {r.monthly.map((v, i) => (
                    <td
                      key={MONTHS[i]}
                      className={`rounded-md px-1 py-2 font-semibold tabular-nums ${heat(hi === lo ? 0.5 : (v - lo) / (hi - lo))}`}
                    >
                      {usd(v)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground" aria-hidden="true">
        <Sun className="size-3.5" /> Cheaper
        <span className="flex overflow-hidden rounded">
          {["bg-emerald-200", "bg-emerald-50", "bg-amber-50", "bg-orange-100", "bg-rose-200"].map((c) => (
            <i key={c} className={`h-2.5 w-6 ${c}`} />
          ))}
        </span>
        Pricier <CalendarX2 className="size-3.5" />
      </div>
    </section>
  );
}
