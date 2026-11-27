import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, ShieldCheck, Users, Scale } from "lucide-react";
import { airlines } from "@/lib/travel-data";
import { airlineProfiles } from "@/lib/airline-profiles";
import { airlineFacts } from "@/lib/airline-facts";
import { PageShell, Card } from "@/components/site/ui";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";
import { breadcrumbLd, jsonLdScript } from "@/lib/structured-data";

const TITLE = "Cheap Airline Tickets: Compare Top Airlines from the USA | FaresDream";
const DESCRIPTION =
  "Compare flights on Emirates, Qatar Airways, Lufthansa, Turkish Airlines and Singapore Airlines from the US: cabins, baggage, US airports and where they fly. Free quotes 24/7.";

export const Route = createFileRoute("/airlines/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
    scripts: [jsonLdScript([breadcrumbLd([{ name: "Airlines", path: "/airlines" }])])],
  }),
  component: AirlinesIndex,
});

function AirlinesIndex() {
  const featured = airlines.slice(0, 3);
  return (
    <PageShell
      eyebrow="Airlines"
      title="Top Airline Deals from the USA"
      photo="/hero/sky-960.webp"
      subtitle="Compare major international airlines side by side: cabins, baggage, US airports and where they fly. Then search your route or get a free quote from a 24/7 agent."
      action={
        <a
          href={`tel:${PHONE_TEL}`}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold text-gold-foreground transition hover:brightness-110"
        >
          <Phone className="size-4" /> Call 24/7: {PHONE_DISPLAY}
        </a>
      }
    >
      <h2 className="mb-4 font-display text-xl font-semibold text-navy">Featured airlines</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {featured.map((a) => {
          const p = airlineProfiles[a.slug];
          const f = airlineFacts[a.slug];
          return (
            <Link
              key={a.slug}
              to="/airlines/$slug"
              params={{ slug: a.slug }}
              className="group rounded-2xl bg-navy p-6 text-navy-foreground shadow-sm transition hover:brightness-110"
            >
              <span className="grid size-14 place-items-center rounded-xl bg-white p-1.5">
                {p ? <img src={p.logo} alt="" width={44} height={44} className="size-11" /> : a.code}
              </span>
              <p className="mt-4 font-display text-xl font-semibold">{a.name}</p>
              <p className="mt-1 text-sm text-white/80">{p?.tagline ?? a.review}</p>
              {f ? <p className="mt-3 text-xs text-white/70">Hub: {f.hub} · {f.usAirports.length} US airports</p> : null}
              <span className="mt-4 inline-block rounded-xl bg-gold px-4 py-2 text-xs font-bold text-gold-foreground">
                Show deals
              </span>
            </Link>
          );
        })}
      </div>

      <h2 className="mb-4 mt-10 font-display text-xl font-semibold text-navy">All airlines</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {airlines.map((a) => {
          const p = airlineProfiles[a.slug];
          const f = airlineFacts[a.slug];
          return (
            <Card key={a.slug}>
              <div className="flex items-center gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-border bg-white p-1">
                  {p ? (
                    <img src={p.logo} alt="" width={40} height={40} loading="lazy" className="size-10" />
                  ) : (
                    <span className="text-sm font-bold text-navy">{a.code}</span>
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-semibold text-navy">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{f ? f.alliance : a.code}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground/80">{p?.tagline ?? a.review}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Fares change daily</span>
                <Link
                  to="/airlines/$slug"
                  params={{ slug: a.slug }}
                  className="rounded-xl bg-gold px-4 py-2 text-xs font-bold text-gold-foreground"
                  aria-label={`Show ${a.name} deals`}
                >
                  Show deals
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl font-semibold text-navy">Why book with FaresDream?</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <Scale className="size-6 text-gold" aria-hidden="true" />
            <h3 className="mt-2 font-semibold text-navy">Compare airlines side by side</h3>
            <p className="mt-1 text-sm text-foreground/80">See several airlines on your route before you choose, with baggage and fare rules shown.</p>
          </Card>
          <Card>
            <Users className="size-6 text-gold" aria-hidden="true" />
            <h3 className="mt-2 font-semibold text-navy">Real agents, 24/7</h3>
            <p className="mt-1 text-sm text-foreground/80">Call any time for fares that aren&apos;t shown online, multi-city trips and group bookings.</p>
          </Card>
          <Card>
            <ShieldCheck className="size-6 text-gold" aria-hidden="true" />
            <h3 className="mt-2 font-semibold text-navy">No surprises</h3>
            <p className="mt-1 text-sm text-foreground/80">Bags, changes and refunds are confirmed before you pay.</p>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
