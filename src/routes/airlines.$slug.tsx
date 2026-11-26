import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BedDouble, Briefcase, Phone, Plane, Search, Sofa } from "lucide-react";
import { airlines, routes } from "@/lib/travel-data";
import { PageShell, Card, SectionTitle } from "@/components/site/ui";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";
import { breadcrumbLd, faqLd, jsonLdScript } from "@/lib/structured-data";
import { airlineFacts } from "@/lib/airline-facts";
import { destinations } from "@/lib/travel-data";

type Airline = (typeof airlines)[number];

/** Questions answered from this page's own content, so the FAQ never says more than the page. */
function airlineFaqs(a: Airline) {
  return [
    ...(airlineFacts[a.slug]?.extraFaqs ?? []),
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
    const f = airlineFacts[a.slug];
    const title = f
      ? `${a.name} Flights from the USA: Routes, Baggage & Business Class | FaresDream`
      : `${a.name} (${a.code}) Flights – Baggage, Seats & Lounges | FaresDream`;
    const description = f
      ? `${a.name} flies from ${f.usAirports.length} US airports via ${f.hub.split(" (")[0]}. Baggage by fare, business class seat and lounge, and travel tips. Compare fares or call 24/7.`
      : `Compare ${a.name} flights and fares. Business class seat (${a.seat}), baggage allowance (${a.baggage}) and lounges, plus 24/7 phone booking.`;
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
  const faqs = airlineFaqs(a);
  const flownRoutes = routes.filter((r) => r.fares.some((f) => f.airline === a.name));
  const others = airlines.filter((o) => o.slug !== a.slug);
  const f = airlineFacts[a.slug];

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
          {f ? <AirlineFactsTop a={a} f={f} /> : null}
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

          {f ? <AirlineFactsBottom a={a} f={f} /> : null}

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

type Facts = NonNullable<(typeof airlineFacts)[string]>;

function AirlineFactsTop({ a, f }: { a: Airline; f: Facts }) {
  return (
    <>
      <Card>
        <p className="text-base font-medium leading-relaxed text-navy">{f.summary}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-xl bg-secondary p-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hub</dt>
            <dd className="mt-1 text-foreground">{f.hub}</dd>
          </div>
          <div className="rounded-xl bg-secondary p-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Alliance</dt>
            <dd className="mt-1 text-foreground">{f.alliance}</dd>
          </div>
          <div className="rounded-xl bg-secondary p-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">US airports</dt>
            <dd className="mt-1 text-foreground">{f.usAirports.length}</dd>
          </div>
        </dl>
      </Card>

      <Card>
        <SectionTitle>Where {a.name} flies from in the US</SectionTitle>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {f.usAirports.map((u) => (
            <li key={u.code} className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm">
              <Plane className="size-4 shrink-0 text-gold" />
              <span>
                <strong className="text-navy">{u.city}</strong> ({u.code})
                {u.note ? <span className="text-muted-foreground"> · {u.note}</span> : null}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">{f.usNote}</p>
      </Card>

      <Card>
        <SectionTitle>{a.name} baggage allowance from the US</SectionTitle>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3">Fare</th>
                <th className="py-2 pr-3">Checked bags</th>
                <th className="py-2">Cabin bags</th>
              </tr>
            </thead>
            <tbody>
              {f.baggage.map((b) => (
                <tr key={b.fare} className="border-b border-border/60">
                  <td className="py-2 pr-3 font-semibold text-navy">{b.fare}</td>
                  <td className="py-2 pr-3">{b.checked}</td>
                  <td className="py-2">{b.cabin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{f.baggageNote}</p>
      </Card>
    </>
  );
}

function AirlineFactsBottom({ a, f }: { a: Airline; f: Facts }) {
  const dests = f.destinations
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter((d): d is (typeof destinations)[number] => Boolean(d));
  return (
    <>
      <Card>
        <SectionTitle>Tips for flying {a.name} from the US</SectionTitle>
        <ul className="mt-3 space-y-3">
          {f.tips.map((t) => (
            <li key={t.title} className="text-sm leading-relaxed text-foreground/80">
              <strong className="text-navy">{t.title}.</strong> {t.text}
            </li>
          ))}
        </ul>
      </Card>

      {dests.length > 0 ? (
        <Card>
          <SectionTitle>Fares by month to popular {a.name} destinations</SectionTitle>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {dests.map((d) => (
              <li key={d.slug}>
                <Link
                  to="/destinations/$slug"
                  params={{ slug: d.slug }}
                  className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-navy transition hover:border-primary"
                >
                  <Plane className="size-4 text-gold" /> Flights to {d.city}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <Card>
        <SectionTitle>Sources</SectionTitle>
        <p className="mt-2 text-xs text-muted-foreground">
          Checked on {f.checked}. Routes and baggage rules change, so confirm on your fare before you pay.
        </p>
        <ul className="mt-2 space-y-1 text-sm">
          {f.sources.map((src) => (
            <li key={src.url}>
              <a href={src.url} rel="nofollow noopener" target="_blank" className="text-primary hover:underline">
                {src.label}
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
