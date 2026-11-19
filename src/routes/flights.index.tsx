import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Plane, TrendingDown } from "lucide-react";
import { PageShell } from "@/components/site/ui";
import { MONTHS_LONG, routeInsights, routePages, usd } from "@/lib/route-pages";
import { breadcrumbLd, jsonLdScript } from "@/lib/structured-data";

export const Route = createFileRoute("/flights/")({
  head: () => ({
    meta: [
      { title: "Cheap Flight Routes: Prices, Cheapest Months & When to Book | FaresDream" },
      {
        name: "description",
        content:
          "Fare data for popular US and international flight routes: typical round-trip prices, the cheapest month, the best time to book and airlines on each route.",
      },
    ],
    scripts: [jsonLdScript(breadcrumbLd([{ name: "Flights", path: "/flights" }]))],
  }),
  component: FlightsHub,
});

function FlightsHub() {
  const groups = new Map<string, typeof routePages>();
  for (const r of routePages) {
    const k = r.to.city;
    groups.set(k, [...(groups.get(k) ?? []), r]);
  }
  return (
    <PageShell
      eyebrow="Route data"
      title="Cheap flights by route"
      crumb="Flights"
      subtitle="Typical prices, the cheapest month and when to book, for every route we track."
    >
      {[...groups.entries()].map(([city, list]) => (
        <section key={city} className="mb-10">
          <h2 className="font-display text-2xl font-bold text-navy">Flights to {city}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((r) => {
              const x = routeInsights(r);
              const max = Math.max(...r.data.monthly);
              return (
                <Link
                  key={r.slug}
                  to="/flights/$slug"
                  params={{ slug: r.slug }}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-bold text-navy">{r.from.code}</span>
                    <span className="flex flex-1 items-center px-2">
                      <span className="h-px flex-1 border-t-2 border-dashed border-border" />
                      <Plane className="mx-1 size-4 text-gold" aria-hidden="true" />
                      <span className="h-px flex-1 border-t-2 border-dashed border-border" />
                    </span>
                    <span className="font-display text-xl font-bold text-navy">{r.to.code}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {r.from.city} → {r.to.city}
                  </p>
                  <div className="mt-4 flex h-12 items-end gap-0.5" aria-hidden="true">
                    {r.data.monthly.map((v, i) => (
                      <span
                        key={i}
                        className={`flex-1 rounded-t-sm ${i === x.cheapIdx ? "bg-emerald-500" : "bg-primary/30"}`}
                        style={{ height: `${(v / max) * 100}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <TrendingDown className="size-3.5" aria-hidden="true" /> {MONTHS_LONG[x.cheapIdx]} {usd(x.cheapPrice)}
                    </span>
                    <span className="text-right">
                      <span className="block text-[11px] text-muted-foreground">Typical round trip</span>
                      <span className="font-display text-lg font-bold text-navy">{usd(x.avg)}</span>
                    </span>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary">
                    See route data <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </PageShell>
  );
}
