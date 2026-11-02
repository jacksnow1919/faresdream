import { addDays, startOfToday } from "date-fns";

export const FLIGHT_SEARCH_ID = "flight-search";

/** Default trip dates (the search bar's, and the footer's): leave in a week, back a week later. */
export function shortcutDates(depart = addDays(startOfToday(), 7)) {
  return { depart, back: addDays(depart, 7) };
}

/**
 * Scrolls the homepage flight search widget into view and focuses the origin field.
 * Returns false when the widget is not on the current page.
 */
export function focusFlightSearch(): boolean {
  if (typeof document === "undefined") return false;
  const el = document.getElementById(FLIGHT_SEARCH_ID);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => {
    el.querySelector<HTMLInputElement>("input[role=combobox]")?.focus();
  }, 400);
  return true;
}

export const SEARCH_DESTINATION_EVENT = "faresdream:search-destination";

/**
 * Detail of SEARCH_DESTINATION_EVENT: airport codes and trip type. `from` and `trip`
 * are left as the visitor set them when omitted. `go` runs the search straight away.
 */
export type SearchDestination = {
  to: string;
  from?: string;
  trip?: "one" | "round";
  go?: boolean;
};

function sendToSearchBar(detail: SearchDestination): boolean {
  if (typeof document === "undefined" || !document.getElementById(FLIGHT_SEARCH_ID)) return false;
  window.dispatchEvent(new CustomEvent(SEARCH_DESTINATION_EVENT, { detail }));
  return true;
}

/**
 * Asks the homepage search widget to search flights to `to` (and from `from`, as
 * a `trip`, if given): it fills the fields, scrolls into view and opens the date
 * picker. Returns false when the widget is not on the current page.
 */
export function searchFlightsTo(to: string, from?: string, trip?: "one" | "round"): boolean {
  return sendToSearchBar({ to, ...(from ? { from } : {}), ...(trip ? { trip } : {}) });
}

/**
 * Like searchFlightsTo, but opens the results page at once, keeping the visitor's dates,
 * travellers, cabin and currency from the widget.
 */
export function showFlightsTo(to: string, from?: string, trip?: "one" | "round"): boolean {
  return sendToSearchBar({ to, ...(from ? { from } : {}), ...(trip ? { trip } : {}), go: true });
}
