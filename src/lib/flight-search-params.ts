export type FlightSearch = {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  airline: string;
  airlineCode?: string;
  flightNo: string;
  cabin: string;
  currency: string;
  price: string;
  baseFare?: string;
  taxes?: string;
  itineraryId?: string;
  adults?: number;
  children?: number;
  infants?: number;
  /** True when the fare arrived from a meta-search deep link and must not be edited. */
  locked?: boolean;
  utm_source?: string;
  click_id?: string;
  promo_code?: string;
  discount_val?: string;
  discount_type?: string;
  discount_pct?: string;
  discount_amount?: string;
  original_price?: string;
  final_price?: string;
};

const str = (v: unknown, fallback: string) => {
  if (typeof v === "number") return String(v);
  return typeof v === "string" && v.trim() !== "" ? v : fallback;
};

const num = (v: unknown, fallback: number) => {
  const n = typeof v === "number" ? v : Number(str(v, ""));
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
};

const CABIN_LABELS: Record<string, string> = {
  economy: "Economy",
  premium_economy: "Premium Economy",
  "premium economy": "Premium Economy",
  business: "Business",
  first: "First",
};

const cabinLabel = (raw: string) => CABIN_LABELS[raw.trim().toLowerCase()] ?? raw;

/** Accepts both the internal params and the meta-search deep-link aliases. */
export const parseFlightSearch = (search: Record<string, unknown>): FlightSearch => {
  const depart = str(search["departDate"], "") || str(search["depart"], "2026-08-19");
  const back = str(search["returnDate"], "") || str(search["return"], "");
  const clickId = str(search["click_id"], "");
  const utm = str(search["utm_source"], "");
  const code = str(search["airline"], "");
  const airlineName = str(search["airline_name"], "") || code || "Emirates";
  const flightNumber = str(search["flight_number"], "") || str(search["flightNo"], "");
  const baseFare = str(search["base_fare"], "");
  const taxes = str(search["taxes"], "");
  const itineraryId = str(search["itinerary_id"], "");

  return {
    origin: str(search["origin"], "JFK").toUpperCase(),
    destination: str(search["destination"], "MIA").toUpperCase(),
    departDate: depart,
    ...(back ? { returnDate: back } : {}),
    airline: airlineName,
    ...(code ? { airlineCode: code } : {}),
    flightNo: flightNumber || (code ? `${code} —` : "EK 204"),
    cabin: cabinLabel(str(search["cabin"], "Business")),
    currency: str(search["currency"], "USD").toUpperCase(),
    price: str(search["price"], "1289"),
    ...(baseFare ? { baseFare } : {}),
    ...(taxes ? { taxes } : {}),
    ...(itineraryId ? { itineraryId } : {}),
    adults: num(search["adults"], 1),
    children: num(search["children"], 0),
    infants: num(search["infants"], 0),

    ...(clickId && utm ? { locked: true } : {}),
    ...(utm ? { utm_source: utm } : {}),
    ...(clickId ? { click_id: clickId } : {}),
    ...(str(search["promo_code"], "") ? { promo_code: str(search["promo_code"], "") } : {}),
    ...(str(search["discount_val"], "") ? { discount_val: str(search["discount_val"], "") } : {}),
    ...(str(search["discount_type"], "")
      ? { discount_type: str(search["discount_type"], "") }
      : {}),
    ...(str(search["discount_pct"], "") ? { discount_pct: str(search["discount_pct"], "") } : {}),
    ...(str(search["discount_amount"], "")
      ? { discount_amount: str(search["discount_amount"], "") }
      : {}),
    ...(str(search["original_price"], "")
      ? { original_price: str(search["original_price"], "") }
      : {}),
    ...(str(search["final_price"], "") ? { final_price: str(search["final_price"], "") } : {}),
  };
};

export const currencySymbol = (c: string) =>
  ({ USD: "$", EUR: "€", GBP: "£", INR: "₹", AED: "AED " })[c.toUpperCase()] ?? `${c} `;

/** "2 adults, 1 child" for a booking's travellers. */
export const travellerText = (flight: FlightSearch) => {
  const adults = flight.adults ?? 1;
  const children = flight.children ?? 0;
  const infants = flight.infants ?? 0;
  return [
    `${adults} adult${adults > 1 ? "s" : ""}`,
    children > 0 ? `${children} child${children > 1 ? "ren" : ""}` : "",
    infants > 0 ? `${infants} infant${infants > 1 ? "s" : ""}` : "",
  ]
    .filter(Boolean)
    .join(", ");
};
