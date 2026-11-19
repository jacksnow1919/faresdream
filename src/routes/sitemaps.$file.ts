import { createFileRoute } from "@tanstack/react-router";
import { childSitemapXml } from "@/lib/sitemap";

/** Child sitemaps: /sitemaps/pages.xml, destinations.xml, airlines.xml, guides.xml. */
export const Route = createFileRoute("/sitemaps/$file")({
  server: {
    handlers: {
      GET: ({ params }) => {
        const xml = childSitemapXml(params.file);
        if (!xml) return new Response("Not found", { status: 404 });
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
