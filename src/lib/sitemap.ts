/**
 * One list of every public page, grouped by type, shared by the XML sitemaps and the HTML
 * /sitemap page (the same split ASAP Tickets uses: pages, destinations, airlines, guides).
 * Sign-in, checkout, search results and admin pages never go here (they are noindex).
 */
import { airlines, destinations } from "@/lib/travel-data";
import { guides } from "@/lib/guides";
import { routePages } from "@/lib/route-pages";
import { SITE_URL } from "@/lib/seo";

export type SitemapEntry = { path: string; label: string; lastmod?: string };
export type SitemapGroup = { key: string; title: string; entries: SitemapEntry[] };

export function sitemapGroups(): SitemapGroup[] {
  return [
    {
      key: "pages",
      title: "Flights & company",
      entries: [
        { path: "/", label: "Search cheap flights" },
        { path: "/deals", label: "Flight deals" },
        { path: "/cabin-suites", label: "Business class flights" },
        { path: "/corporate", label: "Corporate travel" },
        { path: "/about", label: "About FaresDream" },
        { path: "/contact", label: "Contact us" },
        { path: "/sitemap", label: "Sitemap" },
        { path: "/privacy", label: "Privacy policy" },
        { path: "/terms", label: "Terms of use" },
        { path: "/refund-policy", label: "Refund & cancellation policy" },
      ],
    },
    {
      key: "destinations",
      title: "Cheap flights to destinations",
      entries: [
        { path: "/destinations", label: "All destinations" },
        ...destinations.map((d) => ({
          path: `/destinations/${d.slug}`,
          label: `Cheap flights to ${d.city}, ${d.country}`,
        })),
      ],
    },
    {
      key: "airlines",
      title: "Airlines",
      entries: [
        { path: "/airlines", label: "All airlines" },
        ...airlines.map((a) => ({ path: `/airlines/${a.slug}`, label: `${a.name} flights` })),
      ],
    },
    {
      key: "routes",
      title: "Flight routes",
      entries: [
        { path: "/flights", label: "All flight routes" },
        ...routePages.map((r) => ({
          path: `/flights/${r.slug}`,
          label: `${r.from.city} (${r.from.code}) to ${r.to.city} (${r.to.code}) flights`,
          lastmod: r.data.checked,
        })),
      ],
    },
    {
      key: "guides",
      title: "Travel guides",
      entries: [
        { path: "/guides", label: "All travel guides" },
        ...guides.map((g) => ({ path: `/guides/${g.slug}`, label: g.title, lastmod: g.updated })),
      ],
    },
  ];
}

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** /sitemap.xml: a sitemap index pointing at one child sitemap per group. */
export function sitemapIndexXml(): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapGroups().map((g) => `  <sitemap><loc>${SITE_URL}/sitemaps/${g.key}.xml</loc></sitemap>`),
    "</sitemapindex>",
    "",
  ].join("\n");
}

/** /sitemaps/<group>.xml, or null for an unknown group. */
export function childSitemapXml(file: string): string | null {
  const group = sitemapGroups().find((g) => `${g.key}.xml` === file);
  if (!group) return null;
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...group.entries.map(
      (e) =>
        `  <url><loc>${escapeXml(SITE_URL + e.path)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}</url>`,
    ),
    "</urlset>",
    "",
  ].join("\n");
}
