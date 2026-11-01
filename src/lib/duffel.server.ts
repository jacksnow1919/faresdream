/**
 * Duffel flight search (Offer Requests API) — SERVER ONLY.
 * Used instead of PKFARE when DUFFEL_ACCESS_TOKEN is set and PKFARE isn't
 * configured, so local development shows real offers. Keep the token in
 * .env.local (git-ignored), never in .env, which is committed.
 */
import type {
  FareJourney,
  FareRule,
  PkfareNormalisedFare,
  PkfareSearchQuery,
} from "./pkfare-types";

const OFFER_REQUESTS_URL = "https://api.duffel.com/air/offer_requests";
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_FARES = 100;

type Cabin = NonNullable<PkfareSearchQuery["cabinClass"]>;

const DUFFEL_CABINS: Record<Cabin, string> = {
  Economy: "economy",
  PremiumEconomy: "premium_economy",
  Business: "business",
  First: "first",
};

const APP_CABINS: Record<string, Cabin> = {
  economy: "Economy",
  premium_economy: "PremiumEconomy",
  business: "Business",
  first: "First",
};

interface DuffelPlace {
  iata_code: string;
  name?: string | null;
}

interface DuffelCarrier {
  iata_code: string;
  name: string;
  logo_symbol_url?: string | null;
}

interface DuffelSegment {
  /** Local time at the departure airport, e.g. "2026-11-20T08:15:00". */
  departing_at: string;
  arriving_at: string;
  origin: DuffelPlace;
  destination: DuffelPlace;
  origin_terminal?: string | null;
  destination_terminal?: string | null;
  marketing_carrier: DuffelCarrier;
  marketing_carrier_flight_number: string;
  operating_carrier?: DuffelCarrier | null;
  aircraft?: { name?: string | null } | null;
  duration?: string | null;
  passengers?: {
    cabin_class?: string | null;
    baggages?: { type: string; quantity: number }[] | null;
  }[];
}

interface DuffelSlice {
  duration?: string | null;
  fare_brand_name?: string | null;
  segments: DuffelSegment[];
}

interface DuffelCondition {
  allowed?: boolean;
  penalty_amount?: string | null;
  penalty_currency?: string | null;
}

interface DuffelOffer {
  id: string;
  /** Total for every passenger, as a decimal string; base + tax = total. */
  total_amount: string;
  total_currency: string;
  base_amount?: string | null;
  base_currency?: string | null;
  /** Whole-offer estimate for every passenger, as a decimal string. */
  total_emissions_kg?: string | null;
  owner: DuffelCarrier;
  slices: DuffelSlice[];
  conditions?: {
    refund_before_departure?: DuffelCondition | null;
    change_before_departure?: DuffelCondition | null;
  } | null;
}

interface DuffelResponse {
  data?: { offers?: DuffelOffer[] };
  errors?: { title?: string; message?: string }[];
}

/** Duffel serves the search when it has a token and PKFARE has no credentials. */
export function duffelEnabled(): boolean {
  return !!process.env["DUFFEL_ACCESS_TOKEN"] && !process.env["PKFARE_PARTNER_ID"];
}

/** Minutes in an ISO 8601 duration such as "PT7H25M" or "P1DT2H5M". */
function isoMinutes(duration?: string | null): number {
  const m = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?$/.exec(duration ?? "");
  if (!m) return 0;
  return Number(m[1] ?? 0) * 1440 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
}

const hhmm = (local: string) => local.slice(11, 16);
const clockMinutes = (local: string) =>
  Number(local.slice(11, 13)) * 60 + Number(local.slice(14, 16));
/** Both ends of a layover are at the same airport, so local times subtract cleanly. */
const stampMinutes = (local: string) => Date.parse(`${local.slice(0, 19)}Z`) / 60_000;
const durationLabel = (m: number) =>
  m ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m` : "—";

/** Times, stops and flights of one slice (one direction of the trip). */
function sliceJourney(slice: DuffelSlice | undefined): FareJourney | null {
  const segments = slice?.segments ?? [];
  const first = segments[0];
  const last = segments.at(-1);
  if (!slice || !first || !last) return null;

  let maxLayoverMinutes = 0;
  for (let i = 1; i < segments.length; i++) {
    const gap =
      stampMinutes(segments[i]!.departing_at) - stampMinutes(segments[i - 1]!.arriving_at);
    if (gap > maxLayoverMinutes) maxLayoverMinutes = gap;
  }
  const flyingMinutes = segments.reduce((sum, s) => sum + isoMinutes(s.duration), 0);
  const durationMinutes = isoMinutes(slice.duration) || flyingMinutes + maxLayoverMinutes;

  return {
    flightNo: `${first.marketing_carrier.iata_code} ${first.marketing_carrier_flight_number}`,
    origin: first.origin.iata_code,
    destination: last.destination.iata_code,
    departDate: first.departing_at.slice(0, 10),
    departTime: hhmm(first.departing_at),
    arriveTime: hhmm(last.arriving_at),
    duration: durationLabel(durationMinutes),
    durationMinutes,
    departMinutes: clockMinutes(first.departing_at),
    arriveMinutes: clockMinutes(last.arriving_at),
    maxLayoverMinutes,
    stops: segments.length - 1,
    segments: segments.map((s) => {
      const bags = s.passengers?.[0]?.baggages;
      const bagCount = (type: string) => bags?.find((b) => b.type === type)?.quantity;
      const checked = bagCount("checked");
      const carryOn = bagCount("carry_on");
      const operator = s.operating_carrier;
      return {
        carrierCode: s.marketing_carrier.iata_code,
        flightNo: `${s.marketing_carrier.iata_code} ${s.marketing_carrier_flight_number}`,
        origin: s.origin.iata_code,
        destination: s.destination.iata_code,
        departAt: s.departing_at.slice(0, 16),
        arriveAt: s.arriving_at.slice(0, 16),
        durationMinutes: isoMinutes(s.duration),
        carrierName: s.marketing_carrier.name,
        ...(s.marketing_carrier.logo_symbol_url
          ? { logoUrl: s.marketing_carrier.logo_symbol_url }
          : {}),
        ...(operator && operator.iata_code !== s.marketing_carrier.iata_code
          ? { operatedBy: operator.name }
          : {}),
        ...(s.aircraft?.name ? { aircraft: s.aircraft.name } : {}),
        ...(s.origin.name ? { originName: s.origin.name } : {}),
        ...(s.destination.name ? { destinationName: s.destination.name } : {}),
        ...(s.origin_terminal ? { originTerminal: s.origin_terminal } : {}),
        ...(s.destination_terminal ? { destinationTerminal: s.destination_terminal } : {}),
        ...(checked !== undefined ? { checkedBags: checked } : {}),
        ...(carryOn !== undefined ? { carryOnBags: carryOn } : {}),
      };
    }),
  };
}

/** Duffel's refund/change condition; null means the airline didn't say. */
function fareRule(condition: DuffelCondition | null | undefined): FareRule | null {
  if (!condition || typeof condition.allowed !== "boolean") return null;
  const penalty = Number(condition.penalty_amount);
  return {
    allowed: condition.allowed,
    ...(condition.penalty_amount != null && Number.isFinite(penalty) ? { penalty } : {}),
    ...(condition.penalty_currency ? { currency: condition.penalty_currency } : {}),
  };
}

/** Maps an offer; the price (and CO₂) is the offer total split per traveller. */
function normaliseOffer(
  offer: DuffelOffer,
  travellers: number,
  fallbackCabin: Cabin,
): PkfareNormalisedFare | null {
  const outbound = sliceJourney(offer.slices[0]);
  const total = Number(offer.total_amount);
  if (!outbound || !(total > 0)) return null;
  const inbound = offer.slices.length > 1 ? sliceJourney(offer.slices[1]) : null;
  if (offer.slices.length > 1 && !inbound) return null;

  const emissions = Number(offer.total_emissions_kg);
  const firstSegment = offer.slices[0]!.segments[0]!;
  const price = Math.round(total / travellers);
  // The split is only meaningful when Duffel quotes the base in the same currency as the total.
  const base = offer.base_currency === offer.total_currency ? Number(offer.base_amount) : 0;
  const baseFare = base > 0 ? Math.min(price, Math.round(base / travellers)) : null;
  const refundRule = fareRule(offer.conditions?.refund_before_departure);
  const changeRule = fareRule(offer.conditions?.change_before_departure);
  const fareBrand = offer.slices[0]!.fare_brand_name;

  return {
    id: offer.id,
    airline: offer.owner.name,
    carrierCode: offer.owner.iata_code.toUpperCase().slice(0, 2),
    ...outbound,
    cabin: APP_CABINS[firstSegment.passengers?.[0]?.cabin_class ?? ""] ?? fallbackCabin,
    currency: offer.total_currency,
    price,
    refundable: refundRule?.allowed === true,
    ...(inbound ? { inbound } : {}),
    ...(emissions > 0 ? { co2Kg: Math.round(emissions / travellers) } : {}),
    ...(offer.owner.logo_symbol_url ? { logoUrl: offer.owner.logo_symbol_url } : {}),
    ...(baseFare !== null ? { baseFare, taxes: price - baseFare } : {}),
    ...(fareBrand ? { fareBrand } : {}),
    ...(refundRule ? { refundRule } : {}),
    ...(changeRule ? { changeRule } : {}),
  };
}

/** Same flights sold under several fare brands collapse to the cheapest one. */
const flightKey = (offer: DuffelOffer) =>
  offer.slices
    .flatMap((slice) =>
      slice.segments.map(
        (s) =>
          `${s.marketing_carrier.iata_code}${s.marketing_carrier_flight_number}@${s.departing_at}`,
      ),
    )
    .join("|");

export async function runDuffelSearch(query: PkfareSearchQuery): Promise<PkfareNormalisedFare[]> {
  const token = process.env["DUFFEL_ACCESS_TOKEN"];
  if (!token) throw new Error("DUFFEL_ACCESS_TOKEN is not configured");

  const cabinClass = query.cabinClass ?? "Business";
  // Duffel types non-adults by age; these stand in for a child and a lap infant.
  const passengers = [
    ...Array.from({ length: query.adults ?? 1 }, () => ({ type: "adult" })),
    ...Array.from({ length: query.children ?? 0 }, () => ({ age: 8 })),
    ...Array.from({ length: query.infants ?? 0 }, () => ({ age: 1 })),
  ];
  const slices = [
    { origin: query.origin, destination: query.destination, departure_date: query.departDate },
    ...(query.returnDate
      ? [{ origin: query.destination, destination: query.origin, departure_date: query.returnDate }]
      : []),
  ];

  console.info(
    "[Duffel] offer request",
    slices.map((s) => `${s.origin}-${s.destination}@${s.departure_date}`).join(" | "),
    `cabin=${cabinClass} passengers=${passengers.length}`,
    token.startsWith("duffel_test_") ? "(test mode: sample airline data)" : "(live)",
  );

  let res: Response;
  try {
    res = await fetch(`${OFFER_REQUESTS_URL}?return_offers=true&supplier_timeout=20000`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Duffel-Version": "v2",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: { slices, passengers, cabin_class: DUFFEL_CABINS[cabinClass] },
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("[Duffel] transport failure", error);
    throw new Error(
      "We couldn't reach the flight provider just now. Please try again in a moment.",
    );
  }

  let body: DuffelResponse;
  try {
    body = (await res.json()) as DuffelResponse;
  } catch (error) {
    console.error(`[Duffel] unreadable response (${res.status})`, error);
    throw new Error("We couldn't read the flight provider's response. Please try again.");
  }

  if (!res.ok) {
    const detail = (body.errors ?? []).map((e) => e.message || e.title).join("; ");
    console.error(`[Duffel] offer request failed (${res.status}): ${detail}`);
    throw new Error("The flight provider returned an error. Please try again shortly.");
  }

  const cheapest = new Map<string, DuffelOffer>();
  for (const offer of body.data?.offers ?? []) {
    const key = flightKey(offer);
    const seen = cheapest.get(key);
    if (!seen || Number(offer.total_amount) < Number(seen.total_amount)) cheapest.set(key, offer);
  }

  const fares = [...cheapest.values()]
    .map((offer) => normaliseOffer(offer, passengers.length, cabinClass))
    .filter((f): f is PkfareNormalisedFare => f !== null)
    .sort((a, b) => a.price - b.price)
    .slice(0, MAX_FARES);

  const currencies = [...new Set(fares.map((f) => f.currency))].join(", ") || "none";
  console.info(
    `[Duffel] ${body.data?.offers?.length ?? 0} offers -> ${fares.length} fares (currency: ${currencies})`,
  );
  return fares;
}
