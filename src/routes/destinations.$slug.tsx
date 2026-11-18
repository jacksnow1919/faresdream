import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarDays, Car, MapPin, Phone, PlaneLanding, Search, Sofa } from "lucide-react";
import { destinations, routes } from "@/lib/travel-data";
import { PageShell, Card, SectionTitle } from "@/components/site/ui";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";
import { breadcrumbLd, faqLd, jsonLdScript } from "@/lib/structured-data";

/** "LHR — Heathrow" -> { code: "LHR", name: "Heathrow" } */
function splitAirport(airport: string) {
  const [code = "", name = airport] = airport.split(/\s+[—-]\s+/);
  return { code: code.trim(), name: name.trim() };
}

type Destination = (typeof destinations)[number];

/** Questions answered from this page's own content, so the FAQ never says more than the page. */
function destinationFaqs(d: Destination) {
  const { code, name } = splitAirport(d.airport);
  return [
    {
      q: `Which airport do flights to ${d.city} use?`,
      a: `Most international flights to ${d.city} land at ${name} (${code}). Search with ${code} as your destination to compare fares from your nearest airport.`,
    },
    {
      q: `When is the best time to fly to ${d.city}?`,
      a: d.guide,
    },
    {
      q: `How do I get from ${code} to the city?`,
      a: d.transfer,
    },
    {
      q: `Can I book flights to ${d.city} by phone?`,
      a: `Yes. Call ${PHONE_DISPLAY}, 24 hours a day, 7 days a week. Our agents can check fares that are not shown online and hold seats while you decide.`,
    },
  ];
}

export const Route = createFileRoute("/destinations/$slug")({
  loader: ({ params }) => {
    const destination = destinations.find((d) => d.slug === params.slug);
    if (!destination) throw notFound();
    return { destination };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Destination not found" }, { name: "robots", content: "noindex" }] };
    }
    const d = loaderData.destination;
    const { code } = splitAirport(d.airport);
    const title = `Cheap Flights to ${d.city} (${code}) – Compare Fares | FaresDream`;
    const description = `Compare cheap flights to ${d.city} (${code}). Best time to fly, getting from the airport, lounges, and 24/7 phone help for unpublished fares.`;
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
            { name: "Destinations", path: "/destinations" },
            { name: `Flights to ${d.city}`, path: `/destinations/${d.slug}` },
          ]),
          faqLd(destinationFaqs(d)),
        ]),
      ],
    };
  },
  component: DestinationPage,
  notFoundComponent: () => (
    <PageShell title="Destination not found">
      <Link to="/destinations" className="font-semibold text-navy underline">
        Back to destinations
      </Link>
    </PageShell>
  ),
});

function DestinationPage() {
  const { destination: d } = Route.useLoaderData();
  const { code, name } = splitAirport(d.airport);
  const faqs = destinationFaqs(d);
  const cityRoutes = routes.filter((r) => r.destination === code);
  const others = destinations.filter((o) => o.slug !== d.slug);

  return (
    <PageShell
      eyebrow={`${code} · ${name}`}
      title={`Cheap Flights to ${d.city}`}
      crumb={`Flights to ${d.city}`}
      parents={[{ label: "Destinations", href: "/destinations" }]}
      subtitle={`Compare fares to ${d.city} (${code}) from airlines and travel providers in one search, or call us for fares that aren't published online.`}
      action={
        <Link
          to="/"
          search={{ to: code }}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold text-gold-foreground transition hover:brightness-110"
        >
          <Search className="size-4" /> Search flights to {d.city}
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card>
            <SectionTitle>
              <span className="flex items-center gap-2">
                <CalendarDays className="size-5 text-gold" /> Best time to fly to {d.city}
              </span>
            </SectionTitle>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">{d.guide}</p>
          </Card>

          <Card>
            <SectionTitle>
              <span className="flex items-center gap-2">
                <PlaneLanding className="size-5 text-gold" /> Arriving at {name} ({code})
              </span>
            </SectionTitle>
            <p className="mt-3 flex gap-2 text-sm leading-relaxed text-foreground/80">
              <Car className="mt-0.5 size-4 shrink-0 text-gold" /> {d.transfer}
            </p>
            <h3 className="mt-5 text-sm font-semibold text-navy">Airport lounges</h3>
            <ul className="mt-2 grid gap-2 text-sm text-foreground/80 sm:grid-cols-2">
              {d.lounges.map((l: string) => (
                <li key={l} className="flex gap-2">
                  <Sofa className="size-4 shrink-0 text-gold" /> {l}
                </li>
              ))}
            </ul>
          </Card>

          {cityRoutes.length > 0 ? (
            <Card>
              <SectionTitle>Popular routes to {d.city}</SectionTitle>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {cityRoutes.map((r) => (
                  <li key={r.id}>
                    <Link
                      to="/routes/$routeId"
                      params={{ routeId: r.id }}
                      className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-semibold text-navy transition hover:border-primary"
                    >
                      {r.label}
                      <span className="text-xs font-normal text-muted-foreground">{r.duration}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          <section>
            <h2 className="mb-4 font-display text-xl font-semibold text-navy">
              Flights to {d.city}: common questions
            </h2>
            <FaqAccordion items={faqs} initialCount={faqs.length} />
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-40 lg:self-start">
          <Card>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <MapPin className="size-3.5" /> {d.city} · {code}
            </p>
            <p className="mt-2 text-sm text-foreground/80">
              Fares change many times a day. Search for live prices on your dates.
            </p>
            <Link
              to="/"
              search={{ to: code }}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-gold-foreground transition hover:brightness-110"
            >
              <Search className="size-4" /> Compare fares to {d.city}
            </Link>
            <a
              href={`tel:${PHONE_TEL}`}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold text-navy transition hover:border-primary"
            >
              <Phone className="size-4" /> Call {PHONE_DISPLAY}
            </a>
            <p className="mt-2 text-center text-xs text-muted-foreground">24/7 · unpublished fares by phone</p>
          </Card>

          {others.length > 0 ? (
            <Card>
              <h2 className="text-sm font-semibold text-navy">More destinations</h2>
              <ul className="mt-2 space-y-1 text-sm">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      to="/destinations/$slug"
                      params={{ slug: o.slug }}
                      className="text-primary hover:underline"
                    >
                      Flights to {o.city}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </aside>
      </div>
    </PageShell>
  );
}
