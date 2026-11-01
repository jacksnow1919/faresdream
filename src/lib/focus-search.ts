export const FLIGHT_SEARCH_ID = "flight-search";

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
 * are left as the visitor set them when omitted.
 */
export type SearchDestination = { to: string; from?: string; trip?: "one" | "round" };

/**
 * Asks the homepage search widget to search flights to `to` (and from `from`, as
 * a `trip`, if given): it fills the fields, scrolls into view and opens the date
 * picker. Returns false when the widget is not on the current page.
 */
export function searchFlightsTo(to: string, from?: string, trip?: "one" | "round"): boolean {
  if (typeof document === "undefined" || !document.getElementById(FLIGHT_SEARCH_ID)) return false;
  const detail: SearchDestination = { to, ...(from ? { from } : {}), ...(trip ? { trip } : {}) };
  window.dispatchEvent(new CustomEvent(SEARCH_DESTINATION_EVENT, { detail }));
  return true;
}
