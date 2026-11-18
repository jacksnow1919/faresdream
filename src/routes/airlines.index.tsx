import { createFileRoute, Link } from "@tanstack/react-router";
import { airlines } from "@/lib/travel-data";
import { PageShell, Card, Pill } from "@/components/site/ui";

export const Route = createFileRoute("/airlines/")({
  head: () => ({
    meta: [
      { title: "Business Class Airlines & Cabin Guides | FaresDream" },
      {
        name: "description",
        content:
          "Compare business class cabins, lie-flat seats, baggage policies and lounge access across Emirates, Qatar, Lufthansa, Turkish and Singapore Airlines.",
      },
      { property: "og:title", content: "Business Class Airlines & Cabin Guides" },
      { property: "og:description", content: "Seats, baggage rules and lounges for major international airlines." },
    ],
  }),
  component: AirlinesIndex,
});

function AirlinesIndex() {
  return (
    <PageShell
      eyebrow="Airlines"
      title="Airline Cabin Guides"
      subtitle="Seats, baggage and lounges on major long-haul airlines, and how to compare their fares on your route."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {airlines.map((a) => (
          <Card key={a.slug}>
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-navy text-sm font-bold text-navy-foreground">
                {a.code}
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-semibold text-navy">{a.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  {a.cabin}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{a.review}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill>{a.baggage}</Pill>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Fares change daily</span>
              <Link
                to="/airlines/$slug"
                params={{ slug: a.slug }}
                className="rounded-xl bg-gold px-4 py-2 text-xs font-bold text-gold-foreground"
              >
                View guide
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
