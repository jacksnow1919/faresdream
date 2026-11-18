import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  CalendarDays,
  Lightbulb,
  MapPin,
  Phone,
  Plane,
  PlaneLanding,
  Search,
  TrainFront,
  TrendingDown,
} from "lucide-react";
import { destinations, routes, type Destination } from "@/lib/travel-data";
import { PageShell, Card, SectionTitle } from "@/components/site/ui";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";
import { breadcrumbLd, faqLd, jsonLdScript } from "@/lib/structured-data";

const photoUrl = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${Math.round(w * 0.4)}&q=65`;

/** Questions answered from this page's own content, so the FAQ never says more than the page. */
function destinationFaqs(d: Destination) {
  const main = d.airports[0]!;
  const airportAnswer =
    d.airports.length > 1
      ? `${d.city} has ${d.airports.length} main airports: ${d.airports
          .map((a) => `${a.name} (${a.code})`)
          .join(", ")}. ${main.note}`
      : `${main.name} (${main.code}). ${main.note}`;
  return [
    { q: `Which airport should I fly into for ${d.city}?`, a: airportAnswer },
    { q: `When are flights to ${d.city} cheapest?`, a: d.cheapest },
    { q: `Are there nonstop flights from the US to ${d.city}?`, a: d.fromUs },
    { q: `How do I get from the airport to central ${d.city}?`, a: d.transfer },
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
    const title = `Cheap Flights to ${d.city} (${d.code}) from the USA | FaresDream`;
    const description = `Compare cheap flights to ${d.city}, ${d.country}. Cheapest months, nonstop options from the US, ${d.city} airports and how to get into the city, plus 24/7 phone help.`;
    const meta: { title?: string; name?: string; property?: string; content?: string }[] = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ];
    if (d.photo) meta.push({ property: "og:image", content: photoUrl(d.photo, 1200) });
    return {
      meta,
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
  const faqs = destinationFaqs(d);
  const airportCodes = new Set(d.airports.map((a) => a.code));
  const cityRoutes = routes.filter((r) => airportCodes.has(r.destination));
  const sameRegion = destinations.filter((o) => o.slug !== d.slug && o.region === d.region);
  const others = [...sameRegion, ...destinations.filter((o) => o.slug !== d.slug && o.region !== d.region)].slice(0, 6);

  return (
    <PageShell
      eyebrow={`${d.country} · ${d.code}`}
      title={`Cheap Flights to ${d.city}`}
      crumb={`Flights to ${d.city}`}
      parents={[{ label: "Destinations", href: "/destinations" }]}
      photo={d.photo ? photoUrl(d.photo, 1600) : undefined}
      subtitle={`Compare fares to ${d.city} from airlines and travel providers in one search, or call us 24/7 for fares that aren't published online.`}
      action={
        <Link
          to="/"
          search={{ to: d.code }}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold text-gold-foreground transition hover:brightness-110"
        >
          <Search className="size-4" /> Search flights to {d.city}
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card>
            <p className="text-[15px] leading-relaxed text-foreground/85">{d.intro}</p>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <SectionTitle>
                <span className="flex items-center gap-2">
                  <TrendingDown className="size-5 text-gold" /> Cheapest time to fly
                </span>
              </SectionTitle>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">{d.cheapest}</p>
            </Card>
            <Card>
              <SectionTitle>
                <span className="flex items-center gap-2">
                  <CalendarDays className="size-5 text-gold" /> Best time to visit
                </span>
              </SectionTitle>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">{d.bestTime}</p>
            </Card>
          </div>

          <Card>
            <SectionTitle>
              <span className="flex items-center gap-2">
                <Plane className="size-5 text-gold" /> Flights from the US to {d.city}
              </span>
            </SectionTitle>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">{d.fromUs}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              Airline schedules change; your search shows the flights operating on your dates.
            </p>
          </Card>

          <Card>
            <SectionTitle>
              <span className="flex items-center gap-2">
                <PlaneLanding className="size-5 text-gold" /> {d.city} airports
              </span>
            </SectionTitle>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {d.airports.map((a) => (
                <li key={a.code} className="rounded-xl border border-border p-4">
                  <p className="text-sm font-semibold text-navy">
                    {a.name} <span className="text-muted-foreground">({a.code})</span>
                  </p>
                  <p className="mt-1 text-sm text-foreground/80">{a.note}</p>
                  <Link
                    to="/"
                    search={{ to: a.code }}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    <Search className="size-3.5" /> Flights to {a.code}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mt-5 flex items-center gap-2 text-sm font-semibold text-navy">
              <TrainFront className="size-4 text-gold" /> Getting into the city
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">{d.transfer}</p>
          </Card>

          <Card>
            <SectionTitle>
              <span className="flex items-center gap-2">
                <Lightbulb className="size-5 text-gold" /> Tips for booking flights to {d.city}
              </span>
            </SectionTitle>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/80">
              {d.tips.map((t) => (
                <li key={t}>{t}</li>
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
              <MapPin className="size-3.5" /> {d.city} · {d.code}
            </p>
            <p className="mt-2 text-sm text-foreground/80">
              Fares change many times a day. Search for live prices on your dates.
            </p>
            <Link
              to="/"
              search={{ to: d.code }}
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
                    <Link to="/destinations/$slug" params={{ slug: o.slug }} className="text-primary hover:underline">
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
