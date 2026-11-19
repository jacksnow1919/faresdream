import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  Clock,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  MapPin,
  Phone,
  Plane,
  PlaneTakeoff,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { PageShell, Card } from "@/components/site/ui";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import {
  AirlineTable,
  BookingCurve,
  DelayBars,
  DepartTimes,
  MonthlyPriceBars,
  WeekdayBars,
} from "@/components/site/RouteVisuals";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";
import {
  DAYS_LONG,
  MONTHS_LONG,
  clockSentence,
  clockText,
  relatedRoutes,
  routeFaqs,
  routeInsights,
  routePageBySlug,
  usd,
} from "@/lib/route-pages";
import { articleLd, breadcrumbLd, faqLd, jsonLdScript } from "@/lib/structured-data";

const longDate = (iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export const Route = createFileRoute("/flights/$slug")({
  loader: ({ params }) => {
    const page = routePageBySlug(params.slug);
    if (!page) throw notFound();
    return { slug: page.slug };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? routePageBySlug(loaderData.slug) : undefined;
    if (!p) return { meta: [{ title: "Route not found" }, { name: "robots", content: "noindex" }] };
    const x = routeInsights(p);
    const path = `/flights/${p.slug}`;
    const title = `${p.from.city} to ${p.to.city} Flights (${p.from.code}–${p.to.code}) from ${usd(x.fromPrice)} | FaresDream`;
    const h1 = `Cheap flights from ${p.from.city} to ${p.to.city}`;
    const description = `${p.from.code} to ${p.to.code} round trips average ${usd(x.avg)}. ${MONTHS_LONG[x.cheapIdx]} is cheapest (${usd(x.cheapPrice)})${x.book ? `; book about ${x.book.weeks} weeks ahead` : ""}. Fare charts, airlines and tips.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:title", content: h1 },
        { property: "og:description", content: description },
        { property: "article:modified_time", content: p.data.checked },
        ...(p.to.photo ? [{ property: "og:image", content: p.to.photo }] : []),
      ],
      scripts: [
        jsonLdScript([
          articleLd({
            headline: h1,
            description,
            path,
            published: p.data.checked,
            updated: p.data.checked,
            author: "FaresDream Travel Desk",
          }),
          breadcrumbLd([
            { name: "Flights", path: "/flights" },
            { name: `${p.from.city} to ${p.to.city}`, path },
          ]),
          faqLd(routeFaqs(p, x)),
        ]),
      ],
    };
  },
  component: RoutePage,
  notFoundComponent: () => (
    <PageShell title="Route not found">
      <Link to="/flights" className="font-semibold text-navy underline">
        See all routes
      </Link>
    </PageShell>
  ),
});

function StatTile({
  icon: Icon,
  label,
  value,
  note,
  tone = "primary",
}: {
  icon: typeof Plane;
  label: string;
  value: string;
  note: string;
  tone?: "primary" | "green" | "gold" | "navy";
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    green: "bg-emerald-50 text-emerald-700",
    gold: "bg-gold/15 text-gold",
    navy: "bg-navy/10 text-navy",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <span className={`grid size-10 place-items-center rounded-xl ${tones[tone]}`}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-display text-xl font-bold text-navy">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

function RoutePage() {
  const { slug } = Route.useLoaderData();
  const p = routePageBySlug(slug)!;
  const x = routeInsights(p);
  const d = p.data;
  const faqs = routeFaqs(p, x);
  const related = relatedRoutes(p).slice(0, 6);
  const searchHref = `/?from=${p.from.code}&to=${p.to.code}`;
  const A = `${p.from.city} (${p.from.code})`;
  const B = `${p.to.city} (${p.to.code})`;

  return (
    <PageShell
      eyebrow={`${p.from.code} → ${p.to.code}`}
      title={`Cheap flights from ${p.from.city} to ${p.to.city}`}
      crumb={`${p.from.city} to ${p.to.city}`}
      photo={p.to.photo}
      parents={[{ label: "Flights", href: "/flights" }]}
      subtitle={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <Wallet className="size-4" aria-hidden="true" /> Round trips from {usd(x.fromPrice)}
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarCheck className="size-4" aria-hidden="true" /> Data checked{" "}
            <time dateTime={d.checked}>{longDate(d.checked)}</time>
          </span>
        </span>
      }
    >
      {/* Boarding-pass route card */}
      <section className="-mt-2 overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-border">
        <div className="grid items-center gap-4 p-5 sm:grid-cols-[1fr_auto_1fr_auto] sm:p-6">
          <div>
            <p className="font-display text-3xl font-bold text-navy">{p.from.code}</p>
            <p className="text-sm font-semibold text-foreground">{p.from.city}</p>
            <p className="text-xs text-muted-foreground">{p.from.name}</p>
          </div>
          <div className="flex flex-col items-center text-muted-foreground">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {d.direct ? d.direct.duration : x.directPerWeek > 0 ? "Nonstop" : "1+ stop"}
            </span>
            <span className="relative my-1 flex w-28 items-center sm:w-40">
              <span className="h-px flex-1 border-t-2 border-dashed border-border" />
              <Plane className="mx-1 size-5 text-gold" aria-hidden="true" />
              <span className="h-px flex-1 border-t-2 border-dashed border-border" />
            </span>
            <span className="text-[11px]">{x.miles.toLocaleString("en-US")} miles</span>
          </div>
          <div className="sm:text-right">
            <p className="font-display text-3xl font-bold text-navy">{p.to.code}</p>
            <p className="text-sm font-semibold text-foreground">{p.to.city}</p>
            <p className="text-xs text-muted-foreground">{p.to.name}</p>
          </div>
          <div className="flex flex-col gap-2 sm:border-l sm:border-border sm:pl-5">
            <Link
              to={searchHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-gold-foreground transition hover:brightness-110"
            >
              <Search className="size-4" aria-hidden="true" /> Search {p.from.code}–{p.to.code}
            </Link>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-navy/20 px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-navy/5"
            >
              <Phone className="size-4" aria-hidden="true" /> {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="min-w-0 space-y-6">
          <section
            aria-label="Quick answer"
            className="relative overflow-hidden rounded-2xl bg-linear-to-br from-navy to-primary p-5 text-white shadow-card sm:p-7"
          >
            <Lightbulb aria-hidden="true" className="absolute -right-4 -top-4 size-28 text-white/10" />
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="size-3.5" aria-hidden="true" /> Quick answer
            </p>
            <p className="relative mt-3 text-base leading-relaxed sm:text-lg">
              A round trip from {A} to {B} typically costs {usd(x.low)}–{usd(x.high)}, about {usd(x.avg)} on average.{" "}
              {MONTHS_LONG[x.cheapIdx]} is the cheapest month ({usd(x.cheapPrice)}) and {MONTHS_LONG[x.peakIdx]} the most
              expensive ({usd(x.peakPrice)}).
              {x.book ? ` Booking about ${x.book.weeks} weeks ahead saved ${x.book.savingPct}% compared with the last week.` : ""}
              {x.day ? ` ${DAYS_LONG[x.day.cheap]} is the cheapest day to fly.` : ""}
            </p>
          </section>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile icon={TrendingDown} tone="green" label="Cheapest month" value={MONTHS_LONG[x.cheapIdx]!} note={`${usd(x.cheapPrice)} round trip`} />
            <StatTile icon={Wallet} label="Typical round trip" value={usd(x.avg)} note={`Range ${usd(x.low)}–${usd(x.high)}`} />
            <StatTile
              icon={CalendarDays}
              tone="gold"
              label="Book ahead"
              value={x.book ? `${x.book.weeks} weeks` : "n/a"}
              note={x.book ? `${x.book.savingPct}% less than last-minute` : "Not enough data"}
            />
            <StatTile
              icon={PlaneTakeoff}
              tone="navy"
              label="Direct flights"
              value={x.directPerWeek > 0 ? `${x.directPerWeek} / week` : "None"}
              note={d.direct ? `${d.direct.airlines}` : x.directPerWeek > 0 ? "Nonstop service" : "Plan for a stop"}
            />
          </div>

          <Card>
            <MonthlyPriceBars data={d} x={x} title={`${p.from.code} to ${p.to.code} flight prices by month`} />
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {d.bookWeeks ? (
              <Card className="md:col-span-2">
                <BookingCurve weeks={d.bookWeeks} x={x} />
              </Card>
            ) : null}
            {d.weekday ? (
              <Card>
                <WeekdayBars days={d.weekday} x={x} />
              </Card>
            ) : null}
            <Card>
              <h2 className="font-display text-lg font-bold text-navy">Route at a glance</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  { icon: MapPin, k: "Distance", v: `${x.miles.toLocaleString("en-US")} miles (straight line)` },
                  { icon: Clock, k: "Flight time", v: d.direct ? `About ${d.direct.duration} nonstop` : "Varies by connection" },
                  { icon: Clock, k: "Time difference", v: clockText(x.clock) },
                  {
                    icon: Plane,
                    k: "Cheapest airline",
                    v: x.cheapestAirline ? `${x.cheapestAirline.name} (${usd(x.cheapestAirline.price)})` : "n/a",
                  },
                  {
                    icon: ShieldCheck,
                    k: "Most punctual",
                    v: x.punctual ? `${x.punctual.name} (${Math.round(x.punctual.pct)}% on time)` : "n/a",
                  },
                ].map((r) => (
                  <div key={r.k} className="flex gap-3 rounded-xl bg-secondary/60 p-3">
                    <r.icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{r.k}</dt>
                      <dd className="font-semibold text-navy">{r.v}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </Card>
          </div>

          <section className="flex flex-col items-start gap-4 rounded-2xl bg-linear-to-r from-gold/15 via-gold/5 to-transparent p-5 ring-1 ring-gold/30 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="font-display text-lg font-bold text-navy">
                Ready to fly {p.from.code} → {p.to.code}?
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Compare airlines in seconds, or call for fares that aren't shown online.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                to={searchHref}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-gold-foreground transition hover:brightness-110"
              >
                <Search className="size-4" aria-hidden="true" /> Search flights
              </Link>
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center gap-2 rounded-full border border-navy/20 bg-card px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-navy/5"
              >
                <Phone className="size-4" aria-hidden="true" /> {PHONE_DISPLAY}
              </a>
            </div>
          </section>

          {d.cheapestAirlines.length ? (
            <Card>
              <h2 className="font-display text-lg font-bold text-navy">
                Airlines flying {p.from.city} to {p.to.city}
              </h2>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">Typical round-trip fare and share of flights on time.</p>
              <AirlineTable data={d} />
            </Card>
          ) : null}

          {d.delayByMonth || d.departTimes ? (
            <Card>
              <h2 className="font-display text-lg font-bold text-navy">Flight times and delays</h2>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                {d.departTimes ? <DepartTimes shares={d.departTimes} /> : null}
                {d.delayByMonth ? <DelayBars delays={d.delayByMonth} x={x} /> : null}
              </div>
            </Card>
          ) : null}

          <Card>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Lightbulb className="size-5" aria-hidden="true" />
              </span>
              <h2 className="font-display text-lg font-bold text-navy">
                Tips for flying {p.from.city} to {p.to.city}
              </h2>
            </div>
            <ul className="mt-4 space-y-2">
              {[...p.tips, clockSentence(p.from.city, p.to.city, x.clock)].map((t) => (
                <li key={t.slice(0, 40)} className="flex gap-2.5 rounded-xl border border-border px-3 py-2.5 text-[15px] leading-relaxed text-foreground/85">
                  <ArrowRight className="mt-1 size-4 shrink-0 text-gold" aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-gold/15 text-gold">
                <HelpCircle className="size-5" aria-hidden="true" />
              </span>
              <h2 className="font-display text-lg font-bold text-navy">
                {p.from.code} to {p.to.code}: frequently asked questions
              </h2>
            </div>
            <div className="mt-3">
              <FaqAccordion items={faqs} initialCount={7} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-navy">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold text-navy">Where this data comes from</h2>
                <p className="text-xs text-muted-foreground">Checked {longDate(d.checked)} by the FaresDream Travel Desk.</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">
              Prices, booking-window, weekday, airline, on-time and delay figures are KAYAK's published averages for this
              route, based on searches over the past 12 months, in US dollars for a round trip. They show typical fares, not
              a quote: today's price for your dates may be higher or lower. Distance and time difference are calculated from
              airport coordinates and time zones.
            </p>
            <a
              href={d.source}
              rel="nofollow noopener"
              target="_blank"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-navy underline underline-offset-2"
            >
              KAYAK: {p.from.city} to {p.to.city} flights <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </Card>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl bg-navy text-white shadow-card">
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Cheapest month</p>
              <p className="font-display text-2xl font-bold">
                {MONTHS_LONG[x.cheapIdx]} · {usd(x.cheapPrice)}
              </p>
              <p className="mt-1 text-sm text-white/80">
                {p.from.code} → {p.to.code} round trip, average.
              </p>
              <Link
                to={searchHref}
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-bold text-gold-foreground transition hover:brightness-110"
              >
                <Search className="size-4" aria-hidden="true" /> Check today's fares
              </Link>
              <a
                href={`tel:${PHONE_TEL}`}
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-bold transition hover:bg-white/20"
              >
                <Phone className="size-4" aria-hidden="true" /> {PHONE_DISPLAY}
              </a>
            </div>
          </div>

          {p.guide ? (
            <Link
              to={p.guide.href}
              className="group block rounded-2xl border border-border bg-card p-4 shadow-card transition hover:border-primary/40"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gold">Travel guide</p>
              <p className="mt-1 font-display font-bold text-navy group-hover:underline">{p.guide.label}</p>
            </Link>
          ) : null}

          {related.length ? (
            <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <p className="font-display font-bold text-navy">Related routes</p>
              <ul className="mt-3 space-y-1.5">
                {related.map((r) => {
                  const rx = routeInsights(r);
                  return (
                    <li key={r.slug}>
                      <Link
                        to="/flights/$slug"
                        params={{ slug: r.slug }}
                        className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-secondary"
                      >
                        <span className="font-medium text-navy">
                          {r.from.city} → {r.to.city}
                        </span>
                        <span className="text-xs text-muted-foreground">from {usd(rx.fromPrice)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link to="/flights" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary">
                All routes <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          ) : null}
        </aside>
      </div>
    </PageShell>
  );
}
