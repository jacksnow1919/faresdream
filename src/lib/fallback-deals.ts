export type FallbackDeal = {
  id: string;
  origin: string;
  destination: string;
  /** null = no verified fare: the card shows "Check today's fare" instead of a price. */
  price: number | null;
  currency: string;
  cabin_class: string;
  airline: string;
  expires_at: string | null;
};

/**
 * Popular routes shown when the live deals table is empty or unreachable.
 * No prices on purpose: we only show a price we have actually found (live deals table).
 */
export const FALLBACK_DEALS: FallbackDeal[] = [
  {
    id: "fd-jfk-mia",
    origin: "JFK",
    destination: "MIA",
    price: null,
    currency: "USD",
    cabin_class: "Economy",
    airline: "Compare airlines",
    expires_at: null,
  },
  {
    id: "fd-ord-lax",
    origin: "ORD",
    destination: "LAX",
    price: null,
    currency: "USD",
    cabin_class: "Economy",
    airline: "Compare airlines",
    expires_at: null,
  },
  {
    id: "fd-lax-hnl",
    origin: "LAX",
    destination: "HNL",
    price: null,
    currency: "USD",
    cabin_class: "Economy",
    airline: "Compare airlines",
    expires_at: null,
  },
  {
    id: "fd-atl-cun",
    origin: "ATL",
    destination: "CUN",
    price: null,
    currency: "USD",
    cabin_class: "Economy",
    airline: "Compare airlines",
    expires_at: null,
  },
  {
    id: "fd-dfw-cun",
    origin: "DFW",
    destination: "CUN",
    price: null,
    currency: "USD",
    cabin_class: "Economy",
    airline: "Compare airlines",
    expires_at: null,
  },
  {
    id: "fd-jfk-cdg",
    origin: "JFK",
    destination: "CDG",
    price: null,
    currency: "USD",
    cabin_class: "Economy",
    airline: "Compare airlines",
    expires_at: null,
  },
  {
    id: "fd-jfk-lhr",
    origin: "JFK",
    destination: "LHR",
    price: null,
    currency: "USD",
    cabin_class: "Economy",
    airline: "Compare airlines",
    expires_at: null,
  },
  {
    id: "fd-sfo-nrt",
    origin: "SFO",
    destination: "NRT",
    price: null,
    currency: "USD",
    cabin_class: "Economy",
    airline: "Compare airlines",
    expires_at: null,
  },
];
