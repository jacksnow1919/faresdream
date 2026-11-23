import type { Guide } from "@/lib/guides";

/**
 * Cancun guide. Fares, booking windows, cheapest days and flight times come from the KAYAK route
 * pages in `sources` (KAYAK's published 12-month data, read November 23, 2026). Hurricane season
 * dates come from NOAA's National Hurricane Center. "Saving" percentages are our own arithmetic on
 * KAYAK's booking-window chart: cheapest week vs the average of the last two weeks before departure.
 */

const checked = "2026-11-23";
const kayak = (label: string, path: string) => ({
  label: `KAYAK: ${label}`,
  url: `https://www.kayak.com/flight-routes/${path}`,
  checked,
});

export const cancunGuide: Guide = {
  slug: "cheapest-time-to-fly-to-cancun",
  region: "International",
  searchTo: "CUN",
  photo: "https://images.unsplash.com/photo-1772656945540-77583e484667?auto=format&fit=crop&w=1600&h=640&q=65",
  photoAlt: "Turquoise water and white sand beach in Cancun, Mexico",
  title: "Cheapest Time to Fly to Cancun",
  metaTitle: "Cheapest Time to Fly to Cancun (8 US Cities) | FaresDream",
  description:
    "Winter, not fall, is the cheapest time to fly to Cancun from most big US cities. Monthly fares, the best day to fly and when to book, city by city.",
  published: "2026-11-23",
  updated: "2026-11-23",
  author: "FaresDream Travel Desk",
  answer:
    "January and February are the cheapest months to fly to Cancun from most big US cities, not September and October. Dallas–Cancun averaged $329 round trip in February against $697 in November in KAYAK's 12-month data. October to December was the most expensive time on 6 of the 8 routes we checked.",
  keyFacts: [
    "Cheapest month: February from Los Angeles, Dallas and Atlanta; January from Chicago.",
    "Spring is cheapest from three cities: May from New York, March and April from Houston Hobby, April from Miami. Denver is cheapest in July.",
    "Flights to Cancun in September and October cost more than in January and February on 7 of the 8 routes; Houston Hobby is the only exception.",
    "Monday or Tuesday was the cheapest day to fly to Cancun on 6 of the 8 routes.",
    "The lowest monthly fare to Cancun we found was Dallas–Fort Worth in February: $329 round trip.",
  ],
  table: {
    caption: "Round-trip economy fares to Cancun (CUN) by US departure city",
    typicalLabel: "Typical fare",
    rows: [
      {
        route: "Dallas–Fort Worth (DFW) – Cancun",
        monthly: [366, 329, 414, 337, 418, 450, 447, 523, 671, 642, 697, 559],
        cheapestMonth: "February · $329",
        priciestMonths: "November $697 · September $671",
        typical: "$345–$621",
        bookAhead: "14 weeks (≈17% saving)",
        cheapestDay: "Friday",
      },
      {
        route: "Atlanta (ATL) – Cancun",
        monthly: [395, 332, 346, 481, 442, 505, 489, 502, 557, 591, 585, 460],
        cheapestMonth: "February · $332",
        priciestMonths: "October $591 · November $585",
        typical: "$364–$596",
        bookAhead: "4 weeks (≈19% saving)",
        cheapestDay: "Sunday",
      },
      {
        route: "Miami (MIA) – Cancun",
        monthly: [389, 377, 383, 342, 393, 422, 445, 466, 468, 495, 533, 492],
        cheapestMonth: "April · $342",
        priciestMonths: "November $533 · October $495",
        typical: "$341–$539",
        bookAhead: "17 weeks (≈25% saving)",
        cheapestDay: "Tuesday",
      },
      {
        route: "Chicago (all airports) – Cancun",
        monthly: [374, 421, 554, 471, 452, 493, 473, 546, 545, 587, 587, 600],
        cheapestMonth: "January · $374",
        priciestMonths: "December $600 · Oct/Nov $587",
        typical: "$376–$646",
        bookAhead: "Last 2 weeks (no early saving)",
        cheapestDay: "Monday",
      },
      {
        route: "Denver (DEN) – Cancun",
        monthly: [575, 436, 535, 447, 502, 452, 392, 413, 531, 623, 669, 629],
        cheapestMonth: "July · $392",
        priciestMonths: "November $669 · December $629",
        typical: "$384–$653",
        bookAhead: "5 weeks (≈9% saving)",
        cheapestDay: "Tuesday",
      },
      {
        route: "Los Angeles (LAX) – Cancun",
        monthly: [478, 407, 499, 541, 537, 582, 570, 556, 556, 617, 686, 624],
        cheapestMonth: "February · $407",
        priciestMonths: "November $686 · December $624",
        typical: "$417–$698",
        bookAhead: "6 weeks (≈7% saving)",
        cheapestDay: "Tuesday",
      },
      {
        route: "Houston Hobby (HOU) – Cancun",
        monthly: [597, 581, 429, 429, 453, 516, 444, 459, 545, 574, 559, 549],
        cheapestMonth: "March & April · $429",
        priciestMonths: "January $597 · February $581",
        typical: "$408–$622",
        bookAhead: "13 weeks (≈36% saving)",
        cheapestDay: "Monday",
      },
      {
        route: "New York (all airports) – Cancun",
        monthly: [462, 524, 513, 518, 451, 507, 531, 595, 491, 593, 585, 593],
        cheapestMonth: "May · $451",
        priciestMonths: "August $595 · Oct/Dec $593",
        typical: "$413–$687",
        bookAhead: "25 weeks (≈15% saving)",
        cheapestDay: "Monday",
      },
    ],
    note:
      "Monthly figures are KAYAK's published median round-trip economy fares for the last 12 months, by month of departure, read November 23, 2026. Typical fare is the range KAYAK publishes for each route. Saving compares the cheapest booking week with the average of the last two weeks before departure (our calculation from KAYAK's chart). Fares change daily; check live prices before you book.",
  },
  sections: [
    {
      id: "cheapest-month",
      heading: "What is the cheapest month to fly to Cancun?",
      paragraphs: [
        "February is the cheapest month to fly to Cancun from Los Angeles ($407 round trip), Dallas–Fort Worth ($329) and Atlanta ($332), and January is cheapest from Chicago ($374), according to KAYAK's 12-month fare data. Those four cities show the same pattern: Cancun fares are lowest right after the holidays.",
        "Spring is the cheapest time to fly to Cancun from three other cities. New York–Cancun was cheapest in May ($451), Houston Hobby–Cancun in March and April ($429) and Miami–Cancun in April ($342). Denver is the odd one out, with July ($392) the cheapest month.",
        "Cancun fares swing a lot through the year. On Dallas–Cancun the most expensive month cost 112% more than the cheapest; on New York–Cancun, the steadiest route, the gap was 32%.",
      ],
    },
    {
      id: "september-october",
      heading: "Is September or October the cheapest time to fly to Cancun?",
      paragraphs: [
        "For airfare, no. Many travel guides name September and October as the cheapest months for Cancun, but in KAYAK's last 12 months of data, flights in September and October cost more than flights in January and February on 7 of the 8 US routes we checked.",
        "The gap was biggest from Dallas–Fort Worth: September and October averaged $656 round trip against $348 in January and February, almost twice as much. Houston Hobby was the only route where September and October were cheaper than January and February.",
        "September and October are also the stormiest part of the year. The Atlantic hurricane season runs from June 1 to November 30, and NOAA's National Hurricane Center puts the peak on September 10, with most activity between mid-August and mid-October. If you travel then, choose a fare you can change.",
        "This guide covers flights only. We did not check hotel prices, which follow their own seasons.",
      ],
    },
    {
      id: "most-expensive",
      heading: "When are flights to Cancun most expensive?",
      paragraphs: [
        "October to December was the most expensive time to fly to Cancun on 6 of the 8 routes: November from Los Angeles ($686), Dallas–Fort Worth ($697), Denver ($669) and Miami ($533), October from Atlanta ($591) and December from Chicago ($600).",
        "Two routes break the pattern. New York–Cancun was most expensive in August ($595), and Houston Hobby–Cancun in January ($597).",
      ],
    },
    {
      id: "cheapest-day",
      heading: "What is the cheapest day to fly to Cancun?",
      paragraphs: [
        "Monday or Tuesday was the cheapest day of the week to fly to Cancun on 6 of the 8 routes, based on deals KAYAK users found in the last 12 months. Monday was cheapest from New York, Chicago and Houston Hobby, and Tuesday from Los Angeles, Denver and Miami.",
        "Two cities differ: Friday was the cheapest day to fly from Dallas–Fort Worth to Cancun, and Sunday from Atlanta. On New York–Cancun, a Thursday departure averaged $601 against $493 on a Monday.",
      ],
    },
    {
      id: "book-ahead",
      heading: "How far in advance should you book a flight to Cancun?",
      paragraphs: [
        "Book flights to Cancun 4 to 17 weeks ahead from most US cities, and about 6 months (25 weeks) ahead from New York, based on KAYAK's booking-window data. In our calculation, the best booking week cost 7% to 36% less than booking in the last two weeks.",
        "The saving from booking early was largest from Houston Hobby (about 36%, 13 weeks ahead) and Miami (about 25%, 17 weeks ahead). Chicago–Cancun is the exception: fares were lowest in the last two weeks before departure, so early booking did not save money on that route in the last 12 months.",
      ],
    },
    {
      id: "cheapest-city",
      heading: "Which US city has the cheapest flights to Cancun?",
      paragraphs: [
        "Dallas–Fort Worth and Atlanta had the lowest monthly fares to Cancun, at $329 and $332 round trip in February. Miami was the cheapest city across the whole year: its 12 monthly fares averaged $434, the lowest of the 8 cities (our average of KAYAK's monthly figures).",
        "Los Angeles was the most expensive departure city on average, with monthly Cancun fares averaging $554. If you live between two airports, compare both: the cheapest month and the booking window differ by city.",
      ],
    },
    {
      id: "nonstop",
      heading: "How long is the flight to Cancun, and who flies nonstop?",
      paragraphs: [
        "Nonstop flights to Cancun take about 2 to 5 hours from the US cities in this guide: 2h 08m from Miami, 2h 13m from Houston Hobby, 2h 48m from Atlanta, 2h 49m from Dallas–Fort Worth, 3h 59m from Denver, 4h 01m from Chicago, 4h 25m from New York and 4h 44m from Los Angeles, according to KAYAK.",
        "New York has the most nonstop flights to Cancun, with 9 to 10 a day, followed by Chicago (7 to 10) and Atlanta (6 to 8). United, Delta and American fly nonstop from Los Angeles; Delta, Frontier and Southwest from Atlanta.",
        "Budget airlines such as Frontier, Volaris and Viva often show the lowest Cancun fare, but they charge for carry-on and checked bags. Add bag fees before you compare.",
      ],
    },
    {
      id: "tips",
      heading: "How to get the cheapest flight to Cancun",
      paragraphs: [],
      bullets: [
        "Fly in January or February from most cities, or in spring from New York, Houston or Miami.",
        "Avoid October to December, the priciest months on most routes.",
        "Fly out on a Monday or Tuesday, and check Friday from Dallas and Sunday from Atlanta.",
        "Book 1 to 4 months ahead; about 6 months ahead from New York.",
        "If you fly between August and October, pick a fare you can change because of hurricane season.",
        "Compare the total cost with bags, especially on budget airlines.",
        "Travelling as a family or group, or need flexible dates? Call an agent to compare fares for you.",
      ],
    },
    {
      id: "method",
      heading: "How we put this guide together",
      paragraphs: [
        "We read KAYAK's published route data for flights to Cancun from 8 large US cities on November 23, 2026 and copied the monthly fares, cheapest days, booking windows, nonstop counts and flight times as published. The savings percentages and the yearly averages are our own arithmetic on those figures. Hurricane season dates come from NOAA's National Hurricane Center. We did not use FaresDream booking data, and we will update this guide when new data is published.",
      ],
    },
  ],
  faqs: [
    {
      q: "What is the cheapest month to fly to Cancun?",
      a: "Usually February or January. In KAYAK's 12-month data, February was cheapest from Los Angeles ($407 round trip), Dallas–Fort Worth ($329) and Atlanta ($332), and January from Chicago ($374). Spring was cheapest from New York (May), Houston Hobby (March and April) and Miami (April).",
    },
    {
      q: "Is September the cheapest time to fly to Cancun?",
      a: "Not for airfare in the last 12 months. Flights in September and October cost more than in January and February on 7 of the 8 US routes we checked. September is also the peak of the Atlantic hurricane season, which runs from June 1 to November 30.",
    },
    {
      q: "What is the most expensive month to fly to Cancun?",
      a: "Usually November or another month between October and December. November was the priciest month from Los Angeles ($686), Dallas–Fort Worth ($697), Denver ($669) and Miami ($533). New York was priciest in August and Houston Hobby in January.",
    },
    {
      q: "What day of the week is cheapest to fly to Cancun?",
      a: "Monday or Tuesday on 6 of the 8 routes we checked. Friday was cheapest from Dallas–Fort Worth and Sunday from Atlanta.",
    },
    {
      q: "How far in advance should I book a flight to Cancun?",
      a: "About 4 to 17 weeks ahead from most US cities and about 25 weeks ahead from New York. The best booking week cost 7% to 36% less than booking in the last two weeks. From Chicago, fares were lowest in the last two weeks.",
    },
  ],
  sources: [
    kayak("Dallas–Fort Worth to Cancun flights", "Dallas-DFW/Cancun-CUN"),
    kayak("Atlanta to Cancun flights", "Atlanta-ATL/Cancun-CUN"),
    kayak("Miami to Cancun flights", "Miami-MIA/Cancun-CUN"),
    kayak("Chicago to Cancun flights", "Chicago-CHI/Cancun-CUN"),
    kayak("Denver to Cancun flights", "Denver-DEN/Cancun-CUN"),
    kayak("Los Angeles to Cancun flights", "Los-Angeles-LAX/Cancun-CUN"),
    kayak("Houston Hobby to Cancun flights", "Houston-HOU/Cancun-CUN"),
    kayak("New York to Cancun flights", "New-York-NYC/Cancun-CUN"),
    {
      label: "NOAA National Hurricane Center: Tropical Cyclone Climatology",
      url: "https://www.nhc.noaa.gov/climo/",
      checked,
    },
  ],
  related: [
    { label: "Cheap flights to Cancun", href: "/destinations/cancun" },
    { label: "Cheapest time to fly to Orlando", href: "/guides/cheapest-time-to-fly-to-orlando" },
    { label: "Cheapest time to fly to Hawaii", href: "/guides/cheapest-time-to-fly-to-hawaii" },
    { label: "Search flights to Cancun", href: "/?to=CUN" },
  ],
};
