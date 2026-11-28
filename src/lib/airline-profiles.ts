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
          { city: "Manila", slug: "manila" },
          { city: "Tokyo", slug: "tokyo" },
          { city: "Colombo" },
          { city: "Dhaka" },
        ],
      },
      {
        region: "Africa",
        cities: [{ city: "Lagos", slug: "lagos" }, { city: "Nairobi", slug: "nairobi" }, { city: "Johannesburg" }, { city: "Cairo", slug: "cairo" }, { city: "Accra", slug: "accra" }],
      },
      { region: "Europe", cities: [{ city: "London", slug: "london" }, { city: "Paris", slug: "paris" }, { city: "Rome", slug: "rome" }, { city: "Athens", slug: "athens" }] },
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
      { region: "Middle East", cities: [{ city: "Doha", slug: "doha" }, { city: "Dubai", slug: "dubai" }] },
      {
        region: "Asia",
        cities: [
          { city: "Delhi", slug: "delhi" },
          { city: "Mumbai", slug: "mumbai" },
          { city: "Bengaluru" },
          { city: "Kathmandu" },
          { city: "Manila", slug: "manila" },
          { city: "Bangkok" },
          { city: "Singapore", slug: "singapore" },
          { city: "Tokyo", slug: "tokyo" },
        ],
      },
      { region: "Africa", cities: [{ city: "Lagos", slug: "lagos" }, { city: "Nairobi", slug: "nairobi" }, { city: "Johannesburg" }, { city: "Addis Ababa", slug: "addis-ababa" }] },
      { region: "Europe", cities: [{ city: "London", slug: "london" }, { city: "Paris", slug: "paris" }, { city: "Rome", slug: "rome" }, { city: "Athens", slug: "athens" }] },
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
        cities: [{ city: "Frankfurt" }, { city: "Munich" }, { city: "London", slug: "london" }, { city: "Paris", slug: "paris" }, { city: "Rome", slug: "rome" }, { city: "Athens", slug: "athens" }, { city: "Berlin" }],
      },
      {
        region: "Asia",
        cities: [{ city: "Delhi", slug: "delhi" }, { city: "Mumbai", slug: "mumbai" }, { city: "Bengaluru" }, { city: "Tokyo", slug: "tokyo" }, { city: "Singapore", slug: "singapore" }, { city: "Bangkok" }],
      },
      { region: "Middle East", cities: [{ city: "Dubai", slug: "dubai" }] },
      { region: "Africa", cities: [{ city: "Lagos", slug: "lagos" }, { city: "Johannesburg" }, { city: "Cairo", slug: "cairo" }] },
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
      { region: "Europe", cities: [{ city: "Istanbul", slug: "istanbul" }, { city: "London", slug: "london" }, { city: "Paris", slug: "paris" }, { city: "Rome", slug: "rome" }, { city: "Athens", slug: "athens" }] },
      {
        region: "Asia",
        cities: [{ city: "Delhi", slug: "delhi" }, { city: "Mumbai", slug: "mumbai" }, { city: "Tokyo", slug: "tokyo" }, { city: "Singapore", slug: "singapore" }, { city: "Bangkok" }, { city: "Manila", slug: "manila" }],
      },
      { region: "Middle East", cities: [{ city: "Dubai", slug: "dubai" }] },
      {
        region: "Africa",
        cities: [{ city: "Lagos", slug: "lagos" }, { city: "Nairobi", slug: "nairobi" }, { city: "Johannesburg" }, { city: "Cairo", slug: "cairo" }, { city: "Accra", slug: "accra" }, { city: "Addis Ababa", slug: "addis-ababa" }],
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
          { city: "Manila", slug: "manila" },
          { city: "Tokyo", slug: "tokyo" },
          { city: "Bali (Denpasar)" },
          { city: "Ho Chi Minh City", slug: "ho-chi-minh-city" },
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
  "air-india": {
    logo: "/airlines/AI.svg",
    tagline: "India's flag carrier, with nonstop flights from New York, Newark and San Francisco",
    cabins: {
      economy:
        "Economy is sold on every Air India flight from the US. Value fares include 1 checked bag and Classic and Flex fares include 2, so compare fare types before you pay.",
      premium:
        "Premium Economy is on the A350-900 that flies Delhi–New York JFK: 24 seats in a 2-4-2 layout with leg rests and seatback screens. Most 777-300ERs don't have it.",
      business:
        "On the A350-900, Business is a fully flat suite with a privacy door and direct aisle access in a 1-2-1 layout. The older 777-300ERs on San Francisco and Mumbai flights keep the previous business seat.",
      first:
        "First is sold only on some Boeing 777-300ERs, such as on Mumbai–New York, and the aircraft on a given day can change.",
    },
    network: [
      {
        region: "India",
        cities: [
          { city: "Delhi", slug: "delhi" },
          { city: "Mumbai", slug: "mumbai" },
          { city: "Bengaluru" },
          { city: "Hyderabad" },
          { city: "Chennai" },
          { city: "Kochi" },
          { city: "Ahmedabad" },
          { city: "Kolkata" },
        ],
      },
      { region: "Asia", cities: [{ city: "Singapore", slug: "singapore" }, { city: "Bangkok" }, { city: "Tokyo", slug: "tokyo" }, { city: "Kathmandu" }, { city: "Colombo" }] },
      { region: "Middle East", cities: [{ city: "Dubai", slug: "dubai" }] },
      { region: "Oceania", cities: [{ city: "Sydney" }, { city: "Melbourne" }] },
    ],
    highlights: [
      { title: "Nonstop to India", text: "Daily Delhi–New York JFK and Mumbai–New York JFK, plus Newark and San Francisco, so you can reach India without a connection." },
      { title: "Two bags on most fares", text: "Classic and Flex Economy fares include 2 checked bags of 23 kg on US routes, which matters for long family trips." },
      { title: "Star Alliance", text: "Air India is in Star Alliance, so you can earn and use United MileagePlus miles on its flights." },
    ],
    about:
      "Air India is India's flag carrier, founded in 1932 as Tata Airlines and returned to the Tata Group in 2022, with Singapore Airlines as a minority shareholder. Its main hub is Delhi, with Mumbai and Bengaluru as secondary hubs, and it has been a Star Alliance member since 2014.",
  },
  "british-airways": {
    logo: "/airlines/BA.svg",
    tagline: "Nonstop to London from 27 US cities, then on to Europe, India and Africa",
    cabins: {
      economy:
        "World Traveller (economy) is on every flight. Basic fares include no checked bag, while Standard fares include 1 bag of 23 kg on transatlantic routes.",
      premium:
        "World Traveller Plus (premium economy) has wider seats with more legroom and includes 2 checked bags of 23 kg.",
      business:
        "Club Suite is a fully flat seat with a door and direct aisle access in a 1-2-1 layout, fitted on most long-haul aircraft. Some A380s, 787-9s and Gatwick 777s still have the older Club World seat, so check the aircraft.",
      first:
        "First is sold on selected aircraft and routes and includes 3 checked bags of 32 kg plus Concorde Room access at Heathrow Terminal 5.",
    },
    network: [
      {
        region: "Europe",
        cities: [{ city: "London", slug: "london" }, { city: "Paris", slug: "paris" }, { city: "Rome", slug: "rome" }, { city: "Milan" }, { city: "Athens", slug: "athens" }, { city: "Nice" }, { city: "Berlin" }],
      },
      { region: "India", cities: [{ city: "Delhi", slug: "delhi" }, { city: "Mumbai", slug: "mumbai" }, { city: "Hyderabad" }] },
      { region: "Africa", cities: [{ city: "Lagos", slug: "lagos" }, { city: "Johannesburg" }, { city: "Cape Town" }] },
      { region: "Middle East", cities: [{ city: "Dubai", slug: "dubai" }] },
    ],
    highlights: [
      { title: "27 US gateways", text: "British Airways flies nonstop to London from 27 US airports, from Boston and New York to Austin, Denver, Nashville and Seattle." },
      { title: "One stop to Europe and India", text: "Connect at Heathrow to cities across Europe and to Delhi, Mumbai and Hyderabad on one ticket." },
      { title: "Joint business with American", text: "BA and American Airlines are both in oneworld and run a transatlantic joint business, so you can mix their flights and earn AAdvantage miles." },
    ],
    about:
      "British Airways is the UK's flag carrier, formed in 1974 and owned by International Airlines Group (IAG). Its main hub is London Heathrow, mainly Terminal 5, with a second base at Gatwick. It is a oneworld member, and the US is its largest international market.",
  },
  "etihad-airways": {
    logo: "/airlines/EY.svg",
    tagline: "Abu Dhabi carrier with US customs preclearance on every flight home",
    cabins: {
      economy:
        "Economy is sold as Basic, Value, Comfort and Deluxe fares. Basic includes no checked bag; the other Economy fares include 2 bags of 23 kg on US routes.",
      business:
        "On the A350-1000 (New York and Atlanta), Business Studio is a forward-facing suite with a sliding door and a 79-inch flat bed. The 787-9 used on other US routes also has flat-bed business seats with direct aisle access.",
    },
    network: [
      { region: "Middle East", cities: [{ city: "Abu Dhabi" }, { city: "Riyadh" }, { city: "Amman", slug: "amman" }, { city: "Beirut" }] },
      {
        region: "India and Pakistan",
        cities: [{ city: "Mumbai", slug: "mumbai" }, { city: "Delhi", slug: "delhi" }, { city: "Hyderabad" }, { city: "Bengaluru" }, { city: "Chennai" }, { city: "Lahore" }],
      },
      { region: "Asia", cities: [{ city: "Bangkok" }, { city: "Shanghai" }, { city: "Beijing" }] },
      { region: "Africa", cities: [{ city: "Cairo", slug: "cairo" }, { city: "Nairobi", slug: "nairobi" }, { city: "Addis Ababa", slug: "addis-ababa" }, { city: "Johannesburg" }] },
    ],
    highlights: [
      { title: "US preclearance in Abu Dhabi", text: "You clear US immigration and customs at Zayed International before boarding, so you land in the US as a domestic arrival." },
      { title: "Free stopover nights", text: "Eligible return Etihad trips connecting in Abu Dhabi can include up to 2 free hotel nights in Abu Dhabi or Al Ain." },
      { title: "One stop to India", text: "Connect in Abu Dhabi to Mumbai, Delhi, Hyderabad, Bengaluru and Chennai." },
    ],
    about:
      "Etihad Airways is one of the UAE's two national airlines, founded in 2003 and based at Zayed International Airport in Abu Dhabi. It isn't in an airline alliance but codeshares with partners including American Airlines. It flies to 6 US airports.",
  },
  "cathay-pacific": {
    logo: "/airlines/CX.svg",
    tagline: "Hong Kong's flag carrier, with nonstops from 7 US cities to Asia",
    cabins: {
      economy:
        "Economy is on every flight. On US fares, Light includes 1 checked bag of 23 kg and Essential and Flex include 2.",
      premium:
        "Premium Economy has wider seats; on the refitted 777-300ER it adds more privacy and a 15.6-inch 4K screen.",
      business:
        "Business has fully flat beds with direct aisle access. The new Aria Suite, on selected 777-300ERs, adds a privacy door and a 24-inch 4K screen.",
      first:
        "First (6 seats) is on some four-class 777-300ERs, such as selected New York and Los Angeles flights. It is being removed as the 777s are refitted.",
    },
    network: [
      { region: "Greater China", cities: [{ city: "Hong Kong" }, { city: "Taipei" }, { city: "Shanghai" }] },
      { region: "Japan", cities: [{ city: "Tokyo", slug: "tokyo" }, { city: "Sapporo" }] },
      { region: "Southeast Asia", cities: [{ city: "Bangkok" }, { city: "Manila", slug: "manila" }, { city: "Singapore", slug: "singapore" }, { city: "Ho Chi Minh City", slug: "ho-chi-minh-city" }, { city: "Kuala Lumpur" }] },
      { region: "India", cities: [{ city: "Delhi", slug: "delhi" }, { city: "Mumbai", slug: "mumbai" }] },
      { region: "Oceania", cities: [{ city: "Sydney" }, { city: "Melbourne" }, { city: "Perth" }] },
    ],
    highlights: [
      { title: "Up to 3 a day", text: "New York JFK and Los Angeles each have up to three daily flights to Hong Kong, so there's usually a time that suits you." },
      { title: "Aria Suite", text: "Cathay's new business suite has a door and a 24-inch screen; it flies on selected 777-300ERs, including some Los Angeles and San Francisco flights." },
      { title: "oneworld", text: "Cathay is a founding member of oneworld, so you can earn American AAdvantage or Alaska miles on its flights." },
    ],
    about:
      "Cathay Pacific was founded in Hong Kong in 1946 and is based at Hong Kong International Airport (HKG). Swire Pacific and Air China are major shareholders, and it is a founding member of oneworld. From the US it is a popular one-stop option to Southeast Asia, India and Australia.",
  },
  "eva-air": {
    logo: "/airlines/BR.svg",
    tagline: "Taiwan's 5-star airline, nonstop to Taipei from 8 US cities",
    cabins: {
      economy:
        "Economy is on every flight. Most fares include 2 checked bags of 23 kg on US routes; the cheapest Discount fare includes 1.",
      premium:
        "Premium Economy on the 787-9 (Dallas and Washington Dulles) has 28 seats in a 2-3-2 layout with 42-inch pitch and a cradle recline.",
      business:
        "Royal Laurel business class has fully flat seats with direct aisle access in a 1-2-1 layout on the 777-300ER and 787s.",
    },
    network: [
      { region: "Taiwan", cities: [{ city: "Taipei" }, { city: "Kaohsiung" }] },
      { region: "Japan and Korea", cities: [{ city: "Tokyo", slug: "tokyo" }, { city: "Osaka" }, { city: "Sapporo" }, { city: "Okinawa" }, { city: "Seoul" }] },
      {
        region: "Southeast Asia",
        cities: [{ city: "Bangkok" }, { city: "Singapore", slug: "singapore" }, { city: "Manila", slug: "manila" }, { city: "Ho Chi Minh City", slug: "ho-chi-minh-city" }, { city: "Hanoi" }, { city: "Bali" }],
      },
      { region: "India", cities: [{ city: "Delhi", slug: "delhi" }] },
    ],
    highlights: [
      { title: "Easy Taipei connections", text: "Morning arrivals from the US connect to EVA flights across Asia at Taoyuan without going through security again." },
      { title: "Hello Kitty jet", text: "Some Chicago–Taipei flights (BR55/56) use EVA's Hello Kitty 777-300ER, at no extra cost. Schedules can change." },
      { title: "Star Alliance", text: "EVA is in Star Alliance, so you can earn United MileagePlus miles on its flights." },
    ],
    about:
      "EVA Air began flying in 1991 and is part of Taiwan's Evergreen Group. Its hub is Taiwan Taoyuan International Airport (TPE), it is a Star Alliance member, and Skytrax rates it a 5-Star Airline. It flies nonstop to 8 US airports.",
  },
  "philippine-airlines": {
    logo: "/airlines/PR.svg",
    tagline: "Nonstop to Manila from 6 US mainland and Hawaii airports, plus Guam",
    cabins: {
      economy:
        "Economy is on every flight, and all Economy fares on US routes include 2 checked bags of 23 kg according to PAL's baggage table.",
      premium:
        "Premium Economy is on the A350s and selected other aircraft: reclining seats with more space, power outlets and on-demand entertainment, plus 2 bags of 25 kg.",
      business:
        "Business on the A350-1000 is a suite with a privacy door and fully flat bed. The A350-900 and 777-300ER also have flat-bed business seats.",
    },
    network: [
      {
        region: "Philippines",
        cities: [{ city: "Manila", slug: "manila" }, { city: "Cebu" }, { city: "Davao" }, { city: "Iloilo" }, { city: "Bacolod" }, { city: "Puerto Princesa" }, { city: "Boracay" }],
      },
      { region: "Asia", cities: [{ city: "Tokyo", slug: "tokyo" }, { city: "Hong Kong" }, { city: "Singapore", slug: "singapore" }, { city: "Bangkok" }, { city: "Ho Chi Minh City", slug: "ho-chi-minh-city" }] },
      { region: "Pacific", cities: [{ city: "Honolulu" }, { city: "Guam" }, { city: "Saipan" }] },
    ],
    highlights: [
      { title: "Nonstop to Manila", text: "PAL flies nonstop to Manila from Los Angeles, San Francisco, New York JFK, Seattle, Chicago and Honolulu." },
      { title: "Two bags in Economy", text: "Economy fares on US routes include 2 checked bags of 23 kg, which helps when you're carrying gifts home." },
      { title: "Joining oneworld", text: "PAL accepted an invitation in June 2026 to join oneworld, expected in 2027, and already codeshares with American Airlines." },
    ],
    about:
      "Philippine Airlines, founded in 1941, is the national airline of the Philippines and the oldest commercial airline still operating in Asia. Its hub is Manila (MNL), with a second hub in Cebu. In 1946 it became the first Asian airline to fly across the Pacific.",
  },
};
