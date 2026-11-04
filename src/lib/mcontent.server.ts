/**
 * mcontent flight search — SERVER ONLY. The account's site id and source go in
 * MCONTENT_SITE_ID and MCONTENT_SOURCE: .env.local here, Worker secrets on the live site.
 */
import { providerError } from "./flight-providers";
import { mcontentDate, normaliseMcontentItem, type McontentItem } from "./mcontent-normalise";
import type { PkfareNormalisedFare, PkfareSearchQuery } from "./pkfare-types";

const BASE_URL = "https://api.mcontent.site/api/Soulservices";
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_FARES = 50;

type Cabin = NonNullable<PkfareSearchQuery["cabinClass"]>;

const CABINS: Record<Cabin, string> = {
  Economy: "Y",
  PremiumEconomy: "W",
  Business: "C",
  First: "F",
};

export async function runMcontentSearch(query: PkfareSearchQuery): Promise<PkfareNormalisedFare[]> {
  const siteId = process.env["MCONTENT_SITE_ID"];
  const source = process.env["MCONTENT_SOURCE"];
  if (!siteId || !source) throw new Error("mcontent credentials are not configured");

  const cabinClass = query.cabinClass ?? "Business";
  const airline = (query.airline ?? "").toUpperCase().slice(0, 2);
  const params = new URLSearchParams({
    currency: "USD",
    origin: query.origin.toUpperCase(),
    destination: query.destination.toUpperCase(),
    departureDate: mcontentDate(query.departDate),
    JourneyType: query.returnDate ? "R" : "O",
    ...(query.returnDate ? { ReturnDate: mcontentDate(query.returnDate) } : {}),
    airlines: airline,
    cabin: CABINS[cabinClass],
    adults: String(query.adults ?? 1),
    children: String(query.children ?? 0),
    infants: String(query.infants ?? 0),
    siteid: siteId,
    source,
  });
  const base = process.env["MCONTENT_BASE_URL"] || BASE_URL;

  let res: Response;
  try {
    res = await fetch(`${base}?${params.toString()}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("[mcontent] transport failure", error);
    throw providerError(
      "We couldn't reach the flight provider just now. Please try again in a moment.",
      "mcontent could not be reached",
    );
  }

  if (!res.ok) {
    console.error(`[mcontent] search failed (${res.status})`);
    throw providerError(
      "The flight provider returned an error. Please try again shortly.",
      `mcontent answered with HTTP ${res.status}`,
    );
  }

  let body: { Data?: McontentItem[] | null };
  try {
    body = (await res.json()) as { Data?: McontentItem[] | null };
  } catch (error) {
    console.error("[mcontent] unreadable response", error);
    throw providerError(
      "We couldn't read the flight provider's response. Please try again.",
      "mcontent sent a response that isn't JSON",
    );
  }

  const items = body.Data ?? [];
  const fares = items
    .map((item) => normaliseMcontentItem(item, cabinClass))
    .filter((f): f is PkfareNormalisedFare => f !== null)
    .filter((f) => !airline || f.carrierCode === airline)
    .sort((a, b) => a.price - b.price)
    .slice(0, MAX_FARES);

  console.info(`[mcontent] ${items.length} itineraries -> ${fares.length} fares`);
  return fares;
}
