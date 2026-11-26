/**
 * Real fare data for /destinations/$slug pages. Every number comes from KAYAK's public route pages
 * (12-month median round-trip economy fares, read on the `checked` date). Percentages and
 * comparisons in `summary`, `keyFacts` and `faqs` are our own arithmetic on those numbers.
 * Refresh every 1-3 months: re-run tools/kroute.py and update rows + checked.
 */
export type DestinationFareRow = {
  from: string;
  /** KAYAK flight-routes path, e.g. New-York-NYC/Mumbai-BOM */
  kayak: string;
  /** Median round-trip fare by month, Jan..Dec (USD). */
  monthly: number[];
  cheapestMonth: string;
  priciestMonth: string;
  typical: string | null;
  cheapestDay: string | null;
  cheapestAirlines: string[];
  nonstop: string | null;
};

export type DestinationFares = {
  checked: string;
  /** Answer-first summary shown at the top of the page (2-3 sentences). */
  summary: string;
  keyFacts: string[];
  rows: DestinationFareRow[];
  /** Extra questions answered from this data (shown on the page and in FAQ data). */
  faqs: { q: string; a: string }[];
};

export const destinationFares: Record<string, DestinationFares> = {
  mumbai: {
    checked: "2026-11-26",
    summary:
      "February to April is the cheapest time to fly from the US to Mumbai. On all 7 US routes we checked, the cheapest month fell in that window, with median round-trip fares from $707 (Atlanta, April) to $869 (Dallas, April). December is the most expensive month on every route, costing 76–95% more than the cheapest month. Only the New York area has nonstop flights, on Air India.",
    keyFacts: [
      "Cheapest months: February–April on all 7 routes",
      "Priciest month: December on all 7 routes ($1,309–$1,629 median round trip)",
      "Lowest monthly median: $707, Atlanta in April",
      "East Coast is cheaper: typical fares $898–$922 from Washington, Atlanta and New York vs $1,078–$1,116 from Los Angeles and San Francisco",
      "Nonstop: New York area only (Air India, about 14h 47m)",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Mumbai-BOM", monthly: [813, 773, 750, 787, 939, 1145, 1082, 994, 792, 808, 896, 1322], cheapestMonth: "March · $750", priciestMonth: "December · $1,322", typical: "$922", cheapestDay: "Tuesday", cheapestAirlines: ["Scandinavian Airlines", "Air India", "Air France"], nonstop: "Air India, about 14h 47m" },
      { from: "Washington, DC", kayak: "Washington-WAS/Mumbai-BOM", monthly: [788, 741, 765, 767, 916, 1183, 1057, 937, 795, 806, 878, 1309], cheapestMonth: "February · $741", priciestMonth: "December · $1,309", typical: "$898", cheapestDay: "Monday", cheapestAirlines: ["Emirates", "Delta", "Etihad Airways"], nonstop: null },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Mumbai-BOM", monthly: [783, 746, 723, 707, 1038, 986, 1046, 808, 798, 814, 908, 1363], cheapestMonth: "April · $707", priciestMonth: "December · $1,363", typical: "$902", cheapestDay: "Sunday", cheapestAirlines: ["Ethiopian Airlines", "Qatar Airways", "Etihad Airways"], nonstop: null },
      { from: "Chicago", kayak: "Chicago-CHI/Mumbai-BOM", monthly: [852, 784, 831, 800, 895, 1158, 1159, 951, 870, 885, 1017, 1467], cheapestMonth: "February · $784", priciestMonth: "December · $1,467", typical: "$997", cheapestDay: "Monday", cheapestAirlines: ["Scandinavian Airlines", "Royal Jordanian", "Emirates"], nonstop: null },
      { from: "Dallas (DFW)", kayak: "Dallas-DFW/Mumbai-BOM", monthly: [931, 901, 873, 869, 1061, 1304, 1314, 1027, 963, 949, 1064, 1629], cheapestMonth: "April · $869", priciestMonth: "December · $1,629", typical: "$1,054", cheapestDay: "Sunday", cheapestAirlines: ["Turkish Airlines", "Royal Jordanian", "Qatar Airways"], nonstop: null },
      { from: "San Francisco (SFO)", kayak: "San-Francisco-SFO/Mumbai-BOM", monthly: [857, 791, 830, 875, 1139, 1285, 1359, 968, 901, 995, 1132, 1518], cheapestMonth: "February · $791", priciestMonth: "December · $1,518", typical: "$1,116", cheapestDay: "Sunday", cheapestAirlines: ["Delta", "Scandinavian Airlines", "Singapore Airlines"], nonstop: null },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Mumbai-BOM", monthly: [929, 846, 817, 1013, 991, 1235, 1296, 1045, 982, 995, 1132, 1593], cheapestMonth: "March · $817", priciestMonth: "December · $1,593", typical: "$1,078", cheapestDay: "Wednesday", cheapestAirlines: ["Delta", "Royal Jordanian", "Philippine Airlines"], nonstop: null },
    ],
    faqs: [
      {
        q: "What is the cheapest month to fly to Mumbai from the US?",
        a: "February, March or April, depending on your city. In KAYAK's 12-month data the cheapest month was February from Washington, Chicago and San Francisco, March from New York and Los Angeles, and April from Atlanta and Dallas. Median round-trip fares in those months ranged from $707 to $869.",
      },
      {
        q: "Is monsoon season a cheap time to fly to Mumbai?",
        a: "Not in June or July. On every route we checked, June or July was the second most expensive month after December, because US summer holidays push demand up. September, at the end of the monsoon, is better value: from New York and Washington its median fare was within about 7% of the cheapest month.",
      },
      {
        q: "Which US city has the cheapest flights to Mumbai?",
        a: "Atlanta had the lowest monthly median ($707 in April), with Washington, DC ($741 in February) and New York ($750 in March) close behind. West Coast fares were higher: typical fares were $1,078 from Los Angeles and $1,116 from San Francisco, against $898–$922 from Washington, Atlanta and New York.",
      },
      {
        q: "How much more do flights to Mumbai cost in December?",
        a: "December's median round-trip fare was 76% above the cheapest month from New York ($1,322 vs $750) and 95% above it from Los Angeles ($1,593 vs $817). If you must travel for the holidays, book early and compare one-stop routes through Europe and the Gulf.",
      },
    ],
  },
};
