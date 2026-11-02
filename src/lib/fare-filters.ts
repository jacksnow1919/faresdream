/**
 * Filtering and sorting for the flight results page. Stops and times are filtered per
 * direction; layovers look at the whole trip, in either direction.
 */
import type { PkfareNormalisedFare } from "@/lib/pkfare-types";

export const AIRLINE_NAMES: Record<string, string> = {
  QR: "Qatar Airways",
  EK: "Emirates",
  SQ: "Singapore Airlines",
  NH: "ANA",
  DL: "Delta",
  LH: "Lufthansa",
  BA: "British Airways",
  AA: "American Airlines",
  UA: "United Airlines",
  AF: "Air France",
  EY: "Etihad Airways",
  TK: "Turkish Airlines",
};

export const carrierOf = (f: PkfareNormalisedFare) =>
  f.carrierCode || f.flightNo.slice(0, 2).toUpperCase();

/** Providers send either a name (Duffel) or a code (PKFARE) in `airline`. */
export const airlineNameOf = (f: PkfareNormalisedFare) => {
  const code = carrierOf(f);
  return f.airline && f.airline.toUpperCase() !== code ? f.airline : (AIRLINE_NAMES[code] ?? code);
};

export const TIME_BLOCKS = [
  { id: "early", label: "Before 6 AM", from: 0, to: 360 },
  { id: "morning", label: "6 AM - 12 PM", from: 360, to: 720 },
  { id: "afternoon", label: "12 PM - 6 PM", from: 720, to: 1080 },
  { id: "evening", label: "After 6 PM", from: 1080, to: 1441 },
] as const;

export type SortKey = "cheapest" | "fastest" | "best";

export type Filters = {
  stops: string[];
  returnStops: string[];
  maxPrice: number | null;
  fareRules: string[];
  departBlocks: string[];
  arriveBlocks: string[];
  returnDepartBlocks: string[];
  returnArriveBlocks: string[];
  airlines: string[];
  maxLayover: number | null;
  layoverAirports: string[];
};

export const emptyFilters: Filters = {
  stops: [],
  returnStops: [],
  maxPrice: null,
  fareRules: [],
  departBlocks: [],
  arriveBlocks: [],
  returnDepartBlocks: [],
  returnArriveBlocks: [],
  airlines: [],
  maxLayover: null,
  layoverAirports: [],
};

export const hasFilters = (f: Filters) =>
  f.maxPrice !== null ||
  f.maxLayover !== null ||
  [
    f.stops,
    f.returnStops,
    f.fareRules,
    f.departBlocks,
    f.arriveBlocks,
    f.returnDepartBlocks,
    f.returnArriveBlocks,
    f.airlines,
    f.layoverAirports,
  ].some((list) => list.length > 0);

export const toggleIn = (list: string[], value: string) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

export const stopsBucket = (stops: number) =>
  stops === 0 ? "Non Stop" : stops === 1 ? "1 Stop" : "2+ Stops";

export const fareRuleOf = (f: PkfareNormalisedFare) =>
  f.refundable ? "Refundable" : "Non-refundable";

/** Airports the trip changes planes at, in either direction. */
export const layoverAirportsOf = (f: PkfareNormalisedFare) =>
  [...(f.segments ?? []).slice(1), ...(f.inbound?.segments ?? []).slice(1)].map((s) => s.origin);

/** The trip's longest single layover, in either direction. */
export const longestLayover = (f: PkfareNormalisedFare) =>
  Math.max(f.maxLayoverMinutes || 0, f.inbound?.maxLayoverMinutes || 0);

/** The layover slider moves in steps of this many minutes. */
export const LAYOVER_STEP = 15;

const inBlocks = (minutes: number, blocks: string[]) =>
  blocks.length === 0 ||
  TIME_BLOCKS.some((b) => blocks.includes(b.id) && minutes >= b.from && minutes < b.to);

export type Option = { id: string; label: string; price: number; logoUrl?: string | undefined };

export type Bounds = {
  minPrice: number;
  maxPrice: number;
  minDuration: number;
  maxDuration: number;
  maxLayover: number;
  stops: Option[];
  /** Empty unless the fares are round trips. */
  returnStops: Option[];
  fareRules: Option[];
  airlines: Option[];
  layoverAirports: Option[];
};

/** Cheapest fare per option, cheapest first. Only airline options carry a logo. */
function optionsBy(
  fares: PkfareNormalisedFare[],
  keysOf: (f: PkfareNormalisedFare) => string[],
  labelOf: (key: string, f: PkfareNormalisedFare) => string,
  withLogo = false,
): Option[] {
  const byKey = new Map<string, Option>();
  for (const f of fares) {
    for (const key of new Set(keysOf(f))) {
      const seen = byKey.get(key);
      if (!seen || f.price < seen.price) {
        byKey.set(key, {
          id: key,
          label: labelOf(key, f),
          price: f.price,
          ...(withLogo && f.logoUrl ? { logoUrl: f.logoUrl } : {}),
        });
      }
    }
  }
  return [...byKey.values()].sort((a, b) => a.price - b.price);
}

export function computeBounds(
  fares: PkfareNormalisedFare[],
  airportLabel: (code: string) => string,
): Bounds {
  const prices = fares.map((f) => f.price);
  const durations = fares.map(tripMinutes);
  const stopOrder = ["Non Stop", "1 Stop", "2+ Stops"];
  const byStops = (a: Option, b: Option) => stopOrder.indexOf(a.id) - stopOrder.indexOf(b.id);
  const longest = fares.reduce((m, f) => Math.max(m, longestLayover(f)), 0);
  return {
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
    minDuration: durations.length ? Math.min(...durations) : 0,
    maxDuration: durations.length ? Math.max(...durations) : 0,
    // Rounded up to a slider step, or the slider's far end would cut off the longest layover.
    maxLayover: Math.ceil(longest / LAYOVER_STEP) * LAYOVER_STEP,
    stops: optionsBy(
      fares,
      (f) => [stopsBucket(f.stops)],
      (k) => k,
    ).sort(byStops),
    returnStops: optionsBy(
      fares,
      (f) => (f.inbound ? [stopsBucket(f.inbound.stops)] : []),
      (k) => k,
    ).sort(byStops),
    fareRules: optionsBy(
      fares,
      (f) => [fareRuleOf(f)],
      (k) => k,
    ),
    airlines: optionsBy(
      fares,
      (f) => [carrierOf(f)],
      (_, f) => airlineNameOf(f),
      true,
    ),
    layoverAirports: optionsBy(fares, layoverAirportsOf, airportLabel),
  };
}

export function applyFilters(fares: PkfareNormalisedFare[], f: Filters): PkfareNormalisedFare[] {
  return fares.filter((fare) => {
    if (f.stops.length && !f.stops.includes(stopsBucket(fare.stops))) return false;
    if (f.maxPrice !== null && fare.price > f.maxPrice) return false;
    if (f.fareRules.length && !f.fareRules.includes(fareRuleOf(fare))) return false;
    if (!inBlocks(fare.departMinutes ?? 0, f.departBlocks)) return false;
    if (!inBlocks(fare.arriveMinutes ?? 0, f.arriveBlocks)) return false;
    if (fare.inbound) {
      const back = fare.inbound;
      if (f.returnStops.length && !f.returnStops.includes(stopsBucket(back.stops))) return false;
      if (!inBlocks(back.departMinutes, f.returnDepartBlocks)) return false;
      if (!inBlocks(back.arriveMinutes, f.returnArriveBlocks)) return false;
    }
    if (f.airlines.length && !f.airlines.includes(carrierOf(fare))) return false;
    if (f.maxLayover !== null && longestLayover(fare) > f.maxLayover) return false;
    if (
      f.layoverAirports.length &&
      !layoverAirportsOf(fare).some((a) => f.layoverAirports.includes(a))
    )
      return false;
    return true;
  });
}

/** Time in the air and at layovers for the whole trip: outbound plus return on round trips. */
export const tripMinutes = (f: PkfareNormalisedFare) =>
  (f.durationMinutes || 0) + (f.inbound?.durationMinutes || 0);

/**
 * Cheapest: lowest price, quickest first among equal prices. Fastest: shortest whole trip,
 * cheapest first among equal times. Best ("recommended") weighs price 60% and trip time 40%.
 */
export function sortFares(fares: PkfareNormalisedFare[], sort: SortKey, bounds: Bounds) {
  const list = [...fares];
  const byPrice = (a: PkfareNormalisedFare, b: PkfareNormalisedFare) => a.price - b.price;
  const byTime = (a: PkfareNormalisedFare, b: PkfareNormalisedFare) =>
    tripMinutes(a) - tripMinutes(b);
  if (sort === "cheapest") return list.sort((a, b) => byPrice(a, b) || byTime(a, b));
  if (sort === "fastest") return list.sort((a, b) => byTime(a, b) || byPrice(a, b));
  const priceSpan = Math.max(1, bounds.maxPrice - bounds.minPrice);
  const durSpan = Math.max(1, bounds.maxDuration - bounds.minDuration);
  const score = (f: PkfareNormalisedFare) =>
    0.6 * ((f.price - bounds.minPrice) / priceSpan) +
    0.4 * ((tripMinutes(f) - bounds.minDuration) / durSpan);
  return list.sort((a, b) => score(a) - score(b) || byPrice(a, b) || byTime(a, b));
}

export const minutesLabel = (m: number) =>
  `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
