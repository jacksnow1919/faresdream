import type { Guide } from "@/lib/guides";

/**
 * Miami guide. Fares, booking windows, cheapest days, nonstop counts and flight times come from
 * the KAYAK route pages in `sources` (KAYAK's published 12-month data, read November 26, 2026).
 * "Saving" percentages, averages and month comparisons are our own arithmetic on KAYAK's figures.
 */

const checked = "2026-11-26";
const kayak = (label: string, path: string) => ({
  label: `KAYAK: ${label}`,
  url: `https://www.kayak.com/flight-routes/${path}`,
  checked,
});

export const miamiGuide: Guide = {
  slug: "cheapest-time-to-fly-to-miami",
  region: "USA",
  searchTo: "MIA",
  photo: "https://images.pexels.com/photos/35065601/pexels-photo-35065601.jpeg?auto=compress&cs=tinysrgb&w=1600&h=640&fit=crop",
  photoAlt: "Miami Beach skyline and waterfront with yachts under a blue sky",
  title: "Cheapest Time to Fly to Miami",
  metaTitle: "Cheapest Time to Fly to Miami (8 US Cities) | FaresDream",
  description:
    "January is the cheapest month to fly to Miami from most big US cities, even in peak beach season. Monthly fares, the best day to fly and when to book, city by city.",
  published: "2026-11-26",
  updated: "2026-11-26",
  author: "FaresDream Travel Team",
  authorBio:
    "The FaresDream Travel Team is the group of travel agents and editors behind FaresDream. We write our guides from public fare data (sources listed on every page), check the numbers by hand, and update each guide when the fares change. Our agents answer calls 24/7, so the questions in our guides are the ones US travellers ask us most.",
  answer:
    "January is the cheapest time to fly to Miami from most US cities. In KAYAK's 12-month data, the cheapest month to fly to Miami (MIA) was January on 5 of the 8 routes we checked, from $105 round trip out of Atlanta. Summer and the fall are the most expensive: June, July, October and November top the list on most routes. Friday is the most expensive day to fly on every route.",
  keyFacts: [
    "Cheapest month: January from New York, Chicago, Washington, Atlanta and Denver; February from Los Angeles; March from Boston; April from Dallas.",
    "Every route was cheapest between January and April.",
    "Lowest monthly fare we found: Atlanta–Miami in January, $105 round trip.",
    "Monday, Tuesday or Wednesday was the cheapest day to fly on every route, and Friday was the most expensive on all 8.",
    "Book about 4 to 14 weeks ahead; the best booking week cost 25% to 40% less than the last two weeks.",
  ],
  table: {
    caption: "Round-trip economy fares to Miami (MIA) by US departure city",
    typicalLabel: "Typical fare",
    rows: [
      {
        route: "Atlanta (ATL) – Miami",
        monthly: [105, 117, 117, 144, 192, 255, 205, 160, 192, 191, 179, 151],
        cheapestMonth: "January · $105",
        priciestMonths: "June $255 · July $205",
        typical: "$103–$252",
        bookAhead: "4 weeks (≈33% saving)",
        cheapestDay: "Tuesday",
      },
      {
        route: "Dallas–Fort Worth (DFW) – Miami",
        monthly: [176, 135, 229, 129, 200, 299, 287, 236, 282, 304, 291, 293],
        cheapestMonth: "April · $129",
        priciestMonths: "October $304 · June $299",
        typical: "$150–$355",
        bookAhead: "5 weeks (≈40% saving)",
        cheapestDay: "Monday",
      },
      {
        route: "Chicago (all airports) – Miami",
        monthly: [187, 192, 278, 210, 298, 372, 384, 315, 330, 368, 380, 359],
        cheapestMonth: "January · $187",
        priciestMonths: "July $384 · November $380",
        typical: "$181–$406",
        bookAhead: "7 weeks (≈30% saving)",
        cheapestDay: "Tuesday",
      },
      {
        route: "New York (all airports) – Miami",
        monthly: [196, 249, 241, 277, 283, 319, 328, 332, 304, 338, 329, 332],
        cheapestMonth: "January · $196",
        priciestMonths: "October $338 · Aug/Dec $332",
        typical: "$198–$420",
        bookAhead: "10 weeks (≈33% saving)",
        cheapestDay: "Wednesday",
      },
      {
        route: "Washington, DC (all airports) – Miami",
        monthly: [239, 308, 381, 311, 303, 325, 349, 306, 290, 337, 320, 304],
        cheapestMonth: "January · $239",
        priciestMonths: "March $381 · July $349",
        typical: "$227–$409",
        bookAhead: "14 weeks (≈25% saving)",
        cheapestDay: "Monday",
      },
      {
        route: "Boston (BOS) – Miami",
        monthly: [275, 313, 267, 337, 332, 386, 357, 368, 341, 379, 385, 405],
        cheapestMonth: "March · $267",
        priciestMonths: "December $405 · June $386",
        typical: "$241–$456",
        bookAhead: "5 weeks (≈36% saving)",
        cheapestDay: "Tuesday",
      },
      {
        route: "Denver (DEN) – Miami",
        monthly: [308, 325, 345, 328, 347, 370, 397, 364, 384, 407, 449, 391],
        cheapestMonth: "January · $308",
        priciestMonths: "November $449 · October $407",
        typical: "$271–$477",
        bookAhead: "5 weeks (≈30% saving)",
        cheapestDay: "Tuesday",
      },
      {
        route: "Los Angeles (LAX) – Miami",
        monthly: [404, 402, 473, 422, 533, 541, 498, 465, 438, 453, 520, 556],
        cheapestMonth: "February · $402",
        priciestMonths: "December $556 · June $541",
        typical: "$373–$604",
        bookAhead: "4 weeks (≈29% saving)",
        cheapestDay: "Monday",
      },
    ],
    note:
      "Monthly figures are KAYAK's published median round-trip economy fares for the last 12 months, by month of departure, read November 26, 2026. Typical fare is the range KAYAK publishes for each route. Saving compares the cheapest booking week with the average of the last two weeks before departure (our calculation from KAYAK's chart). Fares change daily; check live prices before you book.",
  },
  sections: [
    {
      id: "cheapest-month",
      heading: "What is the cheapest month to fly to Miami?",
      paragraphs: [
        "January is the cheapest month to fly to Miami from New York ($196 round trip), Chicago ($187), Washington, DC ($239), Atlanta ($105) and Denver ($308), according to KAYAK's 12-month fare data. February was cheapest from Los Angeles ($402), March from Boston ($267) and April from Dallas–Fort Worth ($129).",
        "That surprises many travellers, because January to March is Miami's busy winter season. Hotels are often at their most expensive then, but airfares in the last 12 months were at their lowest. This guide covers flights only; we did not check hotel prices.",
        "The month you pick matters a lot on short routes. From Atlanta the most expensive month (June, $255) cost 143% more than January, and from Dallas–Fort Worth October cost 136% more than April. From Los Angeles the gap was 38%.",
      ],
    },
    {
      id: "most-expensive",
      heading: "When are flights to Miami most expensive?",
      paragraphs: [
        "Summer and late fall. June or July was the most expensive month from Atlanta ($255 in June) and Chicago ($384 in July), October from New York ($338) and Dallas–Fort Worth ($304), November from Denver ($449), and December from Boston ($405) and Los Angeles ($556).",
        "Washington, DC is the odd one out: March was its most expensive month ($381), during spring break.",
      ],
    },
    {
      id: "hurricane-season",
      heading: "Is hurricane season cheaper for flights to Miami?",
      paragraphs: [
        "No. In the last 12 months, flights to Miami in September and October cost more than flights in January and February on all 8 routes we checked. From Dallas–Fort Worth they averaged $293 round trip against $156 in January and February.",
        "The Atlantic hurricane season runs from June 1 to November 30, and NOAA's National Hurricane Center puts the peak on September 10, with most activity between mid-August and mid-October. If you fly then, choose a fare you can change.",
      ],
    },
    {
      id: "cheapest-day",
      heading: "What is the cheapest day to fly to Miami?",
      paragraphs: [
        "Tuesday was the cheapest day of the week to fly to Miami from Boston, Chicago, Atlanta and Denver, Monday from Dallas–Fort Worth, Washington, DC and Los Angeles, and Wednesday from New York, based on deals KAYAK users found in the last 12 months.",
        "Friday was the most expensive day on all 8 routes. From Dallas–Fort Worth, a Monday departure averaged $173 against $271 on a Friday, and from Boston a Tuesday averaged $288 against $382 on a Friday.",
      ],
    },
    {
      id: "book-ahead",
      heading: "How far in advance should you book a flight to Miami?",
      paragraphs: [
        "Book flights to Miami about 4 to 14 weeks ahead, based on KAYAK's booking-window data. In our calculation, the best booking week cost 25% to 40% less than booking in the last two weeks before departure, so last-minute Miami flights are expensive.",
        "Booking early saved the most from Dallas–Fort Worth (about 40%, 5 weeks ahead) and Boston (about 36%, 5 weeks ahead). From Washington, DC the best week was about 14 weeks ahead.",
      ],
    },
    {
      id: "cheapest-city",
      heading: "Which US city has the cheapest flights to Miami?",
      paragraphs: [
        "Atlanta. Its 12 monthly fares to Miami averaged $167 round trip, the lowest of the 8 cities (our average of KAYAK's monthly figures), with a low of $105 in January. Dallas–Fort Worth ($238 average) was next.",
        "Los Angeles was the most expensive, averaging $475. If you live near more than one airport, also check Fort Lauderdale (FLL), about 30 miles north of Miami, which budget airlines use a lot. We did not include it in this guide.",
      ],
    },
    {
      id: "nonstop",
      heading: "How long is the flight to Miami, and who flies nonstop?",
      paragraphs: [
        "All 8 cities in this guide have nonstop flights to Miami. KAYAK lists about 3h 23m from New York, 3h 47m from Boston and 5h 01m from Los Angeles.",
        "New York has the most nonstops, with about 37 to 40 flights a day on American, Delta, United and others. Atlanta has about 17 to 19 a day, Chicago 14 to 15 and Washington, DC 13 to 14.",
        "Budget airlines such as Frontier often show the lowest Miami fare, but they charge for carry-on and checked bags. Add bag fees before you compare.",
      ],
    },
    {
      id: "tips",
      heading: "How to get the cheapest flight to Miami",
      paragraphs: [],
      bullets: [
        "Fly in January from most cities; February from Los Angeles, March from Boston and April from Dallas.",
        "Avoid June, July, October and November, the priciest months on most routes.",
        "Fly out early in the week (Monday to Wednesday), and avoid Friday.",
        "Book about 1 to 3 months ahead; last-minute fares were 25–40% higher.",
        "Compare Fort Lauderdale (FLL) as well as Miami (MIA).",
        "Compare the total cost with bags, especially on budget airlines.",
        "Travelling as a family or group, or need flexible dates? Call an agent to compare fares for you.",
      ],
    },
    {
      id: "method",
      heading: "How we put this guide together",
      paragraphs: [
        "We read KAYAK's published route data for flights to Miami International (MIA) from 8 large US cities on November 26, 2026 and copied the monthly fares, cheapest days, booking windows, nonstop counts and flight times as published. The savings percentages, yearly averages and month comparisons are our own arithmetic on those figures. Hurricane season dates come from NOAA's National Hurricane Center. We did not use FaresDream booking data.",
      ],
    },
  ],
  faqs: [
    {
      q: "What is the cheapest month to fly to Miami?",
      a: "Usually January. In KAYAK's 12-month data, January was cheapest from New York ($196 round trip), Chicago ($187), Washington, DC ($239), Atlanta ($105) and Denver ($308). February was cheapest from Los Angeles, March from Boston and April from Dallas–Fort Worth.",
    },
    {
      q: "What is the most expensive month to fly to Miami?",
      a: "It depends on the city: June or July from Atlanta and Chicago, October from New York and Dallas–Fort Worth, November from Denver, December from Boston and Los Angeles, and March from Washington, DC.",
    },
    {
      q: "Is it cheaper to fly to Miami during hurricane season?",
      a: "No. September and October cost more than January and February on all 8 US routes we checked. Hurricane season runs from June 1 to November 30 and peaks around September 10.",
    },
    {
      q: "What day of the week is cheapest to fly to Miami?",
      a: "Tuesday on 4 of the 8 routes, Monday on 3 and Wednesday from New York. Friday was the most expensive day on all 8 routes.",
    },
    {
      q: "How far in advance should I book a flight to Miami?",
      a: "About 4 to 14 weeks ahead. The best booking week cost 25% to 40% less than booking in the last two weeks before departure.",
    },
  ],
  sources: [
    kayak("Atlanta to Miami flights", "Atlanta-ATL/Miami-MIA"),
    kayak("Dallas–Fort Worth to Miami flights", "Dallas-DFW/Miami-MIA"),
    kayak("Chicago to Miami flights", "Chicago-CHI/Miami-MIA"),
    kayak("New York to Miami flights", "New-York-NYC/Miami-MIA"),
    kayak("Washington, DC to Miami flights", "Washington-WAS/Miami-MIA"),
    kayak("Boston to Miami flights", "Boston-BOS/Miami-MIA"),
    kayak("Denver to Miami flights", "Denver-DEN/Miami-MIA"),
    kayak("Los Angeles to Miami flights", "Los-Angeles-LAX/Miami-MIA"),
    {
      label: "NOAA National Hurricane Center: Tropical Cyclone Climatology",
      url: "https://www.nhc.noaa.gov/climo/",
      checked,
    },
  ],
  related: [
    { label: "Cheapest time to fly to Orlando", href: "/guides/cheapest-time-to-fly-to-orlando" },
    { label: "Cheapest time to fly to Puerto Rico", href: "/guides/cheapest-time-to-fly-to-puerto-rico" },
    { label: "Cheapest time to fly to Cancun", href: "/guides/cheapest-time-to-fly-to-cancun" },
    { label: "Flights from Miami to New York", href: "/flights/mia-to-jfk" },
  ],
};
