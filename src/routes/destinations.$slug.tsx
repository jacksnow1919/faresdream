import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Price } from "@/components/site/CurrencyContext";
import { destinations } from "@/lib/travel-data";
import { PageShell, Card, SectionTitle } from "@/components/site/ui";
import { Car, MapPin, Sofa } from "lucide-react";

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
    const title = `Business Class to ${d.city} — Travel, Lounge & Transfer Guide`;
    const description = `${d.city} (${d.airport}) guide for business class travellers: lounge access, chauffeur transfers and fares from $${d.fromPrice}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
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
  return (
    <PageShell eyebrow={d.airport} title={`Business Class to ${d.city}`} subtitle={d.guide}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Card>
            <SectionTitle>Travel guide</SectionTitle>
            <p className="mt-2 text-sm text-muted-foreground">{d.guide}</p>
          </Card>
          <Card>
            <SectionTitle>Lounge access</SectionTitle>
            <ul className="mt-2 space-y-2 text-sm">
              {d.lounges.map((l: string) => (
                <li key={l} className="flex gap-2">
                  <Sofa className="size-4 shrink-0 text-gold" /> {l}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <SectionTitle>Airport transfers</SectionTitle>
            <p className="mt-2 flex gap-2 text-sm text-muted-foreground">
              <Car className="size-4 shrink-0 text-gold" /> {d.transfer}
            </p>
          </Card>
        </div>
        <Card className="lg:sticky lg:top-40 lg:self-start">
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <MapPin className="size-3.5" /> Lowest live fare
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-navy">
            <Price amount={d.fromPrice} />
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
            Search fares to {d.city}
          </Link>
        </Card>
      </div>
    </PageShell>
  );
}
