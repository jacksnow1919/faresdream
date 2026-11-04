/**
 * Asks one flight API for fares — SERVER ONLY. The results page calls this once per API so
 * each API's fares can appear as soon as it answers. Every call is logged in
 * `provider_searches` for the admin panel; a failed log line never affects the search.
 */
import { isMissingTable } from "./admin-activity.server";
import { AIRLINES } from "./airlines.gen";
import {
  LIST_CURRENCY,
  PROVIDERS,
  providerErrorText,
  withAirlineDetails,
  type ProviderAnswer,
  type ProviderKey,
  type ProviderStatus,
} from "./flight-providers";
import type { PkfareNormalisedFare, PkfareSearchQuery } from "./pkfare-types";
import { isProviderPaused } from "./provider-switch.server";

/** Which of an API's key names are set here. Reports names only, never values. */
export function providerKeyStatus(key: ProviderKey) {
  return PROVIDERS[key].envNames.map((name) => ({ name, set: !!process.env[name]?.trim() }));
}

export const providerConfigured = (key: ProviderKey) => providerKeyStatus(key).every((k) => k.set);

async function callProvider(
  key: ProviderKey,
  query: PkfareSearchQuery,
): Promise<PkfareNormalisedFare[]> {
  if (key === "pkfare") return (await import("./pkfare.server")).runPkfareSearch(query);
  if (key === "duffel") return (await import("./duffel.server")).runDuffelSearch(query);
  return (await import("./mcontent.server")).runMcontentSearch(query);
}

/** One API's fares in the currency the site lists, with airline details and the API's name. */
async function listableFares(key: ProviderKey, query: PkfareSearchQuery) {
  const raw = await callProvider(key, query);
  const fares = raw
    .filter((f) => f.currency === LIST_CURRENCY)
    .map((f) => ({ ...withAirlineDetails(f, AIRLINES), provider: key }));
  const dropped = raw.length - fares.length;
  return {
    fares,
    message: dropped ? `${dropped} fares dropped: not priced in ${LIST_CURRENCY}` : null,
  };
}

async function logLookup(
  key: ProviderKey,
  query: PkfareSearchQuery,
  searchId: string,
  result: { status: ProviderStatus; fares: number; ms: number; message: string | null },
) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("provider_searches").insert({
      search_id: searchId,
      provider: key,
      origin: query.origin.toUpperCase(),
      destination: query.destination.toUpperCase(),
      depart_date: query.departDate,
      return_date: query.returnDate ?? null,
      cabin: query.cabinClass ?? null,
      adults: query.adults ?? 1,
      status: result.status,
      fares: result.fares,
      ms: result.ms,
      message: result.message,
    });
    if (error && !isMissingTable(error)) console.error("[provider-search] log failed", error);
  } catch (err) {
    console.error("[provider-search] log threw", err);
  }
}

export async function searchProvider(
  key: ProviderKey,
  query: PkfareSearchQuery,
  searchId?: string,
): Promise<ProviderAnswer> {
  // No keys means nothing was asked, so there's nothing to log.
  if (!providerConfigured(key)) return { provider: key, status: "not_configured", fares: [] };

  const log = (result: Parameters<typeof logLookup>[3]) =>
    searchId ? logLookup(key, query, searchId, result) : Promise.resolve();

  if (await isProviderPaused(key)) {
    await log({ status: "paused", fares: 0, ms: 0, message: null });
    return { provider: key, status: "paused", fares: [] };
  }

  const started = Date.now();
  try {
    const { fares, message } = await listableFares(key, query);
    await log({ status: "ok", fares: fares.length, ms: Date.now() - started, message });
    return { provider: key, status: "ok", fares };
  } catch (error) {
    console.error(`[provider-search] ${key} lookup failed`, error);
    await log({
      status: "error",
      fares: 0,
      ms: Date.now() - started,
      message: providerErrorText(error),
    });
    return { provider: key, status: "error", fares: [] };
  }
}

/**
 * The admin panel's Test key button: one real search on a busy route 30 days ahead. Works
 * while paused, so a key can be checked before resuming, and stays out of the search stats.
 */
export async function testProviderKey(key: ProviderKey) {
  const missing = providerKeyStatus(key).filter((k) => !k.set);
  if (missing.length > 0) {
    return {
      working: false,
      fares: 0,
      ms: 0,
      message: `Missing: ${missing.map((k) => k.name).join(", ")}`,
    };
  }
  const departDate = new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 10);
  const started = Date.now();
  try {
    const { fares, message } = await listableFares(key, {
      origin: "JFK",
      destination: "LAX",
      departDate,
      adults: 1,
      cabinClass: "Economy",
      currency: LIST_CURRENCY,
    });
    const ms = Date.now() - started;
    return {
      working: true,
      fares: fares.length,
      ms,
      message:
        message ??
        (fares.length
          ? `Found fares for JFK to LAX on ${departDate}.`
          : "The key works, but no fares came back."),
    };
  } catch (error) {
    return {
      working: false,
      fares: 0,
      ms: Date.now() - started,
      message: providerErrorText(error),
    };
  }
}
