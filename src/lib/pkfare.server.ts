/**
 * PKFARE Flight Buyer API (Shopping V4) — SERVER ONLY.
 * Credentials (PKFARE_PARTNER_ID / PKFARE_PARTNER_KEY) never reach the browser.
 *
 * Transport quirks handled here:
 *  - auth is `sign = md5(partnerId + partnerKey)` inside the JSON body
 *  - the JSON body is base64-encoded and POSTed as a `param` form field
 *  - flights/segments come back as flat pools referenced by id
 */
import type {
  FareJourney,
  PkfareNormalisedFare,
  PkfareRawFlight,
  PkfareRawSegment,
  PkfareRawSolution,
  PkfareSearchQuery,
  PkfareSearchResponse,
} from "./pkfare-types";

const BASE_URL = "https://api.pkfare.com";
const SHOPPING_PATH = "/shoppingV4";
const REQUEST_TIMEOUT_MS = 30_000;

/** Minimal dependency-free MD5 (RFC 1321) — PKFARE requires MD5(partnerId + partnerKey). */
export function md5(input: string): string {
  const rotl = (n: number, c: number) => (n << c) | (n >>> (32 - c));
  const add = (a: number, b: number) => (a + b) | 0;

  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9,
    14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32));

  const bytes = new TextEncoder().encode(input);
  const bitLen = bytes.length * 8;
  const padded = new Uint8Array((((bytes.length + 8) >> 6) + 1) * 64);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  new DataView(padded.buffer).setUint32(padded.length - 8, bitLen, true);

  let [a0, b0, c0, d0] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
  const view = new DataView(padded.buffer);

  for (let chunk = 0; chunk < padded.length; chunk += 64) {
    const M = Array.from({ length: 16 }, (_, i) => view.getUint32(chunk + i * 4, true));
    let [A, B, C, D] = [a0, b0, c0, d0];

    for (let i = 0; i < 64; i++) {
      let F: number;
      let g: number;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      F = add(add(add(F, A), K[i]!), M[g]!);
      A = D;
      D = C;
      C = B;
      B = add(B, rotl(F, S[i]!));
    }

    a0 = add(a0, A);
    b0 = add(b0, B);
    c0 = add(c0, C);
    d0 = add(d0, D);
  }

  const hex = (n: number) =>
    Array.from({ length: 4 }, (_, i) =>
      ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, "0"),
    ).join("");
  return hex(a0) + hex(b0) + hex(c0) + hex(d0);
}

function credentials() {
  const partnerId = process.env["PKFARE_PARTNER_ID"];
  const partnerKey = process.env["PKFARE_PARTNER_KEY"];
  if (!partnerId || !partnerKey) throw new Error("PKFARE credentials are not configured");
  return { partnerId, sign: md5(`${partnerId}${partnerKey}`) };
}

function toBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

/**
 * PKFARE expects the whole JSON payload (authentication + search) stringified,
 * Base64-encoded, and POSTed as the `param` form field.
 */
export async function pkfarePost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const authentication = credentials();
  const base = (process.env["PKFARE_BASE_URL"] || BASE_URL).replace(/\/+$/, "");
  const param = toBase64(JSON.stringify({ authentication, ...body }));

  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ param }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("[PKFARE] transport failure", error);
    throw new Error(
      "We couldn't reach the flight provider just now. Please try again in a moment.",
    );
  }

  if (!res.ok) {
    let text = "";
    try {
      text = (await res.text()).slice(0, 300).replace(/\s+/g, " ");
    } catch {
      text = "<unreadable>";
    }
    console.error(`[PKFARE] ${base}${path} failed (${res.status}): ${text}`);
    throw new Error("The flight provider returned an error. Please try again shortly.");
  }

  try {
    return (await res.json()) as T;
  } catch (error) {
    console.error("[PKFARE] unreadable response", error);
    throw new Error("We couldn't read the flight provider's response. Please try again.");
  }
}

const minutesToDuration = (m?: number) =>
  m ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m` : "—";

const timeOf = (t?: string | null) => (t ? (t.length > 5 ? t.slice(0, 5) : t) : "");

/**
 * Resolves a solution into its journeys (journey 0 = outbound, journey 1 =
 * inbound for round trips). Every journey is returned so callers can map the
 * real return leg instead of guessing.
 */
function solutionJourneys(
  solution: PkfareRawSolution,
  flightsById: Map<string, PkfareRawFlight>,
  segmentsById: Map<string, PkfareRawSegment>,
): { journeys: PkfareRawSegment[][]; journeyTime: number } | null {
  const journeyKeys = Object.keys(solution.journeys ?? {}).sort();
  const journeys: PkfareRawSegment[][] = [];
  let journeyTime = 0;

  for (const key of journeyKeys) {
    const legSegments: PkfareRawSegment[] = [];
    for (const flightId of solution.journeys?.[key] ?? []) {
      const flight = flightsById.get(flightId);
      if (!flight) return null;
      journeyTime += flight.journeyTime ?? 0;
      for (const segmentId of flight.segmengtIds ?? flight.segmentIds ?? []) {
        const segment = segmentsById.get(segmentId);
        if (!segment) return null;
        legSegments.push(segment);
      }
    }
    if (legSegments.length > 0) journeys.push(legSegments);
  }

  if (journeys.length === 0) return null;
  return { journeys, journeyTime };
}

/** Times, stops and flights of one journey (journey 0 = outbound, 1 = return). */
function journeyOf(segments: PkfareRawSegment[]): FareJourney {
  const first = segments[0]!;
  const last = segments[segments.length - 1]!;
  const segmentMinutes = segments.reduce((sum, seg) => sum + (seg.flightTime ?? 0), 0);

  // Layovers = gap between one segment's arrival and the next segment's departure.
  let maxLayoverMinutes = 0;
  for (let i = 1; i < segments.length; i++) {
    const prev = toMinutesStamp(segments[i - 1]!.strArrivalDate, segments[i - 1]!.strArrivalTime);
    const next = toMinutesStamp(segments[i]!.strDepartureDate, segments[i]!.strDepartureTime);
    if (prev !== null && next !== null && next > prev) {
      maxLayoverMinutes = Math.max(maxLayoverMinutes, next - prev);
    }
  }

  return {
    flightNo: `${first.airline} ${first.flightNum}`,
    origin: first.departure,
    destination: last.arrival,
    departDate: first.strDepartureDate ?? "",
    departTime: timeOf(first.strDepartureTime),
    arriveTime: timeOf(last.strArrivalTime),
    duration: minutesToDuration(segmentMinutes || undefined),
    durationMinutes: segmentMinutes + maxLayoverMinutes,
    departMinutes: clockMinutes(first.strDepartureTime),
    arriveMinutes: clockMinutes(last.strArrivalTime),
    maxLayoverMinutes,
    stops: Math.max(0, segments.length - 1),
    segments: segments.map((seg) => ({
      carrierCode: seg.airline,
      flightNo: `${seg.airline} ${seg.flightNum}`,
      origin: seg.departure,
      destination: seg.arrival,
      departAt: `${seg.strDepartureDate ?? ""}T${timeOf(seg.strDepartureTime)}`,
      arriveAt: `${seg.strArrivalDate ?? ""}T${timeOf(seg.strArrivalTime)}`,
      durationMinutes: seg.flightTime ?? 0,
    })),
  };
}

function normaliseSolution(
  solution: PkfareRawSolution,
  index: number,
  flightsById: Map<string, PkfareRawFlight>,
  segmentsById: Map<string, PkfareRawSegment>,
  fallbackCabin: string,
): PkfareNormalisedFare | null {
  const resolved = solutionJourneys(solution, flightsById, segmentsById);
  if (!resolved) return null;

  const [outboundSegments, inboundSegments] = resolved.journeys;
  const first = outboundSegments![0]!;

  const price =
    (solution.adtFare ?? 0) +
    (solution.adtTax ?? 0) +
    (solution.qCharge ?? 0) +
    (solution.tktFee ?? 0);
  if (price <= 0) return null;

  const carrierCode = (solution.platingCarrier || first.airline || "").toUpperCase().slice(0, 2);
  const baseFare = Math.min(Math.round(price), Math.round(solution.adtFare ?? 0));

  return {
    id: solution.solutionId || solution.solutionKey || `solution-${index}`,
    airline: solution.platingCarrier || first.airline,
    carrierCode,
    ...journeyOf(outboundSegments!),
    cabin: first.cabinClass || fallbackCabin,
    currency: solution.currency || "USD",
    price: Math.round(price),
    ...(baseFare > 0 ? { baseFare, taxes: Math.round(price) - baseFare } : {}),
    refundable: solution.refundable === true,
    ...(inboundSegments ? { inbound: journeyOf(inboundSegments) } : {}),
  };
}

/** Minutes since midnight for a "HH:mm" style time string. */
function clockMinutes(time?: string | null): number {
  const t = timeOf(time);
  const [h, m] = t.split(":");
  const hours = Number(h);
  const mins = Number(m);
  if (!Number.isFinite(hours) || !Number.isFinite(mins)) return 0;
  return hours * 60 + mins;
}

/** Absolute minute stamp from a yyyy-MM-dd date plus HH:mm time. */
function toMinutesStamp(date?: string | null, time?: string | null): number | null {
  if (!date) return null;
  const parsed = Date.parse(`${date}T${timeOf(time) || "00:00"}:00Z`);
  return Number.isFinite(parsed) ? Math.round(parsed / 60000) : null;
}

async function pkfareShopping(query: PkfareSearchQuery, cabinClass: string) {
  const searchAirLegs = [
    {
      cabinClass,
      departureDate: query.departDate,
      origin: query.origin,
      destination: query.destination,
    },
    ...(query.returnDate
      ? [
          {
            cabinClass,
            departureDate: query.returnDate,
            origin: query.destination,
            destination: query.origin,
          },
        ]
      : []),
  ];

  console.info(
    "[PKFARE] shopping request",
    searchAirLegs.map((l) => `${l.origin}-${l.destination}@${l.departureDate}`).join(" | "),
    `cabin=${cabinClass} adults=${query.adults ?? 1} airline=${query.airline ?? "any"}`,
  );

  return pkfarePost<PkfareSearchResponse>(SHOPPING_PATH, {
    search: {
      adults: query.adults ?? 1,
      children: query.children ?? 0,
      infants: query.infants ?? 0,
      nonstop: 0,
      airline: (query.airline ?? "").toUpperCase().slice(0, 2),
      solutions: Math.min(Math.max(query.solutions ?? 20, 20), 100),
      searchAirLegs,
    },
  });
}

/** One PKfare solution with every journey resolved and raw fare components kept. */
export interface PkfareItinerary {
  solutionId: string;
  platingCarrier: string;
  currency: string;
  refundable: boolean;
  fares: {
    adtFare: number;
    adtTax: number;
    chdFare: number | null;
    chdTax: number | null;
    infFare: number | null;
    infTax: number | null;
    qCharge: number;
    tktFee: number;
  };
  /** journeys[0] = outbound, journeys[1] = inbound (round trips only). */
  journeys: PkfareRawSegment[][];
}

/**
 * Round trips are a SINGLE native PKfare call with both searchAirLegs, so the
 * returned solutions are genuinely priced and sellable pairings.
 */
export async function runPkfareItinerarySearch(
  query: PkfareSearchQuery,
): Promise<PkfareItinerary[]> {
  const cabinClass = query.cabinClass ?? "Economy";
  const res = await pkfareShopping(query, cabinClass);

  const code = String(res.errorCode ?? "0");
  if (code !== "0" && code !== "S") {
    console.error(`[PKFARE] api error ${code}: ${res.errorMsg ?? ""}`);
    throw new Error(
      res.errorMsg
        ? `The flight provider couldn't complete that search (${code}).`
        : `PKFARE error ${code}`,
    );
  }

  const flightsById = new Map((res.data?.flights ?? []).map((f) => [f.flightId, f]));
  const segmentsById = new Map((res.data?.segments ?? []).map((s) => [s.segmentId, s]));
  const solutions = res.data?.solutions ?? [];

  const itineraries: PkfareItinerary[] = [];
  for (const [index, solution] of solutions.entries()) {
    const resolved = solutionJourneys(solution, flightsById, segmentsById);
    if (!resolved) continue;
    if ((solution.adtFare ?? 0) <= 0) continue;
    itineraries.push({
      solutionId: solution.solutionId || solution.solutionKey || `solution-${index}`,
      platingCarrier: (solution.platingCarrier || resolved.journeys[0]![0]!.airline || "")
        .toUpperCase()
        .slice(0, 2),
      currency: solution.currency || "USD",
      refundable: solution.refundable === true,
      fares: {
        adtFare: solution.adtFare ?? 0,
        adtTax: solution.adtTax ?? 0,
        chdFare: solution.chdFare ?? null,
        chdTax: solution.chdTax ?? null,
        infFare: solution.infFare ?? null,
        infTax: solution.infTax ?? null,
        qCharge: solution.qCharge ?? 0,
        tktFee: solution.tktFee ?? 0,
      },
      journeys: resolved.journeys,
    });
  }

  console.info(`[PKFARE] ${solutions.length} solutions -> ${itineraries.length} itineraries`);
  return itineraries;
}

export async function runPkfareSearch(query: PkfareSearchQuery): Promise<PkfareNormalisedFare[]> {
  const cabinClass = query.cabinClass ?? "Business";
  const res = await pkfareShopping(query, cabinClass);

  const code = String(res.errorCode ?? "0");
  if (code !== "0" && code !== "S") {
    console.error(`[PKFARE] api error ${code}: ${res.errorMsg ?? ""}`);
    throw new Error(
      res.errorMsg
        ? `The flight provider couldn't complete that search (${code}).`
        : `PKFARE error ${code}`,
    );
  }

  const flightsById = new Map((res.data?.flights ?? []).map((f) => [f.flightId, f]));
  const segmentsById = new Map((res.data?.segments ?? []).map((s) => [s.segmentId, s]));
  const solutions = res.data?.solutions ?? [];

  const fares = solutions
    .map((solution, index) =>
      normaliseSolution(solution, index, flightsById, segmentsById, cabinClass),
    )
    .filter((fare): fare is PkfareNormalisedFare => fare !== null)
    .sort((a, b) => a.price - b.price);

  console.info(`[PKFARE] ${solutions.length} solutions -> ${fares.length} fares`);
  return fares;
}
