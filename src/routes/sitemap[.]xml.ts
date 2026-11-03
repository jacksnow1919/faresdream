import { createFileRoute } from "@tanstack/react-router";
import { airlines, destinations } from "@/lib/travel-data";

const SITE_URL = "https://www.faresdream.com";

/** Public pages for search engines. Sign-in, checkout and search results stay out. */
const PAGES = [
  "/",
  "/deals",
  "/destinations",
  "/airlines",
  "/cabin-suites",
  "/corporate",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/refund-policy",
];

function sitemapXml() {
  const paths = [
    ...PAGES,
    ...destinations.map((d) => `/destinations/${d.slug}`),
    ...airlines.map((a) => `/airlines/${a.slug}`),
  ];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(sitemapXml(), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
