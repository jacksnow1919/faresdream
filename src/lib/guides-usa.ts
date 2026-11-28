import type { Guide } from "@/lib/guides";

/**
 * US domestic flight guides. Every number comes from the KAYAK route pages listed in each
 * guide's `sources` (12-month medians published by KAYAK, read November 18, 2026).
 */

const checked = "2026-11-18";
const kayak = (label: string, path: string) => ({
  label: `KAYAK: ${label}`,
  url: `https://www.kayak.com/flight-routes/${path}`,
  checked,
});

export const usaGuides: Guide[] = [
  {
    slug: "cheapest-time-to-fly-to-hawaii",
    searchTo: "HNL",
    region: "USA",
    photo: "https://images.unsplash.com/photo-1524565308556-b777381b2f73?auto=format&fit=crop&w=1600&h=640&q=65",
    photoAlt: "Honolulu, Hawaii",
    title: "Cheapest Time to Fly to Hawaii",
    metaTitle: "Cheapest Time to Fly to Hawaii (2027 Fare Data) | FaresDream",
    description:
      "January and February are the cheapest months to fly to Hawaii; December and June cost the most. Fares from LA, San Francisco, Seattle and New York compared.",
    published: "2026-11-18",
    updated: "2026-11-18",
    author: "FaresDream Travel Desk",
    answer:
      "The cheapest months to fly to Hawaii are January and February, and the most expensive are December and June. Los Angeles–Honolulu averaged $339 round trip in February against $546 in December in KAYAK's 12-month data. Booking 5 to 13 weeks ahead saved 17% to 34% compared with booking in the last two weeks.",
    keyFacts: [
      "Cheapest month: February from Los Angeles and New York; January from San Francisco and Seattle.",
      "Most expensive: December on four of the five routes we checked; June from Seattle.",
      "The priciest month cost 58% to 63% more than the cheapest on every route.",
      "Saturday was the most expensive day to fly on all five routes.",
      "Maui (Kahului) cost about the same as Honolulu from Los Angeles: $353 vs $339 in February.",
    ],
    table: {
      caption: "Round-trip economy fares to Hawaii by route",
      typicalLabel: "Price swing",
      rows: [
        {
          route: "Los Angeles (LAX) – Honolulu (HNL)",
          monthly: [353, 339, 447, 376, 406, 521, 511, 439, 376, 376, 468, 546],
          cheapestMonth: "February · $339",
          priciestMonths: "December $546 · June $521",
          typical: "61%",
          bookAhead: "13 weeks (≈31% saving)",
          cheapestDay: "Monday",
        },
        {
          route: "San Francisco (SFO) – Honolulu (HNL)",
          monthly: [382, 399, 434, 443, 465, 581, 544, 502, 457, 444, 508, 606],
          cheapestMonth: "January · $382",
          priciestMonths: "December $606 · June $581",
          typical: "58%",
          bookAhead: "7 weeks (≈30% saving)",
          cheapestDay: "Tuesday",
        },
        {
          route: "Seattle (SEA) – Honolulu (HNL)",
          monthly: [428, 475, 456, 498, 496, 693, 632, 593, 555, 581, 618, 679],
          cheapestMonth: "January · $428",
          priciestMonths: "June $693 · December $679",
          typical: "61%",
          bookAhead: "5 weeks (≈34% saving)",
          cheapestDay: "Tuesday",
        },
        {
          route: "New York (NYC) – Honolulu (HNL)",
          monthly: [813, 796, 890, 861, 831, 1066, 1131, 1047, 899, 948, 896, 1281],
          cheapestMonth: "February · $796",
          priciestMonths: "December $1,281 · July $1,131",
          typical: "60%",
          bookAhead: "9 weeks (≈21% saving)",
          cheapestDay: "Wednesday",
        },
        {
          route: "Los Angeles (LAX) – Maui (OGG)",
          monthly: [416, 353, 478, 414, 424, 553, 558, 501, 445, 430, 515, 578],
          cheapestMonth: "February · $353",
          priciestMonths: "December $578 · July $558",
          typical: "63%",
          bookAhead: "10 weeks (≈17% saving)",
          cheapestDay: "Thursday",
        },
      ],
      note: "Source: KAYAK route pages (median round-trip prices over the past 12 months), read November 18, 2026. Price swing = how much more the priciest month cost than the cheapest. Savings are against fares booked within two weeks of departure. These are averages, not quotes.",
    },
    sections: [
      {
        id: "by-month",
        heading: "When is it cheapest to fly to Hawaii, month by month?",
        paragraphs: [
          "Hawaii fares follow US school holidays. Prices peak when families travel (Christmas–New Year and June–July) and drop once the holidays end.",
        ],
        bullets: [
          "January–February: the cheapest months on all five routes, once the New Year rush is over.",
          "March–May: not among the cheapest or the two priciest months on any route we checked.",
          "June–July: summer peak. June was the priciest month from Seattle and second priciest from LA and San Francisco; July second priciest from New York and LA–Maui.",
          "August–November: not among the two priciest months on any route we checked, though Thanksgiving week is busy.",
          "December: the most expensive month on four of the five routes we checked.",
        ],
      },
      {
        id: "how-far-ahead",
        heading: "How far ahead should I book flights to Hawaii?",
        paragraphs: [
          "KAYAK's data puts the cheapest booking point between 5 and 13 weeks before departure, depending on the route: 13 weeks from Los Angeles, 9 from New York, 7 from San Francisco and 5 from Seattle. Booking in that window saved 17% to 34% against last-minute fares.",
          "For Christmas or a June–July family trip, start looking earlier. Cheap seats on peak dates sell first.",
        ],
      },
      {
        id: "which-day",
        heading: "Which day of the week is cheapest to fly to Hawaii?",
        paragraphs: [
          "A weekday. Monday, Tuesday, Wednesday or Thursday was cheapest depending on the route, 5% to 9% below an average day. Saturday was the most expensive day on all five routes, 9% to 13% above average.",
        ],
      },
      {
        id: "airports",
        heading: "Which US airports have the cheapest flights to Hawaii?",
        paragraphs: [
          "The West Coast. Los Angeles–Honolulu was the cheapest route we checked at $339 in February, and the nonstop takes about 6 hours. From New York the cheapest month still averaged $796, and the nonstop takes about 11 hours 19 minutes.",
          "Nonstops run from Los Angeles (Alaska, American and others), San Francisco (United, Alaska), Seattle (Alaska, Delta) and New York (Alaska, Delta, United). If you live in the East or Midwest, compare a cheap flight to the West Coast plus a separate ticket to Hawaii, but leave plenty of connection time if the tickets are separate.",
        ],
      },
      {
        id: "tips",
        heading: "How to get the cheapest flight to Hawaii",
        paragraphs: [],
        bullets: [
          "Fly in January or February, or in the fall outside Thanksgiving week.",
          "Book 5 to 13 weeks ahead, and earlier for Christmas or summer.",
          "Avoid Saturday departures; fly Monday to Thursday.",
          "Compare Honolulu with Maui, Kauai and the Big Island; prices can be close.",
          "Check bag fees before comparing fares; a lower fare without a checked bag can end up costing more.",
        ],
      },
      {
        id: "method",
        heading: "How we put this guide together",
        paragraphs: [
          "We read KAYAK's published route data for five popular mainland–Hawaii routes on November 18, 2026 and copied the figures as published. We did not use FaresDream booking data. We will update the table as new data is published.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the cheapest month to fly to Hawaii?",
        a: "January or February. In KAYAK's 12-month data, February was cheapest from Los Angeles to Honolulu ($339 round trip) and January from San Francisco ($382) and Seattle ($428).",
      },
      {
        q: "What is the most expensive time to fly to Hawaii?",
        a: "December, followed by June and July. December averaged $546 round trip from Los Angeles to Honolulu and $1,281 from New York.",
      },
      {
        q: "How far in advance should I book a flight to Hawaii?",
        a: "Between 5 and 13 weeks ahead depending on your airport, which saved 17% to 34% against last-minute fares in KAYAK's data. Book earlier for Christmas or summer.",
      },
      {
        q: "What day is cheapest to fly to Hawaii?",
        a: "A weekday, usually Monday or Tuesday. Saturday was the most expensive day on every route we checked.",
      },
      {
        q: "Is it cheaper to fly to Honolulu or Maui?",
        a: "From Los Angeles they were close: $339 to Honolulu and $353 to Maui (Kahului) in February. Compare both for your dates.",
      },
    ],
    sources: [
      kayak("Los Angeles to Honolulu flights", "Los-Angeles-LAX/Honolulu-HNL"),
      kayak("San Francisco to Honolulu flights", "San-Francisco-SFO/Honolulu-HNL"),
      kayak("Seattle to Honolulu flights", "Seattle-Tacoma-Intl-SEA/Honolulu-HNL"),
      kayak("New York to Honolulu flights", "New-York-NYC/Honolulu-HNL"),
      kayak("Los Angeles to Kahului (Maui) flights", "Los-Angeles-LAX/Kahului-OGG"),
    ],
    related: [
      { label: "Cheapest time to fly to New York", href: "/guides/cheapest-time-to-fly-to-new-york" },
      { label: "Cheapest time to fly to Las Vegas", href: "/guides/cheapest-time-to-fly-to-las-vegas" },
      { label: "Cheapest time to fly to Orlando", href: "/guides/cheapest-time-to-fly-to-orlando" },
      { label: "Search flights", href: "/" },
    ],
  },
  {
    slug: "cheapest-time-to-fly-to-orlando",
    searchTo: "MCO",
    region: "USA",
    photo: "https://images.pexels.com/photos/20486251/pexels-photo-20486251.jpeg?auto=compress&cs=tinysrgb&w=1600&h=640&fit=crop",
    photoAlt: "Lake Eola and the downtown Orlando skyline",
    title: "Cheapest Time to Fly to Orlando",
    metaTitle: "Cheapest Time to Fly to Orlando (2027 Fare Data) | FaresDream",
    description:
      "January is usually the cheapest month to fly to Orlando; June and November cost the most. Fares from New York, Chicago, Boston, Atlanta and Dallas compared.",
    published: "2026-11-18",
    updated: "2026-11-18",
    author: "FaresDream Travel Desk",
    answer:
      "January is usually the cheapest month to fly to Orlando, and June and November are the most expensive. New York–Orlando averaged $173 round trip in January against $323 in August in KAYAK's 12-month data. Booking 5 to 12 weeks ahead saved 26% to 38% compared with booking in the last two weeks.",
    keyFacts: [
      "Cheapest month: January from New York, Boston and Dallas; February from Chicago; March from Atlanta.",
      "Most expensive: June or November on every route we checked; August from New York.",
      "Tuesday was the cheapest day to fly on four of the five routes.",
      "The priciest month cost 60% to 143% more than the cheapest month.",
      "Atlanta–Orlando was the cheapest route: $127 round trip in March.",
    ],
    table: {
      caption: "Round-trip economy fares to Orlando (MCO) by route",
      typicalLabel: "Price swing",
      rows: [
        {
          route: "New York (NYC) – Orlando (MCO)",
          monthly: [173, 215, 236, 263, 229, 274, 290, 323, 275, 284, 305, 299],
          cheapestMonth: "January · $173",
          priciestMonths: "August $323 · November $305",
          typical: "86%",
          bookAhead: "12 weeks (≈33% saving)",
          cheapestDay: "Tuesday",
        },
        {
          route: "Chicago (ORD) – Orlando (MCO)",
          monthly: [206, 205, 324, 244, 248, 342, 323, 300, 310, 333, 373, 321],
          cheapestMonth: "February · $205",
          priciestMonths: "November $373 · June $342",
          typical: "81%",
          bookAhead: "5 weeks (≈26% saving)",
          cheapestDay: "Tuesday",
        },
        {
          route: "Boston (BOS) – Orlando (MCO)",
          monthly: [232, 279, 258, 342, 254, 359, 309, 343, 319, 347, 373, 316],
          cheapestMonth: "January · $232",
          priciestMonths: "November $373 · June $359",
          typical: "60%",
          bookAhead: "5 weeks (≈34% saving)",
          cheapestDay: "Wednesday",
        },
        {
          route: "Atlanta (ATL) – Orlando (MCO)",
          monthly: [135, 147, 127, 151, 161, 210, 166, 138, 137, 145, 176, 147],
          cheapestMonth: "March · $127",
          priciestMonths: "June $210 · November $176",
          typical: "65%",
          bookAhead: "10 weeks (≈38% saving)",
          cheapestDay: "Tuesday",
        },
        {
          route: "Dallas–Fort Worth (DFW) – Orlando (MCO)",
          monthly: [132, 189, 249, 218, 243, 322, 284, 234, 289, 285, 275, 273],
          cheapestMonth: "January · $132",
          priciestMonths: "June $322 · September $289",
          typical: "143%",
          bookAhead: "10 weeks (≈33% saving)",
          cheapestDay: "Tuesday",
        },
      ],
      note: "Source: KAYAK route pages (median round-trip prices over the past 12 months), read November 18, 2026. Price swing = how much more the priciest month cost than the cheapest. Savings are against fares booked within two weeks of departure. These are averages, not quotes.",
    },
    sections: [
      {
        id: "by-month",
        heading: "When is it cheapest to fly to Orlando, month by month?",
        paragraphs: [
          "Orlando fares follow school calendars and theme-park demand, so the cheapest time is right after the winter holidays and the most expensive is when families travel.",
        ],
        bullets: [
          "January–February: the cheapest months on four of the five routes once the New Year rush ends.",
          "March: cheapest from Atlanta ($127), but spring-break weeks push fares up from other cities.",
          "June–August: summer peak. June was the priciest month from Atlanta and Dallas, August from New York.",
          "September–October: usually calmer, although September was the second priciest month from Dallas.",
          "November–December: Thanksgiving and the holidays. November was the most expensive month from Chicago and Boston.",
        ],
      },
      {
        id: "how-far-ahead",
        heading: "How far ahead should I book flights to Orlando?",
        paragraphs: [
          "Between 5 and 12 weeks before departure. KAYAK's data shows 12 weeks from New York, 10 from Atlanta and Dallas, and 5 from Chicago and Boston, saving 26% to 38% against last-minute fares.",
          "For spring break, summer or Thanksgiving, book at the early end of that range.",
        ],
      },
      {
        id: "which-day",
        heading: "Which day of the week is cheapest to fly to Orlando?",
        paragraphs: [
          "Tuesday was cheapest on four of the five routes, and Wednesday from Boston. From Atlanta, Tuesday was 15% below an average day. Friday or Sunday was the most expensive day on every route.",
        ],
      },
      {
        id: "airlines",
        heading: "Which airlines fly nonstop to Orlando?",
        paragraphs: [
          "Nonstops are easy to find: Delta and JetBlue among others from New York (about 3 hours), United and American from Chicago, JetBlue and Delta from Boston, Delta, Frontier and Southwest from Atlanta (about 1.5 hours), and American and Frontier from Dallas–Fort Worth.",
          "Budget airlines often show the lowest fare but charge for carry-on and checked bags. Add bag fees before you compare.",
        ],
      },
      {
        id: "tips",
        heading: "How to get the cheapest flight to Orlando",
        paragraphs: [],
        bullets: [
          "Fly in January, February or early March, avoiding spring-break weeks.",
          "Book 5 to 12 weeks ahead; earlier for summer and Thanksgiving.",
          "Fly on a Tuesday or Wednesday; avoid Fridays and Sundays.",
          "Compare total cost including bags, especially on budget airlines.",
          "Families and groups: call an agent to compare fares for everyone at once.",
        ],
      },
      {
        id: "method",
        heading: "How we put this guide together",
        paragraphs: [
          "We read KAYAK's published route data for five busy routes to Orlando International (MCO) on November 18, 2026 and copied the figures as published. We did not use FaresDream booking data. We will update the table as new data is published.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the cheapest month to fly to Orlando?",
        a: "Usually January. In KAYAK's 12-month data, January was cheapest from New York ($173 round trip), Boston ($232) and Dallas ($132). February was cheapest from Chicago and March from Atlanta.",
      },
      {
        q: "What is the most expensive month to fly to Orlando?",
        a: "June or November on most routes. November averaged $373 from Chicago and Boston; June averaged $322 from Dallas. From New York, August was the priciest at $323.",
      },
      {
        q: "How far in advance should I book a flight to Orlando?",
        a: "Between 5 and 12 weeks ahead, which saved 26% to 38% against last-minute fares in KAYAK's data.",
      },
      {
        q: "What day is cheapest to fly to Orlando?",
        a: "Tuesday on four of the five routes we checked. Friday or Sunday was the most expensive.",
      },
    ],
    sources: [
      kayak("New York to Orlando flights", "New-York-NYC/Orlando-MCO"),
      kayak("Chicago O'Hare to Orlando flights", "Chicago-O-Hare-Intl-ORD/Orlando-MCO"),
      kayak("Boston to Orlando flights", "Boston-Logan-Intl-BOS/Orlando-MCO"),
      kayak("Atlanta to Orlando flights", "Atlanta-Hartsfield-Jackson-ATL/Orlando-MCO"),
      kayak("Dallas–Fort Worth to Orlando flights", "Dallas-Ft-Worth-other-airports-DFW/Orlando-MCO"),
    ],
    related: [
      { label: "Cheapest time to fly to Las Vegas", href: "/guides/cheapest-time-to-fly-to-las-vegas" },
      { label: "Cheapest time to fly to Hawaii", href: "/guides/cheapest-time-to-fly-to-hawaii" },
      { label: "Search flights", href: "/" },
    ],
  },
  {
    slug: "cheapest-time-to-fly-to-las-vegas",
    searchTo: "LAS",
    region: "USA",
    photo: "https://images.unsplash.com/photo-1634400139456-292e44ca5327?auto=format&fit=crop&w=1600&h=640&q=65",
    photoAlt: "The Las Vegas Strip",
    title: "Cheapest Time to Fly to Las Vegas",
    metaTitle: "Cheapest Time to Fly to Las Vegas (2027 Fare Data) | FaresDream",
    description:
      "January is the cheapest month to fly to Las Vegas on every route we checked. Fares from LA, New York, Chicago, Seattle and Dallas, plus the best days and booking window.",
    published: "2026-11-18",
    updated: "2026-11-18",
    author: "FaresDream Travel Desk",
    answer:
      "January is the cheapest month to fly to Las Vegas; it was cheapest (or tied) on all five routes we checked. The most expensive months depend on where you start: summer from Los Angeles and Dallas, October from New York and Chicago. Booking 5 to 12 weeks ahead saved 33% to 51% compared with booking in the last two weeks.",
    keyFacts: [
      "Cheapest month: January on all five routes (tied with February from Los Angeles).",
      "Los Angeles–Las Vegas averaged $108 round trip in January against $213 in July.",
      "Friday was the most expensive day on four of the five routes.",
      "From Los Angeles, Monday flights were 24% below an average day and Friday 22% above.",
      "Booking at the right time saved up to 51% (Los Angeles, 5 weeks ahead).",
    ],
    table: {
      caption: "Round-trip economy fares to Las Vegas (LAS) by route",
      typicalLabel: "Price swing",
      rows: [
        {
          route: "Los Angeles (LAX) – Las Vegas (LAS)",
          monthly: [108, 108, 117, 130, 175, 203, 213, 184, 176, 179, 141, 124],
          cheapestMonth: "January & February · $108",
          priciestMonths: "July $213 · June $203",
          typical: "97%",
          bookAhead: "5 weeks (≈51% saving)",
          cheapestDay: "Monday",
        },
        {
          route: "New York (NYC) – Las Vegas (LAS)",
          monthly: [322, 385, 397, 383, 396, 402, 433, 415, 395, 491, 440, 450],
          cheapestMonth: "January · $322",
          priciestMonths: "October $491 · December $450",
          typical: "52%",
          bookAhead: "12 weeks (≈33% saving)",
          cheapestDay: "Saturday",
        },
        {
          route: "Chicago (ORD) – Las Vegas (LAS)",
          monthly: [254, 298, 342, 302, 347, 353, 357, 318, 329, 368, 333, 324],
          cheapestMonth: "January · $254",
          priciestMonths: "October $368 · July $357",
          typical: "44%",
          bookAhead: "9 weeks (≈35% saving)",
          cheapestDay: "Monday",
        },
        {
          route: "Seattle (SEA) – Las Vegas (LAS)",
          monthly: [188, 233, 237, 244, 307, 270, 296, 225, 280, 251, 306, 282],
          cheapestMonth: "January · $188",
          priciestMonths: "May $307 · November $306",
          typical: "63%",
          bookAhead: "12 weeks (≈43% saving)",
          cheapestDay: "Sunday",
        },
        {
          route: "Dallas–Fort Worth (DFW) – Las Vegas (LAS)",
          monthly: [171, 183, 248, 219, 279, 326, 353, 255, 302, 295, 271, 235],
          cheapestMonth: "January · $171",
          priciestMonths: "July $353 · June $326",
          typical: "106%",
          bookAhead: "9 weeks (≈36% saving)",
          cheapestDay: "Tuesday",
        },
      ],
      note: "Source: KAYAK route pages (median round-trip prices over the past 12 months), read November 18, 2026. Price swing = how much more the priciest month cost than the cheapest. Savings are against fares booked within two weeks of departure. These are averages, not quotes.",
    },
    sections: [
      {
        id: "by-month",
        heading: "When is it cheapest to fly to Las Vegas, month by month?",
        paragraphs: [
          "Las Vegas is busy all year, so the peak months differ by city. What every route shares is a cheap January.",
        ],
        bullets: [
          "January: the cheapest month on all five routes (tied with February from Los Angeles).",
          "February: matched January from Los Angeles ($108).",
          "May–July: May was the priciest month from Seattle; June and July from Los Angeles and Dallas.",
          "October: the most expensive month from New York ($491) and Chicago ($368).",
          "November–December: November was second priciest from Seattle, December from New York.",
        ],
      },
      {
        id: "how-far-ahead",
        heading: "How far ahead should I book flights to Las Vegas?",
        paragraphs: [
          "Between 5 and 12 weeks before departure, depending on your airport: 5 weeks from Los Angeles, 9 from Chicago and Dallas, and 12 from New York and Seattle. Savings against last-minute fares were 33% to 51%, the biggest of the three US destinations we've covered.",
        ],
      },
      {
        id: "which-day",
        heading: "Which day of the week is cheapest to fly to Las Vegas?",
        paragraphs: [
          "It depends on the route, but Friday is the one to avoid: it was the most expensive day on four of the five routes. Monday was cheapest from Los Angeles (24% below average) and Chicago, Tuesday from Dallas (18% below), Sunday from Seattle and Saturday from New York.",
        ],
      },
      {
        id: "airlines",
        heading: "Which airlines fly nonstop to Las Vegas?",
        paragraphs: [
          "Southwest and United are among the nonstop airlines from Los Angeles (about 1 hour 17 minutes). United and Delta fly from New York (about 5 hours 54 minutes); United, American and Frontier from Chicago; Alaska and Delta from Seattle; and American and Frontier from Dallas–Fort Worth.",
        ],
      },
      {
        id: "tips",
        heading: "How to get the cheapest flight to Las Vegas",
        paragraphs: [],
        bullets: [
          "Fly in January if you can; it was the cheapest month on every route we checked.",
          "Avoid Friday departures.",
          "Book 5 to 12 weeks ahead; last-minute fares cost a third to a half more.",
          "From the East Coast, avoid October, the priciest month from New York and Chicago.",
          "Check big events and conventions for your dates; they can raise both fares and hotel rates.",
        ],
      },
      {
        id: "method",
        heading: "How we put this guide together",
        paragraphs: [
          "We read KAYAK's published route data for five busy routes to Harry Reid International (LAS) on November 18, 2026 and copied the figures as published. We did not use FaresDream booking data. We will update the table as new data is published.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the cheapest month to fly to Las Vegas?",
        a: "January. It was the cheapest month on all five routes we checked, tied with February from Los Angeles ($108 round trip).",
      },
      {
        q: "What is the most expensive month to fly to Las Vegas?",
        a: "It depends on your city: July from Los Angeles ($213) and Dallas ($353), October from New York ($491) and Chicago ($368), and May from Seattle ($307).",
      },
      {
        q: "How far in advance should I book a flight to Las Vegas?",
        a: "Between 5 and 12 weeks ahead, which saved 33% to 51% against last-minute fares in KAYAK's data.",
      },
      {
        q: "What day is cheapest to fly to Las Vegas?",
        a: "It varies by route, but Friday was the most expensive day on four of the five routes. From Los Angeles, Monday was 24% cheaper than an average day.",
      },
    ],
    sources: [
      kayak("Los Angeles to Las Vegas flights", "Los-Angeles-LAX/Las-Vegas-McCarran-LAS"),
      kayak("New York to Las Vegas flights", "New-York-NYC/Las-Vegas-McCarran-LAS"),
      kayak("Chicago O'Hare to Las Vegas flights", "Chicago-O-Hare-Intl-ORD/Las-Vegas-McCarran-LAS"),
      kayak("Seattle to Las Vegas flights", "Seattle-Tacoma-Intl-SEA/Las-Vegas-McCarran-LAS"),
      kayak("Dallas–Fort Worth to Las Vegas flights", "Dallas-Ft-Worth-other-airports-DFW/Las-Vegas-McCarran-LAS"),
    ],
    related: [
      { label: "Cheapest time to fly to Hawaii", href: "/guides/cheapest-time-to-fly-to-hawaii" },
      { label: "Cheapest time to fly to Orlando", href: "/guides/cheapest-time-to-fly-to-orlando" },
      { label: "Search flights", href: "/" },
    ],
  },
  {
    slug: "cheapest-time-to-fly-to-new-york",
    searchTo: "JFK",
    region: "USA",
    photo: "https://images.unsplash.com/photo-1588384153148-ebd739ac430c?auto=format&fit=crop&w=1600&h=640&q=65",
    photoAlt: "The New York City skyline",
    title: "Cheapest Time to Fly to New York",
    metaTitle: "Cheapest Time to Fly to New York: Best Month, Day & Airport (2027) | FaresDream",
    description:
      "January is the cheapest month to fly to New York from most US cities, and Sunday is the priciest day. Fares from 7 cities and the cheapest NYC airport (JFK, LGA or EWR) for each.",
    published: "2026-11-18",
    updated: "2026-11-26",
    author: "FaresDream Travel Desk",
    answer:
      "January is the cheapest month to fly to New York from most US cities, and February from Atlanta and Miami. Los Angeles–New York averaged $247 round trip in January against $484 in June in KAYAK's 12-month data. Wednesday was usually the cheapest day and Sunday the most expensive on all 7 routes we checked. Booking 5 to 24 weeks ahead saved 29% to 43% compared with booking in the last two weeks.",
    keyFacts: [
      "Cheapest month: January from Los Angeles, Chicago, San Francisco, Dallas and Orlando; February from Atlanta and Miami.",
      "Sunday was the most expensive day to fly on all 7 routes, up to 27% above an average day.",
      "Wednesday was the cheapest day on 4 of the 7 routes (Thursday on 2, Tuesday on 1).",
      "There is no single cheapest NYC airport: LaGuardia was cheapest from 4 cities, JFK from 2 and Newark from 1.",
      "Orlando–New York was the cheapest route: $103 round trip in January.",
    ],
    table: {
      caption: "Round-trip economy fares to New York (all airports) by route",
      typicalLabel: "Typical fare",
      rows: [
        {
          route: "Los Angeles (LAX) – New York",
          monthly: [247, 278, 373, 361, 393, 484, 478, 438, 455, 443, 447, 442],
          cheapestMonth: "January · $247",
          priciestMonths: "June $484 · July $478",
          typical: "$311–$549",
          bookAhead: "12 weeks (≈38% saving)",
          cheapestDay: "Wednesday",
        },
        {
          route: "San Francisco (SFO) – New York",
          monthly: [317, 322, 366, 392, 435, 569, 537, 487, 488, 507, 540, 515],
          cheapestMonth: "January · $317",
          priciestMonths: "June $569 · November $540",
          typical: "$342–$598",
          bookAhead: "24 weeks (≈39% saving)",
          cheapestDay: "Tuesday",
        },
        {
          route: "Chicago (ORD) – New York",
          monthly: [147, 174, 196, 198, 232, 275, 263, 251, 281, 324, 283, 250],
          cheapestMonth: "January · $147",
          priciestMonths: "October $324 · November $283",
          typical: "$172–$331",
          bookAhead: "7 weeks (≈38% saving)",
          cheapestDay: "Wednesday",
        },
        {
          route: "Dallas–Fort Worth (DFW) – New York",
          monthly: [189, 219, 260, 257, 302, 330, 353, 321, 335, 380, 338, 324],
          cheapestMonth: "January · $189",
          priciestMonths: "October $380 · July $353",
          typical: "$211–$433",
          bookAhead: "9 weeks (≈38% saving)",
          cheapestDay: "Wednesday",
        },
        {
          route: "Atlanta (ATL) – New York",
          monthly: [131, 126, 136, 190, 224, 276, 266, 258, 288, 295, 261, 222],
          cheapestMonth: "February · $126",
          priciestMonths: "October $295 · September $288",
          typical: "$149–$314",
          bookAhead: "5 weeks (≈29% saving)",
          cheapestDay: "Wednesday",
        },
        {
          route: "Miami (MIA) – New York",
          monthly: [153, 152, 165, 196, 230, 308, 304, 314, 297, 313, 291, 215],
          cheapestMonth: "February · $152",
          priciestMonths: "August $314 · October $313",
          typical: "$164–$370",
          bookAhead: "6 weeks (≈43% saving)",
          cheapestDay: "Thursday",
        },
        {
          route: "Orlando (MCO) – New York",
          monthly: [103, 133, 165, 166, 186, 263, 299, 281, 265, 262, 249, 211],
          cheapestMonth: "January · $103",
          priciestMonths: "July $299 · August $281",
          typical: "$143–$316",
          bookAhead: "14 weeks (≈38% saving)",
          cheapestDay: "Thursday",
        },
      ],
      note: "Source: KAYAK route pages (median round-trip prices by month and typical price range over the past 12 months), read November 18, 2026. Savings are KAYAK's figures for booking in the cheapest window. These are averages, not quotes; today's fare for your dates can be higher or lower.",
    },
    sections: [
      {
        id: "by-month",
        heading: "When is it cheapest to fly to New York, month by month?",
        paragraphs: [
          "New York fares drop hard after the holidays. In KAYAK's data the priciest month cost 79% to 190% more than the cheapest month, depending on the route, so the month you pick matters more than anything else.",
        ],
        bullets: [
          "January–February: the cheapest months on every route we checked. January won on 5 routes, February on 2 (Atlanta and Miami).",
          "June–August: summer is the priciest time from the West Coast and Florida. June was the most expensive month from Los Angeles and San Francisco, July from Orlando, August from Miami.",
          "September–November: autumn is the priciest time from Chicago, Dallas and Atlanta, where October was the most expensive month.",
          "December: KAYAK lists December as the busiest month from Los Angeles, so expect crowds around the holidays even when it is not the priciest month.",
        ],
      },
      {
        id: "which-airport",
        heading: "Which New York airport is cheapest: JFK, LaGuardia or Newark?",
        paragraphs: [
          "It depends on where you fly from. KAYAK compares the three main New York airports for each route, and the cheapest one changed by city:",
          "Search all New York airports at once (code NYC) instead of picking one. LaGuardia is the closest to Manhattan; JFK has the most long-haul and international flights; Newark is in New Jersey and often easiest for the west side of Manhattan and New Jersey.",
        ],
        bullets: [
          "LaGuardia (LGA): cheapest from Los Angeles (5% average saving), Dallas–Fort Worth (11%), San Francisco ($57 cheaper) and Orlando ($19 cheaper).",
          "JFK: cheapest from Chicago O'Hare ($29 cheaper) and Miami (7% average saving).",
          "Newark (EWR): cheapest from Atlanta ($12 cheaper).",
        ],
      },
      {
        id: "how-far-ahead",
        heading: "How far ahead should I book flights to New York?",
        paragraphs: [
          "About 5 to 14 weeks ahead from most cities, and about 24 weeks from San Francisco. KAYAK's data shows savings of 29% to 43% in those windows.",
          "Last-minute fares (booked within two weeks) ran 14% to 39% above the route average. The gap was biggest from Los Angeles (39%) and smallest from Atlanta (14%).",
        ],
      },
      {
        id: "which-day",
        heading: "Which day of the week is cheapest to fly to New York?",
        paragraphs: [
          "Wednesday was cheapest from Los Angeles, Chicago, Dallas and Atlanta; Thursday from Miami and Orlando; Tuesday from San Francisco. The savings were small, 5% to 7% below an average day.",
          "Avoiding Sunday matters more: Sunday was the most expensive day on all 7 routes, from 13% (San Francisco) to 27% (Orlando) above an average day.",
        ],
      },
      {
        id: "airlines",
        heading: "Which airlines fly nonstop to New York?",
        paragraphs: [
          "Every route in our table has nonstop flights. From Los Angeles, JetBlue, American and others fly nonstop in about 5h 21m. From Miami, American, Delta and United take about 3h 07m, and from Dallas–Fort Worth, American, Delta and others take about 3h 26m.",
          "On Los Angeles–New York, one-stop fares averaged $269 round trip (via Las Vegas) against $422 for nonstops, so a stop can save money if you have time.",
          "Budget airlines often show the lowest fare but charge for carry-on and checked bags. Add bag fees before you compare.",
        ],
      },
      {
        id: "tips",
        heading: "How to get the cheapest flight to New York",
        paragraphs: [],
        bullets: [
          "Fly in January or February, after the New Year rush.",
          "Search all three airports (NYC), not just JFK.",
          "Book 5 to 14 weeks ahead; about 6 months ahead from San Francisco.",
          "Fly out midweek and avoid flying on Sunday.",
          "Compare the total cost including bags, especially on budget airlines.",
          "Need help with dates or a group booking? Call an agent to compare fares for you.",
        ],
      },
      {
        id: "method",
        heading: "How we put this guide together",
        paragraphs: [
          "We read KAYAK's published route data for 7 busy routes to New York on November 18, 2026 and copied the figures as published. The cheapest-airport findings are KAYAK's comparison of JFK, LaGuardia and Newark for each route. We did not use FaresDream booking data. We will update the table as new data is published.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the cheapest month to fly to New York?",
        a: "Usually January. In KAYAK's 12-month data, January was cheapest from Los Angeles ($247 round trip), San Francisco ($317), Chicago ($147), Dallas ($189) and Orlando ($103). February was cheapest from Atlanta ($126) and Miami ($152).",
      },
      {
        q: "What is the most expensive month to fly to New York?",
        a: "It depends on the route: June from Los Angeles ($484) and San Francisco ($569), October from Chicago ($324), Dallas ($380) and Atlanta ($295), August from Miami ($314) and July from Orlando ($299).",
      },
      {
        q: "Is it cheaper to fly into JFK, LaGuardia or Newark?",
        a: "No single airport is always cheapest. In KAYAK's route data LaGuardia was cheapest from Los Angeles, San Francisco, Dallas and Orlando, JFK from Chicago and Miami, and Newark from Atlanta. Search all New York airports at once.",
      },
      {
        q: "What day of the week is cheapest to fly to New York?",
        a: "Usually Wednesday (4 of 7 routes), then Thursday or Tuesday. Sunday was the most expensive day on every route we checked.",
      },
      {
        q: "How far in advance should I book a flight to New York?",
        a: "Between 5 and 14 weeks ahead from most US cities, and about 24 weeks from San Francisco. That saved 29% to 43% in KAYAK's data.",
      },
    ],
    sources: [
      kayak("Los Angeles to New York flights", "Los-Angeles-LAX/New-York-NYC"),
      kayak("San Francisco to New York flights", "San-Francisco-SFO/New-York-NYC"),
      kayak("Chicago O'Hare to New York flights", "Chicago-ORD/New-York-NYC"),
      kayak("Dallas–Fort Worth to New York flights", "Dallas-Fort-Worth-DFW/New-York-NYC"),
      kayak("Atlanta to New York flights", "Atlanta-ATL/New-York-NYC"),
      kayak("Miami to New York flights", "Miami-MIA/New-York-NYC"),
      kayak("Orlando to New York flights", "Orlando-MCO/New-York-NYC"),
    ],
    related: [
      { label: "Los Angeles to New York (LAX–JFK) fares by month", href: "/flights/lax-to-jfk" },
      { label: "Miami to New York (MIA–JFK) fares by month", href: "/flights/mia-to-jfk" },
      { label: "New York to Orlando (JFK–MCO) fares by month", href: "/flights/jfk-to-mco" },
      { label: "Cheapest time to fly to Miami", href: "/guides/cheapest-time-to-fly-to-miami" },
      { label: "Cheapest time to fly to Orlando", href: "/guides/cheapest-time-to-fly-to-orlando" },
      { label: "Cheapest time to fly to Las Vegas", href: "/guides/cheapest-time-to-fly-to-las-vegas" },
      { label: "Cheapest time to fly to Hawaii", href: "/guides/cheapest-time-to-fly-to-hawaii" },
      { label: "Search flights", href: "/" },
    ],
  },
];
