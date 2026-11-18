import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { guides } from "@/lib/guides";
import { PageShell } from "@/components/site/ui";
import { breadcrumbLd, jsonLdScript } from "@/lib/structured-data";

export const Route = createFileRoute("/guides/")({
  head: () => ({
    meta: [
      { title: "Flight Travel Guides: When to Book & Fly Cheap | FaresDream" },
      {
        name: "description",
        content:
          "Data-backed flight guides from FaresDream: the cheapest months to fly, how far ahead to book, and route tips for travelers from the USA.",
      },
    ],
    scripts: [jsonLdScript(breadcrumbLd([{ name: "Travel guides", path: "/guides" }]))],
  }),
  component: GuidesIndex,
});

function GuidesIndex() {
  return (
    <PageShell
      title="Travel guides"
      subtitle="When to fly, when to book and how to pay less, using published fare data with sources."
    >
      {(
        [
          ["USA", "Flights within the USA"],
          ["International", "International flights from the USA"],
        ] as const
      ).map(([region, heading]) => (
        <section key={region} className="mb-10">
          <h2 className="mb-4 font-display text-xl font-bold text-navy">{heading}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.filter((g) => g.region === region).map((g) => (
              <Link
                key={g.slug}
                to="/guides/$slug"
                params={{ slug: g.slug }}
                className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition hover:border-primary/40"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Updated {g.updated}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold text-navy">{g.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-foreground/75">{g.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-navy">
                  Read guide <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </PageShell>
  );
}
