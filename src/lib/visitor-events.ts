/**
 * The rules for visitor journeys and telling people from scripts. Free of server and React
 * imports so the page, the server and scripts/visitors.test.ts share them.
 */

export const VISITOR_EVENTS = [
  "page_view",
  "search_run",
  "search_result",
  "fare_selected",
  "call_clicked",
  "booking_started",
  "booking_completed",
  "quote_requested",
] as const;
export type VisitorEventType = (typeof VISITOR_EVENTS)[number];

export const VISITOR_EVENT_LABELS: Record<VisitorEventType, string> = {
  page_view: "Viewed a page",
  search_run: "Searched flights",
  search_result: "Saw results",
  fare_selected: "Selected a fare",
  call_clicked: "Clicked to call",
  booking_started: "Started booking",
  booking_completed: "Completed booking",
  quote_requested: "Asked for a quote",
};

const ID_LETTERS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/** A random code with no meaning, built from letters that are hard to misread. */
export function newVisitorCode(bytes: Uint8Array) {
  return [...bytes].map((b) => ID_LETTERS[b % ID_LETTERS.length]).join("");
}

/** Only the real site counts, so local testing and copies never look like customers. */
export const isLiveHost = (hostname: string) => /(^|\.)faresdream\.com$/.test(hostname);

export const isVisitorId = (value: string) => /^V-[A-Z0-9]{6,12}$/.test(value);

/**
 * The path to record, or null for one that shouldn't be tracked. Staff pages stay out, query
 * strings are dropped, and a verification link's private token is never stored.
 */
export function trackablePath(pathname: string): string | null {
  const path = pathname.split(/[?#]/)[0] || "/";
  if (path === "/admin" || path.startsWith("/admin/")) return null;
  if (path.startsWith("/verify/")) return "/verify";
  return path.slice(0, 300);
}

/* ------------------------------- people or scripts ----------------------------- */

const AUTOMATION_UA =
  /headless|phantomjs|puppeteer|playwright|selenium|webdriver|python-requests|python-urllib|aiohttp|httpx|scrapy|go-http-client|^java\/|okhttp|libwww-perl|^curl\/|^wget\/|node-fetch|undici|axios\/|^got\/|httpclient|postmanruntime|^php\/|guzzlehttp|^node$/i;

const CRAWLER_UA =
  /bot\b|bot\/|crawler|spider|crawling|slurp|bingpreview|facebookexternalhit|embedly|lighthouse|pagespeed|gptbot|claudebot|bytespider|ahrefs|semrush|mj12/i;

export type GuardReason = "automation" | "crawler" | "country" | "too_many";

export const GUARD_REASON_LABELS: Record<GuardReason, string> = {
  automation: "Headless browser / script",
  crawler: "Crawler on a no-crawl page",
  country: "Blocked country",
  too_many: "Too many searches from one address",
};

/** Why this user agent shouldn't run a live search, or null for a normal browser. */
export function automatedReason(userAgent: string | null | undefined): GuardReason | null {
  const ua = (userAgent ?? "").trim();
  if (!ua || AUTOMATION_UA.test(ua)) return "automation";
  if (CRAWLER_UA.test(ua)) return "crawler";
  return null;
}

/** Countries from a setting like "CN, RU". Empty means none are blocked. */
export function parseBlockedCountries(setting: string | undefined) {
  return new Set(
    (setting ?? "")
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter((s) => /^[A-Z]{2}$/.test(s)),
  );
}
