import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { destinations } from "@/lib/travel-data";
import { PageShell } from "@/components/site/ui";
import { breadcrumbLd, jsonLdScript } from "@/lib/structured-data";

const photoUrl = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&h=360&q=65`;

export const Route = createFileRoute("/destinations/")({
  head: () => ({
    meta: [
      { title: "Flight Destination Guides: Cheapest Months & Airports | FaresDream" },
      {
        name: "description",
        content:
          "Guides to flying from the US to London, Paris, Dubai, Delhi, Mumbai, Tokyo, Singapore, Cancún and Lagos: cheapest months, nonstop options, airports and transfers.",
      },
      { property: "og:title", content: "Flight Destination Guides | FaresDream" },
      {
        property: "og:description",
        content: "Cheapest months, nonstop options and airport tips for popular destinations from the US.",
      },
    ],
    scripts: [jsonLdScript(breadcrumbLd([{ name: "Destinations", path: "/destinations" }]))],
  }),
  component: DestinationsIndex,
});

function DestinationsIndex() {
  return (
    <PageShell
      eyebrow="Destinations"
      title="Flight guides for popular destinations"
      subtitle="When fares are lowest, which airport to choose, nonstop options from the US and how to get into the city."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((d) => (
          <Link
            key={d.slug}
            to="/destinations/$slug"
            params={{ slug: d.slug }}
            className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-0.5 hover:shadow-lux"
          >
            <div className="relative aspect-[16/9] bg-linear-to-br from-navy to-navy-soft">
              {d.photo ? (
                <img
                  src={photoUrl(d.photo)}
                  alt={`${d.city}, ${d.country}`}
                  loading="lazy"
                  width={640}
                  height={360}
                  className="size-full object-cover"
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center font-display text-4xl font-bold text-white/90">
                  {d.code}
                </span>
              )}
            </div>
            <div className="p-5">
              <p className="font-display text-xl font-semibold text-navy">Flights to {d.city}</p>
              <p className="text-xs text-muted-foreground">
                {d.country} · {d.airports.map((a) => a.code).join(" · ")}
              </p>
              <p className="mt-3 line-clamp-3 text-sm text-foreground/80">{d.cheapest}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Read the guide <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
