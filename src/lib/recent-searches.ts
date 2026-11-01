import { format } from "date-fns";

/**
 * Flight searches a visitor ran, kept only in their own browser (localStorage) so the
 * homepage can offer "Recent Searches" when they come back. No personal data.
 */
export type RecentSearch = {
  origin: string;
  destination: string;
  /** yyyy-MM-dd departure date. */
  date: string;
  passengers: number;
  cabin: string;
  currency: string;
  /** Last per-person price seen (cheapest result, or the fare picked at checkout). */
  price?: number;
  savedAt: number;
};

const KEY = "faresdream:recent-searches";
const MAX = 4;

const keyOf = (s: Pick<RecentSearch, "origin" | "destination" | "date">) =>
  `${s.origin}-${s.destination}-${s.date}`;

const isUpcoming = (date: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= format(new Date(), "yyyy-MM-dd");

function read(): RecentSearch[] {
  try {
    const list: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(list)
      ? list.filter(
          (s): s is RecentSearch =>
            typeof s?.origin === "string" &&
            typeof s?.destination === "string" &&
            typeof s?.date === "string",
        )
      : [];
  } catch {
    return [];
  }
}

function write(list: RecentSearch[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Storage full or blocked (private mode): recent searches are a nice-to-have.
  }
}

/** Upcoming searches, newest first. Call from effects only (reads localStorage). */
export function loadRecentSearches(): RecentSearch[] {
  return read().filter((s) => isUpcoming(s.date));
}

/**
 * Records a search (newest first, max 4). Fields left out keep their previous value
 * for the same route and date, so a later step can add a price without losing the
 * passenger count.
 */
export function saveRecentSearch(entry: {
  origin: string;
  destination: string;
  date: string;
  passengers?: number;
  cabin?: string;
  currency?: string;
  price?: number;
}) {
  if (typeof window === "undefined" || entry.origin === entry.destination) return;
  if (!isUpcoming(entry.date)) return;
  const list = read();
  const key = keyOf(entry);
  const prev = list.find((s) => keyOf(s) === key);
  const price = entry.price && entry.price > 0 ? entry.price : prev?.price;
  const next: RecentSearch = {
    origin: entry.origin,
    destination: entry.destination,
    date: entry.date,
    passengers: entry.passengers ?? prev?.passengers ?? 1,
    cabin: entry.cabin ?? prev?.cabin ?? "Economy",
    currency: entry.currency ?? prev?.currency ?? "USD",
    ...(price ? { price } : {}),
    savedAt: Date.now(),
  };
  write([next, ...list.filter((s) => keyOf(s) !== key)].slice(0, MAX));
}

export function clearRecentSearches() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear if storage is blocked.
  }
}
