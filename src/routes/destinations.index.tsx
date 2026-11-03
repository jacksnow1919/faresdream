import { createFileRoute, Link } from "@tanstack/react-router";
import { Price } from "@/components/site/CurrencyContext";
import { destinations } from "@/lib/travel-data";
import { PageShell, Card } from "@/components/site/ui";

export const Route = createFileRoute("/destinations/")({
  head: () => ({
    meta: [
      { title: "Luxury Destination Guides | FaresDream" },
      {
        name: "description",
        content:
          "Destination guides for business class travellers: lounge access, airport transfers and the best booking windows for Dubai, London and Singapore.",
      },
      { property: "og:title", content: "Luxury Destination Guides" },
      {
        property: "og:description",
        content: "Lounge maps, transfers and travel guides for premium cabins.",
      },
    ],
  }),
  component: DestinationsIndex,
});

function DestinationsIndex() {
  return (
    <PageShell
      eyebrow="Destinations"
      title="Where luxury travellers are heading"
      subtitle="Travel guides, lounge access and airport transfer intel for every gateway we serve."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((d) => (
          <Card key={d.slug}>
            <p className="font-display text-xl font-semibold text-navy">{d.city}</p>
            <p className="text-xs text-muted-foreground">{d.airport}</p>
            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{d.guide}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-display text-lg font-semibold text-navy">
                from <Price amount={d.fromPrice} />
              </span>
              <Link
                to="/destinations/$slug"
                params={{ slug: d.slug }}
                className="rounded-xl bg-gold px-4 py-2 text-xs font-bold text-gold-foreground"
              >
                Explore
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
