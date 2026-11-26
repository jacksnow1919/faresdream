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
  singapore: {
    checked: "2026-11-26",
    summary:
      "Late summer is the cheapest time to fly from the US to Singapore, and December is the most expensive. In KAYAK's 12-month data, August or September was the cheapest month (or within about 11% of it) on 5 of the 6 US routes we checked, with median round-trip fares from $696 (San Francisco). December cost 86–119% more than each route's cheapest month. The West Coast is much cheaper than the East: typical fares were $841–$923 from San Francisco, Seattle and Los Angeles against $1,246–$1,364 from New York, Chicago and Dallas.",
    keyFacts: [
      "Cheapest window: August–September on most routes (lowest median $696, San Francisco)",
      "Priciest month: December on 5 of 6 routes ($1,450–$1,919 median round trip)",
      "West Coast is cheaper: typical $841 San Francisco, $851 Seattle, $923 Los Angeles",
      "East and Central: typical $1,246 Chicago, $1,252 New York, $1,364 Dallas",
      "Nonstop: from New York area, Los Angeles, San Francisco and Seattle (about 17–19 hours)",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Singapore-SIN", monthly: [1034, 970, 1097, 1155, 1239, 1357, 1303, 1121, 978, 1012, 1058, 1919], cheapestMonth: "February · $970", priciestMonth: "December · $1,919", typical: "$1,252", cheapestDay: "Sunday", cheapestAirlines: ["United Airlines", "Gulf Air", "Emirates"], nonstop: "Singapore Airlines, about 19h 03m" },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Singapore-SIN", monthly: [911, 802, 850, 815, 908, 1236, 1060, 780, 794, 866, 837, 1450], cheapestMonth: "August · $780", priciestMonth: "December · $1,450", typical: "$923", cheapestDay: "Tuesday", cheapestAirlines: ["Korean Air", "China Eastern", "United Airlines"], nonstop: "Singapore Airlines, about 17h 48m" },
      { from: "San Francisco (SFO)", kayak: "San-Francisco-SFO/Singapore-SIN", monthly: [787, 759, 789, 803, 929, 1318, 1303, 696, 696, 744, 826, 1522], cheapestMonth: "August · $696", priciestMonth: "December · $1,522", typical: "$841", cheapestDay: "Wednesday", cheapestAirlines: ["Korean Air", "Singapore Airlines", "Philippine Airlines"], nonstop: "United Airlines and Singapore Airlines" },
      { from: "Seattle (SEA)", kayak: "Seattle-SEA/Singapore-SIN", monthly: [970, 853, 757, 787, 743, 991, 1101, 954, 821, 774, 787, 1588], cheapestMonth: "May · $743", priciestMonth: "December · $1,588", typical: "$851", cheapestDay: "Tuesday", cheapestAirlines: ["Singapore Airlines", "Philippine Airlines", "Cathay Pacific"], nonstop: "Singapore Airlines, about 17h 05m" },
      { from: "Chicago", kayak: "Chicago-CHI/Singapore-SIN", monthly: [958, 1082, 1016, 949, 1159, 1290, 1387, 1297, 923, 970, 1015, 1867], cheapestMonth: "September · $923", priciestMonth: "December · $1,867", typical: "$1,246", cheapestDay: "Tuesday", cheapestAirlines: ["Cathay Pacific", "Etihad Airways", "Air Canada"], nonstop: null },
      { from: "Dallas (DFW)", kayak: "Dallas-DFW/Singapore-SIN", monthly: [862, 983, 1187, 1057, 2200, 1495, 1346, 1123, 1105, 1083, 1108, 1785], cheapestMonth: "January · $862", priciestMonth: "May · $2,200", typical: "$1,364", cheapestDay: "Wednesday", cheapestAirlines: ["Cathay Pacific", "Korean Air", "Air Canada"], nonstop: null },
    ],
    faqs: [
      {
        q: "What is the cheapest month to fly to Singapore from the US?",
        a: "It depends on your city, but August or September is the safest bet. In KAYAK's 12-month data the cheapest month was August from Los Angeles and San Francisco, September from Chicago, February from New York (September was within 1%), May from Seattle and January from Dallas. The lowest monthly median was $696 round trip from San Francisco in August and September.",
      },
      {
        q: "Which US city has the cheapest flights to Singapore?",
        a: "San Francisco, with a typical round-trip fare of $841 and a low of $696. Seattle ($851) and Los Angeles ($923) were close. New York ($1,252), Chicago ($1,246) and Dallas ($1,364) were about 50–60% more expensive, so if you live in the East it can pay to compare a connection through the West Coast.",
      },
      {
        q: "How much more do flights to Singapore cost in December?",
        a: "A lot. December's median fare was 98% above the cheapest month from New York ($1,919 vs $970) and 119% above it from San Francisco ($1,522 vs $696). Dallas was the one route where another month (May, $2,200) was even higher.",
      },
      {
        q: "Is June or July a cheap time to fly to Singapore?",
        a: "No. US summer holidays push fares up: June was among the three most expensive months on 5 of the 6 routes, and from San Francisco it cost $1,318 against $696 in August. Waiting until late August or September usually saves a lot.",
      },
    ],
  },
  paris: {
    checked: "2026-11-26",
    summary:
      "January and February are the cheapest months to fly from the US to Paris. On all 8 US routes we checked, the cheapest month was January or February, with median round-trip fares from $522 (New York, January) to $806 (Atlanta, February). June is the most expensive month on 6 of the 8 routes, costing 72–109% more than the cheapest month. Every city we checked has nonstop flights.",
    keyFacts: [
      "Cheapest months: January–February on all 8 routes",
      "Lowest monthly median: $522, New York in January",
      "Priciest month: June on 6 of 8 routes; December from Los Angeles and Miami",
      "Cheapest city overall: New York (typical $748), then Boston ($865) and Chicago ($892)",
      "Nonstop from all 8 cities, on Air France, Delta, United, American, JetBlue or French Bee",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Paris-PAR", monthly: [522, 576, 630, 652, 757, 902, 829, 777, 738, 761, 679, 885], cheapestMonth: "January · $522", priciestMonth: "June · $902", typical: "$748", cheapestDay: "Sunday", cheapestAirlines: ["French Bee", "TAP AIR PORTUGAL", "Icelandair"], nonstop: "Air France, United, Delta, American and JetBlue" },
      { from: "Boston (BOS)", kayak: "Boston-BOS/Paris-PAR", monthly: [655, 638, 670, 818, 895, 1097, 964, 854, 847, 871, 809, 1068], cheapestMonth: "February · $638", priciestMonth: "June · $1,097", typical: "$865", cheapestDay: "Monday", cheapestAirlines: ["TAP AIR PORTUGAL", "Icelandair", "Scandinavian Airlines"], nonstop: "Air France, JetBlue and Delta, about 6h 58m" },
      { from: "Washington, DC", kayak: "Washington-WAS/Paris-PAR", monthly: [665, 674, 829, 766, 1177, 1388, 1169, 1072, 1069, 1028, 906, 1243], cheapestMonth: "January · $665", priciestMonth: "June · $1,388", typical: "$1,039", cheapestDay: "Sunday", cheapestAirlines: ["Royal Air Maroc", "JetBlue", "TAP AIR PORTUGAL"], nonstop: "Air France and United" },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Paris-PAR", monthly: [1006, 806, 905, 920, 1158, 1391, 1140, 1089, 1066, 1084, 1025, 1281], cheapestMonth: "February · $806", priciestMonth: "June · $1,391", typical: "$1,079", cheapestDay: "Tuesday", cheapestAirlines: ["Scandinavian Airlines", "JetBlue", "British Airways"], nonstop: "Delta and Air France" },
      { from: "Chicago", kayak: "Chicago-CHI/Paris-PAR", monthly: [589, 579, 735, 690, 906, 1135, 1060, 937, 914, 891, 770, 994], cheapestMonth: "February · $579", priciestMonth: "June · $1,135", typical: "$892", cheapestDay: "Wednesday", cheapestAirlines: ["Iberia", "Icelandair", "British Airways"], nonstop: "United Airlines, Air France and American Airlines, about 8h 10m" },
      { from: "Dallas (DFW)", kayak: "Dallas-DFW/Paris-PAR", monthly: [788, 760, 801, 795, 1221, 1466, 1117, 1130, 1043, 1070, 932, 1129], cheapestMonth: "February · $760", priciestMonth: "June · $1,466", typical: "$1,060", cheapestDay: "Sunday", cheapestAirlines: ["British Airways", "Lufthansa", "Air Canada"], nonstop: "American Airlines and Air France" },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Paris-PAR", monthly: [751, 742, 975, 755, 972, 1127, 1157, 995, 1062, 1057, 1063, 1298], cheapestMonth: "February · $742", priciestMonth: "December · $1,298", typical: "$1,036", cheapestDay: "Tuesday", cheapestAirlines: ["Scandinavian Airlines", "Condor", "Royal Air Maroc"], nonstop: "Air France, Air Tahiti Nui and Delta" },
      { from: "Miami (MIA)", kayak: "Miami-MIA/Paris-PAR", monthly: [661, 656, 771, 803, 949, 1090, 993, 979, 905, 823, 762, 1131], cheapestMonth: "February · $656", priciestMonth: "December · $1,131", typical: "$911", cheapestDay: "Thursday", cheapestAirlines: ["Icelandair", "French Bee", "Air Caraïbes"], nonstop: "Air France and French Bee" },
    ],
    faqs: [
      {
        q: "What is the cheapest month to fly to Paris from the US?",
        a: "February, or January from New York and Washington. In KAYAK's 12-month data, January or February was the cheapest month on all 8 US routes we checked, with median round-trip fares from $522 (New York) to $806 (Atlanta).",
      },
      {
        q: "Is summer an expensive time to fly to Paris?",
        a: "Yes. June was the most expensive month on 6 of the 8 routes: $902 from New York against $522 in January, and $1,388 from Washington against $665. On most routes July and August were cheaper than June but still well above winter fares.",
      },
      {
        q: "Is November a good time to fly to Paris?",
        a: "It is one of the better-value months outside winter. From New York the November median was $679, from Miami $762 and from Chicago $770, all well below the summer peak on those routes.",
      },
      {
        q: "Which US city has the cheapest flights to Paris?",
        a: "New York, with a typical round-trip fare of $748 and a January median of $522. Boston ($865), Chicago ($892) and Miami ($911) came next. Atlanta, Dallas, Washington and Los Angeles had typical fares of $1,036–$1,079.",
      },
    ],
  },
};
