/**
 * Client-side flight search service.
 * All flight API traffic happens server-side through the `searchOneProvider` server
 * function, so API keys are never exposed to the browser.
 */
import { searchOneProvider } from "@/lib/pkfare.functions";
import type { ProviderAnswer, ProviderKey } from "@/lib/flight-providers";
import type { PkfareSearchQuery } from "@/lib/pkfare-types";

export type * from "@/lib/pkfare-types";

/** Asks one flight API through the secure backend. A failed API answers with status "error". */
export async function searchFlights(
  provider: ProviderKey,
  query: PkfareSearchQuery,
  searchId: string,
): Promise<ProviderAnswer> {
  return searchOneProvider({
    data: {
      provider,
      searchId,
      origin: query.origin,
      destination: query.destination,
      departDate: query.departDate,
      ...(query.returnDate ? { returnDate: query.returnDate } : {}),
      adults: query.adults ?? 1,
      children: query.children ?? 0,
      infants: query.infants ?? 0,
      cabinClass: query.cabinClass ?? "Business",
      currency: query.currency ?? "USD",
      solutions: query.solutions ?? 20,
      ...(query.airline ? { airline: query.airline } : {}),
    },
  });
}
