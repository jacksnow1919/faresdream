/**
 * Charts for route pages (/flights/$slug). Plain HTML/SVG so they render on the server and
 * stay readable to crawlers: every bar also carries its number as text.
 */
import { DAYS_LONG, MONTHS_LONG, usd, type RouteFareData, type RouteInsights } from "@/lib/route-pages";

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function barTone(i: number, cheap: number, peak: number) {
  if (i === cheap) return "bg-emerald-500";
  if (i === peak) return "bg-rose-500";
  return "bg-primary/70";
}

/** 12 vertical bars, cheapest month green, priciest red. */
export function MonthlyPriceBars({ data, x, title }: { data: RouteFareData; x: RouteInsights; title: string }) {
  const max = Math.max(...data.monthly);
  return (
    <figure>
      <figcaption className="font-display text-lg font-bold text-navy">{title}</figcaption>
      <p className="mt-1 text-sm text-muted-foreground">Average round-trip fare by departure month.</p>
      <div className="mt-5 flex h-56 items-end gap-1.5 sm:gap-2.5" role="list">
        {data.monthly.map((v, i) => (
          <div key={MON[i]} role="listitem" className="flex h-full min-w-0 flex-1 flex-col items-center justify-end">
            <span
              className={`mb-1 whitespace-nowrap text-[10px] font-bold sm:text-xs ${
                i === x.cheapIdx ? "text-emerald-700" : i === x.peakIdx ? "text-rose-700" : "text-navy/70"
              }`}
            >
              {usd(v)}
            </span>
            <span
              className={`w-full rounded-t-md ${barTone(i, x.cheapIdx, x.peakIdx)}`}
              style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
              aria-hidden="true"
            />
            <span className="mt-1.5 text-[10px] font-semibold text-muted-foreground sm:text-xs">{MON[i]}</span>
            <span className="sr-only">
              {MONTHS_LONG[i]}: {usd(v)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-emerald-500" /> Cheapest: {MONTHS_LONG[x.cheapIdx]} {usd(x.cheapPrice)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-rose-500" /> Priciest: {MONTHS_LONG[x.peakIdx]} {usd(x.peakPrice)}
        </span>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-800">
          Save {usd(x.peakPrice - x.cheapPrice)} ({x.monthSavingPct}%) by picking the cheapest month
        </span>
      </div>
    </figure>
  );
}

/** Price vs weeks before departure, as an SVG line with the cheapest week marked. */
export function BookingCurve({ weeks, x }: { weeks: number[]; x: RouteInsights }) {
  const W = 640;
  const H = 200;
  const pad = { l: 44, r: 12, t: 16, b: 28 };
  const min = Math.min(...weeks);
  const max = Math.max(...weeks);
  const span = max - min || 1;
  const px = (i: number) => pad.l + (i / (weeks.length - 1)) * (W - pad.l - pad.r);
  const py = (v: number) => pad.t + (1 - (v - min) / span) * (H - pad.t - pad.b);
  const pts = weeks.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(" ");
  const best = weeks.indexOf(min);
  const area = `${px(0)},${H - pad.b} ${pts} ${px(weeks.length - 1)},${H - pad.b}`;
  return (
    <figure>
      <figcaption className="font-display text-lg font-bold text-navy">When to book</figcaption>
      <p className="mt-1 text-sm text-muted-foreground">
        Average round trip by how many weeks before departure it was booked.
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 h-auto w-full" role="img" aria-label={`Fares were lowest about ${x.book?.weeks} weeks before departure`}>
        <defs>
          <linearGradient id="bc-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((f) => {
          const v = min + f * span;
          return (
            <g key={f}>
              <line x1={pad.l} x2={W - pad.r} y1={py(v)} y2={py(v)} className="stroke-border" strokeDasharray="3 4" />
              <text x={pad.l - 6} y={py(v) + 4} textAnchor="end" className="fill-muted-foreground text-[11px]">
                {usd(v)}
              </text>
            </g>
          );
        })}
        <polygon points={area} fill="url(#bc-fill)" className="text-primary" />
        <polyline points={pts} fill="none" className="stroke-primary" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx={px(best)} cy={py(min)} r="6" className="fill-emerald-500 stroke-white" strokeWidth="2" />
        <text x={px(best)} y={py(min) - 12} textAnchor="middle" className="fill-emerald-700 text-[12px] font-bold">
          {weeks.length - best} wks: {usd(min)}
        </text>
        {[0, Math.floor((weeks.length - 1) / 2), weeks.length - 1].map((i) => (
          <text
            key={i}
            x={px(i)}
            y={H - 8}
            textAnchor={i === 0 ? "start" : i === weeks.length - 1 ? "end" : "middle"}
            className="fill-muted-foreground text-[11px]"
          >
            {weeks.length - i} {weeks.length - i === 1 ? "week" : "weeks"} before
          </text>
        ))}
      </svg>
      {x.book ? (
        <p className="mt-2 text-sm text-foreground/85">
          Booking about <strong>{x.book.weeks} weeks ahead</strong> averaged {usd(x.book.price)}, against{" "}
          {usd(x.book.lastMinute)} in the last week: <strong className="text-emerald-700">{x.book.savingPct}% less</strong>.
        </p>
      ) : null}
    </figure>
  );
}

/** Horizontal bars Mon..Sun. */
export function WeekdayBars({ days, x }: { days: number[]; x: RouteInsights }) {
  const max = Math.max(...days);
  const min = Math.min(...days);
  return (
    <figure>
      <figcaption className="font-display text-lg font-bold text-navy">Cheapest day to fly</figcaption>
      <ul className="mt-4 space-y-2">
        {days.map((v, i) => (
          <li key={DAY[i]} className="flex items-center gap-3 text-sm">
            <span className="w-10 shrink-0 font-semibold text-navy">{DAY[i]}</span>
            <span className="h-6 flex-1 overflow-hidden rounded-full bg-secondary">
              <span
                className={`block h-full rounded-full ${v === min ? "bg-emerald-500" : v === max ? "bg-rose-400" : "bg-primary/60"}`}
                style={{ width: `${Math.max(12, (v / max) * 100)}%` }}
              />
            </span>
            <span className={`w-14 shrink-0 text-right font-bold ${v === min ? "text-emerald-700" : "text-navy"}`}>{usd(v)}</span>
          </li>
        ))}
      </ul>
      {x.day ? (
        <p className="mt-3 text-sm text-foreground/85">
          <strong>{DAYS_LONG[x.day.cheap]}</strong> was the cheapest day to depart; {DAYS_LONG[x.day.peak]} cost the most.
        </p>
      ) : null}
    </figure>
  );
}

/** Airline comparison: typical round trip + on-time %. */
export function AirlineTable({ data }: { data: RouteFareData }) {
  const rows = [...data.cheapestAirlines].sort((a, b) => a.price - b.price);
  const onTime = new Map(data.onTime.map((o) => [o.name, o.pct]));
  const cheapest = rows[0]?.price ?? 0;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-left text-sm">
        <thead>
          <tr className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="rounded-l-lg px-3 py-2.5 font-semibold">Airline</th>
            <th scope="col" className="px-3 py-2.5 font-semibold">Typical round trip</th>
            <th scope="col" className="rounded-r-lg px-3 py-2.5 font-semibold">On time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => {
            const pct = onTime.get(r.name);
            return (
              <tr key={r.name}>
                <th scope="row" className="px-3 py-3 font-semibold text-navy">
                  <span className="inline-flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {r.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                    {r.name}
                    {r.price === cheapest ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800">Cheapest</span>
                    ) : null}
                  </span>
                </th>
                <td className="px-3 py-3 font-bold text-navy">{usd(r.price)}</td>
                <td className="px-3 py-3">
                  {pct ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
                        <span className="block h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                      </span>
                      {Math.round(pct)}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground">n/a</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** % delayed by month, small bars. */
export function DelayBars({ delays, x }: { delays: number[]; x: RouteInsights }) {
  const max = Math.max(...delays);
  return (
    <figure>
      <figcaption className="font-display text-base font-bold text-navy">Delays by month</figcaption>
      <div className="mt-3 flex h-24 items-end gap-1">
        {delays.map((v, i) => (
          <div key={MON[i]} className="flex h-full flex-1 flex-col items-center justify-end" title={`${MONTHS_LONG[i]}: ${v}% delayed`}>
            <span
              className={`w-full rounded-t ${x.delay && i === x.delay.worst ? "bg-rose-400" : x.delay && i === x.delay.best ? "bg-emerald-500" : "bg-navy/25"}`}
              style={{ height: `${Math.max(6, (v / max) * 100)}%` }}
            />
            <span className="mt-1 text-[9px] text-muted-foreground">{MON[i]![0]}</span>
          </div>
        ))}
      </div>
      {x.delay ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Most delays: {MONTHS_LONG[x.delay.worst]} ({x.delay.worstPct}% of flights). Fewest: {MONTHS_LONG[x.delay.best]} (
          {x.delay.bestPct}%).
        </p>
      ) : null}
    </figure>
  );
}

/** Share of flights by time of day. */
export function DepartTimes({ shares }: { shares: number[] }) {
  const labels = ["Morning", "Afternoon", "Evening", "Night"];
  const tones = ["bg-amber-400", "bg-orange-500", "bg-indigo-500", "bg-navy"];
  return (
    <figure>
      <figcaption className="font-display text-base font-bold text-navy">When flights leave</figcaption>
      <div className="mt-3 flex h-4 overflow-hidden rounded-full bg-secondary">
        {shares.map((s, i) => (s > 0 ? <span key={labels[i]} className={tones[i]} style={{ width: `${s}%` }} /> : null))}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-1.5 text-xs">
        {shares.map((s, i) => (
          <li key={labels[i]} className="inline-flex items-center gap-1.5">
            <span className={`size-2.5 rounded-full ${tones[i]}`} /> {labels[i]} <strong className="text-navy">{s}%</strong>
          </li>
        ))}
      </ul>
    </figure>
  );
}
