import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, FileText, Plane, User, type LucideIcon } from "lucide-react";
import { PageShell } from "@/components/site/ui";

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: "Sitemap | FaresDream Flight Deals" },
      {
        name: "description",
        content:
          "Browse every page on FaresDream — flight search, deals, destinations, airlines, support and policy pages in one place.",
      },
      { property: "og:title", content: "Sitemap | FaresDream" },
      { property: "og:description", content: "All FaresDream pages in one simple index." },
    ],
  }),
  component: SitemapPage,
});

const groups: {
  title: string;
  icon: LucideIcon;
  links: {
    label: string;
    to:
      | "/"
      | "/deals"
      | "/destinations"
      | "/airlines"
      | "/about"
      | "/contact"
      | "/auth"
      | "/dashboard"
      | "/privacy"
      | "/terms"
      | "/refund-policy";
  }[];
}[] = [
  {
    title: "Book flights",
    icon: Plane,
    links: [
      { label: "Search flights", to: "/" },
      { label: "Flight deals", to: "/deals" },
      { label: "Destinations", to: "/destinations" },
      { label: "Airlines", to: "/airlines" },
    ],
  },
  {
    title: "Company",
    icon: Building2,
    links: [
      { label: "About us", to: "/about" },
      { label: "Contact us", to: "/contact" },
    ],
  },
  {
    title: "Your account",
    icon: User,
    links: [
      { label: "Sign in or join", to: "/auth" },
      { label: "My trips", to: "/dashboard" },
    ],
  },
  {
    title: "Legal",
    icon: FileText,
    links: [
      { label: "Privacy policy", to: "/privacy" },
      { label: "Terms of use", to: "/terms" },
      { label: "Refund & cancellation policy", to: "/refund-policy" },
    ],
  },
];

function SitemapPage() {
  return (
    <PageShell title="Sitemap" subtitle="Every FaresDream page in one place.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((g) => (
          <section
            key={g.title}
            className="rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <h2 className="flex items-center gap-3 font-display text-base font-bold text-navy">
              <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <g.icon className="size-4" />
              </span>
              {g.title}
            </h2>
            <ul className="mt-3 divide-y divide-border">
              {g.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="group flex items-center justify-between gap-3 py-2.5 text-sm font-medium text-foreground transition hover:text-primary"
                  >
                    {l.label}
                    <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
