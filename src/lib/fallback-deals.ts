export type FallbackDeal = {
  id: string;
  origin: string;
  destination: string;
  price: number;
  currency: string;
  cabin_class: string;
  airline: string;
  expires_at: string | null;
};

/** Curated inventory shown when the live deals table is empty or unreachable. */
export const FALLBACK_DEALS: FallbackDeal[] = [
  {
    id: "fd-jfk-mia",
    origin: "JFK",
    destination: "MIA",
    price: 123,
    currency: "USD",
    cabin_class: "Economy",
    airline: "American Airlines",
    expires_at: null,
  },
  {
    id: "fd-ord-lax",
    origin: "ORD",
    destination: "LAX",
    price: 149,
    currency: "USD",
    cabin_class: "Economy",
    airline: "United Airlines",
    expires_at: null,
  },
  {
    id: "fd-lax-hnl",
    origin: "LAX",
    destination: "HNL",
    price: 189,
    currency: "USD",
    cabin_class: "Economy",
    airline: "Hawaiian Airlines",
    expires_at: null,
  },
  {
    id: "fd-atl-cun",
    origin: "ATL",
    destination: "CUN",
    price: 198,
    currency: "USD",
    cabin_class: "Economy",
    airline: "Delta Air Lines",
    expires_at: null,
  },
  {
    id: "fd-dfw-cun",
    origin: "DFW",
    destination: "CUN",
    price: 210,
    currency: "USD",
    cabin_class: "Economy",
    airline: "American Airlines",
    expires_at: null,
  },
  {
    id: "fd-jfk-cdg",
    origin: "JFK",
    destination: "CDG",
    price: 459,
    currency: "USD",
    cabin_class: "Economy",
    airline: "Air France",
    expires_at: null,
  },
  {
    id: "fd-jfk-lhr",
    origin: "JFK",
    destination: "LHR",
    price: 499,
    currency: "USD",
    cabin_class: "Economy",
    airline: "British Airways",
    expires_at: null,
  },
  {
    id: "fd-sfo-nrt",
    origin: "SFO",
    destination: "NRT",
    price: 689,
    currency: "USD",
    cabin_class: "Premium Economy",
    airline: "Japan Airlines",
    expires_at: null,
  },
];
