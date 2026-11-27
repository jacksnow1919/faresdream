/**
 * Extra content for the ASAP-style airline pages (/airlines and /airlines/$slug):
 * logo, one-line selling point, cabins, a destination network grouped by region and
 * three "Fly with" highlights. Keep it factual and conservative: routes and cabins change,
 * so review at least twice a year. No prices here (fares change daily).
 */
export type CabinKey = "economy" | "premium" | "business" | "first";

export type AirlineProfile = {
  /** Self-hosted logo in /public/airlines (small SVG, no third-party request). */
  logo: string;
  /** One line for the hub card. */
  tagline: string;
  /** Cabins this airline sells on long-haul flights from the US. Missing key = not sold on most routes. */
  cabins: Partial<Record<CabinKey, string>>;
  /** Selected destinations by region (city names; slug links to our destination page when we have one). */
  network: { region: string; cities: { city: string; slug?: string }[] }[];
  /** Three short highlight cards. */
  highlights: { title: string; text: string }[];
  about: string;
};

export const CABIN_LABEL: Record<CabinKey, string> = {
  economy: "Economy",
  premium: "Premium Economy",
  business: "Business",
  first: "First",
};

export const airlineProfiles: Record<string, AirlineProfile> = {
  emirates: {
    logo: "/airlines/EK.svg",
    tagline: "Dubai-based carrier with A380s and a generous baggage allowance",
    cabins: {
      economy:
        "Economy is sold on every Emirates flight from the US. Long-haul flights include meals, drinks and the ice seatback entertainment system. Cheaper Special and Saver fares include fewer checked bags, so compare fare types before you pay.",
      premium:
        "Premium Economy is fitted on selected A380 and refurbished Boeing 777 aircraft, with wider leather seats, more legroom and upgraded meals. It isn't on every US route, so check the seat map for your flight.",
      business:
        "Business Class has lie-flat seats; on the A380 there is an onboard lounge for Business and First passengers. Business tickets include Emirates lounge access in Dubai and chauffeur-drive in many cities.",
      first:
        "First Class private suites are sold on many A380 and Boeing 777 flights, including some US routes, with lounge access and chauffeur-drive.",
    },
    network: [
      { region: "Middle East", cities: [{ city: "Dubai", slug: "dubai" }] },
      {
        region: "Asia",
        cities: [
          { city: "Mumbai", slug: "mumbai" },
          { city: "Delhi", slug: "delhi" },
          { city: "Bangkok" },
          { city: "Singapore", slug: "singapore" },
          { city: "Manila" },
          { city: "Tokyo", slug: "tokyo" },
          { city: "Colombo" },
          { city: "Dhaka" },
        ],
      },
      {
        region: "Africa",
        cities: [{ city: "Lagos", slug: "lagos" }, { city: "Nairobi" }, { city: "Johannesburg" }, { city: "Cairo" }, { city: "Accra" }],
      },
      { region: "Europe", cities: [{ city: "London", slug: "london" }, { city: "Paris", slug: "paris" }, { city: "Rome" }, { city: "Athens" }] },
      { region: "Oceania", cities: [{ city: "Sydney" }, { city: "Melbourne" }] },
    ],
    highlights: [
      { title: "One stop via Dubai", text: "Fly from the US to India, Africa, Asia and Australia with a single connection at Dubai International." },
      { title: "A380 on many routes", text: "Emirates runs the world's largest A380 fleet, with a quieter double-deck cabin on many long-haul flights." },
      { title: "Bags included", text: "Most fares from the US include checked bags; Business and First include two 32 kg bags." },
    ],
    about:
      "Emirates is the flag carrier of the United Arab Emirates, based at Dubai International Airport (DXB). It flies to more than 140 cities and isn't part of an airline alliance, though it partners with airlines such as Qantas. From the US it is a popular one-stop option to India, Africa and Asia.",
  },
  "qatar-airways": {
    logo: "/airlines/QR.svg",
    tagline: "Doha hub, oneworld member, and the Qsuite business class",
    cabins: {
      economy:
        "Economy on long-haul flights from the US includes meals, drinks and Oryx One entertainment. Lighter fares carry stricter change rules, so check the fare conditions before you pay.",
      business:
        "Business Class on many long-haul flights is the Qsuite: a lie-flat suite with a closing door. Business tickets include lounge access at Hamad International in Doha.",
    },
    network: [
      { region: "Middle East", cities: [{ city: "Doha" }, { city: "Dubai", slug: "dubai" }] },
      {
        region: "Asia",
        cities: [
          { city: "Delhi", slug: "delhi" },
          { city: "Mumbai", slug: "mumbai" },
          { city: "Bengaluru" },
          { city: "Kathmandu" },
          { city: "Manila" },
          { city: "Bangkok" },
          { city: "Singapore", slug: "singapore" },
          { city: "Tokyo", slug: "tokyo" },
        ],
      },
      { region: "Africa", cities: [{ city: "Lagos", slug: "lagos" }, { city: "Nairobi" }, { city: "Johannesburg" }, { city: "Addis Ababa" }] },
      { region: "Europe", cities: [{ city: "London", slug: "london" }, { city: "Paris", slug: "paris" }, { city: "Rome" }, { city: "Athens" }] },
      { region: "Oceania", cities: [{ city: "Sydney" }, { city: "Melbourne" }] },
    ],
    highlights: [
      { title: "Connect in Doha", text: "One stop at Hamad International links the US with India, Nepal, the Philippines, Africa and more." },
      { title: "Qsuite business class", text: "Lie-flat suites with a privacy door on many long-haul aircraft." },
      { title: "oneworld member", text: "Earn and use miles with partners such as American Airlines and British Airways." },
    ],
    about:
      "Qatar Airways is the national airline of Qatar, based at Hamad International Airport (DOH) in Doha, and a member of the oneworld alliance. From the US it is a common one-stop choice for travel to India, South Asia, the Middle East and Africa.",
  },
  lufthansa: {
    logo: "/airlines/LH.svg",
    tagline: "Germany's flag carrier, connecting via Frankfurt and Munich",
    cabins: {
      economy:
        "Economy on transatlantic flights includes meals and drinks. The cheapest Light fares don't include a checked bag, so compare Light with Classic if you're checking luggage.",
      premium:
        "Premium Economy is sold on most long-haul aircraft, with a wider seat, more legroom and two checked bags.",
      business:
        "Business Class has lie-flat seats on long-haul flights and includes Lufthansa lounge access in Frankfurt and Munich.",
      first:
        "First Class is sold on selected long-haul aircraft from Frankfurt and Munich, including some US routes.",
    },
    network: [
      {
        region: "Europe",
        cities: [{ city: "Frankfurt" }, { city: "Munich" }, { city: "London", slug: "london" }, { city: "Paris", slug: "paris" }, { city: "Rome" }, { city: "Athens" }, { city: "Berlin" }],
      },
      {
        region: "Asia",
        cities: [{ city: "Delhi", slug: "delhi" }, { city: "Mumbai", slug: "mumbai" }, { city: "Bengaluru" }, { city: "Tokyo", slug: "tokyo" }, { city: "Singapore", slug: "singapore" }, { city: "Bangkok" }],
      },
      { region: "Middle East", cities: [{ city: "Dubai", slug: "dubai" }] },
      { region: "Africa", cities: [{ city: "Lagos", slug: "lagos" }, { city: "Johannesburg" }, { city: "Cairo" }] },
    ],
    highlights: [
      { title: "Two big hubs", text: "Connect in Frankfurt or Munich to cities across Europe, India and Africa." },
      { title: "Star Alliance", text: "Book connections with partners such as United and Air Canada on one ticket." },
      { title: "Four cabins", text: "Choose Economy, Premium Economy, Business or, on some flights, First." },
    ],
    about:
      "Lufthansa is Germany's largest airline and a founding member of Star Alliance. Its main hubs are Frankfurt (FRA) and Munich (MUC), and it flies from many US cities with connections across Europe, Asia and Africa.",
  },
  "turkish-airlines": {
    logo: "/airlines/TK.svg",
    tagline: "One stop in Istanbul to more countries than almost any airline",
    cabins: {
      economy:
        "Economy on long-haul flights includes meals cooked onboard and drinks. EcoFly, ExtraFly and PrimeFly fares differ in baggage and change rules.",
      business:
        "Business Class on long-haul aircraft has lie-flat seats, and tickets include the Turkish Airlines lounge at Istanbul Airport.",
    },
    network: [
      { region: "Europe", cities: [{ city: "Istanbul" }, { city: "London", slug: "london" }, { city: "Paris", slug: "paris" }, { city: "Rome" }, { city: "Athens" }] },
      {
        region: "Asia",
        cities: [{ city: "Delhi", slug: "delhi" }, { city: "Mumbai", slug: "mumbai" }, { city: "Tokyo", slug: "tokyo" }, { city: "Singapore", slug: "singapore" }, { city: "Bangkok" }, { city: "Manila" }],
      },
      { region: "Middle East", cities: [{ city: "Dubai", slug: "dubai" }] },
      {
        region: "Africa",
        cities: [{ city: "Lagos", slug: "lagos" }, { city: "Nairobi" }, { city: "Johannesburg" }, { city: "Cairo" }, { city: "Accra" }, { city: "Addis Ababa" }],
      },
    ],
    highlights: [
      { title: "Huge network", text: "Turkish Airlines flies to more countries than almost any other airline, all through Istanbul." },
      { title: "Touristanbul", text: "Free city tours for eligible passengers on long Istanbul layovers; check the conditions before booking." },
      { title: "Star Alliance", text: "Earn and use miles with United, Lufthansa and other partners." },
    ],
    about:
      "Turkish Airlines is the flag carrier of Türkiye, based at Istanbul Airport (IST), and a member of Star Alliance. It flies from many US cities, which makes it a common one-stop option to Europe, Africa, the Middle East and Asia.",
  },
  "singapore-airlines": {
    logo: "/airlines/SQ.svg",
    tagline: "Singapore hub, Star Alliance, and some of the longest non-stops",
    cabins: {
      economy:
        "Economy includes meals, drinks and KrisWorld entertainment. Lite and Value fares cost less but have stricter change rules.",
      premium:
        "Premium Economy has a wider seat, more recline and upgraded meals, and is sold on most long-haul flights from the US.",
      business:
        "Business Class has wide lie-flat seats and includes SilverKris lounge access at Changi Airport.",
      first:
        "First Class and Suites are sold on selected aircraft and routes only.",
    },
    network: [
      {
        region: "Asia",
        cities: [
          { city: "Singapore", slug: "singapore" },
          { city: "Delhi", slug: "delhi" },
          { city: "Mumbai", slug: "mumbai" },
          { city: "Bangkok" },
          { city: "Manila" },
          { city: "Tokyo", slug: "tokyo" },
          { city: "Bali (Denpasar)" },
          { city: "Ho Chi Minh City" },
        ],
      },
      { region: "Oceania", cities: [{ city: "Sydney" }, { city: "Melbourne" }] },
      { region: "Europe", cities: [{ city: "London", slug: "london" }, { city: "Paris", slug: "paris" }, { city: "Frankfurt" }] },
    ],
    highlights: [
      { title: "Long non-stops", text: "Non-stop flights link Singapore with US cities such as New York (Newark), Los Angeles and San Francisco." },
      { title: "Changi connections", text: "Connect at Singapore Changi to Southeast Asia, India and Australia." },
      { title: "Star Alliance", text: "Earn and use miles with United, Lufthansa and other partners." },
    ],
    about:
      "Singapore Airlines is the flag carrier of Singapore, based at Changi Airport (SIN), and a member of Star Alliance. It runs non-stop flights from the US to Singapore and connects onwards across Southeast Asia, India and Australia.",
  },
};
