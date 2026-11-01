/** Shared PKFARE types — safe to import from client and server code. */

export interface PkfareSearchQuery {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string | undefined;
  adults?: number | undefined;
  children?: number | undefined;
  infants?: number | undefined;
  cabinClass?: "Economy" | "PremiumEconomy" | "Business" | "First" | undefined;
  currency?: string | undefined;
  solutions?: number | undefined;
  /** Optional 2-letter carrier hint passed straight to the provider. */
  airline?: string | undefined;
}

/** Raw Shopping V4 shapes. Flights/segments arrive as flat pools keyed by id. */
export interface PkfareRawSegment {
  segmentId: string;
  airline: string;
  flightNum: string;
  cabinClass?: string | null;
  departure: string;
  arrival: string;
  flightTime?: number | null;
  strDepartureDate?: string | null;
  strDepartureTime?: string | null;
  strArrivalDate?: string | null;
  strArrivalTime?: string | null;
  departureDate?: number | null;
  arrivalDate?: number | null;
  equipment?: string | null;
  aircraftCode?: string | null;
}

export interface PkfareRawFlight {
  flightId: string;
  journeyTime?: number | null;
  transferCount?: number | null;
  /** The provider really does misspell this; older payloads use `segmentIds`. */
  segmengtIds?: string[];
  segmentIds?: string[];
}

export interface PkfareRawSolution {
  solutionId?: string;
  solutionKey?: string;
  currency?: string;
  adtFare?: number;
  adtTax?: number;
  chdFare?: number;
  chdTax?: number;
  infFare?: number;
  infTax?: number;
  qCharge?: number;
  tktFee?: number;

  platingCarrier?: string;
  journeys?: Record<string, string[]>;
  refundable?: boolean | null;
}

export interface PkfareSearchResponse {
  errorCode?: string | number;
  errorMsg?: string | undefined;
  data?: {
    solutions?: PkfareRawSolution[];
    flights?: PkfareRawFlight[];
    segments?: PkfareRawSegment[];
  };
}

/** One flight within a journey, for the results page's Flight Details panel. */
export interface FareSegment {
  carrierCode: string;
  flightNo: string;
  origin: string;
  destination: string;
  /** Local "yyyy-MM-ddTHH:mm" at the departure airport. */
  departAt: string;
  /** Local "yyyy-MM-ddTHH:mm" at the arrival airport. */
  arriveAt: string;
  durationMinutes: number;
  /** Details below are only sent by some providers (Duffel). */
  carrierName?: string | undefined;
  logoUrl?: string | undefined;
  /** Set when another airline flies the plane (codeshare). */
  operatedBy?: string | undefined;
  aircraft?: string | undefined;
  originName?: string | undefined;
  destinationName?: string | undefined;
  originTerminal?: string | undefined;
  destinationTerminal?: string | undefined;
  /** Bags included per traveller, as piece counts. */
  checkedBags?: number | undefined;
  carryOnBags?: number | undefined;
}

/** An airline refund or change rule; `penalty` is the airline's fee for the booking. */
export interface FareRule {
  allowed: boolean;
  penalty?: number | undefined;
  currency?: string | undefined;
}

/** One direction of a trip: the outbound fields of a fare, or its return journey. */
export interface FareJourney {
  flightNo: string;
  origin: string;
  destination: string;
  departDate: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  durationMinutes: number;
  departMinutes: number;
  arriveMinutes: number;
  maxLayoverMinutes: number;
  stops: number;
  segments: FareSegment[];
}

export interface PkfareNormalisedFare {
  id: string;
  airline: string;
  /** 2-letter plating carrier code, used for airline + alliance filters. */
  carrierCode: string;
  flightNo: string;
  origin: string;
  destination: string;
  departDate: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  /** Total trip minutes including layovers. */
  durationMinutes: number;
  /** Departure time as minutes since midnight. */
  departMinutes: number;
  /** Arrival time as minutes since midnight. */
  arriveMinutes: number;
  /** Longest single layover in minutes (0 when non-stop). */
  maxLayoverMinutes: number;
  cabin: string;
  currency: string;
  price: number;
  refundable: boolean;
  stops: number;
  /** Outbound flights in order. */
  segments?: FareSegment[] | undefined;
  /** Return journey on round-trip fares; `price` then covers both directions. */
  inbound?: FareJourney | undefined;
  /** Estimated CO₂ per traveller in kg, when the provider reports it. */
  co2Kg?: number | undefined;
  /** Airline logo URL, when the provider supplies one. */
  logoUrl?: string | undefined;
  /** Per-traveller split of `price` (baseFare + taxes = price). */
  baseFare?: number | undefined;
  taxes?: number | undefined;
  /** Airline's name for the fare, e.g. "Basic" or "Main Cabin". */
  fareBrand?: string | undefined;
  /** Airline rules before departure; absent when the provider doesn't say. */
  refundRule?: FareRule | undefined;
  changeRule?: FareRule | undefined;
}
