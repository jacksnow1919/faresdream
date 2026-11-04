import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Price } from "@/components/site/CurrencyContext";
import { airlines } from "@/lib/travel-data";
import { PageShell, Card, SectionTitle } from "@/components/site/ui";
import { BedDouble, Briefcase, Sofa, Star } from "lucide-react";

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
    const title = `${a.name} Business Class — Cabin, Baggage & Lounge Guide`;
    const description = `${a.name} business class review: ${a.seat}. Baggage ${a.baggage}. Lounge access at ${a.lounge}. Fares from $${a.fromPrice}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
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
  return (
    <PageShell
      eyebrow={`${a.code} · ${a.rating} ★`}
      title={`${a.name} Business Class`}
      subtitle={a.cabin}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          <Card>
            <SectionTitle>Cabin guide</SectionTitle>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex gap-3">
                <BedDouble className="size-4 shrink-0 text-gold" /> {a.seat}
              </li>
              <li className="flex gap-3">
                <Sofa className="size-4 shrink-0 text-gold" /> {a.lounge}
              </li>
              <li className="flex gap-3">
                <Briefcase className="size-4 shrink-0 text-gold" /> {a.baggage}
              </li>
            </ul>
          </Card>
          <Card>
            <SectionTitle>Baggage policy</SectionTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              Business class passengers receive {a.baggage}. Excess pieces are charged per-piece at
              check-in; sports and instrument equipment can be pre-declared free of charge on most
              long-haul sectors.
            </p>
          </Card>
          <Card>
            <SectionTitle>Business class review</SectionTitle>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-navy">
              <Star className="size-4 text-gold" /> {a.rating} / 5 — verified traveller score
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{a.review}</p>
          </Card>
        </div>

        <Card className="lg:sticky lg:top-40 lg:self-start">
          <SectionTitle>Exclusive deals</SectionTitle>
          <p className="mt-2 text-xs text-muted-foreground">
            Unpublished {a.name} fares, live today.
          </p>
          <p className="mt-3 font-display text-3xl font-semibold text-navy">
            <Price amount={a.fromPrice} />
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
            Search {a.name} fares
          </Link>
          <a
            href="tel:+18885967882"
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-bold text-navy"
          >
            Talk to an expert
          </a>
        </Card>
      </div>
    </PageShell>
  );
}
