export type Airline = {
  slug: string;
  name: string;
  code: string;
  cabin: string;
  seat: string;
  baggage: string;
  lounge: string;
  rating: number;
  review: string;
  fromPrice: number;
};

export const airlines: Airline[] = [
  {
    slug: "air-india",
    name: "Air India",
    code: "AI",
    cabin: "Business Class · A350-900",
    seat: "Lie-flat suite, 1-2-1 layout with direct aisle access (A350)",
    baggage: "2 x 32kg checked in business · 2 x 23kg in economy (USA routes)",
    lounge: "Air India lounges in Delhi and Mumbai; Star Alliance partner lounges in the USA",
    rating: 0,
    review: "Nonstop flights from New York JFK and Newark to Delhi and Mumbai, and from San Francisco to Delhi, with two free checked bags in economy.",
    fromPrice: 739,
  },
  {
    slug: "emirates",
    name: "Emirates",
    code: "EK",
    cabin: "Business Class · A380 Upper Deck",
    seat: "Lie-flat 78in pitch, 1-2-1 direct aisle access",
    baggage: "2 x 32kg checked · 2 x 7kg cabin",
    lounge: "Emirates Business Lounge, Dubai Concourse A & B",
    rating: 4.8,
    review:
      "Onboard lounge, Shower Spa on A380 first, and one of the most generous baggage policies in the sky.",
    fromPrice: 2140,
  },
  {
    slug: "qatar-airways",
    name: "Qatar Airways",
    code: "QR",
    cabin: "Qsuite · Business Class",
    seat: "Quad suite with closing door, 79in fully flat bed",
    baggage: "2 x 32kg checked · 2 x 7kg cabin",
    lounge: "Al Mourjan Business Lounge, Doha",
    rating: 4.9,
    review: "The Qsuite remains the benchmark: privacy doors, double beds and dine-on-demand.",
    fromPrice: 2450,
  },
  {
    slug: "lufthansa",
    name: "Lufthansa",
    code: "LH",
    cabin: "Business Class · A350 / 747-8",
    seat: "Fully flat 1.98m bed, 2-2-2 configuration",
    baggage: "2 x 32kg checked · 2 x 8kg cabin",
    lounge: "Senator & Business Lounges, Frankfurt / Munich",
    rating: 4.5,
    review: "Precision German service, excellent European connectivity and stellar lounge network.",
    fromPrice: 1975,
  },
  {
    slug: "turkish-airlines",
    name: "Turkish Airlines",
    code: "TK",
    cabin: "Business Class · Flying Chef",
    seat: "Lie-flat 188cm bed, 2-2-2 configuration",
    baggage: "2 x 32kg checked · 1 x 8kg cabin",
    lounge: "Turkish Airlines Lounge, Istanbul (IST)",
    rating: 4.6,
    review: "Best value premium cabin with the widest network and an on-board Flying Chef.",
    fromPrice: 1690,
  },
  {
    slug: "singapore-airlines",
    name: "Singapore Airlines",
    code: "SQ",
    cabin: "Business Class · A350 long haul",
    seat: "78in wide bed, forward-facing 1-2-1",
    baggage: "2 x 32kg checked · 2 x 7kg cabin",
    lounge: "SilverKris Business Lounge, Changi T3",
    rating: 4.9,
    review: "Book the Cook dining, immaculate cabin crew and the widest business seat in the sky.",
    fromPrice: 3120,
  },
];

export type RouteInfo = {
  id: string;
  label: string;
  origin: string;
  destination: string;
  duration: string;
  aircraft: string;
  bestWindow: string;
  fares: { airline: string; price: number; stops: string }[];
};

export const routes: RouteInfo[] = [
  {
    id: "nyc-london",
    label: "New York → London",
    origin: "JFK",
    destination: "LHR",
    duration: "7h 05m non-stop",
    aircraft: "Boeing 777-300ER / A350-1000",
    bestWindow: "Book 6–9 weeks out, depart Tue/Wed",
    fares: [
      { airline: "British Airways", price: 1890, stops: "Non-stop" },
      { airline: "Virgin Atlantic", price: 1940, stops: "Non-stop" },
      { airline: "Lufthansa", price: 1780, stops: "1 Stop · FRA" },
    ],
  },
  {
    id: "nyc-delhi",
    label: "New York → Delhi",
    origin: "JFK",
    destination: "DEL",
    duration: "14h 20m non-stop",
    aircraft: "Boeing 777-300ER / A350-900",
    bestWindow: "Book 8–12 weeks out, avoid Dec & Jun",
    fares: [
      { airline: "Emirates", price: 2140, stops: "1 Stop · DXB" },
      { airline: "Air India", price: 2290, stops: "Non-stop" },
      { airline: "Qatar Airways", price: 2050, stops: "1 Stop · DOH" },
    ],
  },
  {
    id: "lax-dubai",
    label: "Los Angeles → Dubai",
    origin: "LAX",
    destination: "DXB",
    duration: "16h 05m non-stop",
    aircraft: "Airbus A380-800",
    bestWindow: "Book 10 weeks out, depart Sat/Sun",
    fares: [
      { airline: "Emirates", price: 2890, stops: "Non-stop" },
      { airline: "Turkish Airlines", price: 2480, stops: "1 Stop · IST" },
      { airline: "Qatar Airways", price: 2620, stops: "1 Stop · DOH" },
    ],
  },
];

export { destinations, type Destination } from "./destinations";

export const upsells = [
  { id: "lounge", label: "Airport Lounge Pass", detail: "Premium lounge access at both ends", price: 89 },
  { id: "insurance", label: "Travel Insurance", detail: "Medical + cancellation cover to $250k", price: 129 },
  { id: "priority", label: "Priority Boarding", detail: "Zone 1 boarding & fast-track security", price: 39 },
  { id: "chauffeur", label: "Chauffeur Transfer", detail: "Luxury sedan airport transfer, both cities", price: 149 },
];
