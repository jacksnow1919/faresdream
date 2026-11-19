/** Shared SEO rules: the one public address of every page, and which pages stay out of search. */

export const SITE_URL = "https://www.faresdream.com";

/**
 * Pages that are private, per-visitor or endless (search results, checkout, sign-in, admin).
 * They get `X-Robots-Tag: noindex, follow` and no canonical link.
 */
const NOINDEX_PREFIXES = [
  "/flight/",
  "/auth",
  "/admin",
  "/verify/",
  "/dashboard",
  "/agent",
  "/api/",
];

export function isNoindexPath(pathname: string): boolean {
  const path = pathname.toLowerCase();
  return NOINDEX_PREFIXES.some(
    (prefix) => path === prefix.replace(/\/$/, "") || path.startsWith(prefix),
  );
}

/** The canonical URL for a path: www + https, lower case, no query string, no trailing slash. */
export function canonicalUrl(pathname: string): string {
  let path = pathname.toLowerCase();
  if (path.length > 1) path = path.replace(/\/+$/, "");
  return `${SITE_URL}${path || "/"}`;
}
