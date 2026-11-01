import type { PkfareNormalisedFare } from "@/lib/pkfare-types";

/**
 * The fare a visitor picked on the results page, kept for this browser tab so the checkout
 * steps can show its timeline, baggage and rules. The URL stays the source of truth for the
 * price; this only adds detail, and only when it matches the flight in the URL.
 */
const KEY = "faresdream:selected-fare";

export type SelectedFare = { fare: PkfareNormalisedFare; airline: string };

export function saveSelectedFare(selected: SelectedFare) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(selected));
  } catch {
    // Storage blocked (private mode etc.): checkout falls back to the URL details.
  }
}

export function loadSelectedFare(flight: {
  origin: string;
  destination: string;
  departDate: string;
  flightNo: string;
}): SelectedFare | null {
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as SelectedFare | null;
    const f = saved?.fare;
    if (
      f &&
      f.origin === flight.origin &&
      f.destination === flight.destination &&
      f.departDate === flight.departDate &&
      f.flightNo === flight.flightNo
    )
      return saved;
  } catch {
    // Unreadable entry: ignore it.
  }
  return null;
}
