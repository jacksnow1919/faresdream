/**
 * Turns mcontent's itineraries into the site's fares. No imports beyond types, so
 * scripts/flight-providers.test.ts can run it on its own.
 */
import type { FareJourney, PkfareNormalisedFare } from "./pkfare-types";

interface McontentSector {
  DepAirportCode?: string;
  ArrAirportCode?: string;
  /** Local time at the airport, e.g. "2026-12-14T22:20:00". */
  DepDateTime?: string;
  ArrDateTime?: string;
  MCarrier?: string;
  OCarrier?: string;
  FlightNo?: string;
}

interface McontentLeg {
  /** "hh:mm", e.g. "25:23". */
  TotalTime?: string;
  Sector?: McontentSector[];
}

interface McontentPrice {
  Price?: number | string;
  BaseFare?: number | string;
  Tax?: number | string;
}

export interface McontentItem {
  UniqueId?: string;
  Fyn?: string;
  Index?: number | string;
  Carrier?: string;
  Currency?: string;
  OutBound?: McontentLeg;
  InBound?: McontentLeg;
  AdultPrice?: McontentPrice;
}

/** "yyyy-MM-dd" to the "dd-MM-yyyy" mcontent asks for. */
export function mcontentDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}-${m}-${y}`;
}

const dateOf = (stamp: string) => stamp.slice(0, 10);
const timeOf = (stamp: string) => stamp.slice(11, 16);

function clockMinutes(stamp: string) {
  const minutes = Number(stamp.slice(11, 13)) * 60 + Number(stamp.slice(14, 16));
  return Number.isFinite(minutes) ? minutes : 0;
}

/** Local clock as absolute minutes; only differences at one airport mean anything. */
function stampMinutes(stamp: string) {
  const parsed = Date.parse(`${stamp.slice(0, 16)}:00Z`);
  return Number.isFinite(parsed) ? Math.round(parsed / 60_000) : null;
}

/** "25:23" is 1523 minutes. Anything else is 0, and the card then shows no length. */
function legMinutes(value?: string) {
  const m = /^(\d{1,3}):(\d{2})$/.exec((value ?? "").trim());
  return m ? Number(m[1]) * 60 + Number(m[2]) : 0;
}

const durationLabel = (m: number) =>
  m ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m` : "—";

const sectorCarrier = (s: McontentSector) => (s.MCarrier || s.OCarrier || "").toUpperCase();

const sectorFlightNo = (s: McontentSector) =>
  `${sectorCarrier(s)} ${(s.FlightNo ?? "").trim().replace(/^0+(?=\d)/, "")}`.trim();

function journeyOf(leg: McontentLeg | undefined): FareJourney | null {
  const sectors = leg?.Sector ?? [];
  const first = sectors[0];
  const last = sectors.at(-1);
  if (
    !first ||
    !last ||
    !sectors.every((s) => s.DepAirportCode && s.ArrAirportCode && s.DepDateTime && s.ArrDateTime)
  ) {
    return null;
  }

  let maxLayoverMinutes = 0;
  for (let i = 1; i < sectors.length; i++) {
    const landed = stampMinutes(sectors[i - 1]!.ArrDateTime!);
    const leaves = stampMinutes(sectors[i]!.DepDateTime!);
    if (landed !== null && leaves !== null && leaves > landed) {
      maxLayoverMinutes = Math.max(maxLayoverMinutes, leaves - landed);
    }
  }
  const durationMinutes = legMinutes(leg?.TotalTime);

  return {
    flightNo: sectorFlightNo(first),
    origin: first.DepAirportCode!,
    destination: last.ArrAirportCode!,
    departDate: dateOf(first.DepDateTime!),
    departTime: timeOf(first.DepDateTime!),
    arriveTime: timeOf(last.ArrDateTime!),
    duration: durationLabel(durationMinutes),
    durationMinutes,
    departMinutes: clockMinutes(first.DepDateTime!),
    arriveMinutes: clockMinutes(last.ArrDateTime!),
    maxLayoverMinutes,
    stops: sectors.length - 1,
    segments: sectors.map((s) => ({
      carrierCode: sectorCarrier(s),
      flightNo: sectorFlightNo(s),
      origin: s.DepAirportCode!,
      destination: s.ArrAirportCode!,
      departAt: s.DepDateTime!.slice(0, 16),
      arriveAt: s.ArrDateTime!.slice(0, 16),
      // mcontent gives the whole leg's time only; the details panel skips a 0.
      durationMinutes: 0,
    })),
  };
}

/** Null when the itinerary has no usable flights or price. `price` is per adult. */
export function normaliseMcontentItem(
  item: McontentItem,
  cabin: string,
): PkfareNormalisedFare | null {
  const outbound = journeyOf(item.OutBound);
  const total = Number(item.AdultPrice?.Price);
  if (!outbound || !Number.isFinite(total) || total <= 0) return null;

  const hasReturn = (item.InBound?.Sector?.length ?? 0) > 0;
  const inbound = hasReturn ? journeyOf(item.InBound) : null;
  if (hasReturn && !inbound) return null;

  const price = Math.round(total);
  const base = Number(item.AdultPrice?.BaseFare);
  const baseFare = Number.isFinite(base) && base > 0 ? Math.min(price, Math.round(base)) : null;
  const carrierCode = (item.Carrier || outbound.segments[0]!.carrierCode).toUpperCase().slice(0, 2);
  const id = item.UniqueId || item.Fyn || `${item.Index ?? ""}-${outbound.flightNo}-${price}`;

  return {
    id: `mcontent-${id}`,
    airline: carrierCode,
    carrierCode,
    ...outbound,
    cabin,
    currency: (item.Currency ?? "").toUpperCase(),
    price,
    // mcontent doesn't state refund terms, so a fare is never advertised as refundable.
    refundable: false,
    ...(inbound ? { inbound } : {}),
    ...(baseFare !== null ? { baseFare, taxes: price - baseFare } : {}),
  };
}
