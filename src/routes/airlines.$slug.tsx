import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  AlertTriangle,
  Armchair,
  ArrowRight,
  Award,
  BedDouble,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  ExternalLink,
  Headphones,
  Lightbulb,
  Luggage,
  Phone,
  Plane,
  PlaneTakeoff,
  Search,
  ShieldCheck,
  Sofa,
  Sparkles,
  Wallet,
} from "lucide-react";
import { airlines, routes, type Airline } from "@/lib/travel-data";
import { airlineProfiles, type AirlineProfile, type AirlineRouteStatus } from "@/lib/airline-profiles";
import { destinations } from "@/lib/destinations";
import { PageShell, Card, SectionTitle } from "@/components/site/ui";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";
import { breadcrumbLd, faqLd, jsonLdScript } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/seo";

/** Questions answered from this page's own content, so the FAQ never says more than the page. */
function airlineFaqs(a: Airline) {
  return [
    {
      q: `What is the ${a.name} business class baggage allowance?`,
      a: `On most long-haul routes ${a.name} business class includes ${a.baggage}. Allowances can differ by route and fare, so check the fare rules before you pay.`,
    },
    {
      q: `What is the ${a.name} business class seat like?`,
      a: `${a.cabin}: ${a.seat}.`,
    },
    {
      q: `Which lounge can ${a.name} business class passengers use?`,
      a: `${a.lounge}. Access depends on your ticket and route.`,
    },
    {
      q: `Can I book ${a.name} flights by phone?`,
      a: `Yes. Call ${PHONE_DISPLAY}, 24 hours a day, 7 days a week, to compare ${a.name} fares with other airlines on your route, including fares not shown online.`,
    },
  ];
}

export const Route = createFileRoute("/airlines/$slug")({
  loader: ({ params }) => {
    const airline = airlines.find((a) => a.slug === params.slug);
    if (!airline) throw notFound();
    return { airline };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Airline not found" }, { name: "robots", content: "noindex" }] };
    }
    const a = loaderData.airline;
    const p = airlineProfiles[a.slug];
    if (p) {
      const title = `${a.name} Flights from the USA: Nonstop Routes, Baggage & Fares | FaresDream`;
      const description = `${a.name} nonstop routes from New York, Newark and San Francisco to Delhi and Mumbai, which routes are suspended, baggage allowance and fares. Checked ${p.checked}.`;
      return {
        meta: [
          { title },
          { name: "description", content: description },
          { property: "og:title", content: title },
          { property: "og:description", content: description },
        ],
        scripts: [
          jsonLdScript([
            breadcrumbLd([
              { name: "Airlines", path: "/airlines" },
              { name: a.name, path: `/airlines/${a.slug}` },
            ]),
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              url: `${SITE_URL}/airlines/${a.slug}`,
              name: title,
              dateModified: p.checked,
              about: { "@type": "Airline", name: a.name, iataCode: a.code },
            },
            faqLd(p.faqs),
          ]),
        ],
      };
    }
    const title = `${a.name} (${a.code}) Flights – Baggage, Seats & Lounges | FaresDream`;
    const description = `Compare ${a.name} flights and fares. Business class seat (${a.seat}), baggage allowance (${a.baggage}) and lounges, plus 24/7 phone booking.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
      scripts: [
        jsonLdScript([
          breadcrumbLd([
            { name: "Airlines", path: "/airlines" },
            { name: a.name, path: `/airlines/${a.slug}` },
          ]),
          faqLd(airlineFaqs(a)),
        ]),
      ],
    };
  },
  component: AirlinePage,
  notFoundComponent: () => (
    <PageShell title="Airline not found" subtitle="We could not find that carrier.">
      <Link to="/airlines" className="font-semibold text-navy underline">
        Back to all airlines
      </Link>
    </PageShell>
  ),
});

function AirlinePage() {
  const { airline: a } = Route.useLoaderData();
  const profile = airlineProfiles[a.slug];
  if (profile) return <RichAirlinePage a={a} p={profile} />;
  const faqs = airlineFaqs(a);
  const flownRoutes = routes.filter((r) => r.fares.some((f) => f.airline === a.name));
  const others = airlines.filter((o) => o.slug !== a.slug);

  return (
    <PageShell
      eyebrow={`${a.code} · ${a.cabin}`}
      title={`${a.name} Flights & Business Class Guide`}
      crumb={a.name}
      parents={[{ label: "Airlines", href: "/airlines" }]}
      subtitle={`Seats, baggage and lounges on ${a.name}, and how to compare its fares with other airlines on your route.`}
      action={
        <a
          href={`tel:${PHONE_TEL}`}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold text-gold-foreground transition hover:brightness-110"
        >
          <Phone className="size-4" /> Call for {a.name} fares
        </a>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card>
            <SectionTitle>Business class at a glance</SectionTitle>
            <dl className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-secondary p-4">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <BedDouble className="size-4 text-gold" /> Seat
                </dt>
                <dd className="mt-1 text-sm text-foreground">{a.seat}</dd>
              </div>
              <div className="rounded-xl bg-secondary p-4">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Briefcase className="size-4 text-gold" /> Baggage
                </dt>
                <dd className="mt-1 text-sm text-foreground">{a.baggage}</dd>
              </div>
              <div className="rounded-xl bg-secondary p-4">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Sofa className="size-4 text-gold" /> Lounge
                </dt>
                <dd className="mt-1 text-sm text-foreground">{a.lounge}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              Typical long-haul business class. Allowances and aircraft vary by route and fare; your
              fare rules are confirmed before you pay.
            </p>
          </Card>

          <Card>
            <SectionTitle>Our take</SectionTitle>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">{a.review}</p>
          </Card>

          {flownRoutes.length > 0 ? (
            <Card>
              <SectionTitle>Popular routes with {a.name}</SectionTitle>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {flownRoutes.map((r) => (
                  <li key={r.id}>
                    <Link
                      to="/routes/$routeId"
                      params={{ routeId: r.id }}
                      className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-navy transition hover:border-primary"
                    >
                      <Plane className="size-4 text-gold" /> {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          <section>
            <h2 className="mb-4 font-display text-xl font-semibold text-navy">
              {a.name}: common questions
            </h2>
            <FaqAccordion items={faqs} initialCount={faqs.length} />
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-40 lg:self-start">
          <Card>
            <h2 className="text-sm font-semibold text-navy">Compare {a.name} fares</h2>
            <p className="mt-2 text-sm text-foreground/80">
              Search your route to see {a.name} next to other airlines, or call for fares that
              aren&apos;t published online.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-gold-foreground transition hover:brightness-110"
            >
              <Search className="size-4" /> Search flights
            </Link>
            <a
              href={`tel:${PHONE_TEL}`}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold text-navy transition hover:border-primary"
            >
              <Phone className="size-4" /> {PHONE_DISPLAY}
            </a>
            <p className="mt-2 text-center text-xs text-muted-foreground">Agents available 24/7</p>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-navy">Other airlines</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link to="/airlines/$slug" params={{ slug: o.slug }} className="text-primary hover:underline">
                    {o.name} ({o.code})
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}

const photoUrl = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&h=360&q=65`;
const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

function StatusBadge({ status }: { status: AirlineRouteStatus }) {
  const map = {
    operating: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    suspended: "bg-amber-50 text-amber-800 ring-amber-600/20",
    ended: "bg-slate-100 text-slate-600 ring-slate-500/20",
  } as const;
  const label = { operating: "Flying", suspended: "Suspended", ended: "Ended" }[status];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${map[status]}`}>{label}</span>
  );
}

function RichAirlinePage({ a, p }: { a: Airline; p: AirlineProfile }) {
  const operating = p.usRoutes.filter((r) => r.status === "operating");
  const notFlying = p.usRoutes.filter((r) => r.status !== "operating");
  const fares = p.usRoutes.flatMap((r) => (r.fare ? [r.fare.price] : []));
  const fromPrice = fares.length ? Math.min(...fares) : undefined;
  const related = airlines.filter((o) => p.related.includes(o.slug));
  const dests = destinations.filter((d) => p.destinations.includes(d.slug));

  return (
    <PageShell
      eyebrow={`${a.code} · Star Alliance`}
      title={`${a.name} flights from the USA`}
      crumb={a.name}
      parents={[{ label: "Airlines", href: "/airlines" }]}
      subtitle={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {fromPrice ? (
            <span className="inline-flex items-center gap-1.5">
              <Wallet className="size-4" aria-hidden="true" /> Round trips from {usd(fromPrice)}
            </span>
          ) : null}
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <PlaneTakeoff className="size-4" aria-hidden="true" /> {operating.length} US routes flying
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarCheck className="size-4" aria-hidden="true" /> Checked <time dateTime={p.checked}>{longDate(p.checked)}</time>
          </span>
        </span>
      }
      action={
        <div className="flex flex-wrap gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold text-gold-foreground transition hover:brightness-110"
          >
            <Search className="size-4" aria-hidden="true" /> Compare {a.name} fares
          </Link>
          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/30 transition hover:bg-white/25"
          >
            <Phone className="size-4" aria-hidden="true" /> {PHONE_DISPLAY}
          </a>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="min-w-0 space-y-6">
          <section
            aria-label="Quick answer"
            className="relative overflow-hidden rounded-2xl bg-linear-to-br from-navy to-primary p-5 text-white shadow-card sm:p-7"
          >
            <Lightbulb aria-hidden="true" className="absolute -right-4 -top-4 size-28 text-white/10" />
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="size-3.5" aria-hidden="true" /> Quick answer
            </p>
            <p className="relative mt-3 text-base leading-relaxed sm:text-lg">{p.quickAnswer}</p>
          </section>

          <Card>
            <h2 className="font-display text-xl font-semibold text-navy">{a.name} at a glance</h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {p.facts.map((f) => (
                <div key={f.label} className="rounded-xl bg-secondary p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{f.label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <h2 className="font-display text-xl font-semibold text-navy">{a.name} routes between the USA and India</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Status on {longDate(p.checked)}. Schedules change often; we confirm your flight before you pay.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th scope="col" className="py-2 pr-3 font-semibold">Route</th>
                    <th scope="col" className="py-2 pr-3 font-semibold">Flights</th>
                    <th scope="col" className="py-2 pr-3 font-semibold">Per week</th>
                    <th scope="col" className="py-2 pr-3 font-semibold">Aircraft</th>
                    <th scope="col" className="py-2 pr-3 font-semibold">Flight time</th>
                    <th scope="col" className="py-2 font-semibold">From</th>
                  </tr>
                </thead>
                <tbody>
                  {operating.map((r) => (
                    <tr key={r.from.code + r.to.code} className="border-b border-border/60 align-top">
                      <td className="py-3 pr-3">
                        <p className="font-semibold text-navy">
                          {r.from.code} ⇄ {r.to.code}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {r.from.city} – {r.to.city}
                        </p>
                        <p className="mt-1 text-xs text-foreground/70">{r.note}</p>
                      </td>
                      <td className="py-3 pr-3 whitespace-nowrap">{r.flights}</td>
                      <td className="py-3 pr-3">{r.perWeek}</td>
                      <td className="py-3 pr-3">{r.aircraft}</td>
                      <td className="py-3 pr-3 text-xs">
                        To India {r.timeEast}
                        <br />
                        To USA {r.timeWest}
                      </td>
                      <td className="py-3">
                        {r.fare ? (
                          <span className="font-display text-base font-bold text-navy">{usd(r.fare.price)}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Call for fares</span>
                        )}
                        {r.routeSlug ? (
                          <Link
                            to="/flights/$slug"
                            params={{ slug: r.routeSlug }}
                            className="mt-1 flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                          >
                            Route prices <ArrowRight className="size-3" aria-hidden="true" />
                          </Link>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {notFlying.length ? (
              <div className="mt-4 rounded-xl bg-amber-50/60 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
                  <AlertTriangle className="size-4" aria-hidden="true" /> Not flying right now
                </p>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {notFlying.map((r) => (
                    <li key={r.from.code + r.to.code} className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={r.status} />
                      <span className="font-semibold text-navy">
                        {r.from.city} ({r.from.code}) – {r.to.city}
                      </span>
                      <span className="text-foreground/70">{r.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <p className="mt-3 text-xs text-muted-foreground">
              Fares: cheapest {a.name} round trip on KAYAK in the past 12 months (USD). Times are approximate block times.
            </p>
          </Card>

          <Card>
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-navy">
              <Luggage className="size-5 text-gold" aria-hidden="true" /> {a.name} baggage allowance (USA routes)
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {p.baggage.map((b) => (
                <div key={b.cabin} className="rounded-xl border border-border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{b.cabin}</p>
                  <p className="mt-1 font-display text-lg font-bold text-navy">{b.checked}</p>
                  {b.note ? <p className="mt-1 text-xs text-foreground/70">{b.note}</p> : null}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Checked bags only. Confirm on{" "}
              <a href={p.baggageSource} rel="nofollow noopener" target="_blank" className="text-primary underline">
                Air India&apos;s baggage page
              </a>{" "}
              before you fly.
            </p>
          </Card>

          <Card>
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-navy">
              <Armchair className="size-5 text-gold" aria-hidden="true" /> Which plane you&apos;ll fly
            </h2>
            <div className="mt-4 space-y-3">
              {p.cabins.map((c) => (
                <div key={c.name} className="rounded-xl bg-secondary p-4">
                  <p className="font-semibold text-navy">{c.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/80">{c.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <Award className="size-4 text-gold" aria-hidden="true" /> Miles and loyalty
                </p>
                <p className="mt-1 text-sm text-foreground/80">{p.loyalty}</p>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <Plane className="size-4 text-gold" aria-hidden="true" /> Connecting from other US cities
                </p>
                <p className="mt-1 text-sm text-foreground/80">{p.partners}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-navy">
              <Lightbulb className="size-5 text-gold" aria-hidden="true" /> Tips for booking {a.name}
            </h2>
            <ul className="mt-3 space-y-2">
              {p.tips.map((t) => (
                <li key={t} className="flex gap-2 text-sm leading-relaxed text-foreground/80">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" /> {t}
                </li>
              ))}
            </ul>
          </Card>

          <section className="rounded-2xl bg-navy p-5 text-white shadow-card sm:p-7">
            <h2 className="font-display text-xl font-semibold">How our agents help with {a.name} bookings</h2>
            <ul className="mt-3 grid gap-2 text-sm text-white/85 sm:grid-cols-2">
              <li className="flex gap-2"><Headphones className="size-4 shrink-0 text-gold" aria-hidden="true" /> Compare {a.name} with one-stop options on other airlines</li>
              <li className="flex gap-2"><ShieldCheck className="size-4 shrink-0 text-gold" aria-hidden="true" /> Check the aircraft and baggage on your date before you pay</li>
              <li className="flex gap-2"><Plane className="size-4 shrink-0 text-gold" aria-hidden="true" /> Book a connection from your home airport on one ticket</li>
              <li className="flex gap-2"><Phone className="size-4 shrink-0 text-gold" aria-hidden="true" /> Available 24 hours a day, 7 days a week</li>
            </ul>
            <a
              href={`tel:${PHONE_TEL}`}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold text-gold-foreground transition hover:brightness-110"
            >
              <Phone className="size-4" aria-hidden="true" /> Call {PHONE_DISPLAY}
            </a>
          </section>

          <section>
            <h2 className="mb-4 font-display text-xl font-semibold text-navy">{a.name}: common questions</h2>
            <FaqAccordion items={p.faqs} initialCount={p.faqs.length} />
          </section>

          <Card>
            <h2 className="text-sm font-semibold text-navy">Sources</h2>
            <ul className="mt-2 space-y-1 text-xs">
              {p.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} rel="nofollow noopener" target="_blank" className="inline-flex items-center gap-1 text-primary hover:underline">
                    {s.label} <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              Last checked {longDate(p.checked)}. FaresDream is an independent travel agency, not {a.name}.
            </p>
          </Card>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-40 lg:self-start">
          {dests.length ? (
            <Card>
              <h2 className="text-sm font-semibold text-navy">Where {a.name} flies from the USA</h2>
              <div className="mt-3 space-y-3">
                {dests.map((d) => (
                  <Link
                    key={d.slug}
                    to="/destinations/$slug"
                    params={{ slug: d.slug }}
                    className="group block overflow-hidden rounded-xl border border-border transition hover:border-primary"
                  >
                    {d.photo ? (
                      <img src={photoUrl(d.photo)} alt="" loading="lazy" className="h-24 w-full object-cover" />
                    ) : null}
                    <p className="px-3 py-2 text-sm font-semibold text-navy group-hover:text-primary">
                      Flights to {d.city} guide
                    </p>
                  </Link>
                ))}
              </div>
            </Card>
          ) : null}
          <Card>
            <h2 className="text-sm font-semibold text-navy">Compare with other airlines</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {related.map((o) => (
                <li key={o.slug}>
                  <Link to="/airlines/$slug" params={{ slug: o.slug }} className="text-primary hover:underline">
                    {o.name} ({o.code})
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="text-sm font-semibold text-navy">Guides</h2>
            <Link
              to="/guides/$slug"
              params={{ slug: "cheapest-time-to-fly-to-india-from-usa" }}
              className="mt-2 block text-sm text-primary hover:underline"
            >
              Cheapest time to fly to India from the USA
            </Link>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}
