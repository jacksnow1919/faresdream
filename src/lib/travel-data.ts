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
    slug: "emirates",
    name: "Emirates",
    code: "EK",
    cabin: "Business Class · A380 Upper Deck",
    seat: "Lie-flat 78in pitch, 1-2-1 direct aisle access",
    baggage: "2 x 32kg checked · 7kg cabin bag + 7kg briefcase",
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
    baggage: "2 x 32kg checked · 2 cabin bags, 15kg total",
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
    baggage: "2 x 32kg checked · 2 x 8kg cabin",
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
    review: "Book the Cook dining, immaculate cabin crew and one of the widest business class seats flying.",
    fromPrice: 3120,
  },
  {
    slug: "air-india",
    name: "Air India",
    code: "AI",
    cabin: "Business Class · A350-900",
    seat: "Fully flat suite with a privacy door and direct aisle access, 1-2-1",
    baggage: "2 x 32kg checked",
    lounge: "Maharaja Lounge, Delhi Terminal 3 (opened Feb 2026)",
    rating: 0,
    review: "Nonstop flights from New York, Newark and San Francisco to India, with new A350 cabins on Delhi–New York.",
    fromPrice: 0,
  },
  {
    slug: "british-airways",
    name: "British Airways",
    code: "BA",
    cabin: "Club Suite business class",
    seat: "Fully flat seat with a door and direct aisle access, 1-2-1 (older Club World on some aircraft)",
    baggage: "2 x 32kg checked",
    lounge: "Galleries Club lounges, Heathrow Terminal 5",
    rating: 0,
    review: "Nonstop to London from 27 US cities, with onward flights to Europe, India and Africa.",
    fromPrice: 0,
  },
  {
    slug: "etihad-airways",
    name: "Etihad Airways",
    code: "EY",
    cabin: "Business Studio · A350-1000 and 787-9",
    seat: "Fully flat suite with a sliding door and direct aisle access",
    baggage: "2 x 32kg checked",
    lounge: "Etihad Business Lounge, Zayed International Terminal A",
    rating: 0,
    review: "Nonstop to Abu Dhabi from 6 US airports, with US customs cleared before you fly home.",
    fromPrice: 0,
  },
  {
    slug: "cathay-pacific",
    name: "Cathay Pacific",
    code: "CX",
    cabin: "Business Class · Aria Suite on selected 777-300ER",
    seat: "Fully flat bed; Aria Suite adds a privacy door and 24-inch 4K screen",
    baggage: "2 x 32kg checked",
    lounge: "The Pier and The Deck business lounges, Hong Kong",
    rating: 0,
    review: "Nonstop to Hong Kong from 7 US cities, connecting across Asia, India and Australia.",
    fromPrice: 0,
  },
  {
    slug: "eva-air",
    name: "EVA Air",
    code: "BR",
    cabin: "Royal Laurel business class",
    seat: "Fully flat seat with direct aisle access, 1-2-1",
    baggage: "2 x 32kg checked",
    lounge: "The Infinity lounge, Taoyuan Terminal 2",
    rating: 0,
    review: "Nonstop to Taipei from 8 US cities, with easy connections to Japan and Southeast Asia.",
    fromPrice: 0,
  },
  {
    slug: "philippine-airlines",
    name: "Philippine Airlines",
    code: "PR",
    cabin: "Business Class · A350-1000 and A350-900",
    seat: "Fully flat bed; A350-1000 suites have privacy doors",
    baggage: "2 x 32kg checked",
    lounge: "Mabuhay Lounge, Manila Terminal 1",
    rating: 0,
    review: "Nonstop to Manila from Los Angeles, San Francisco, New York, Seattle, Chicago and Honolulu.",
    fromPrice: 0,
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
