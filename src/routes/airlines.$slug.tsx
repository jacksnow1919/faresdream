import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BedDouble, Briefcase, Phone, Plane, Search, Sofa } from "lucide-react";
import { airlines, routes } from "@/lib/travel-data";
import { FlightSearchBar } from "@/components/site/FlightSearchBar";
import { PageShell, Card, SectionTitle } from "@/components/site/ui";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";
import { breadcrumbLd, faqLd, jsonLdScript } from "@/lib/structured-data";
import { airlineFacts } from "@/lib/airline-facts";
import { destinations } from "@/lib/travel-data";
import { airlineProfiles, CABIN_LABEL, type AirlineProfile, type CabinKey } from "@/lib/airline-profiles";
import { AirlineQuoteForm } from "@/components/site/AirlineQuoteForm";

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
  const flownRoutes = routes.filter((r) => r.fares.some((fr) => fr.airline === a.name));
  const others = airlines.filter((o) => o.slug !== a.slug);
  const f = airlineFacts[a.slug];
  const p = airlineProfiles[a.slug];
  const cabinKeys = p ? (Object.keys(CABIN_LABEL) as CabinKey[]).filter((k) => p.cabins[k]) : [];

  return (
    <PageShell
      eyebrow={`${a.code} · ${f ? f.alliance : a.cabin}`}
      title={`Cheap ${a.name} Flights`}
      crumb={a.name}
      parents={[{ label: "Airlines", href: "/airlines" }]}
      photo="/hero/sky-960.webp"
      search={<FlightSearchBar defaults={{ to: f?.hub.match(/\(([A-Z]{3})\)/)?.[1] }} />}
      subtitle={
        <span className="flex flex-wrap items-center gap-3">
          {p ? (
            <span className="grid size-12 place-items-center rounded-xl bg-white p-1.5 shadow">
              <img src={p.logo} alt={`${a.name} logo`} width={40} height={40} className="size-10" />
            </span>
          ) : null}
          <span>
            Compare {a.name} fares from the US with other airlines, or get a free quote from a
            24/7 agent.
          </span>
        </span>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          {f ? <AirlineFactsTop a={a} f={f} /> : null}

          {p && cabinKeys.length > 0 ? <CabinTabs airline={a.name} cabins={p.cabins} keys={cabinKeys} /> : null}

          {p ? <NetworkTabs airline={a.name} network={p.network} /> : null}

          {p ? (
            <section>
              <h2 className="mb-4 font-display text-xl font-semibold text-navy">Fly with {a.name}</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {p.highlights.map((h, i) => {
                  const Icon = [Plane, BedDouble, Sofa][i] ?? Plane;
                  return (
                    <Card key={h.title}>
                      <span className="grid size-10 place-items-center rounded-xl bg-secondary">
                        <Icon className="size-5 text-gold" aria-hidden="true" />
                      </span>
                      <h3 className="mt-3 font-display text-base font-semibold text-navy">{h.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/80">{h.text}</p>
                    </Card>
                  );
                })}
              </div>
            </section>
          ) : null}

          <Card>
            <SectionTitle>{a.name} business class at a glance</SectionTitle>
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

          {p ? (
            <Card>
              <SectionTitle>About {a.name}</SectionTitle>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">{p.about}</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">{a.review}</p>
            </Card>
          ) : null}

          <Card>
            <SectionTitle>Why book {a.name} with FaresDream</SectionTitle>
            <ul className="mt-3 grid gap-3 sm:grid-cols-3">
              <li className="rounded-xl bg-secondary p-4 text-sm">
                <strong className="block text-navy">Compare, don&apos;t guess</strong>
                See {a.name} next to other airlines on your route before you choose.
              </li>
              <li className="rounded-xl bg-secondary p-4 text-sm">
                <strong className="block text-navy">Real people, 24/7</strong>
                Call {PHONE_DISPLAY} any time for fares that aren&apos;t shown online.
              </li>
              <li className="rounded-xl bg-secondary p-4 text-sm">
                <strong className="block text-navy">Fare rules up front</strong>
                Baggage and change rules are confirmed before you pay.
              </li>
            </ul>
          </Card>

          <section>
            <h2 className="mb-4 font-display text-xl font-semibold text-navy">
              {a.name}: common questions
            </h2>
            <FaqAccordion items={faqs} initialCount={faqs.length} />
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-40 lg:self-start">
          <AirlineQuoteForm airline={a.name} />
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
            <Link
              to="/"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-navy underline"
            >
              <Search className="size-4" /> Search all flights
            </Link>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}

/** Cabin tabs: every panel is in the HTML (search engines read all of it); tabs only hide/show. */
function CabinTabs({ airline, cabins, keys }: { airline: string; cabins: Partial<Record<CabinKey, string>>; keys: CabinKey[] }) {
  const [active, setActive] = useState<CabinKey>(keys[0]!);
  return (
    <Card>
      <SectionTitle>{airline} cabins from the US</SectionTitle>
      <div role="tablist" aria-label={`${airline} cabins`} className="mt-4 flex flex-wrap gap-2">
        {keys.map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={active === k}
            onClick={() => setActive(k)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active === k ? "bg-navy text-navy-foreground" : "bg-secondary text-navy hover:bg-secondary/70"
            }`}
          >
            {CABIN_LABEL[k]}
          </button>
        ))}
      </div>
      {keys.map((k) => (
        <div key={k} role="tabpanel" hidden={active !== k} className="mt-4">
          <h3 className="font-display text-base font-semibold text-navy">
            {airline} {CABIN_LABEL[k]}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-foreground/80">{cabins[k]}</p>
        </div>
      ))}
      {!keys.includes("premium") ? (
        <p className="mt-3 text-xs text-muted-foreground">{airline} doesn&apos;t sell Premium Economy on most routes from the US.</p>
      ) : null}
    </Card>
  );
}

/** Destinations by region, ASAP-style. Cities we have a guide for link to it; others go to a quote. */
function NetworkTabs({ airline, network }: { airline: string; network: AirlineProfile["network"] }) {
  const [active, setActive] = useState(network[0]?.region ?? "");
  return (
    <Card>
      <SectionTitle>Where {airline} flies: select a region</SectionTitle>
      <div role="tablist" aria-label="Regions" className="mt-4 flex flex-wrap gap-2">
        {network.map((n) => (
          <button
            key={n.region}
            type="button"
            role="tab"
            aria-selected={active === n.region}
            onClick={() => setActive(n.region)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active === n.region ? "bg-navy text-navy-foreground" : "bg-secondary text-navy hover:bg-secondary/70"
            }`}
          >
            {n.region}
          </button>
        ))}
      </div>
      {network.map((n) => (
        <ul key={n.region} role="tabpanel" hidden={active !== n.region} className="mt-4 grid gap-2 sm:grid-cols-2">
          {n.cities.map((c) => (
            <li key={c.city} className="flex items-center justify-between gap-2 rounded-xl border border-border px-4 py-3 text-sm">
              <span className="flex items-center gap-2 font-semibold text-navy">
                <Plane className="size-4 text-gold" aria-hidden="true" /> {c.city}
              </span>
              {c.slug ? (
                <Link to="/destinations/$slug" params={{ slug: c.slug }} className="text-xs font-semibold text-primary hover:underline">
                  Flights to {c.city}
                </Link>
              ) : (
                <a href={`tel:${PHONE_TEL}`} className="text-xs font-semibold text-primary hover:underline">
                  Check today&apos;s fare
                </a>
              )}
            </li>
          ))}
        </ul>
      ))}
      <p className="mt-3 text-xs text-muted-foreground">
        Selected destinations, usually with one connection from the US. Routes change; your agent
        confirms the schedule before you book.
      </p>
    </Card>
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

    </>
  );
}
