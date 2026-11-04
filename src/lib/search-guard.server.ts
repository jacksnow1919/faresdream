/**
 * Stops scripts spending flight API searches — SERVER ONLY. Every search calls paid APIs from a
 * public address, so automation and crawlers are refused, and one address gets a search budget.
 *
 * Fails open: if the counter can't be reached the search goes ahead, because a database problem
 * must never stop a customer searching. Refusals are logged for the admin panel with the reason
 * and country, never the address.
 */
import { getRequestHeader } from "@tanstack/react-start/server";
import { PROVIDER_KEYS, type ProviderKey } from "./flight-providers";
import { automatedReason, parseBlockedCountries, type GuardReason } from "./visitor-events";

/** Each search asks every API once, so this allows about 50 searches in ten minutes. */
const SEARCHES_PER_WINDOW = 50;
const WINDOW_SECONDS = 600;

export function requestCountry() {
  const value = getRequestHeader("cf-ipcountry")?.trim().toUpperCase();
  return value && /^[A-Z]{2}$/.test(value) && value !== "XX" && value !== "T1" ? value : null;
}

async function db() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}

async function addressKey(address: string, provider: ProviderKey) {
  const salted = `${process.env["SESSION_SECRET"] ?? ""}:${provider}:${address}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(salted));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function withinBudget(address: string, provider: ProviderKey) {
  try {
    const { data, error } = await (
      await db()
    ).rpc("rate_limit_hit", {
      p_key: await addressKey(address, provider),
      p_window_seconds: WINDOW_SECONDS,
      p_limit: SEARCHES_PER_WINDOW,
    });
    if (error) {
      console.error("[search-guard] counter unavailable, admitting", error.message);
      return true;
    }
    return data !== false;
  } catch (error) {
    console.error("[search-guard] counter threw, admitting", error);
    return true;
  }
}

/** One search calls every API, so only the first API's refusal goes in the log. */
async function logBlock(reason: GuardReason, country: string | null, provider: ProviderKey) {
  if (provider !== PROVIDER_KEYS[0]) return;
  try {
    await (
      await db()
    )
      .from("search_guard_blocks")
      .insert({ reason, path: "/flight/search", country });
  } catch (error) {
    console.error("[search-guard] log failed", error);
  }
}

/** True when this request may run a live search on this API. */
export async function admitSearch(provider: ProviderKey): Promise<boolean> {
  const country = requestCountry();
  const automated = automatedReason(getRequestHeader("user-agent"));
  if (automated) {
    await logBlock(automated, country, provider);
    return false;
  }
  if (
    country &&
    parseBlockedCountries(process.env["SEARCH_GUARD_BLOCKED_COUNTRIES"]).has(country)
  ) {
    await logBlock("country", country, provider);
    return false;
  }
  const address = getRequestHeader("cf-connecting-ip")?.trim();
  if (address && !(await withinBudget(address, provider))) {
    await logBlock("too_many", country, provider);
    return false;
  }
  return true;
}
