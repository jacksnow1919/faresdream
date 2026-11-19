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
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-linear-to-br from-navy to-primary">
                  {g.photo ? (
                    <img
                      src={g.photo.replace("w=1600", "w=640").replace("h=640", "h=360")}
                      alt={g.photoAlt ?? ""}
                      loading="lazy"
                      width={640}
                      height={360}
                      className="size-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : null}
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-navy">
                    {g.table ? `${g.table.rows.length} routes compared` : "Guide"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Updated {g.updated}
                  </span>
                  <h3 className="mt-1.5 font-display text-lg font-bold text-navy">{g.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-foreground/75">{g.description}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-bold text-primary">
                    Read guide <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </PageShell>
  );
}
