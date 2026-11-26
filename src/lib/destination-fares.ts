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
  delhi: {
    checked: "2026-11-26",
    summary:
      "February to April is the cheapest time to fly from the US to Delhi. On all 7 US routes we checked, the cheapest month fell in that window, with median round-trip fares from $777 (Atlanta, April) to $977 (Los Angeles, March). December is the most expensive month from 5 of the 7 cities, and June and July are expensive from all of them. Only the New York area has nonstop flights in this data.",
    keyFacts: [
      "Cheapest months: February–April on all 7 routes",
      "Priciest month: December from 5 cities ($1,312–$1,586); July from San Francisco and Los Angeles",
      "Lowest monthly median: $777, Atlanta in April ($779 from Chicago in April)",
      "East and Midwest are cheaper: typical fares $956–$1,001 from New York, Washington, Atlanta and Chicago vs $1,071–$1,142 from San Francisco, Los Angeles and Dallas",
      "Nonstop: New York area only (Air India, United, American; about 14h 55m)",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/New-Delhi-DEL", monthly: [858, 816, 825, 821, 1012, 1141, 1120, 975, 837, 885, 990, 1312], cheapestMonth: "February · $816", priciestMonth: "December · $1,312", typical: "$956", cheapestDay: "Monday", cheapestAirlines: ["Etihad Airways", "Virgin Atlantic", "Turkish Airlines"], nonstop: "Air India, United Airlines and American Airlines, about 14h 55m" },
      { from: "Washington, DC", kayak: "Washington-WAS/New-Delhi-DEL", monthly: [888, 831, 854, 803, 964, 1172, 1106, 925, 821, 939, 1055, 1412], cheapestMonth: "April · $803", priciestMonth: "December · $1,412", typical: "$982", cheapestDay: "Tuesday", cheapestAirlines: ["Emirates", "Delta", "Etihad Airways"], nonstop: null },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/New-Delhi-DEL", monthly: [873, 795, 807, 777, 1065, 1134, 1048, 850, 849, 944, 1019, 1354], cheapestMonth: "April · $777", priciestMonth: "December · $1,354", typical: "$988", cheapestDay: "Monday", cheapestAirlines: ["Etihad Airways", "Virgin Atlantic", "Delta"], nonstop: null },
      { from: "Chicago", kayak: "Chicago-CHI/New-Delhi-DEL", monthly: [892, 830, 837, 779, 1003, 1204, 1212, 960, 880, 975, 1179, 1409], cheapestMonth: "April · $779", priciestMonth: "December · $1,409", typical: "$1,001", cheapestDay: "Wednesday", cheapestAirlines: ["United Airlines", "Ethiopian Air", "Delta"], nonstop: null },
      { from: "Dallas (DFW)", kayak: "Dallas-DFW/New-Delhi-DEL", monthly: [998, 938, 980, 862, 1092, 1273, 1276, 1034, 991, 1062, 1292, 1586], cheapestMonth: "April · $862", priciestMonth: "December · $1,586", typical: "$1,142", cheapestDay: "Tuesday", cheapestAirlines: ["Qatar Airways", "Turkish Airlines", "Emirates"], nonstop: null },
      { from: "San Francisco (SFO)", kayak: "San-Francisco-SFO/New-Delhi-DEL", monthly: [944, 908, 888, 988, 1034, 1362, 1389, 1010, 961, 1069, 1199, 1321], cheapestMonth: "March · $888", priciestMonth: "July · $1,389", typical: "$1,071", cheapestDay: "Tuesday", cheapestAirlines: ["Qatar Airways", "Air India", "China Southern"], nonstop: null },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/New-Delhi-DEL", monthly: [1004, 1018, 977, 1005, 1097, 1289, 1329, 1036, 990, 1071, 1129, 1313], cheapestMonth: "March · $977", priciestMonth: "July · $1,329", typical: "$1,104", cheapestDay: "Tuesday", cheapestAirlines: ["Delta", "Qatar Airways", "EVA Air"], nonstop: null },
    ],
    faqs: [
      {
        q: "Is September or October a cheap time to fly to Delhi?",
        a: "Fairly. On every route, the September–October average was only 2–10% above the January–February average (our calculation from KAYAK's monthly medians). Fares then climb in November and peak in December on most routes.",
      },
      {
        q: "How much more do flights to Delhi cost in December?",
        a: "December's median round-trip fare was 61% above the cheapest month from New York ($1,312 vs $816) and 84% above it from Dallas ($1,586 vs $862).",
      },
      {
        q: "Are summer flights to Delhi expensive?",
        a: "Yes. June's median was 32–55% above each route's cheapest month, because US summer holidays push up demand. The monsoon does not bring cheap fares from the US.",
      },
      {
        q: "Which US city has the cheapest flights to Delhi?",
        a: "New York had the lowest typical fare ($956), and Atlanta ($777) and Chicago ($779) had the lowest single-month medians, both in April. West Coast cities and Dallas were about $100–$190 more on a typical trip.",
      },
    ],
  },
  london: {
    checked: "2026-11-26",
    summary:
      "January and February are the cheapest time to fly from the US to London. On all 8 US routes we checked, the cheapest month was January or February, with median round-trip fares from $524 (New York, February) to $867 (Dallas, February). June is the most expensive month on every route, at 73–127% above the cheapest month. Every city we checked has nonstop flights.",
    keyFacts: [
      "Cheapest months: January or February on all 8 routes",
      "Priciest month: June on all 8 routes ($914–$1,590 median round trip)",
      "Lowest monthly median: $524, New York in February ($527 from Boston in January)",
      "The Northeast is cheapest: typical fares $747 from New York and $777 from Boston vs $1,069–$1,178 from Atlanta and Dallas",
      "Nonstop from all 8 cities in KAYAK's data (New York about 7h 07m, Dallas about 9h 03m)",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/London-LON", monthly: [537, 524, 612, 648, 759, 914, 832, 748, 766, 797, 740, 853], cheapestMonth: "February · $524", priciestMonth: "June · $914", typical: "$747", cheapestDay: "Monday", cheapestAirlines: ["Icelandair", "Scandinavian Airlines", "TAP AIR PORTUGAL"], nonstop: "British Airways, United Airlines and others, about 7h 07m" },
      { from: "Boston (BOS)", kayak: "Boston-BOS/London-LON", monthly: [527, 551, 618, 699, 766, 1028, 882, 764, 789, 800, 810, 845], cheapestMonth: "January · $527", priciestMonth: "June · $1,028", typical: "$777", cheapestDay: "Monday", cheapestAirlines: ["Icelandair", "Scandinavian Airlines", "United Airlines"], nonstop: "Yes (about 6 a day)" },
      { from: "Washington, DC", kayak: "Washington-WAS/London-LON", monthly: [738, 661, 778, 801, 971, 1285, 1085, 923, 917, 916, 868, 1114], cheapestMonth: "February · $661", priciestMonth: "June · $1,285", typical: "$932", cheapestDay: "Wednesday", cheapestAirlines: ["Icelandair", "Scandinavian Airlines", "TAP AIR PORTUGAL"], nonstop: "Yes (about 5 a day)" },
      { from: "Chicago", kayak: "Chicago-CHI/London-LON", monthly: [636, 694, 811, 773, 940, 1444, 1134, 949, 942, 878, 840, 1012], cheapestMonth: "January · $636", priciestMonth: "June · $1,444", typical: "$910", cheapestDay: "Wednesday", cheapestAirlines: ["Scandinavian Airlines", "Icelandair", "Iberia"], nonstop: "United Airlines, British Airways and American Airlines, about 7h 59m" },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/London-LON", monthly: [840, 823, 874, 898, 1205, 1421, 1244, 1018, 1017, 992, 978, 1126], cheapestMonth: "February · $823", priciestMonth: "June · $1,421", typical: "$1,069", cheapestDay: "Wednesday", cheapestAirlines: ["Scandinavian Airlines", "British Airways", "Iberia"], nonstop: "Yes (about 5 a day)" },
      { from: "Miami (MIA)", kayak: "Miami-MIA/London-LON", monthly: [779, 641, 838, 801, 979, 1235, 1226, 1059, 1053, 1004, 936, 1113], cheapestMonth: "February · $641", priciestMonth: "June · $1,235", typical: "$1,037", cheapestDay: "Tuesday", cheapestAirlines: ["TAP AIR PORTUGAL", "Air Europa", "Scandinavian Airlines"], nonstop: "Virgin Atlantic, British Airways and American Airlines, about 8h 41m" },
      { from: "Dallas (DFW)", kayak: "Dallas-DFW/London-LON", monthly: [900, 867, 978, 906, 1242, 1590, 1454, 1109, 1057, 1107, 1143, 1398], cheapestMonth: "February · $867", priciestMonth: "June · $1,590", typical: "$1,178", cheapestDay: "Wednesday", cheapestAirlines: ["Lufthansa", "Turkish Airlines", "Iberia"], nonstop: "American Airlines and British Airways, about 9h 03m" },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/London-LON", monthly: [780, 670, 781, 806, 979, 1329, 1178, 962, 942, 944, 906, 1240], cheapestMonth: "February · $670", priciestMonth: "June · $1,329", typical: "$996", cheapestDay: "Tuesday", cheapestAirlines: ["Iberia", "United Airlines", "Scandinavian Airlines"], nonstop: "Yes (about 7 a day)" },
    ],
    faqs: [
      {
        q: "Is it cheaper to fly to London in winter or summer?",
        a: "Winter, by a wide margin. June–July averaged 65% more than January–February from New York ($873 vs $530) and 94% more from Chicago ($1,289 vs $665) (our calculation from KAYAK's monthly medians).",
      },
      {
        q: "Is fall a cheap time to fly to London?",
        a: "Not especially. September–October averaged 21–47% more than January–February on the 8 routes we checked. It is cheaper than summer, but winter is the real low season.",
      },
      {
        q: "Are Christmas flights to London expensive?",
        a: "December was 37–85% above the cheapest month, but still cheaper than June on every route we checked.",
      },
      {
        q: "Which US city has the cheapest flights to London?",
        a: "New York (typical $747) and Boston (typical $777). The lowest single-month medians were $524 from New York in February and $527 from Boston in January.",
      },
    ],
  },
  dubai: {
    checked: "2026-11-26",
    summary:
      "January–February and September–October are the cheapest times to fly from the US to Dubai. On all 7 US routes we checked, the cheapest month fell in one of those windows, with median round-trip fares from $676 (Atlanta, September) to $906 (Los Angeles, January). December is the most expensive month from 5 of the 7 cities, and summer is not cheap despite the heat. Emirates flies nonstop from every city on our list except Atlanta.",
    keyFacts: [
      "Cheapest months: January–February or September–October on all 7 routes",
      "Priciest month: December from 5 cities ($1,136–$1,327); June from San Francisco and Los Angeles",
      "Lowest monthly median: $676, Atlanta in September",
      "The East Coast is cheaper: typical fares $817–$869 from Atlanta, Washington and New York vs $1,001–$1,012 from San Francisco and Los Angeles",
      "Nonstop: Emirates from New York, Washington, Chicago, Dallas, San Francisco and Los Angeles (Washington about 12h 45m)",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Dubai-DXB", monthly: [778, 818, 811, 850, 875, 950, 971, 907, 801, 756, 853, 1308], cheapestMonth: "October · $756", priciestMonth: "December · $1,308", typical: "$869", cheapestDay: "Sunday", cheapestAirlines: ["Royal Jordanian", "Air India", "Gulf Air"], nonstop: "Yes (about 2 a day)" },
      { from: "Washington, DC", kayak: "Washington-WAS/Dubai-DXB", monthly: [779, 798, 778, 830, 878, 1088, 906, 955, 724, 746, 796, 1327], cheapestMonth: "September · $724", priciestMonth: "December · $1,327", typical: "$865", cheapestDay: "Wednesday", cheapestAirlines: ["Royal Jordanian", "SAUDIA", "Turkish Airlines"], nonstop: "Emirates, about 12h 45m" },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Dubai-DXB", monthly: [689, 727, 728, 816, 878, 1027, 1063, 853, 676, 826, 815, 1136], cheapestMonth: "September · $676", priciestMonth: "December · $1,136", typical: "$817", cheapestDay: "Thursday", cheapestAirlines: ["Turkish Airlines", "KLM", "Qatar Airways"], nonstop: null },
      { from: "Chicago", kayak: "Chicago-CHI/Dubai-DXB", monthly: [764, 772, 843, 802, 1054, 1137, 1027, 897, 852, 864, 888, 1170], cheapestMonth: "January · $764", priciestMonth: "December · $1,170", typical: "$879", cheapestDay: "Tuesday", cheapestAirlines: ["Air France", "KLM", "Delta"], nonstop: "Yes (about 1 a day)" },
      { from: "Dallas (DFW)", kayak: "Dallas-DFW/Dubai-DXB", monthly: [916, 796, 856, 867, 889, 1104, 1087, 897, 864, 913, 920, 1232], cheapestMonth: "February · $796", priciestMonth: "December · $1,232", typical: "$930", cheapestDay: "Tuesday", cheapestAirlines: ["Royal Jordanian", "Turkish Airlines", "Qatar Airways"], nonstop: "Emirates, about 14h 45m" },
      { from: "San Francisco (SFO)", kayak: "San-Francisco-SFO/Dubai-DXB", monthly: [882, 925, 903, 982, 1043, 1159, 1145, 1036, 976, 1019, 999, 1158], cheapestMonth: "January · $882", priciestMonth: "June · $1,159", typical: "$1,001", cheapestDay: "Saturday", cheapestAirlines: ["Air India", "Qatar Airways", "Air France"], nonstop: "Yes (about 1 a day)" },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Dubai-DXB", monthly: [906, 908, 929, 963, 1002, 1272, 1096, 1026, 929, 1011, 1001, 1235], cheapestMonth: "January · $906", priciestMonth: "June · $1,272", typical: "$1,012", cheapestDay: "Tuesday", cheapestAirlines: ["Air France", "Delta", "Turkish Airlines"], nonstop: "Yes (about 1 a day)" },
    ],
    faqs: [
      {
        q: "Is summer a cheap time to fly to Dubai?",
        a: "No. Dubai is very hot from June to August, but June–July fares from the US averaged 27–55% above each route's cheapest month (our calculation from KAYAK's monthly medians). Hotels may be cheaper then; flights are not.",
      },
      {
        q: "How much more do flights to Dubai cost in December?",
        a: "December's median round-trip fare was 73% above the cheapest month from New York ($1,308 vs $756) and 83% above it from Washington ($1,327 vs $724).",
      },
      {
        q: "Which US city has the cheapest flights to Dubai?",
        a: "Atlanta had the lowest typical fare ($817) and the lowest single-month median ($676 in September), even though it has no nonstop. Washington ($865) and New York ($869) were close behind.",
      },
      {
        q: "How long is the nonstop flight from the US to Dubai?",
        a: "About 12h 45m from Washington and 14h 45m from Dallas on Emirates, based on KAYAK's route data.",
      },
    ],
  },
  tokyo: {
    checked: "2026-11-26",
    summary:
      "January and February are the cheapest time to fly from the US to Tokyo from most cities. On 6 of the 7 US routes we checked, the cheapest month was January or February, with median round-trip fares from $791 (Seattle, February) to $1,125 (Chicago, February); Los Angeles was cheapest in September ($738). December is the most expensive month on every route, and March and June are also expensive. Every city we checked has nonstop flights.",
    keyFacts: [
      "Cheapest months: January or February on 6 of 7 routes; September from Los Angeles",
      "Priciest month: December on all 7 routes ($1,186–$2,085 median round trip)",
      "Lowest monthly median: $738, Los Angeles in September",
      "The West Coast is cheapest: typical fares $951–$1,045 from Los Angeles, Seattle and San Francisco vs $1,343–$1,591 from New York, Chicago, Atlanta and Dallas",
      "Nonstop from all 7 cities in KAYAK's data (Los Angeles about 12h 01m, Atlanta about 14h 29m)",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Tokyo-TYO", monthly: [1083, 1083, 1367, 1176, 1413, 1567, 1450, 1297, 1258, 1392, 1325, 1728], cheapestMonth: "January · $1,083", priciestMonth: "December · $1,728", typical: "$1,343", cheapestDay: "Monday", cheapestAirlines: ["Air Canada", "United Airlines", "ANA"], nonstop: "Yes (about 7 a day)" },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Tokyo-TYO", monthly: [749, 748, 1056, 915, 1004, 1170, 1057, 741, 738, 948, 998, 1186], cheapestMonth: "September · $738", priciestMonth: "December · $1,186", typical: "$951", cheapestDay: "Tuesday", cheapestAirlines: ["ZIPAIR", "AIR PREMIA", "Singapore Airlines"], nonstop: "ANA, United Airlines and others, about 12h 01m" },
      { from: "San Francisco (SFO)", kayak: "San-Francisco-SFO/Tokyo-TYO", monthly: [852, 922, 1014, 1010, 1028, 1271, 1151, 874, 893, 1004, 1124, 1381], cheapestMonth: "January · $852", priciestMonth: "December · $1,381", typical: "$1,045", cheapestDay: "Tuesday", cheapestAirlines: ["ZIPAIR", "Cathay Pacific", "AIR PREMIA"], nonstop: "Yes (about 7 a day)" },
      { from: "Seattle (SEA)", kayak: "Seattle-SEA/Tokyo-TYO", monthly: [847, 791, 1048, 986, 1010, 1194, 1080, 987, 975, 1081, 1077, 1371], cheapestMonth: "February · $791", priciestMonth: "December · $1,371", typical: "$1,027", cheapestDay: "Sunday", cheapestAirlines: ["Cathay Pacific", "Philippine Airlines", "Air Canada"], nonstop: "Yes (about 4 a day)" },
      { from: "Chicago", kayak: "Chicago-CHI/Tokyo-TYO", monthly: [1376, 1125, 1511, 1196, 1406, 1608, 1510, 1292, 1302, 1336, 1291, 1750], cheapestMonth: "February · $1,125", priciestMonth: "December · $1,750", typical: "$1,396", cheapestDay: "Tuesday", cheapestAirlines: ["Air Canada", "Cathay Pacific", "ANA"], nonstop: "Yes (about 6 a day)" },
      { from: "Dallas (DFW)", kayak: "Dallas-DFW/Tokyo-TYO", monthly: [1098, 1198, 1560, 1295, 1831, 1965, 1968, 1396, 1405, 1544, 1712, 2085], cheapestMonth: "January · $1,098", priciestMonth: "December · $2,085", typical: "$1,591", cheapestDay: "Wednesday", cheapestAirlines: ["Qatar Airways", "Air Canada", "STARLUX Airlines"], nonstop: "American Airlines and Japan Airlines, about 13h 50m" },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Tokyo-TYO", monthly: [1031, 1078, 1519, 1458, 1618, 1744, 1536, 1404, 1396, 1579, 1494, 1885], cheapestMonth: "January · $1,031", priciestMonth: "December · $1,885", typical: "$1,512", cheapestDay: "Monday", cheapestAirlines: ["Air Canada", "ANA", "Alaska Airlines"], nonstop: "Delta, about 14h 29m" },
    ],
    faqs: [
      {
        q: "Is cherry-blossom season an expensive time to fly to Tokyo?",
        a: "Yes. March medians were 14–44% above the January–February average on every route we checked (our calculation from KAYAK's monthly medians).",
      },
      {
        q: "Is late summer a cheap time to fly to Tokyo?",
        a: "From Los Angeles and San Francisco, yes: August and September were about as cheap as winter ($738–$741 from Los Angeles). From the other cities, September–October cost more than January–February.",
      },
      {
        q: "How much more do flights to Tokyo cost in December?",
        a: "December's median was 60% above the cheapest month from New York ($1,728 vs $1,083) and 90% above it from Dallas ($2,085 vs $1,098).",
      },
      {
        q: "Which US city has the cheapest flights to Tokyo?",
        a: "Los Angeles (typical $951), followed by Seattle ($1,027) and San Francisco ($1,045). Flying from the East Coast or Texas typically cost $300–$640 more.",
      },
    ],
  },
  lagos: {
    checked: "2026-11-26",
    summary:
      "February is the cheapest month to fly from the US to Lagos from most cities. On 5 of the 8 US routes we checked, February was cheapest, with median round-trip fares from $1,088 (Washington) to $1,241 (Dallas); New York was cheapest in October ($1,076), Chicago in April ($1,031) and Atlanta in September ($1,571). December is the most expensive month on every route, at 43–119% above the cheapest month.",
    keyFacts: [
      "Cheapest month: February on 5 of 8 routes",
      "Priciest month: December on all 8 routes ($1,810–$2,665 median round trip)",
      "Lowest monthly medians: $1,031 from Chicago in April and $1,076 from New York in October",
      "Atlanta was the most expensive gateway in this data (typical $1,889), despite its nonstop",
      "Nonstop: New York (Delta, about 10h 04m), Atlanta (Delta) and Washington (United) in KAYAK's data",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Lagos-LOS", monthly: [1279, 1100, 1157, 1132, 1296, 1307, 1318, 1296, 1133, 1076, 1141, 1912], cheapestMonth: "October · $1,076", priciestMonth: "December · $1,912", typical: "$1,353", cheapestDay: "Friday", cheapestAirlines: ["Kenya Airways", "Ethiopian Air", "Turkish Airlines"], nonstop: "Delta, about 10h 04m" },
      { from: "Washington, DC", kayak: "Washington-WAS/Lagos-LOS", monthly: [1205, 1088, 1241, 1180, 1351, 1586, 1421, 1361, 1166, 1275, 1172, 1810], cheapestMonth: "February · $1,088", priciestMonth: "December · $1,810", typical: "$1,375", cheapestDay: "Wednesday", cheapestAirlines: ["Egyptair", "Ethiopian Air", "Turkish Airlines"], nonstop: "Yes (not daily)" },
      { from: "Houston", kayak: "Houston-HOU/Lagos-LOS", monthly: [1507, 1218, 1430, 1498, 1444, 1690, 1540, 1691, 1493, 1525, 1528, 2665], cheapestMonth: "February · $1,218", priciestMonth: "December · $2,665", typical: "$1,524", cheapestDay: "Sunday", cheapestAirlines: ["Delta", "Virgin Atlantic", "KLM"], nonstop: null },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Lagos-LOS", monthly: [1908, 1714, 1677, 1608, 2177, 1906, 1756, 1789, 1571, 1703, 1858, 2242], cheapestMonth: "September · $1,571", priciestMonth: "December · $2,242", typical: "$1,889", cheapestDay: "Monday", cheapestAirlines: ["Qatar Airways", "Ethiopian Air", "Turkish Airlines"], nonstop: "Yes (about 1 a day)" },
      { from: "Dallas (DFW)", kayak: "Dallas-DFW/Lagos-LOS", monthly: [1351, 1241, 1354, 1277, 1646, 1685, 1721, 1521, 1458, 1488, 1721, 2090], cheapestMonth: "February · $1,241", priciestMonth: "December · $2,090", typical: "$1,641", cheapestDay: "Sunday", cheapestAirlines: ["Delta", "Turkish Airlines", "Qatar Airways"], nonstop: null },
      { from: "Chicago", kayak: "Chicago-CHI/Lagos-LOS", monthly: [1250, 1135, 1110, 1031, 1417, 1582, 1339, 1345, 1402, 1266, 1120, 1842], cheapestMonth: "April · $1,031", priciestMonth: "December · $1,842", typical: "$1,404", cheapestDay: "Sunday", cheapestAirlines: ["United Airlines", "Air Canada", "Delta"], nonstop: null },
      { from: "Boston (BOS)", kayak: "Boston-BOS/Lagos-LOS", monthly: [1358, 1153, 1302, 1353, 1556, 1611, 1597, 1821, 1363, 1289, 1481, 1938], cheapestMonth: "February · $1,153", priciestMonth: "December · $1,938", typical: "$1,523", cheapestDay: "Thursday", cheapestAirlines: ["Delta", "United Airlines", "Emirates"], nonstop: null },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Lagos-LOS", monthly: [1290, 1198, 1315, 1373, 1642, 1635, 1570, 1519, 1514, 1288, 1347, 2072], cheapestMonth: "February · $1,198", priciestMonth: "December · $2,072", typical: "$1,624", cheapestDay: "Sunday", cheapestAirlines: ["Royal Air Maroc", "Qatar Airways", "Kenya Airways"], nonstop: null },
    ],
    faqs: [
      {
        q: "How much more do Christmas flights to Lagos cost?",
        a: "December's median round-trip fare was 78% above the cheapest month from New York ($1,912 vs $1,076) and 119% above it from Houston ($2,665 vs $1,218). If you must travel in December, compare one-stop routes through Europe, the Gulf and Africa as well as nonstops.",
      },
      {
        q: "Are summer flights to Lagos expensive?",
        a: "Moderately. June's median was 21–53% above each route's cheapest month, well below December.",
      },
      {
        q: "Which US city has the cheapest flights to Lagos?",
        a: "New York (typical $1,353), Washington ($1,375) and Chicago ($1,404). Atlanta was the most expensive at $1,889 typical.",
      },
    ],
  },
  cancun: {
    checked: "2026-11-26",
    summary:
      "January to April is the cheapest time to fly from the US to Cancun from most cities. On 6 of the 8 US routes we checked, the cheapest month fell between January and April, with median round-trip fares from $329 (Dallas, February) to $429 (Houston, March). October or November, near the end of hurricane season, was the most expensive month on 5 of the 8 routes. Every city we checked has nonstop flights.",
    keyFacts: [
      "Cheapest month: January–April on 6 of 8 routes (May from New York, July from Denver)",
      "Priciest month: October or November on 5 of 8 routes",
      "Lowest monthly medians: $329 from Dallas and $332 from Atlanta, both in February",
      "Typical round trip: $428 (Miami) to $560 (Los Angeles)",
      "Nonstop from all 8 cities in KAYAK's data (Atlanta about 2h 48m, Los Angeles about 4h 44m)",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Cancun-CUN", monthly: [462, 524, 513, 518, 451, 507, 531, 595, 491, 593, 585, 593], cheapestMonth: "May · $451", priciestMonth: "August · $595", typical: "$528", cheapestDay: "Monday", cheapestAirlines: ["American Airlines", "Aeromexico", "JetBlue"], nonstop: "Yes (about 10 a day)" },
      { from: "Miami (MIA)", kayak: "Miami-MIA/Cancun-CUN", monthly: [389, 377, 383, 342, 393, 422, 445, 466, 468, 495, 533, 492], cheapestMonth: "April · $342", priciestMonth: "November · $533", typical: "$428", cheapestDay: "Tuesday", cheapestAirlines: ["Delta", "Frontier", "Aeromexico"], nonstop: "Yes (about 4 a day)" },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Cancun-CUN", monthly: [395, 332, 346, 481, 442, 505, 489, 502, 557, 591, 585, 460], cheapestMonth: "February · $332", priciestMonth: "October · $591", typical: "$475", cheapestDay: "Sunday", cheapestAirlines: ["Frontier", "Volaris", "American Airlines"], nonstop: "Delta, Frontier and Southwest, about 2h 48m" },
      { from: "Dallas (DFW)", kayak: "Dallas-DFW/Cancun-CUN", monthly: [366, 329, 414, 337, 418, 450, 447, 523, 671, 642, 697, 559], cheapestMonth: "February · $329", priciestMonth: "November · $697", typical: "$453", cheapestDay: "Friday", cheapestAirlines: ["Frontier", "Volaris", "Viva"], nonstop: "Yes (about 8 a day)" },
      { from: "Houston", kayak: "Houston-HOU/Cancun-CUN", monthly: [597, 581, 429, 429, 453, 516, 444, 459, 545, 574, 559, 549], cheapestMonth: "March · $429", priciestMonth: "January · $597", typical: "$513", cheapestDay: "Monday", cheapestAirlines: ["Southwest", "American Airlines", "Delta"], nonstop: "Yes (about 3 a day)" },
      { from: "Chicago", kayak: "Chicago-CHI/Cancun-CUN", monthly: [374, 421, 554, 471, 452, 493, 473, 546, 545, 587, 587, 600], cheapestMonth: "January · $374", priciestMonth: "December · $600", typical: "$504", cheapestDay: "Monday", cheapestAirlines: ["Frontier", "Volaris", "Viva"], nonstop: "United Airlines, American Airlines and others, about 4h 01m" },
      { from: "Denver (DEN)", kayak: "Denver-DEN/Cancun-CUN", monthly: [575, 436, 535, 447, 502, 452, 392, 413, 531, 623, 669, 629], cheapestMonth: "July · $392", priciestMonth: "November · $669", typical: "$513", cheapestDay: "Tuesday", cheapestAirlines: ["Air Canada", "Frontier", "Southwest"], nonstop: "Yes (about 4 a day)" },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Cancun-CUN", monthly: [478, 407, 499, 541, 537, 582, 570, 556, 556, 617, 686, 624], cheapestMonth: "February · $407", priciestMonth: "November · $686", typical: "$560", cheapestDay: "Tuesday", cheapestAirlines: ["Volaris", "Viva", "Frontier"], nonstop: "United Airlines, Delta and American Airlines, about 4h 44m" },
    ],
    faqs: [
      {
        q: "Is September or October a cheap time to fly to Cancun?",
        a: "Not for flights. September–October cost more than January–February on 7 of the 8 routes we checked; Houston was the only exception (our calculation from KAYAK's monthly medians).",
      },
      {
        q: "Are summer flights to Cancun expensive?",
        a: "Not unusually. June–July averages were within about 6% of each route's typical fare, and from Denver they were 18% below it (July was Denver's cheapest month).",
      },
      {
        q: "Which US city has the cheapest flights to Cancun?",
        a: "Miami had the lowest typical fare ($428). Dallas ($329) and Atlanta ($332) had the lowest single-month medians, both in February.",
      },
    ],
  },
};
