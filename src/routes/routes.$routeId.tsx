import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Price } from "@/components/site/CurrencyContext";
import { routes as routeData } from "@/lib/travel-data";
import { PageShell, Card, SectionTitle } from "@/components/site/ui";
import { Clock, Plane, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/routes/$routeId")({
  loader: ({ params }) => {
    const route = routeData.find((r) => r.id === params.routeId);
    if (!route) throw notFound();
    return { route };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Route not found" }, { name: "robots", content: "noindex" }] };
    }
    const r = loaderData.route;
    const cheapest = Math.min(
      ...r.fares.map((f: { airline: string; price: number; stops: string }) => f.price),
    );
    const title = `${r.label} Business Class from $${cheapest} — Fare Comparison`;
    const description = `${r.label} business class: ${r.duration} on ${r.aircraft}. Live fare comparison and best booking window (${r.bestWindow}).`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: RoutePage,
  notFoundComponent: () => (
    <PageShell title="Route not found">
      <Link to="/" className="font-semibold text-navy underline">
        Back home
      </Link>
    </PageShell>
  ),
});

function RoutePage() {
  const { route: r } = Route.useLoaderData();
  const cheapest = Math.min(
    ...r.fares.map((f: { airline: string; price: number; stops: string }) => f.price),
  );
  return (
    <PageShell
      eyebrow={`${r.origin} → ${r.destination}`}
      title={`${r.label} Business Class`}
      subtitle={`${r.duration} · ${r.aircraft}`}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Card>
            <SectionTitle>Live fare comparison</SectionTitle>
            <ul className="mt-3 divide-y divide-border">
              {r.fares.map((f: { airline: string; price: number; stops: string }) => (
                <li key={f.airline} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy">{f.airline}</p>
                    <p className="text-xs text-muted-foreground">{f.stops}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg font-semibold text-navy">
                      <Price amount={f.price} />
                    </span>
                    <Link
                      to="/flight/fare-details"
                      search={{
                        origin: r.origin,
                        destination: r.destination,
                        departDate: "2026-08-19",
                        airline: f.airline,
                        flightNo: "—",
                        cabin: "Business",
                        currency: "USD",
                        price: String(f.price),
                      }}
                      className="rounded-xl bg-gold px-4 py-2 text-xs font-bold text-gold-foreground"
                    >
                      Select
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                <Clock className="size-3.5" /> Flight duration
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-navy">{r.duration}</p>
            </Card>
            <Card>
              <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                <Plane className="size-3.5" /> Aircraft type
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-navy">{r.aircraft}</p>
            </Card>
          </div>
        </div>
        <Card className="lg:sticky lg:top-40 lg:self-start">
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <TrendingDown className="size-3.5" /> Best booking window
          </p>
          <p className="mt-2 text-sm font-semibold text-navy">{r.bestWindow}</p>
          <p className="mt-4 font-display text-3xl font-semibold text-navy">
            <Price amount={cheapest} />
          </p>
          <Link
            to="/flight/search"
            search={{
              origin: "JFK",
              destination: "MIA",
              date: "",
              passengers: 1,
              cabin: "Business",
            }}
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gold px-5 py-3 text-sm font-bold text-gold-foreground"
          >
            See all options
          </Link>
        </Card>
      </div>
    </PageShell>
  );
}
