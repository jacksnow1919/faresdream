/**
 * Rich airline pages (/airlines/$slug). One template, real data per airline.
 * Every fact carries a source; schedules change often, so each profile has a `checked` date
 * and the page tells readers to confirm on the airline's own site.
 */

export type AirlineRouteStatus = "operating" | "suspended" | "ended";

export type AirlineUsRoute = {
  from: { code: string; city: string };
  to: { code: string; city: string };
  flights: string;
  status: AirlineRouteStatus;
  /** Plain-English note, e.g. "Nonstop both ways" or "Suspended since June 1, 2026". */
  note: string;
  perWeek?: string;
  aircraft?: string;
  /** Approximate block time, westbound to the US / eastbound to India. */
  timeWest?: string;
  timeEast?: string;
  /** Our route page slug, when we have one. */
  routeSlug?: string;
  /** Cheapest round trip seen on this airline for the route, with the source route key. */
  fare?: { price: number; key: string };
};

export type AirlineProfile = {
  slug: string;
  checked: string;
  quickAnswer: string;
  facts: { label: string; value: string }[];
  usRoutes: AirlineUsRoute[];
  baggage: { cabin: string; checked: string; note?: string }[];
  baggageSource: string;
  cabins: { name: string; detail: string }[];
  loyalty: string;
  partners: string;
  tips: string[];
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  /** Destination guide slugs to link. */
  destinations: string[];
  /** Other airlines on the same corridor (slugs on our site). */
  related: string[];
};

export const airlineProfiles: Record<string, AirlineProfile> = {
  "air-india": {
    slug: "air-india",
    checked: "2026-11-19",
    quickAnswer:
      "Air India is India's flag carrier and a Star Alliance member. As of November 19, 2026 it flies nonstop from New York JFK and Newark to both Delhi and Mumbai, and from San Francisco to Delhi (the return to San Francisco stops in Kolkata or Vienna). Chicago and Washington Dulles are suspended. Economy includes two 23 kg checked bags on US routes, and the cheapest Air India round trips we saw were about $739 (Newark–Mumbai) and $798 (New York–Delhi).",
    facts: [
      { label: "Airline code", value: "AI (IATA) · AIC (ICAO)" },
      { label: "Alliance", value: "Star Alliance (since 2014)" },
      { label: "Main hub", value: "Delhi (DEL); also Mumbai (BOM) and Bengaluru (BLR)" },
      { label: "US airports served", value: "New York JFK, Newark (EWR), San Francisco (SFO)" },
      { label: "Nonstop US–India routes", value: "5 operating (Nov 2026)" },
      { label: "Loyalty program", value: "Maharaja Club" },
    ],
    usRoutes: [
      {
        from: { code: "JFK", city: "New York" },
        to: { code: "DEL", city: "Delhi" },
        flights: "AI101 / AI102",
        status: "operating",
        note: "Nonstop both ways",
        perWeek: "7",
        aircraft: "Airbus A350-900",
        timeWest: "≈17h30",
        timeEast: "≈15h10",
        routeSlug: "jfk-to-del",
        fare: { price: 798, key: "JFK-DEL" },
      },
      {
        from: { code: "JFK", city: "New York" },
        to: { code: "BOM", city: "Mumbai" },
        flights: "AI116 / AI119",
        status: "operating",
        note: "Nonstop both ways",
        perWeek: "7",
        aircraft: "Boeing 777-300ER",
        timeWest: "≈16h50",
        timeEast: "≈15h",
      },
      {
        from: { code: "EWR", city: "Newark" },
        to: { code: "DEL", city: "Delhi" },
        flights: "AI105 / AI106",
        status: "operating",
        note: "Nonstop both ways",
        perWeek: "4",
        aircraft: "Airbus A350-900",
        timeWest: "≈17h40",
        timeEast: "≈15h",
      },
      {
        from: { code: "EWR", city: "Newark" },
        to: { code: "BOM", city: "Mumbai" },
        flights: "AI144 / AI191",
        status: "operating",
        note: "Nonstop both ways",
        perWeek: "3",
        aircraft: "Boeing 777-300ER",
        timeWest: "≈17h",
        timeEast: "≈15h",
        routeSlug: "ewr-to-bom",
        fare: { price: 739, key: "EWR-BOM" },
      },
      {
        from: { code: "SFO", city: "San Francisco" },
        to: { code: "DEL", city: "Delhi" },
        flights: "AI183 / AI184",
        status: "operating",
        note: "Nonstop to San Francisco; one stop (Kolkata or Vienna) to Delhi",
        perWeek: "4 (Nov) · 6 (Dec–Feb)",
        aircraft: "Boeing 777-300ER",
        timeWest: "≈16h05",
        timeEast: "≈22h incl. stop",
      },
      {
        from: { code: "ORD", city: "Chicago" },
        to: { code: "DEL", city: "Delhi" },
        flights: "—",
        status: "suspended",
        note: "Suspended since June 1, 2026; no return date",
      },
      {
        from: { code: "IAD", city: "Washington Dulles" },
        to: { code: "DEL", city: "Delhi" },
        flights: "—",
        status: "suspended",
        note: "Suspended since September 1, 2025",
      },
    ],
    baggage: [
      { cabin: "Economy", checked: "2 bags × 23 kg (50 lb)", note: "The lowest fare brand can include less; check your fare." },
      { cabin: "Premium economy", checked: "2 bags × 23 kg (50 lb)" },
      { cabin: "Business", checked: "2 bags × 32 kg (70 lb)" },
      { cabin: "First (some 777s)", checked: "2 bags × 32 kg (70 lb)" },
    ],
    baggageSource: "https://www.airindia.com/in/en/travel-information/baggage-guidelines/checked-baggage-allowance.html",
    cabins: [
      {
        name: "A350-900 (JFK and Newark to Delhi)",
        detail: "Air India's newest long-haul cabin: 28 business suites in a 1-2-1 layout (every seat has aisle access), 24 premium economy and 264 economy seats.",
      },
      {
        name: "777-300ER (Mumbai routes, San Francisco)",
        detail: "Two versions fly under the same type: refitted aircraft with first, business and economy (no premium economy), and older aircraft with the cabin Air India is replacing. The version can change by date, so we check it before you pay.",
      },
    ],
    loyalty:
      "Maharaja Club is Air India's program. Because Air India is in Star Alliance, you can also earn and use United MileagePlus miles on Air India flights.",
    partners:
      "For connections beyond JFK, Newark and San Francisco, Air India works with US airlines including United, so one ticket can cover a domestic flight plus the nonstop to India.",
    tips: [
      "Book the A350 if the cabin matters: JFK–Delhi and Newark–Delhi use Air India's newest seats.",
      "Fares on New York–India routes are lowest in February–April and highest in December and June–July (KAYAK monthly data, all airlines).",
      "Flights to the US can need a fuel stop in strong January headwinds; Air India has warned this may happen again.",
      "From Chicago or Washington, Air India is not flying nonstop right now. Compare one-stop options or connect at New York or Newark.",
    ],
    faqs: [
      {
        q: "Does Air India fly nonstop from the USA to India?",
        a: "Yes. As of November 19, 2026 Air India flies nonstop between New York JFK and Delhi and Mumbai, Newark and Delhi and Mumbai, and from Delhi to San Francisco. The San Francisco to Delhi flight stops in Kolkata or Vienna.",
      },
      {
        q: "Does Air India still fly from Chicago?",
        a: "Not right now. Air India suspended Delhi–Chicago on June 1, 2026 and has not announced a return date. Washington Dulles has been suspended since September 1, 2025.",
      },
      {
        q: "What is Air India's baggage allowance from the USA?",
        a: "On USA routes, economy and premium economy include two checked bags of 23 kg (50 lb) each; business and first include two bags of 32 kg (70 lb) each. The cheapest economy fare can include less, so check the baggage line on your fare.",
      },
      {
        q: "How long is the Air India flight from New York to Delhi?",
        a: "About 15 hours 10 minutes from New York to Delhi and about 17 and a half hours from Delhi to New York, on the Airbus A350-900.",
      },
      {
        q: "How much does an Air India flight from New York to Delhi cost?",
        a: "The cheapest Air India round trip KAYAK recorded on JFK–Delhi in the last 12 months was about $798. Across all airlines the route averages about $927, with February and April the cheapest months.",
      },
      {
        q: "Is Air India part of Star Alliance?",
        a: "Yes. Air India joined Star Alliance in 2014, so you can earn and redeem United MileagePlus and other Star Alliance miles on its flights.",
      },
      {
        q: "Can I book Air India flights by phone?",
        a: "Yes. Our travel agents compare Air India with one-stop options on Emirates, Qatar Airways, Lufthansa and others, 24 hours a day.",
      },
    ],
    sources: [
      { label: "Air India: checked baggage allowance", url: "https://www.airindia.com/in/en/travel-information/baggage-guidelines/checked-baggage-allowance.html" },
      { label: "Air India: flight schedule", url: "https://www.airindia.com/in/en/book/flight-schedule.html" },
      { label: "KAYAK: New York JFK to Delhi route data", url: "https://www.kayak.com/flight-routes/New-York-John-F-Kennedy-Intl-JFK/New-Delhi-Indira-Gandhi-Intl-DEL" },
      { label: "KAYAK: Newark to Mumbai route data", url: "https://www.kayak.com/flight-routes/Newark-Liberty-Intl-EWR/Mumbai-BOM" },
      { label: "Route status, Nov 18, 2026 (compiled from Air India, AeroRoutes, CAPA)", url: "https://www.voldeluxe.com/journal/air-india-nonstop-flights-usa-canada-to-india-routes" },
      { label: "Wikipedia: Air India (codes, alliance, hubs)", url: "https://en.wikipedia.org/wiki/Air_India" },
    ],
    destinations: ["delhi", "mumbai"],
    related: ["emirates", "qatar-airways", "lufthansa", "turkish-airlines"],
  },
};
