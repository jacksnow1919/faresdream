/**
 * The flight APIs the site searches, and the rules around them. Kept free of server and
 * React imports so the results page, the server and scripts/flight-providers.test.ts all
 * share the same logic.
 */
import type { FareJourney, FareSegment, PkfareNormalisedFare } from "./pkfare-types";

export const PROVIDER_KEYS = ["pkfare", "duffel", "mcontent"] as const;
export type ProviderKey = (typeof PROVIDER_KEYS)[number];

export const PROVIDERS: Record<ProviderKey, { label: string; envNames: string[] }> = {
  pkfare: { label: "PKFARE", envNames: ["PKFARE_PARTNER_ID", "PKFARE_PARTNER_KEY"] },
  duffel: { label: "Duffel", envNames: ["DUFFEL_ACCESS_TOKEN"] },
  mcontent: { label: "mcontent", envNames: ["MCONTENT_SITE_ID", "MCONTENT_SOURCE"] },
};

export const providerLabel = (key: string | null | undefined) =>
  key ? (PROVIDERS[key as ProviderKey]?.label ?? key) : "";

/** Prices are only comparable in one currency, and checkout charges in this one. */
export const LIST_CURRENCY = "USD";

/** What one API said to one search. Never carries the API's own error text to the browser. */
export type ProviderStatus = "ok" | "paused" | "not_configured" | "error";
export type ProviderAnswer = {
  provider: ProviderKey;
  status: ProviderStatus;
  fares: PkfareNormalisedFare[];
};

/* ----------------------------------- errors -------------------------------- */

/** A customer-safe message, plus the API's own words for the admin panel. */
export const providerError = (message: string, providerMessage: string) =>
  Object.assign(new Error(message), { providerMessage });

export function providerErrorText(error: unknown): string {
  const own = (error as { providerMessage?: unknown } | null)?.providerMessage;
  const text = typeof own === "string" && own ? own : error instanceof Error ? error.message : "";
  return (text || "Unknown error").slice(0, 300);
}

/* ------------------------------- pause and resume ---------------------------- */

export type ProviderSwitch = {
  paused: boolean;
  /** Set when the pause ends by itself; null means until someone resumes it. */
  paused_until: string | null;
  paused_at: string | null;
  paused_by: string | null;
  reason: string | null;
};

export function isPausedNow(sw: ProviderSwitch | null | undefined, now = Date.now()) {
  if (!sw?.paused) return false;
  if (!sw.paused_until) return true;
  return Date.parse(sw.paused_until) > now;
}

export const PAUSE_OPTIONS: { minutes: 60 | 360 | 1440 | null; label: string }[] = [
  { minutes: null, label: "Until I resume" },
  { minutes: 60, label: "1 hour" },
  { minutes: 360, label: "6 hours" },
  { minutes: 1440, label: "24 hours" },
];

/* ------------------------------- airline details ----------------------------- */

export type AirlineLookup = Record<string, { name: string; logo?: string }>;

function segmentDetails(s: FareSegment, airlines: AirlineLookup): FareSegment {
  const info = airlines[s.carrierCode.toUpperCase()];
  if (!info) return s;
  return {
    ...s,
    carrierName: s.carrierName ?? info.name,
    ...(!s.logoUrl && info.logo ? { logoUrl: info.logo } : {}),
  };
}

/** Some APIs send only airline codes; fills in the name and logo where they're missing. */
export function withAirlineDetails(
  f: PkfareNormalisedFare,
  airlines: AirlineLookup,
): PkfareNormalisedFare {
  const info = airlines[f.carrierCode.toUpperCase()];
  const named = !f.airline || f.airline.toUpperCase() === f.carrierCode.toUpperCase();
  return {
    ...f,
    ...(info && named ? { airline: info.name } : {}),
    ...(!f.logoUrl && info?.logo ? { logoUrl: info.logo } : {}),
    ...(f.segments ? { segments: f.segments.map((s) => segmentDetails(s, airlines)) } : {}),
    ...(f.inbound
      ? {
          inbound: {
            ...f.inbound,
            segments: f.inbound.segments.map((s) => segmentDetails(s, airlines)),
          },
        }
      : {}),
  };
}

/* ------------------------------- merging results ----------------------------- */

const legKey = (
  j: Pick<
    FareJourney,
    "origin" | "departDate" | "departTime" | "destination" | "arriveTime" | "stops"
  >,
) => [j.origin, j.departDate, j.departTime, j.destination, j.arriveTime, j.stops].join("|");

/**
 * What makes two quotes the same trip. The flight number is left out on purpose: one plane
 * is sold under several numbers (codeshares), so APIs disagree on it. A fare without times
 * can't be compared, so it stays on its own.
 */
export function tripKey(f: PkfareNormalisedFare) {
  if (!f.departTime || !f.arriveTime) return `id:${f.id}`;
  return `${legKey(f)}#${f.inbound ? legKey(f.inbound) : ""}`;
}

const flightDigits = (flightNo: string) => {
  const m = /(\d+)[A-Z]?$/.exec(flightNo.trim().toUpperCase());
  return m ? Number(m[1]) : Number.MAX_SAFE_INTEGER;
};

/**
 * Cheapest first, one card per trip. When APIs sell the same trip the cheaper quote stays.
 * On a tie the API listed first stays; within one API the lower flight number stays, which
 * is usually the operating airline's own number rather than a codeshare's.
 */
export function mergeFares(...sources: PkfareNormalisedFare[][]) {
  const byTrip = new Map<string, PkfareNormalisedFare>();
  let duplicates = 0;
  for (const fare of sources.flat()) {
    const key = tripKey(fare);
    const seen = byTrip.get(key);
    if (seen) duplicates++;
    if (
      !seen ||
      fare.price < seen.price ||
      (fare.price === seen.price &&
        fare.provider === seen.provider &&
        flightDigits(fare.flightNo) < flightDigits(seen.flightNo))
    ) {
      byTrip.set(key, fare);
    }
  }
  return { fares: [...byTrip.values()].sort((a, b) => a.price - b.price), duplicates };
}

/* ------------------------------- the admin panel ----------------------------- */

export type ProviderHealth = "no_key" | "paused" | "failing" | "idle" | "working";

export function providerHealth(p: {
  configured: boolean;
  paused: boolean;
  lookups: number;
  lastFaresAt: string | null;
  lastErrorAt: string | null;
}): ProviderHealth {
  if (!p.configured) return "no_key";
  if (p.paused) return "paused";
  if (p.lookups === 0) return "idle";
  // Failing until it next returns fares, so one old error doesn't flag a healthy API.
  if (p.lastErrorAt && (!p.lastFaresAt || p.lastErrorAt > p.lastFaresAt)) return "failing";
  return "working";
}

export type SearchLogRow = {
  created_at: string;
  search_id: string;
  provider: string;
  origin: string;
  destination: string;
  depart_date: string;
  return_date: string | null;
  cabin: string | null;
  adults: number;
  status: string;
  fares: number;
  ms: number;
  message: string | null;
};

export type SearchSummary = {
  id: string;
  at: string;
  origin: string;
  destination: string;
  departDate: string;
  returnDate: string | null;
  cabin: string | null;
  adults: number;
  answers: Partial<
    Record<ProviderKey, { status: string; fares: number; ms: number; message: string | null }>
  >;
};

/** One row per search, newest first, from the one-row-per-API log. */
export function groupSearches(rows: SearchLogRow[], limit = 40): SearchSummary[] {
  const byId = new Map<string, SearchSummary>();
  for (const r of rows) {
    let s = byId.get(r.search_id);
    if (!s) {
      s = {
        id: r.search_id,
        at: r.created_at,
        origin: r.origin,
        destination: r.destination,
        departDate: r.depart_date,
        returnDate: r.return_date,
        cabin: r.cabin,
        adults: r.adults,
        answers: {},
      };
      byId.set(r.search_id, s);
    }
    if (r.created_at < s.at) s.at = r.created_at;
    s.answers[r.provider as ProviderKey] = {
      status: r.status,
      fares: r.fares,
      ms: r.ms,
      message: r.message,
    };
  }
  return [...byId.values()].sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, limit);
}
