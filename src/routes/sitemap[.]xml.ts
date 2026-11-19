import { createFileRoute } from "@tanstack/react-router";
import { sitemapIndexXml } from "@/lib/sitemap";

/** Sitemap index: one child sitemap per page type (see src/lib/sitemap.ts). */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(sitemapIndexXml(), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
