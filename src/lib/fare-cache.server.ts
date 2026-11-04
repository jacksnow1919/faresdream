/**
 * Public fare-cache endpoint logic (server only).
 * GET  -> cheapest cached/live PKfare fare for a route (5-hour cache)
 * POST -> record an interest click
 */
import { md5 } from "./pkfare.server";

export const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "content-type, x-api-key, authorization",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-max-age": "86400",
};

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  ...CORS_HEADERS,
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });

export const fareCacheOptions = () => new Response(null, { status: 204, headers: CORS_HEADERS });

const iata = (v: string | null) => (v ?? "").trim().toUpperCase().slice(0, 3);

function departureDate(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 21);
  return d.toISOString().slice(0, 10);
}

interface PkfareSolution {
  adtFare?: number | string;
  adtTax?: number | string;
  currency?: string;
  platingCarrier?: string;
}

/** Cheapest all-in per-adult fare from PKfare shoppingV10, or null when unpriced. */
async function fetchCheapestFare(
  origin: string,
  destination: string,
  cabin: string,
): Promise<{ price: number; currency: string; airline: string | null } | null> {
  // Off unless switched on: this address is public, so any visitor could spend PKFARE searches.
  if (process.env["FARE_CACHE_USE_PKFARE"] !== "true") return null;

  const partnerId = process.env["PKFARE_PARTNER_ID"];
  const partnerKey = process.env["PKFARE_PARTNER_KEY"];
  if (!partnerId || !partnerKey) {
    console.error("[fare-cache] PKFARE credentials are not configured");
    return null;
  }
  const { isProviderPaused } = await import("./provider-switch.server");
  if (await isProviderPaused("pkfare")) return null;

  const body = {
    authentication: { sign: md5(`${partnerId}${partnerKey}`), partnerId },
    search: {
      nonstop: "",
      children: "0",
      adults: "1",
      airline: "",
      infants: "0",
      solutions: "",
      searchAirLegs: [
        { cabinClass: cabin, origin, destination, departureDate: departureDate() },
      ],
      brandFare: "",
      returnBrandFarePrice: "Y",
      multiTags: {},
      returnMultiTagPrice: "N",
    },
  };

  let res: Response;
  try {
    res = await fetch("https://api.pkfare.com/json/shoppingV10", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30_000),
    });
  } catch (error) {
    console.error("[fare-cache] PKFARE transport failure", error);
    return null;
  }

  if (!res.ok) {
    console.error(`[fare-cache] PKFARE http ${res.status}`);
    return null;
  }

  let payload: { errorCode?: string | number; data?: { solutions?: PkfareSolution[] } };
  try {
    payload = await res.json();
  } catch (error) {
    console.error("[fare-cache] PKFARE unreadable response", error);
    return null;
  }

  if (String(payload.errorCode ?? "0") !== "0") {
    console.warn(`[fare-cache] PKFARE errorCode ${payload.errorCode} for ${origin}-${destination}`);
    return null;
  }

  let best: { price: number; currency: string; airline: string | null } | null = null;
  for (const s of payload.data?.solutions ?? []) {
    const total = Number(s.adtFare ?? 0) + Number(s.adtTax ?? 0);
    if (!Number.isFinite(total) || total <= 0) continue;
    if (!best || total < best.price) {
      best = {
        price: total,
        currency: s.currency || "USD",
        airline: (s.platingCarrier || "").toUpperCase().slice(0, 2) || null,
      };
    }
  }
  if (!best) return null;
  return { ...best, price: Math.round(best.price) };
}

export async function handleFareCacheGet(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const origin = iata(url.searchParams.get("origin"));
  const destination = iata(url.searchParams.get("destination"));
  const cabin = (url.searchParams.get("cabin") || "Economy").trim();
  const fallbackCurrency = (url.searchParams.get("currency") || "INR").trim().toUpperCase();

  if (origin.length !== 3 || destination.length !== 3) {
    return json({ error: "origin and destination must be 3-letter IATA codes" }, 400);
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: cached } = await supabaseAdmin
    .from("route_fare_cache")
    .select("*")
    .eq("origin", origin)
    .eq("destination", destination)
    .eq("cabin_class", cabin)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (cached) {
    await supabaseAdmin
      .from("route_fare_cache")
      .update({ search_count: Number(cached.search_count ?? 0) + 1 })
      .eq("id", cached.id);
    return json({
      price: cached.price === null ? null : Number(cached.price),
      currency: cached.currency ?? fallbackCurrency,
      airline: cached.airline ?? null,
      cached: true,
      origin,
      destination,
    });
  }

  const live = await fetchCheapestFare(origin, destination, cabin);
  if (!live) {
    return json({
      price: null,
      currency: fallbackCurrency,
      airline: null,
      cached: false,
      origin,
      destination,
    });
  }

  const now = new Date();
  const expires = new Date(now.getTime() + 5 * 60 * 60 * 1000);
  const { error } = await supabaseAdmin.from("route_fare_cache").upsert(
    {
      origin,
      destination,
      cabin_class: cabin,
      price: live.price,
      currency: live.currency,
      airline: live.airline,
      fetched_at: now.toISOString(),
      expires_at: expires.toISOString(),
      search_count: 1,
    },
    { onConflict: "origin,destination,cabin_class" },
  );
  if (error) console.error("[fare-cache] cache upsert failed", error.message);

  return json({
    price: live.price,
    currency: live.currency,
    airline: live.airline,
    cached: false,
    origin,
    destination,
  });
}

export async function handleFareCachePost(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const origin = iata(typeof body["origin"] === "string" ? (body["origin"] as string) : null);
  const destination = iata(
    typeof body["destination"] === "string" ? (body["destination"] as string) : null,
  );
  if (origin.length !== 3 || destination.length !== 3) {
    return json({ error: "origin and destination must be 3-letter IATA codes" }, 400);
  }

  const airlineRaw = typeof body["airline"] === "string" ? (body["airline"] as string).trim() : "";
  const interestType =
    typeof body["interest_type"] === "string" && (body["interest_type"] as string).trim()
      ? (body["interest_type"] as string).trim().slice(0, 60)
      : "get_price";

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("fare_interest_clicks").insert({
    origin,
    destination,
    airline: airlineRaw ? airlineRaw.toUpperCase().slice(0, 4) : null,
    interest_type: interestType,
  });
  if (error) {
    console.error("[fare-cache] interest click insert failed", error.message);
    return json({ error: "Could not record interest" }, 500);
  }

  return json({ ok: true });
}
