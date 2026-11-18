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
    region: "USA",
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
          cheapestMonth: "February · $339",
          priciestMonths: "December $546 · June $521",
          typical: "61%",
          bookAhead: "13 weeks (≈31% saving)",
          cheapestDay: "Monday",
        },
        {
          route: "San Francisco (SFO) – Honolulu (HNL)",
          cheapestMonth: "January · $382",
          priciestMonths: "December $606 · June $581",
          typical: "58%",
          bookAhead: "7 weeks (≈30% saving)",
          cheapestDay: "Tuesday",
        },
        {
          route: "Seattle (SEA) – Honolulu (HNL)",
          cheapestMonth: "January · $428",
          priciestMonths: "June $693 · December $679",
          typical: "61%",
          bookAhead: "5 weeks (≈34% saving)",
          cheapestDay: "Tuesday",
        },
        {
          route: "New York (NYC) – Honolulu (HNL)",
          cheapestMonth: "February · $796",
          priciestMonths: "December $1,281 · July $1,131",
          typical: "60%",
          bookAhead: "9 weeks (≈21% saving)",
          cheapestDay: "Wednesday",
        },
        {
          route: "Los Angeles (LAX) – Maui (OGG)",
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
      { label: "Cheapest time to fly to Las Vegas", href: "/guides/cheapest-time-to-fly-to-las-vegas" },
      { label: "Cheapest time to fly to Orlando", href: "/guides/cheapest-time-to-fly-to-orlando" },
      { label: "Search flights", href: "/" },
    ],
  },
  {
    slug: "cheapest-time-to-fly-to-orlando",
    region: "USA",
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
          cheapestMonth: "January · $173",
          priciestMonths: "August $323 · November $305",
          typical: "86%",
          bookAhead: "12 weeks (≈33% saving)",
          cheapestDay: "Tuesday",
        },
        {
          route: "Chicago (ORD) – Orlando (MCO)",
          cheapestMonth: "February · $205",
          priciestMonths: "November $373 · June $342",
          typical: "81%",
          bookAhead: "5 weeks (≈26% saving)",
          cheapestDay: "Tuesday",
        },
        {
          route: "Boston (BOS) – Orlando (MCO)",
          cheapestMonth: "January · $232",
          priciestMonths: "November $373 · June $359",
          typical: "60%",
          bookAhead: "5 weeks (≈34% saving)",
          cheapestDay: "Wednesday",
        },
        {
          route: "Atlanta (ATL) – Orlando (MCO)",
          cheapestMonth: "March · $127",
          priciestMonths: "June $210 · November $176",
          typical: "65%",
          bookAhead: "10 weeks (≈38% saving)",
          cheapestDay: "Tuesday",
        },
        {
          route: "Dallas–Fort Worth (DFW) – Orlando (MCO)",
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
    region: "USA",
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
          cheapestMonth: "January & February · $108",
          priciestMonths: "July $213 · June $203",
          typical: "97%",
          bookAhead: "5 weeks (≈51% saving)",
          cheapestDay: "Monday",
        },
        {
          route: "New York (NYC) – Las Vegas (LAS)",
          cheapestMonth: "January · $322",
          priciestMonths: "October $491 · December $450",
          typical: "52%",
          bookAhead: "12 weeks (≈33% saving)",
          cheapestDay: "Saturday",
        },
        {
          route: "Chicago (ORD) – Las Vegas (LAS)",
          cheapestMonth: "January · $254",
          priciestMonths: "October $368 · July $357",
          typical: "44%",
          bookAhead: "9 weeks (≈35% saving)",
          cheapestDay: "Monday",
        },
        {
          route: "Seattle (SEA) – Las Vegas (LAS)",
          cheapestMonth: "January · $188",
          priciestMonths: "May $307 · November $306",
          typical: "63%",
          bookAhead: "12 weeks (≈43% saving)",
          cheapestDay: "Sunday",
        },
        {
          route: "Dallas–Fort Worth (DFW) – Las Vegas (LAS)",
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
];
