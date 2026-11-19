import { createFileRoute } from "@tanstack/react-router";
import { Building2, BookOpen, Globe2, Plane, type LucideIcon } from "lucide-react";
import { PageShell } from "@/components/site/ui";
import { sitemapGroups } from "@/lib/sitemap";
import { breadcrumbLd, jsonLdScript } from "@/lib/structured-data";

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: "Sitemap: Flights, Destinations, Airlines & Guides | FaresDream" },
      {
        name: "description",
        content:
          "Every FaresDream page in one place: cheap flights by destination, airlines, travel guides, deals and company pages.",
      },
    ],
    scripts: [jsonLdScript(breadcrumbLd([{ name: "Sitemap", path: "/sitemap" }]))],
  }),
  component: SitemapPage,
});

const icons: Record<string, LucideIcon> = {
  pages: Building2,
  destinations: Plane,
  airlines: Globe2,
  guides: BookOpen,
};

function SitemapPage() {
  const groups = sitemapGroups();
  return (
    <PageShell title="Sitemap" subtitle="Every FaresDream page, grouped by type.">
      <nav aria-label="Sitemap sections" className="mb-6 flex flex-wrap gap-2">
        {groups.map((g) => (
          <a
            key={g.key}
            href={`#${g.key}`}
            className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-navy hover:border-primary/40"
          >
            {g.title} ({g.entries.length})
          </a>
        ))}
      </nav>
      <div className="space-y-6">
        {groups.map((g) => {
          const Icon = icons[g.key] ?? Plane;
          return (
            <section
              key={g.key}
              id={g.key}
              className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6"
            >
              <h2 className="flex items-center gap-3 font-display text-lg font-bold text-navy">
                <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                {g.title}
              </h2>
              <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {g.entries.map((e) => (
                  <li key={e.path}>
                    <a href={e.path} className="text-sm font-medium text-foreground/85 hover:text-navy hover:underline">
                      {e.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}
