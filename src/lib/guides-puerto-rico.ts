import type { Guide } from "@/lib/guides";

/**
 * Puerto Rico (San Juan) guide. Fares, booking windows, cheapest days, nonstop counts and flight
 * times come from the KAYAK route pages in `sources` (KAYAK's published 12-month data, read
 * November 26, 2026). Hurricane season dates come from NOAA's National Hurricane Center.
 * "Saving" percentages, averages and month comparisons are our own arithmetic on KAYAK's figures.
 */

const checked = "2026-11-26";
const kayak = (label: string, path: string) => ({
  label: `KAYAK: ${label}`,
  url: `https://www.kayak.com/flight-routes/${path}`,
  checked,
});

export const puertoRicoGuide: Guide = {
  slug: "cheapest-time-to-fly-to-puerto-rico",
  region: "USA",
  searchTo: "SJU",
  photo: "https://images.pexels.com/photos/34102483/pexels-photo-34102483.jpeg?auto=compress&cs=tinysrgb&w=1600&h=640&fit=crop",
  photoAlt: "Colourful colonial buildings on a street in Old San Juan, Puerto Rico",
  title: "Cheapest Time to Fly to Puerto Rico",
  metaTitle: "Cheapest Time to Fly to Puerto Rico (8 US Cities) | FaresDream",
  description:
    "January and February are the cheapest months to fly to San Juan, Puerto Rico from most big US cities. Monthly fares, the best day to fly and when to book, city by city.",
  published: "2026-11-26",
  updated: "2026-11-26",
  author: "FaresDream Travel Desk",
  answer:
    "January and February are the cheapest time to fly to Puerto Rico from most US cities. In KAYAK's 12-month data the cheapest month to fly to San Juan (SJU) was January or February on 5 of the 8 routes we checked, from $284 round trip out of New York. December and July are the most expensive months. Orlando is the cheapest place to fly from, with fares as low as $202 in October.",
  keyFacts: [
    "Cheapest month: January or February from New York, Boston, Washington, Atlanta and Dallas; October from Orlando, August from Chicago and September from Los Angeles.",
    "Most expensive month: December on 5 of the 8 routes; July from Boston and Atlanta.",
    "Lowest monthly fare we found: Orlando–San Juan in October, $202 round trip.",
    "Monday or Tuesday was the cheapest day to fly on 7 of the 8 routes.",
    "Book about 5 to 12 weeks ahead; the best booking week cost 6% to 31% less than the last two weeks.",
  ],
  table: {
    caption: "Round-trip economy fares to San Juan, Puerto Rico (SJU) by US departure city",
    typicalLabel: "Typical fare",
    rows: [
      {
        route: "Orlando (all airports) – San Juan",
        monthly: [241, 206, 314, 232, 299, 339, 320, 253, 235, 202, 265, 355],
        cheapestMonth: "October · $202",
        priciestMonths: "December $355 · June $339",
        typical: "$218–$360",
        bookAhead: "9 weeks (≈12% saving)",
        cheapestDay: "Tuesday",
      },
      {
        route: "New York (all airports) – San Juan",
        monthly: [284, 330, 392, 384, 378, 396, 421, 392, 350, 368, 403, 432],
        cheapestMonth: "January · $284",
        priciestMonths: "December $432 · July $421",
        typical: "$292–$505",
        bookAhead: "12 weeks (≈19% saving)",
        cheapestDay: "Monday",
      },
      {
        route: "Atlanta (ATL) – San Juan",
        monthly: [336, 297, 354, 354, 382, 443, 450, 386, 376, 326, 399, 422],
        cheapestMonth: "February · $297",
        priciestMonths: "July $450 · June $443",
        typical: "$283–$493",
        bookAhead: "10 weeks (≈26% saving)",
        cheapestDay: "Tuesday",
      },
      {
        route: "Dallas–Fort Worth (DFW) – San Juan",
        monthly: [309, 316, 416, 345, 356, 483, 458, 434, 465, 490, 500, 532],
        cheapestMonth: "January · $309",
        priciestMonths: "December $532 · November $500",
        typical: "$313–$569",
        bookAhead: "5 weeks (≈23% saving)",
        cheapestDay: "Sunday",
      },
      {
        route: "Boston (BOS) – San Juan",
        monthly: [325, 341, 330, 365, 379, 439, 475, 402, 329, 367, 453, 465],
        cheapestMonth: "January · $325",
        priciestMonths: "July $475 · December $465",
        typical: "$286–$517",
        bookAhead: "7 weeks (≈16% saving)",
        cheapestDay: "Tuesday",
      },
      {
        route: "Chicago (all airports) – San Juan",
        monthly: [345, 376, 438, 367, 379, 468, 400, 334, 373, 430, 505, 528],
        cheapestMonth: "August · $334",
        priciestMonths: "December $528 · November $505",
        typical: "$304–$542",
        bookAhead: "12 weeks (≈6% saving)",
        cheapestDay: "Tuesday",
      },
      {
        route: "Washington, DC (all airports) – San Juan",
        monthly: [397, 363, 492, 410, 429, 505, 505, 434, 397, 408, 430, 492],
        cheapestMonth: "February · $363",
        priciestMonths: "June & July $505",
        typical: "$346–$580",
        bookAhead: "9 weeks (≈7% saving)",
        cheapestDay: "Monday",
      },
      {
        route: "Los Angeles (LAX) – San Juan",
        monthly: [450, 444, 468, 417, 457, 567, 555, 450, 406, 431, 524, 570],
        cheapestMonth: "September · $406",
        priciestMonths: "December $570 · June $567",
        typical: "$392–$610",
        bookAhead: "10 weeks (≈31% saving)",
        cheapestDay: "Tuesday",
      },
    ],
    note:
      "Monthly figures are KAYAK's published median round-trip economy fares for the last 12 months, by month of departure, read November 26, 2026. Typical fare is the range KAYAK publishes for each route. Saving compares the cheapest booking week with the average of the last two weeks before departure (our calculation from KAYAK's chart). Fares change daily; check live prices before you book.",
  },
  sections: [
    {
      id: "cheapest-month",
      heading: "What is the cheapest month to fly to Puerto Rico?",
      paragraphs: [
        "January or February is the cheapest month to fly to San Juan, Puerto Rico from New York ($284 round trip in January), Boston ($325 in January), Dallas–Fort Worth ($309 in January), Atlanta ($297 in February) and Washington, DC ($363 in February), according to KAYAK's 12-month fare data.",
        "Three cities break the pattern. Orlando–San Juan was cheapest in October ($202), only $4 below February ($206). Chicago was cheapest in August ($334) and Los Angeles in September ($406).",
        "Picking the right month matters. On Orlando–San Juan the most expensive month cost 76% more than the cheapest, and on Dallas–San Juan 72% more. Washington, DC was the steadiest route, with a 39% gap.",
      ],
    },
    {
      id: "most-expensive",
      heading: "When are flights to Puerto Rico most expensive?",
      paragraphs: [
        "December was the most expensive month to fly to San Juan on 5 of the 8 routes: New York ($432), Chicago ($528), Orlando ($355), Dallas–Fort Worth ($532) and Los Angeles ($570).",
        "Summer is the other expensive season. July was the priciest month from Boston ($475) and Atlanta ($450), and June and July tied as the priciest from Washington, DC ($505).",
      ],
    },
    {
      id: "hurricane-season",
      heading: "Is hurricane season cheaper for flights to Puerto Rico?",
      paragraphs: [
        "Only on some routes. September and October together were cheaper than January and February from Orlando and Los Angeles, but more expensive on the other 6 routes we checked. From Dallas–Fort Worth, September and October averaged $478 round trip against $313 in January and February.",
        "The Atlantic hurricane season runs from June 1 to November 30, and NOAA's National Hurricane Center puts the peak on September 10, with most activity between mid-August and mid-October. If you fly then, choose a fare you can change.",
        "This guide covers flights only. We did not check hotel prices, which follow their own seasons.",
      ],
    },
    {
      id: "cheapest-day",
      heading: "What is the cheapest day to fly to Puerto Rico?",
      paragraphs: [
        "Monday or Tuesday was the cheapest day of the week to fly to San Juan on 7 of the 8 routes, based on deals KAYAK users found in the last 12 months. Tuesday was cheapest from Boston, Chicago, Atlanta, Orlando and Los Angeles, and Monday from New York and Washington, DC.",
        "Dallas–Fort Worth is the exception, with Sunday the cheapest day ($400 against $468 on a Friday). Thursday and Friday were among the two most expensive days on 6 of the 8 routes.",
      ],
    },
    {
      id: "book-ahead",
      heading: "How far in advance should you book a flight to Puerto Rico?",
      paragraphs: [
        "Book flights to Puerto Rico about 5 to 12 weeks ahead, based on KAYAK's booking-window data. In our calculation, the best booking week cost 6% to 31% less than booking in the last two weeks before departure.",
        "Booking early saved the most from Los Angeles (about 31%, 10 weeks ahead), Atlanta (about 26%, 10 weeks ahead) and Dallas–Fort Worth (about 23%, 5 weeks ahead). From Chicago and Washington, DC the saving was small, about 6–7%.",
      ],
    },
    {
      id: "cheapest-city",
      heading: "Which US city has the cheapest flights to Puerto Rico?",
      paragraphs: [
        "Orlando. Its 12 monthly fares to San Juan averaged $272 round trip, the lowest of the 8 cities (our average of KAYAK's monthly figures), and it had the lowest single month, $202 in October.",
        "Atlanta ($377 average) and New York ($378) were next. Los Angeles was the most expensive, averaging $478, and it had no regular nonstop flights in KAYAK's data, so most trips from the West Coast connect.",
      ],
    },
    {
      id: "nonstop",
      heading: "How long is the flight to Puerto Rico, and who flies nonstop?",
      paragraphs: [
        "Nonstop flights to San Juan take about 2h 52m from Orlando, 3h 32m from Atlanta, 3h 52m from Washington, DC and 4h 37m from Dallas–Fort Worth, according to KAYAK.",
        "Orlando and New York have the most nonstops, with about 17 to 18 and 15 to 16 flights a day. Southwest, JetBlue and Frontier fly from Orlando; JetBlue, United, Delta and Frontier from New York. Atlanta has about 6 to 7 a day on Delta and Frontier.",
        "Budget airlines such as Frontier often show the lowest fare to San Juan, but they charge for carry-on and checked bags. Add bag fees before you compare.",
      ],
    },
    {
      id: "tips",
      heading: "How to get the cheapest flight to Puerto Rico",
      paragraphs: [],
      bullets: [
        "Fly in January or February from most cities; October from Orlando, August from Chicago and September from Los Angeles.",
        "Avoid December and July, the priciest months on most routes.",
        "Fly out on a Monday or Tuesday, or a Sunday from Dallas.",
        "Book about 5 to 12 weeks ahead.",
        "If you fly between August and October, pick a fare you can change because of hurricane season.",
        "Compare the total cost with bags, especially on budget airlines.",
        "Travelling as a family or group, or need flexible dates? Call an agent to compare fares for you.",
      ],
    },
    {
      id: "method",
      heading: "How we put this guide together",
      paragraphs: [
        "We read KAYAK's published route data for flights to San Juan (SJU) from 8 large US cities on November 26, 2026 and copied the monthly fares, cheapest days, booking windows, nonstop counts and flight times as published. The savings percentages, yearly averages and month comparisons are our own arithmetic on those figures. Hurricane season dates come from NOAA's National Hurricane Center. We did not use FaresDream booking data.",
      ],
    },
  ],
  faqs: [
    {
      q: "What is the cheapest month to fly to Puerto Rico?",
      a: "Usually January or February. In KAYAK's 12-month data, January was cheapest from New York ($284 round trip), Boston ($325) and Dallas–Fort Worth ($309), and February from Atlanta ($297) and Washington, DC ($363). Orlando was cheapest in October ($202).",
    },
    {
      q: "What is the most expensive month to fly to Puerto Rico?",
      a: "December on 5 of the 8 US routes we checked, and July from Boston and Atlanta. June and July tied as the priciest months from Washington, DC.",
    },
    {
      q: "Is it cheaper to fly to Puerto Rico during hurricane season?",
      a: "Not usually. September and October were more expensive than January and February on 6 of the 8 routes; only Orlando and Los Angeles were cheaper then. Hurricane season runs from June 1 to November 30 and peaks around September 10.",
    },
    {
      q: "What day of the week is cheapest to fly to Puerto Rico?",
      a: "Monday or Tuesday on 7 of the 8 routes we checked. Sunday was cheapest from Dallas–Fort Worth.",
    },
    {
      q: "Which US city has the cheapest flights to San Juan?",
      a: "Orlando, with monthly fares averaging $272 round trip and a low of $202 in October. Atlanta and New York averaged about $377–$378.",
    },
  ],
  sources: [
    kayak("Orlando to San Juan flights", "Orlando-ORL/San-Juan-SJU"),
    kayak("New York to San Juan flights", "New-York-NYC/San-Juan-SJU"),
    kayak("Atlanta to San Juan flights", "Atlanta-ATL/San-Juan-SJU"),
    kayak("Dallas–Fort Worth to San Juan flights", "Dallas-DFW/San-Juan-SJU"),
    kayak("Boston to San Juan flights", "Boston-BOS/San-Juan-SJU"),
    kayak("Chicago to San Juan flights", "Chicago-CHI/San-Juan-SJU"),
    kayak("Washington, DC to San Juan flights", "Washington-WAS/San-Juan-SJU"),
    kayak("Los Angeles to San Juan flights", "Los-Angeles-LAX/San-Juan-SJU"),
    {
      label: "NOAA National Hurricane Center: Tropical Cyclone Climatology",
      url: "https://www.nhc.noaa.gov/climo/",
      checked,
    },
  ],
  related: [
    { label: "Cheapest time to fly to Cancun", href: "/guides/cheapest-time-to-fly-to-cancun" },
    { label: "Cheapest time to fly to Miami", href: "/guides/cheapest-time-to-fly-to-miami" },
    { label: "Cheapest time to fly to Orlando", href: "/guides/cheapest-time-to-fly-to-orlando" },
    { label: "Search flights to San Juan", href: "/?to=SJU" },
  ],
};
