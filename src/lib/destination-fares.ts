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
      "February to April is the cheapest time to fly from the US to Mumbai. On all 7 US routes we checked, the cheapest month fell in that window, with median round-trip fares from $707 (Atlanta, April) to $869 (Dallas, April). December is the most expensive month on every route, costing 76–95% more than the cheapest month. Only the New York area has nonstop flights in this data.",
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
  manila: {
    checked: "2026-11-27",
    summary:
      "March–April or September is the cheapest time to fly from the US to Manila. On all 7 US routes we checked, the cheapest month fell in one of those windows, with median round-trip fares from $790 (Los Angeles, September) to $916 (New York, September). December is the most expensive month on every route, costing 69–86% more than the cheapest month, and June is the second most expensive.",
    keyFacts: [
      "Cheapest months: March–April or September on all 7 routes",
      "Priciest month: December on all 7 routes ($1,345–$1,668 median round trip)",
      "Lowest monthly median: $790, Los Angeles in September",
      "West Coast is cheaper: 12-month averages of $947–$970 from Los Angeles, Seattle and San Francisco vs $1,111–$1,122 from New York and Chicago (our calculation)",
      "Nonstop: Philippine Airlines from Los Angeles, San Francisco, Seattle, New York and Chicago; United from San Francisco",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Manila-MNL", monthly: [975, 970, 1087, 969, 1222, 1376, 1275, 1062, 916, 946, 956, 1575], cheapestMonth: "September · $916", priciestMonth: "December · $1,575", typical: "$927–$1,398", cheapestDay: "Tuesday", cheapestAirlines: ["Korean Air", "Singapore Airlines", "ANA"], nonstop: "Philippine Airlines, about 16h 50m" },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Manila-MNL", monthly: [853, 803, 883, 829, 973, 1234, 1121, 835, 790, 812, 809, 1425], cheapestMonth: "September · $790", priciestMonth: "December · $1,425", typical: "$770–$1,235", cheapestDay: "Tuesday", cheapestAirlines: ["Philippine Airlines", "Singapore Airlines", "China Eastern"], nonstop: "Philippine Airlines" },
      { from: "San Francisco (SFO)", kayak: "San-Francisco-SFO/Manila-MNL", monthly: [860, 865, 841, 811, 957, 1307, 1110, 850, 885, 874, 908, 1373], cheapestMonth: "April · $811", priciestMonth: "December · $1,373", typical: "$795–$1,207", cheapestDay: "Wednesday", cheapestAirlines: ["ANA", "Korean Air", "United Airlines"], nonstop: "United Airlines and Philippine Airlines, about 15h 01m" },
      { from: "Seattle (SEA)", kayak: "Seattle-SEA/Manila-MNL", monthly: [869, 832, 832, 797, 1023, 1278, 1078, 888, 823, 857, 960, 1345], cheapestMonth: "April · $797", priciestMonth: "December · $1,345", typical: null, cheapestDay: "Sunday", cheapestAirlines: ["Philippine Airlines", "Cathay Pacific", "Singapore Airlines"], nonstop: "Philippine Airlines (not daily)" },
      { from: "Chicago", kayak: "Chicago-CHI/Manila-MNL", monthly: [1023, 904, 986, 905, 1273, 1436, 1336, 1016, 897, 996, 1024, 1668], cheapestMonth: "September · $897", priciestMonth: "December · $1,668", typical: "$917–$1,393", cheapestDay: "Tuesday", cheapestAirlines: ["United Airlines", "ANA", "Cathay Pacific"], nonstop: "Philippine Airlines, about 16h 40m" },
      { from: "Dallas (DFW)", kayak: "Dallas-DFW/Manila-MNL", monthly: [924, 842, 806, 890, 1196, 1424, 1144, 814, 893, 927, 869, 1482], cheapestMonth: "March · $806", priciestMonth: "December · $1,482", typical: "$837–$1,304", cheapestDay: "Thursday", cheapestAirlines: ["ANA", "Korean Air", "Asiana Airlines"], nonstop: null },
      { from: "Las Vegas (LAS)", kayak: "Las-Vegas-LAS/Manila-MNL", monthly: [944, 878, 907, 866, 1078, 1304, 1185, 937, 919, 888, 920, 1474], cheapestMonth: "April · $866", priciestMonth: "December · $1,474", typical: "$870–$1,193", cheapestDay: "Tuesday", cheapestAirlines: ["Air Canada", "Korean Air", "ANA"], nonstop: null },
    ],
    faqs: [
      {
        q: "How much more do Christmas flights to Manila cost?",
        a: "December's median round-trip fare was 69–86% above each route's cheapest month in KAYAK's data: $1,425 vs $790 from Los Angeles, and $1,668 vs $897 from Chicago. If you must fly in December, book early and compare one-stop fares via Seoul, Tokyo or Taipei with the nonstops.",
      },
      {
        q: "Is summer a cheap time to fly to Manila?",
        a: "No. June was the second most expensive month on all 7 routes we checked. August to November was much cheaper, with September the cheapest month from New York, Los Angeles and Chicago.",
      },
      {
        q: "Which US city has the cheapest flights to Manila?",
        a: "Los Angeles: its 12-month average median was $947 and its September median $790, the lowest in our data. Seattle ($965) and San Francisco ($970) were close behind.",
      },
    ],
  },
  "ho-chi-minh-city": {
    checked: "2026-11-27",
    summary:
      "March and April are the cheapest months to fly from the US to Ho Chi Minh City. On 6 of the 8 US routes we checked, the cheapest month was March or April, with median round-trip fares from $741 (Seattle, April) to $1,104 (Washington, April). June or December was the most expensive month on 7 of the 8 routes. West Coast cities were the cheapest gateways, and only San Francisco has a nonstop.",
    keyFacts: [
      "Cheapest months: March or April on 6 of 8 routes (Chicago September, New York November)",
      "Priciest month: June or December on 7 of 8 routes",
      "Lowest monthly medians: $741 from Seattle (April) and $742 from Los Angeles (March)",
      "12-month averages: $889 from Los Angeles vs $1,372 from Atlanta (our calculation)",
      "Nonstop: Vietnam Airlines from San Francisco only; other cities connect in Asia",
    ],
    rows: [
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Ho-Chi-Minh-City-SGN", monthly: [808, 798, 742, 748, 949, 1193, 1071, 750, 776, 796, 796, 1242], cheapestMonth: "March · $742", priciestMonth: "December · $1,242", typical: "$727–$1,067", cheapestDay: "Monday", cheapestAirlines: ["Philippine Airlines", "China Eastern", "Air Premia"], nonstop: null },
      { from: "San Francisco (SFO)", kayak: "San-Francisco-SFO/Ho-Chi-Minh-City-SGN", monthly: [829, 863, 758, 778, 1059, 1254, 1185, 903, 805, 875, 902, 1263], cheapestMonth: "March · $758", priciestMonth: "December · $1,263", typical: null, cheapestDay: "Tuesday", cheapestAirlines: ["Singapore Airlines", "China Eastern", "Cathay Pacific"], nonstop: "Vietnam Airlines (not daily)" },
      { from: "Seattle (SEA)", kayak: "Seattle-SEA/Ho-Chi-Minh-City-SGN", monthly: [886, 860, 781, 741, 850, 1333, 1189, 821, 775, 811, 840, 1217], cheapestMonth: "April · $741", priciestMonth: "June · $1,333", typical: "$762–$1,132", cheapestDay: "Monday", cheapestAirlines: ["Singapore Airlines", "Philippine Airlines", "Cathay Pacific"], nonstop: null },
      { from: "New York (all airports)", kayak: "New-York-NYC/Ho-Chi-Minh-City-SGN", monthly: [937, 955, 939, 898, 1331, 1449, 1238, 1015, 920, 968, 894, 1506], cheapestMonth: "November · $894", priciestMonth: "December · $1,506", typical: "$871–$1,327", cheapestDay: "Tuesday", cheapestAirlines: ["Air Premia", "Air India", "Korean Air"], nonstop: null },
      { from: "Dallas (DFW)", kayak: "Dallas-DFW/Ho-Chi-Minh-City-SGN", monthly: [1048, 1002, 866, 797, 1297, 1484, 1368, 968, 922, 926, 992, 1329], cheapestMonth: "April · $797", priciestMonth: "June · $1,484", typical: "$901–$1,358", cheapestDay: "Sunday", cheapestAirlines: ["Delta", "ANA", "Korean Air"], nonstop: null },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Ho-Chi-Minh-City-SGN", monthly: [1229, 1243, 1273, 1087, 1457, 1775, 1697, 1219, 1152, 1153, 1351, 1831], cheapestMonth: "April · $1,087", priciestMonth: "December · $1,831", typical: null, cheapestDay: "Tuesday", cheapestAirlines: ["Alaska Airlines", "Qatar Airways", "Starlux"], nonstop: null },
      { from: "Chicago", kayak: "Chicago-CHI/Ho-Chi-Minh-City-SGN", monthly: [1054, 1070, 1035, 943, 1181, 1463, 1295, 979, 925, 953, 971, 1408], cheapestMonth: "September · $925", priciestMonth: "June · $1,463", typical: "$947–$1,301", cheapestDay: "Thursday", cheapestAirlines: ["ANA", "United Airlines", "Cathay Pacific"], nonstop: null },
      { from: "Washington, DC", kayak: "Washington-WAS/Ho-Chi-Minh-City-SGN", monthly: [1207, 1225, 1156, 1104, 1441, 1431, 1360, 1164, 1157, 1126, 1126, 1386], cheapestMonth: "April · $1,104", priciestMonth: "May · $1,441", typical: "$1,090–$1,436", cheapestDay: "Tuesday", cheapestAirlines: ["Korean Air", "Qatar Airways", "Cathay Pacific"], nonstop: null },
    ],
    faqs: [
      {
        q: "Are flights to Vietnam expensive around Tet?",
        a: "In KAYAK's monthly data, February medians were within about 16% of March on every route, but a monthly median hides the peak week. Fares for the days just before Tet (February 6, 2027) usually sell out early, so book those dates as soon as you can.",
      },
      {
        q: "Is summer a cheap time to fly to Ho Chi Minh City?",
        a: "No. June was the most expensive or second most expensive month on all 8 routes, up to 86% above the cheapest month (Dallas: $1,484 in June vs $797 in April).",
      },
      {
        q: "Which US city has the cheapest flights to Ho Chi Minh City?",
        a: "Los Angeles had the lowest 12-month average median ($889), followed by Seattle ($925) and San Francisco ($956). Atlanta ($1,372) and Washington ($1,240) were the most expensive.",
      },
    ],
  },
  accra: {
    checked: "2026-11-27",
    summary:
      "February is the cheapest month to fly from the US to Accra. On 6 of the 7 US routes we checked, February was cheapest, with median round-trip fares from $993 (Dallas) to $1,303 (Atlanta); Chicago was cheapest in January ($1,098). December is the most expensive month on 5 of the 7 routes, at 45–100% above the cheapest month, and July on the other 2.",
    keyFacts: [
      "Cheapest month: February on 6 of 7 routes",
      "Priciest month: December on 5 of 7 routes ($1,685–$2,103 median round trip); July from Chicago and Los Angeles",
      "Lowest monthly median: $993, Dallas in February",
      "New York had the lowest 12-month average ($1,381); Atlanta the highest ($1,596) (our calculation)",
      "Nonstop: Delta from New York JFK and United from Washington Dulles",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Accra-ACC", monthly: [1250, 1165, 1321, 1278, 1427, 1551, 1619, 1429, 1295, 1218, 1331, 1685], cheapestMonth: "February · $1,165", priciestMonth: "December · $1,685", typical: "$1,182–$1,762", cheapestDay: "Tuesday", cheapestAirlines: ["Kenya Airways", "Royal Air Maroc", "Ethiopian Air"], nonstop: "Delta, about 11h" },
      { from: "Washington, DC", kayak: "Washington-WAS/Accra-ACC", monthly: [1316, 1161, 1210, 1189, 1432, 1738, 1712, 1486, 1404, 1603, 1352, 1776], cheapestMonth: "February · $1,161", priciestMonth: "December · $1,776", typical: "$1,204–$1,794", cheapestDay: "Wednesday", cheapestAirlines: ["Royal Air Maroc", "Turkish Airlines", "Egyptair"], nonstop: "United (Dulles)" },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Accra-ACC", monthly: [1310, 1303, 1560, 1489, 1683, 1857, 1624, 1401, 1499, 1762, 1561, 2103], cheapestMonth: "February · $1,303", priciestMonth: "December · $2,103", typical: null, cheapestDay: "Monday", cheapestAirlines: ["Ethiopian Air", "Qatar Airways", "Turkish Airlines"], nonstop: "Delta, seasonal" },
      { from: "Chicago", kayak: "Chicago-CHI/Accra-ACC", monthly: [1098, 1295, 1273, 1315, 1572, 1664, 1798, 1611, 1384, 1524, 1677, 1720], cheapestMonth: "January · $1,098", priciestMonth: "July · $1,798", typical: "$1,299–$1,781", cheapestDay: "Wednesday", cheapestAirlines: ["Ethiopian Air", "Turkish Airlines", "British Airways"], nonstop: null },
      { from: "Dallas (DFW)", kayak: "Dallas-DFW/Accra-ACC", monthly: [1423, 993, 1378, 1428, 1528, 1768, 1953, 1633, 1484, 1637, 1463, 1988], cheapestMonth: "February · $993", priciestMonth: "December · $1,988", typical: "$1,349–$1,830", cheapestDay: "Friday", cheapestAirlines: ["Qatar Airways", "Turkish Airlines", "United Airlines"], nonstop: null },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Accra-ACC", monthly: [1280, 1165, 1219, 1297, 1359, 1828, 2178, 1615, 1412, 1374, 1181, 1636], cheapestMonth: "February · $1,165", priciestMonth: "July · $2,178", typical: null, cheapestDay: "Saturday", cheapestAirlines: ["ITA Airways", "Royal Air Maroc", "Turkish Airlines"], nonstop: null },
      { from: "Boston (BOS)", kayak: "Boston-BOS/Accra-ACC", monthly: [1395, 1107, 1351, 1485, 1546, 1764, 1690, 1561, 1471, 1595, 1571, 1878], cheapestMonth: "February · $1,107", priciestMonth: "December · $1,878", typical: "$1,355–$1,805", cheapestDay: "Tuesday", cheapestAirlines: ["TAP Air Portugal", "Kenya Airways", "United Airlines"], nonstop: null },
    ],
    faqs: [
      {
        q: "How much more do December flights to Accra cost?",
        a: "December's median was 45% above February from New York ($1,685 vs $1,165) and 100% above it from Dallas ($1,988 vs $993) in KAYAK's data. For Christmas and 'Detty December' trips, book early and compare one-stop routes through Casablanca, Addis Ababa, Istanbul and Europe.",
      },
      {
        q: "Are summer flights to Accra expensive?",
        a: "Yes. July was the most expensive month from Chicago and Los Angeles, and June–July were well above the cheapest month on every route we checked.",
      },
      {
        q: "Which US city has the cheapest flights to Accra?",
        a: "New York (12-month average $1,381) and Washington ($1,448), the two cities with nonstops. Dallas had the lowest single-month median, $993 in February.",
      },
    ],
  },
  "punta-cana": {
    checked: "2026-11-27",
    summary:
      "January and February are the cheapest months to fly from the US to Punta Cana from most cities. On 5 of the 8 US routes we checked, the cheapest month was January or February, with median round-trip fares from $299 (Miami, February) to $498 (Atlanta, January). Hurricane season is not cheaper for flights: the most expensive month fell between June and November on 7 of the 8 routes.",
    keyFacts: [
      "Cheapest month: January or February on 5 of 8 routes",
      "Priciest month: between June and November on 7 of 8 routes (Boston: December)",
      "Lowest monthly median: $299, Miami in February",
      "Miami had the lowest 12-month average ($373); Charlotte the highest ($786) despite its nonstop (our calculation)",
      "Nonstop from all 8 cities we checked (New York about 4h 05m, Charlotte about 3h 31m)",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Punta-Cana-PUJ", monthly: [459, 492, 497, 556, 459, 554, 618, 639, 523, 540, 565, 596], cheapestMonth: "January · $459", priciestMonth: "August · $639", typical: "$417–$709", cheapestDay: "Tuesday", cheapestAirlines: ["JetBlue", "American Airlines", "United Airlines"], nonstop: "JetBlue, United Airlines and others, about 4h 05m" },
      { from: "Boston (BOS)", kayak: "Boston-BOS/Punta-Cana-PUJ", monthly: [516, 589, 565, 659, 481, 614, 597, 606, 578, 638, 618, 685], cheapestMonth: "May · $481", priciestMonth: "December · $685", typical: "$480–$761", cheapestDay: "Monday", cheapestAirlines: ["American Airlines", "United Airlines", "JetBlue"], nonstop: "JetBlue, Delta and American Airlines, about 4h 13m" },
      { from: "Miami (MIA)", kayak: "Miami-MIA/Punta-Cana-PUJ", monthly: [327, 299, 314, 318, 342, 451, 442, 382, 462, 356, 343, 438], cheapestMonth: "February · $299", priciestMonth: "September · $462", typical: "$306–$496", cheapestDay: "Tuesday", cheapestAirlines: ["Frontier", "Arajet", "LATAM Airlines"], nonstop: "American and Arajet" },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Punta-Cana-PUJ", monthly: [498, 512, 535, 604, 570, 585, 544, 517, 590, 714, 686, 650], cheapestMonth: "January · $498", priciestMonth: "October · $714", typical: "$459–$730", cheapestDay: "Monday", cheapestAirlines: ["Frontier", "Air Canada", "JetBlue"], nonstop: "Delta and Frontier" },
      { from: "Chicago", kayak: "Chicago-CHI/Punta-Cana-PUJ", monthly: [441, 467, 617, 548, 544, 661, 599, 522, 434, 534, 619, 597], cheapestMonth: "September · $434", priciestMonth: "June · $661", typical: "$417–$752", cheapestDay: "Monday", cheapestAirlines: ["JetBlue", "American Airlines", "United Airlines"], nonstop: "American, United and others" },
      { from: "Philadelphia (PHL)", kayak: "Philadelphia-PHL/Punta-Cana-PUJ", monthly: [559, 490, 606, 582, 577, 619, 603, 549, 561, 611, 698, 606], cheapestMonth: "February · $490", priciestMonth: "November · $698", typical: "$484–$741", cheapestDay: "Tuesday", cheapestAirlines: ["Air Canada", "Frontier", "American Airlines"], nonstop: "American and Frontier" },
      { from: "Dallas (DFW)", kayak: "Dallas-DFW/Punta-Cana-PUJ", monthly: [741, 452, 728, 707, 675, 681, 656, 629, 545, 814, 1079, 786], cheapestMonth: "February · $452", priciestMonth: "November · $1,079", typical: null, cheapestDay: "Saturday", cheapestAirlines: ["Frontier", "Air Canada", "Avianca"], nonstop: "American" },
      { from: "Charlotte (CLT)", kayak: "Charlotte-CLT/Punta-Cana-PUJ", monthly: [739, 738, 740, 734, 779, 754, 748, 855, 845, 839, 852, 808], cheapestMonth: "April · $734", priciestMonth: "August · $855", typical: "$637–$959", cheapestDay: "Monday", cheapestAirlines: ["Air Canada", "Frontier", "JetBlue"], nonstop: "American Airlines, about 3h 31m" },
    ],
    faqs: [
      {
        q: "Is hurricane season a cheap time to fly to Punta Cana?",
        a: "Not for flights. In KAYAK's data the most expensive month fell between June and November on 7 of the 8 routes we checked, while January–February was cheapest on 5. Resort rates may drop in the low season, but airfares usually don't.",
      },
      {
        q: "What's the cheapest month to fly to Punta Cana from New York?",
        a: "January and May, both $459 median round trip in KAYAK's data. August was the most expensive at $639.",
      },
      {
        q: "Which US city has the cheapest flights to Punta Cana?",
        a: "Miami, with a 12-month average median of $373 and $299 in February. Dallas had the widest swing: $452 in February vs $1,079 in November.",
      },
    ],
  },
  "san-jose-costa-rica": {
    checked: "2026-11-27",
    summary:
      "January and February are the cheapest months to fly from the US to Costa Rica's San José airport. On 6 of the 7 US routes we checked, the cheapest month was January or February, with median round-trip fares from $264 (Miami, February) to $494 (Chicago, February); New York was cheapest in May ($461). The most expensive month was in July–October on 4 routes and December on 3.",
    keyFacts: [
      "Cheapest month: January or February on 6 of 7 routes",
      "Priciest month: July–October on 4 routes, December on 3",
      "Lowest monthly median: $264, Miami in February",
      "Miami had the lowest 12-month average ($389); Dallas the highest ($649) (our calculation)",
      "Nonstop from all 7 cities we checked (Miami about 3h 05m, Los Angeles about 5h 44m); some are seasonal",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/San-Jose-SJO", monthly: [466, 508, 519, 499, 461, 585, 656, 676, 581, 548, 510, 668], cheapestMonth: "May · $461", priciestMonth: "August · $676", typical: "$419–$762", cheapestDay: "Tuesday", cheapestAirlines: ["Avianca", "Copa Airlines", "American Airlines"], nonstop: "United Airlines and JetBlue, about 5h 28m" },
      { from: "Miami (MIA)", kayak: "Miami-MIA/San-Jose-SJO", monthly: [318, 264, 350, 315, 338, 375, 462, 390, 435, 420, 483, 515], cheapestMonth: "February · $264", priciestMonth: "December · $515", typical: "$299–$505", cheapestDay: "Friday", cheapestAirlines: ["Avianca", "GOL", "Delta"], nonstop: "American Airlines and Avianca, about 3h 05m" },
      { from: "Houston", kayak: "Houston-HOU/San-Jose-SJO", monthly: [492, 585, 623, 575, 575, 655, 832, 566, 575, 615, 753, 643], cheapestMonth: "January · $492", priciestMonth: "July · $832", typical: "$539–$733", cheapestDay: "Sunday", cheapestAirlines: ["American Airlines", "Southwest", "GOL"], nonstop: "United and Southwest" },
      { from: "Dallas (DFW)", kayak: "Dallas-DFW/San-Jose-SJO", monthly: [435, 439, 577, 449, 599, 684, 689, 744, 665, 869, 791, 850], cheapestMonth: "January · $435", priciestMonth: "October · $869", typical: "$414–$873", cheapestDay: "Wednesday", cheapestAirlines: ["Avianca", "Frontier", "Air Canada"], nonstop: "American Airlines and Frontier, about 4h 10m" },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/San-Jose-SJO", monthly: [484, 436, 549, 505, 484, 607, 627, 608, 621, 672, 639, 778], cheapestMonth: "February · $436", priciestMonth: "December · $778", typical: null, cheapestDay: "Tuesday", cheapestAirlines: ["Southwest", "Avianca", "JetBlue"], nonstop: "Alaska Airlines, United Airlines and Delta, about 5h 44m" },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/San-Jose-SJO", monthly: [375, 442, 439, 530, 575, 617, 675, 634, 648, 564, 620, 647], cheapestMonth: "January · $375", priciestMonth: "July · $675", typical: null, cheapestDay: "Thursday", cheapestAirlines: ["Frontier", "JetBlue", "Southwest"], nonstop: "Delta" },
      { from: "Chicago", kayak: "Chicago-CHI/San-Jose-SJO", monthly: [498, 494, 650, 528, 538, 610, 627, 591, 550, 512, 562, 719], cheapestMonth: "February · $494", priciestMonth: "December · $719", typical: "$472–$755", cheapestDay: "Thursday", cheapestAirlines: ["Avianca", "Delta", "American Airlines"], nonstop: "Seasonal" },
    ],
    faqs: [
      {
        q: "Is the green season cheaper for flights to Costa Rica?",
        a: "Not usually. In KAYAK's data the cheapest months were January–February, in the dry season, on 6 of the 7 routes. July to October was the most expensive period on 4 routes.",
      },
      {
        q: "Is it cheaper to fly into San José or Liberia?",
        a: "It depends on your city and dates, so compare both. Choose by where you're staying: the drive between SJO and Liberia (LIR) can take over 5 hours.",
      },
      {
        q: "Which US city has the cheapest flights to San José, Costa Rica?",
        a: "Miami, with a 12-month average median of $389 and $264 in February. Atlanta had the next-lowest single month, $375 in January.",
      },
    ],
  },
  rome: {
    checked: "2026-11-27",
    summary:
      "January and February are the cheapest months to fly from the US to Rome. On all 8 US routes we checked, the cheapest month was January or February, with median round-trip fares from $539 (New York, February) to $842 (Atlanta, February). June is the most expensive month on 6 of the 8 routes, costing 85–168% more than the cheapest month.",
    keyFacts: [
      "Cheapest month: January or February on all 8 routes",
      "Priciest month: June on 6 of 8 routes (New York: December; Chicago: September)",
      "Lowest monthly median: $539, New York in February",
      "New York had the lowest 12-month average ($737); Philadelphia the highest ($1,160) (our calculation)",
      "Nonstop: ITA Airways, Delta and United from New York (about 8h 22m); ITA from Miami and Los Angeles",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Rome-ROM", monthly: [543, 539, 669, 647, 764, 967, 862, 723, 757, 713, 656, 1007], cheapestMonth: "February · $539", priciestMonth: "December · $1,007", typical: "$601–$999", cheapestDay: "Monday", cheapestAirlines: ["Iberia", "Icelandair", "TAP Air Portugal"], nonstop: "ITA Airways, Delta and United Airlines, about 8h 22m" },
      { from: "Boston (BOS)", kayak: "Boston-BOS/Rome-ROM", monthly: [608, 604, 643, 726, 852, 1130, 885, 759, 770, 766, 709, 845], cheapestMonth: "February · $604", priciestMonth: "June · $1,130", typical: "$643–$1,016", cheapestDay: "Monday", cheapestAirlines: ["TAP Air Portugal", "Scandinavian Airlines", "Icelandair"], nonstop: "ITA Airways and Delta" },
      { from: "Chicago", kayak: "Chicago-CHI/Rome-ROM", monthly: [596, 635, 787, 791, 953, 981, 917, 771, 1021, 915, 770, 890], cheapestMonth: "January · $596", priciestMonth: "September · $1,021", typical: "$726–$1,106", cheapestDay: "Sunday", cheapestAirlines: ["Iberia", "British Airways", "Aer Lingus"], nonstop: "United (plus seasonal flights)" },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Rome-ROM", monthly: [648, 637, 717, 706, 894, 1180, 1040, 783, 870, 826, 784, 1002], cheapestMonth: "February · $637", priciestMonth: "June · $1,180", typical: null, cheapestDay: "Tuesday", cheapestAirlines: ["TAP Air Portugal", "British Airways", "Royal Air Maroc"], nonstop: "ITA Airways, about 12h" },
      { from: "Miami (MIA)", kayak: "Miami-MIA/Rome-ROM", monthly: [589, 589, 699, 667, 896, 1181, 1082, 789, 868, 822, 742, 980], cheapestMonth: "January · $589", priciestMonth: "June · $1,181", typical: "$693–$1,119", cheapestDay: "Monday", cheapestAirlines: ["Air Canada", "British Airways", "Iberia"], nonstop: "ITA Airways, about 9h 54m" },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Rome-ROM", monthly: [965, 842, 949, 1145, 1514, 1563, 1203, 1052, 1180, 1022, 972, 1275], cheapestMonth: "February · $842", priciestMonth: "June · $1,563", typical: "$858–$1,562", cheapestDay: "Monday", cheapestAirlines: ["Scandinavian Airlines", "TAP Air Portugal", "Turkish Airlines"], nonstop: "Delta" },
      { from: "Dallas (DFW)", kayak: "Dallas-DFW/Rome-ROM", monthly: [676, 709, 922, 982, 1417, 1813, 1449, 972, 1190, 1129, 1045, 1258], cheapestMonth: "January · $676", priciestMonth: "June · $1,813", typical: "$847–$1,478", cheapestDay: "Monday", cheapestAirlines: ["British Airways", "Finnair", "Iberia"], nonstop: "American" },
      { from: "Philadelphia (PHL)", kayak: "Philadelphia-PHL/Rome-ROM", monthly: [796, 793, 1027, 956, 1320, 1750, 1436, 936, 1225, 1244, 949, 1490], cheapestMonth: "February · $793", priciestMonth: "June · $1,750", typical: "$911–$1,488", cheapestDay: "Tuesday", cheapestAirlines: ["American Airlines", "British Airways", "United Airlines"], nonstop: "American" },
    ],
    faqs: [
      {
        q: "How much more does summer cost for flights to Rome?",
        a: "June's median was 85–168% above the cheapest month on the 6 routes where June was priciest, for example $1,180 vs $637 from Los Angeles and $1,813 vs $676 from Dallas (KAYAK data, our calculation).",
      },
      {
        q: "Is autumn a cheap time to fly to Rome?",
        a: "Cheaper than summer, not cheapest. October medians were 21–67% above each route's cheapest month, but well below June on most routes.",
      },
      {
        q: "Which US city has the cheapest flights to Rome?",
        a: "New York (12-month average $737, $539 in February), then Boston ($775). Atlanta and Philadelphia were the most expensive gateways in this data.",
      },
    ],
  },
  istanbul: {
    checked: "2026-11-27",
    summary:
      "February is the cheapest month to fly from the US to Istanbul. On 5 of the 6 US routes we checked, February was cheapest, with median round-trip fares from $686 (New York) to $818 (San Francisco); Chicago was cheapest in March ($857). June is the most expensive month on all 6 routes, at 72–99% above the cheapest month.",
    keyFacts: [
      "Cheapest month: February on 5 of 6 routes",
      "Priciest month: June on all 6 routes ($1,292–$1,480 median round trip)",
      "Lowest monthly median: $686, New York in February",
      "New York had the lowest 12-month average ($942); San Francisco the highest ($1,105) (our calculation)",
      "Nonstop: Turkish Airlines from about 14 US airports (Washington about 9h 51m, Los Angeles about 13h 18m)",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Istanbul-IST", monthly: [754, 686, 759, 794, 1048, 1292, 1222, 1051, 890, 869, 852, 1081], cheapestMonth: "February · $686", priciestMonth: "June · $1,292", typical: null, cheapestDay: "Sunday", cheapestAirlines: ["British Airways", "Lufthansa", "Qatar Airways"], nonstop: "Turkish Airlines" },
      { from: "Chicago", kayak: "Chicago-CHI/Istanbul-IST", monthly: [939, 864, 857, 945, 1320, 1474, 1410, 1062, 1007, 1023, 1005, 1261], cheapestMonth: "March · $857", priciestMonth: "June · $1,474", typical: "$885–$1,362", cheapestDay: "Wednesday", cheapestAirlines: ["LOT", "United Airlines", "Turkish Airlines"], nonstop: "Turkish Airlines" },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Istanbul-IST", monthly: [737, 702, 758, 785, 1195, 1397, 1342, 1121, 1101, 1025, 958, 1281], cheapestMonth: "February · $702", priciestMonth: "June · $1,397", typical: "$787–$1,321", cheapestDay: "Tuesday", cheapestAirlines: ["Lufthansa", "Royal Air Maroc", "British Airways"], nonstop: "Turkish Airlines, about 13h 18m" },
      { from: "Miami (MIA)", kayak: "Miami-MIA/Istanbul-IST", monthly: [808, 760, 937, 942, 1208, 1442, 1347, 1093, 1061, 1019, 982, 1151], cheapestMonth: "February · $760", priciestMonth: "June · $1,442", typical: "$880–$1,339", cheapestDay: "Tuesday", cheapestAirlines: ["Air France", "Lufthansa", "British Airways"], nonstop: "Turkish Airlines, about 11h 26m" },
      { from: "Washington, DC", kayak: "Washington-WAS/Istanbul-IST", monthly: [785, 736, 877, 860, 1096, 1343, 1231, 1038, 954, 999, 980, 1205], cheapestMonth: "February · $736", priciestMonth: "June · $1,343", typical: "$827–$1,266", cheapestDay: "Wednesday", cheapestAirlines: ["Lufthansa", "United Airlines", "British Airways"], nonstop: "Turkish Airlines, about 9h 51m" },
      { from: "San Francisco (SFO)", kayak: "San-Francisco-SFO/Istanbul-IST", monthly: [918, 818, 943, 882, 1214, 1480, 1374, 1140, 1112, 1076, 1146, 1160], cheapestMonth: "February · $818", priciestMonth: "June · $1,480", typical: null, cheapestDay: "Wednesday", cheapestAirlines: ["Lufthansa", "United Airlines", "British Airways"], nonstop: "Turkish Airlines" },
    ],
    faqs: [
      {
        q: "How much more do summer flights to Istanbul cost?",
        a: "June was the priciest month on every route we checked, 72–99% above the cheapest month: for example $1,397 vs $702 from Los Angeles (KAYAK data, our calculation).",
      },
      {
        q: "Is autumn a good time to fly to Istanbul?",
        a: "For value, yes. September–November medians were well below June on all 6 routes, and the weather is usually mild.",
      },
      {
        q: "Which US city has the cheapest flights to Istanbul?",
        a: "New York (12-month average $942, $686 in February), then Washington ($1,009) and Los Angeles ($1,034).",
      },
    ],
  },
  "amman": {
    checked: "2026-11-28",
    summary:
      "January to March is the cheapest time to fly from the US to Amman. On all 7 US routes we checked, the cheapest month fell in that window, with median round-trip fares from $732 (Washington, January) to $921 (Detroit, February). June is the most expensive month on 5 of the 7 routes, at 63–93% above the cheapest month.",
    keyFacts: [
      "Cheapest months: January–March on all 7 routes",
      "Priciest month: June on 5 of 7 routes",
      "Lowest monthly median: $732, Washington DC in January",
      "Washington ($994) and Atlanta ($995) had the lowest 12-month averages; Detroit the highest ($1,228) (our calculation)",
      "Nonstop: Royal Jordanian from JFK, Chicago, Detroit, Washington Dulles and Dallas",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Amman-AMM", monthly: [949, 922, 912, 974, 1245, 1403, 1334, 1135, 1045, 1031, 1047, 1455], cheapestMonth: "March · $912", priciestMonth: "December · $1,455", typical: "$1,028–$1,482", cheapestDay: "Wednesday", cheapestAirlines: ["Ethiopian Air", "Etihad Airways", "SAUDIA"], nonstop: null },
      { from: "Chicago", kayak: "Chicago-CHI/Amman-AMM", monthly: [924, 883, 902, 1083, 1318, 1556, 1359, 1124, 987, 969, 1028, 1268], cheapestMonth: "February · $883", priciestMonth: "June · $1,556", typical: "$976–$1,515", cheapestDay: "Sunday", cheapestAirlines: ["Iberia", "Turkish Airlines", "Etihad Airways"], nonstop: "Royal Jordanian, about 11h 44m" },
      { from: "Detroit", kayak: "Detroit-DTT/Amman-AMM", monthly: [1048, 921, 955, 1121, 1380, 1623, 1414, 1322, 1116, 1113, 1134, 1594], cheapestMonth: "February · $921", priciestMonth: "June · $1,623", typical: "$1,016–$1,571", cheapestDay: "Thursday", cheapestAirlines: ["Turkish Airlines", "Royal Jordanian", "Lufthansa"], nonstop: "Royal Jordanian, about 11h 23m" },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Amman-AMM", monthly: [928, 913, 967, 1376, 1302, 1484, 1302, 1151, 1016, 982, 969, 1192], cheapestMonth: "February · $913", priciestMonth: "June · $1,484", typical: null, cheapestDay: "Sunday", cheapestAirlines: ["Lufthansa", "Turkish Airlines", "Royal Jordanian"], nonstop: null },
      { from: "Washington, DC", kayak: "Washington-WAS/Amman-AMM", monthly: [732, 766, 787, 910, 1173, 1315, 1211, 973, 982, 944, 907, 1231], cheapestMonth: "January · $732", priciestMonth: "June · $1,315", typical: "$882–$1,368", cheapestDay: "Monday", cheapestAirlines: ["Etihad Airways", "SAUDIA", "Ethiopian Air"], nonstop: null },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Amman-AMM", monthly: [762, 774, 789, 883, 1275, 1195, 1181, 1097, 1011, 984, 927, 1059], cheapestMonth: "January · $762", priciestMonth: "May · $1,275", typical: "$946–$1,286", cheapestDay: "Wednesday", cheapestAirlines: ["Etihad Airways", "Turkish Airlines", "Royal Jordanian"], nonstop: null },
      { from: "Dallas–Fort Worth (DFW)", kayak: "Dallas-DFW/Amman-AMM", monthly: [797, 811, 930, 994, 1392, 1539, 1396, 1129, 967, 1010, 993, 1319], cheapestMonth: "January · $797", priciestMonth: "June · $1,539", typical: "$1,040–$1,574", cheapestDay: "Saturday", cheapestAirlines: ["Turkish Airlines", "Qatar Airways", "Austrian Airlines"], nonstop: null },
    ],
    faqs: [
      {
        q: "How much more do summer flights to Amman cost?",
        a: "June was the priciest month on 5 of the 7 routes we checked, 63–93% above each route's cheapest month: for example $1,539 vs $797 from Dallas (KAYAK data, our calculation).",
      },
      {
        q: "Which US airlines fly nonstop to Amman?",
        a: "None. Royal Jordanian is the only airline with nonstop flights, from New York JFK, Chicago, Detroit, Washington Dulles and Dallas–Fort Worth (schedules checked November 2026).",
      },
      {
        q: "Do US citizens need a visa for Jordan?",
        a: "Yes, but you can get it on arrival at Queen Alia Airport for JOD 40. The Jordan Pass waives that fee if you stay 3+ days and also covers Petra; there is no visa on arrival at the Allenby/King Hussein Bridge.",
      },
    ],
  },
  "doha": {
    checked: "2026-11-28",
    summary:
      "February and March are usually the cheapest months to fly from the US to Doha. On the 4 routes with a full year of KAYAK data, the cheapest median round-trip fares were $822 (Chicago, March) to $993 (Dallas, September). December cost 75–147% more than the cheapest month on every route.",
    keyFacts: [
      "Cheapest months: February–March on 3 of 4 routes (Dallas: September)",
      "December is 75–147% above each route's cheapest month",
      "Lowest monthly median: $822, Chicago in March",
      "Chicago had the lowest 12-month average ($1,139); Dallas the highest ($1,371) (our calculation)",
      "Nonstop: Qatar Airways only, from about a dozen US cities",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Doha-DOH", monthly: [1478, 931, 1076, 1119, 1478, 1464, 1639, 1165, 1068, 943, 1273, 1630], cheapestMonth: "February · $931", priciestMonth: "July · $1,639", typical: "$1,067–$1,631", cheapestDay: "Sunday", cheapestAirlines: ["Royal Jordanian", "Gulf Air", "Etihad Airways"], nonstop: "Qatar Airways, about 12h 10m" },
      { from: "Washington, DC", kayak: "Washington-WAS/Doha-DOH", monthly: [1008, 872, 983, 1180, 1253, 1539, 1006, 1279, 1038, 979, 1134, 1529], cheapestMonth: "February · $872", priciestMonth: "June · $1,539", typical: "$948–$1,344", cheapestDay: "Friday", cheapestAirlines: ["KLM", "Royal Jordanian", "Etihad Airways"], nonstop: null },
      { from: "Dallas–Fort Worth (DFW)", kayak: "Dallas-DFW/Doha-DOH", monthly: [1114, 1112, 1190, 1034, 1697, 1533, 1533, 1376, 993, 1504, 1396, 1966], cheapestMonth: "September · $993", priciestMonth: "December · $1,966", typical: "$1,085–$1,719", cheapestDay: "Tuesday", cheapestAirlines: ["Royal Jordanian", "British Airways", "Qatar Airways"], nonstop: null },
      { from: "Chicago", kayak: "Chicago-CHI/Doha-DOH", monthly: [960, 1073, 822, 1073, 1179, 1151, 1099, 1385, 877, 1021, 1005, 2027], cheapestMonth: "March · $822", priciestMonth: "December · $2,027", typical: "$986–$1,771", cheapestDay: "Thursday", cheapestAirlines: ["Royal Jordanian", "Etihad Airways", "Turkish Airlines"], nonstop: null },
    ],
    faqs: [
      {
        q: "How much more do Christmas flights to Doha cost?",
        a: "On the routes we checked, December cost 75–147% more than the cheapest month: for example $2,027 vs $822 from Chicago (KAYAK data, our calculation). Book early for holiday travel.",
      },
      {
        q: "Is Doha a good stop on the way to India?",
        a: "Yes. Qatar Airways connects its US flights in Doha to many Indian cities, and it was among the cheapest airlines on several US–India routes in our data. Compare it with Emirates and Etihad.",
      },
      {
        q: "Are flights to Doha running normally?",
        a: "Qatar Airways is flying, but Qatar's airspace was closed for part of 2026 and some routes still use approved corridors. Check your flight a few days before departure.",
      },
    ],
  },
  "tel-aviv": {
    checked: "2026-11-28",
    summary:
      "January and February are usually the cheapest months to fly from the US to Tel Aviv. On 6 of the 8 US routes we checked, the cheapest month fell in that window, with median round-trip fares from $877 (Dallas, January) to $1,119 (New York, January). Seasonal swings are smaller than on most routes: the priciest month was 33–70% above the cheapest.",
    keyFacts: [
      "Cheapest months: January–February on 6 of 8 routes",
      "Priciest month: June on 4 of 8 routes",
      "Lowest monthly median: $877, Dallas in January",
      "Miami had the lowest 12-month average ($1,229); Atlanta the highest ($1,565) (our calculation)",
      "Nonstop (late 2026): Delta from JFK, United from Newark, El Al from several cities",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Tel-Aviv-TLV", monthly: [1119, 1129, 1248, 1268, 1454, 1463, 1482, 1492, 1431, 1437, 1251, 1319], cheapestMonth: "January · $1,119", priciestMonth: "August · $1,492", typical: "$1,103–$1,621", cheapestDay: "Monday", cheapestAirlines: ["ITA Airways", "Condor", "Air Europa"], nonstop: null },
      { from: "Miami (MIA)", kayak: "Miami-MIA/Tel-Aviv-TLV", monthly: [964, 978, 1047, 1125, 1344, 1497, 1360, 1264, 1293, 1455, 1119, 1300], cheapestMonth: "January · $964", priciestMonth: "June · $1,497", typical: "$997–$1,611", cheapestDay: "Friday", cheapestAirlines: ["ITA Airways", "Virgin Atlantic", "Air Europa"], nonstop: "EL AL, about 11h 40m" },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Tel-Aviv-TLV", monthly: [1175, 1089, 1270, 1386, 1364, 1704, 1573, 1680, 1472, 1312, 1241, 1619], cheapestMonth: "February · $1,089", priciestMonth: "June · $1,704", typical: "$1,139–$1,751", cheapestDay: "Friday", cheapestAirlines: ["Austrian Airlines", "Air Canada", "Delta"], nonstop: null },
      { from: "Chicago", kayak: "Chicago-CHI/Tel-Aviv-TLV", monthly: [1239, 1065, 1200, 1068, 1343, 1302, 1279, 1352, 1242, 1337, 1175, 1439], cheapestMonth: "February · $1,065", priciestMonth: "December · $1,439", typical: "$1,068–$1,519", cheapestDay: "Thursday", cheapestAirlines: ["Air Canada", "LOT", "Etihad Airways"], nonstop: null },
      { from: "Boston (BOS)", kayak: "Boston-BOS/Tel-Aviv-TLV", monthly: [1069, 1037, 1228, 1163, 1208, 1463, 1283, 1197, 1366, 1306, 1067, 1373], cheapestMonth: "February · $1,037", priciestMonth: "June · $1,463", typical: "$1,048–$1,493", cheapestDay: "Friday", cheapestAirlines: ["ITA Airways", "Air Canada", "TAP AIR PORTUGAL"], nonstop: null },
      { from: "Washington, DC", kayak: "Washington-WAS/Tel-Aviv-TLV", monthly: [1287, 1244, 1364, 1281, 1271, 1561, 1404, 1429, 1443, 1406, 1085, 1576], cheapestMonth: "November · $1,085", priciestMonth: "December · $1,576", typical: "$1,150–$1,665", cheapestDay: "Thursday", cheapestAirlines: ["ITA Airways", "EL AL", "Etihad Airways"], nonstop: "United Airlines, about 10h 50m" },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Tel-Aviv-TLV", monthly: [1369, 1463, 1479, 1563, 1519, 1647, 1591, 1873, 1359, 1710, 1496, 1708], cheapestMonth: "September · $1,359", priciestMonth: "August · $1,873", typical: null, cheapestDay: "Saturday", cheapestAirlines: ["Ethiopian Air", "Etihad Airways", "EL AL"], nonstop: "Delta, about 11h 30m" },
      { from: "Dallas–Fort Worth (DFW)", kayak: "Dallas-DFW/Tel-Aviv-TLV", monthly: [877, 936, 1215, 1110, 1101, 1488, 1209, 1425, 1483, 1353, 1225, 1468], cheapestMonth: "January · $877", priciestMonth: "June · $1,488", typical: null, cheapestDay: "Tuesday", cheapestAirlines: ["Air Canada", "United Airlines", "Iberia"], nonstop: null },
    ],
    faqs: [
      {
        q: "Why are flights to Tel Aviv expensive right now?",
        a: "US airlines suspended and restored service several times in 2025–2026, which reduced seats. In our data even the cheapest month cost $877–$1,359 round trip, depending on the US city (KAYAK medians).",
      },
      {
        q: "Which airlines fly nonstop from the US to Tel Aviv?",
        a: "In late 2026: Delta from New York JFK, United from Newark, and El Al from New York, Newark, Miami, Los Angeles, Boston and San Francisco. American's flights are suspended. Check before booking, as schedules change often.",
      },
      {
        q: "Do Americans need an ETA to visit Israel?",
        a: "Yes. US citizens need an approved ETA-IL before flying. It costs NIS 25, lasts up to 2 years and allows stays of up to 90 days per visit.",
      },
    ],
  },
  "cairo": {
    checked: "2026-11-28",
    summary:
      "December is the most expensive time to fly from the US to Cairo: it was the priciest month on 6 of the 7 US routes we checked, at 35–92% above the cheapest month. The cheapest months were January, February, April or October, with median round-trip fares from $690 (Chicago, October) to $776 (Dallas, April).",
    keyFacts: [
      "Priciest month: December on 6 of 7 routes",
      "Cheapest months vary: January, February, April or October",
      "Lowest monthly median: $690, Chicago in October",
      "Los Angeles had the lowest 12-month average ($832); Dallas the highest ($1,000) (our calculation)",
      "Nonstop: EgyptAir from JFK, Newark, Washington Dulles, Chicago and Los Angeles",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Cairo-CAI", monthly: [757, 759, 819, 810, 882, 1096, 1087, 969, 794, 821, 821, 1133], cheapestMonth: "January · $757", priciestMonth: "December · $1,133", typical: "$783–$1,135", cheapestDay: "Tuesday", cheapestAirlines: ["Royal Jordanian", "Royal Air Maroc", "Gulf Air"], nonstop: "Egyptair, about 10h 17m" },
      { from: "Washington, DC", kayak: "Washington-WAS/Cairo-CAI", monthly: [694, 715, 812, 704, 1052, 1186, 1107, 971, 898, 810, 832, 1219], cheapestMonth: "January · $694", priciestMonth: "December · $1,219", typical: "$800–$1,195", cheapestDay: "Wednesday", cheapestAirlines: ["Royal Jordanian", "Egyptair", "Turkish Airlines"], nonstop: null },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Cairo-CAI", monthly: [761, 734, 812, 740, 860, 929, 969, 824, 794, 796, 777, 989], cheapestMonth: "February · $734", priciestMonth: "December · $989", typical: "$759–$987", cheapestDay: "Tuesday", cheapestAirlines: ["Royal Air Maroc", "Turkish Airlines", "Egyptair"], nonstop: null },
      { from: "Chicago", kayak: "Chicago-CHI/Cairo-CAI", monthly: [754, 730, 903, 801, 1051, 1097, 866, 748, 732, 690, 720, 1117], cheapestMonth: "October · $690", priciestMonth: "December · $1,117", typical: "$733–$1,121", cheapestDay: "Wednesday", cheapestAirlines: ["Royal Jordanian", "Delta", "Turkish Airlines"], nonstop: "Egyptair, about 11h 10m" },
      { from: "Dallas–Fort Worth (DFW)", kayak: "Dallas-DFW/Cairo-CAI", monthly: [820, 790, 977, 776, 1086, 1237, 1299, 942, 829, 883, 876, 1489], cheapestMonth: "April · $776", priciestMonth: "December · $1,489", typical: "$843–$1,309", cheapestDay: "Wednesday", cheapestAirlines: ["Turkish Airlines", "Royal Jordanian", "Delta"], nonstop: null },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Cairo-CAI", monthly: [828, 774, 840, 824, 931, 1183, 1034, 922, 823, 844, 863, 1361], cheapestMonth: "February · $774", priciestMonth: "December · $1,361", typical: null, cheapestDay: "Monday", cheapestAirlines: ["Delta", "KLM", "Air France"], nonstop: null },
      { from: "Miami (MIA)", kayak: "Miami-MIA/Cairo-CAI", monthly: [798, 760, 840, 706, 913, 956, 1028, 843, 822, 825, 806, 1001], cheapestMonth: "April · $706", priciestMonth: "July · $1,028", typical: "$759–$1,061", cheapestDay: "Thursday", cheapestAirlines: ["ITA Airways", "Turkish Airlines", "Delta"], nonstop: null },
    ],
    faqs: [
      {
        q: "How much more do Christmas flights to Cairo cost?",
        a: "December was the priciest month on 6 of 7 routes we checked: for example $1,489 vs $776 from Dallas, and $1,219 vs $694 from Washington (KAYAK data, our calculation).",
      },
      {
        q: "Is there a nonstop flight from Chicago to Cairo?",
        a: "Yes. EgyptAir started Chicago–Cairo in June 2026, three times a week, taking about 11h 10m. It also flies from New York JFK, Newark, Washington Dulles and Los Angeles.",
      },
      {
        q: "Do Americans need a visa for Egypt?",
        a: "Yes. Apply for an e-visa at visa2egypt.gov.eg at least 7 days ahead, or buy a visa on arrival at Cairo airport. Your passport needs 6 months' validity.",
      },
    ],
  },
  "nairobi": {
    checked: "2026-11-28",
    summary:
      "February to April is the cheapest time to fly from the US to Nairobi. On all 7 US routes we checked, the cheapest month fell in that window, with median round-trip fares from $889 (Chicago, February) to $1,085 (Minneapolis, February). December is the most expensive month on 6 of the 7 routes, at 39–68% above the cheapest month.",
    keyFacts: [
      "Cheapest months: February–April on all 7 routes",
      "Priciest month: December on 6 of 7 routes",
      "Lowest monthly median: $889, Chicago in February",
      "Chicago had the lowest 12-month average ($1,057); Minneapolis the highest ($1,354) (our calculation)",
      "Nonstop: Kenya Airways from New York JFK only, about 13h 30m",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Nairobi-NBO", monthly: [1089, 1009, 975, 1059, 1155, 1364, 1407, 1284, 1036, 982, 1017, 1636], cheapestMonth: "March · $975", priciestMonth: "December · $1,636", typical: "$1,027–$1,551", cheapestDay: "Monday", cheapestAirlines: ["Air France", "Delta", "Turkish Airlines"], nonstop: "Kenya Airways, about 13h 30m" },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Nairobi-NBO", monthly: [957, 946, 983, 938, 1271, 1341, 1351, 1017, 941, 1065, 1047, 1418], cheapestMonth: "April · $938", priciestMonth: "December · $1,418", typical: "$966–$1,432", cheapestDay: "Monday", cheapestAirlines: ["Turkish Airlines", "Qatar Airways", "Etihad Airways"], nonstop: null },
      { from: "Washington, DC", kayak: "Washington-WAS/Nairobi-NBO", monthly: [988, 907, 1002, 971, 1139, 1336, 1239, 1260, 965, 1044, 983, 1399], cheapestMonth: "February · $907", priciestMonth: "December · $1,399", typical: "$978–$1,429", cheapestDay: "Thursday", cheapestAirlines: ["Ethiopian Air", "Turkish Airlines", "Etihad Airways"], nonstop: null },
      { from: "Dallas–Fort Worth (DFW)", kayak: "Dallas-DFW/Nairobi-NBO", monthly: [1039, 993, 991, 1087, 1317, 1376, 1233, 1147, 1028, 1068, 1216, 1466], cheapestMonth: "March · $991", priciestMonth: "December · $1,466", typical: "$1,029–$1,470", cheapestDay: "Monday", cheapestAirlines: ["Delta", "Emirates", "Turkish Airlines"], nonstop: null },
      { from: "Chicago", kayak: "Chicago-CHI/Nairobi-NBO", monthly: [1008, 889, 963, 918, 1260, 1202, 1207, 1138, 966, 930, 971, 1233], cheapestMonth: "February · $889", priciestMonth: "May · $1,260", typical: "$944–$1,313", cheapestDay: "Sunday", cheapestAirlines: ["Etihad Airways", "Qatar Airways", "Turkish Airlines"], nonstop: null },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Nairobi-NBO", monthly: [1086, 1103, 1084, 1022, 1285, 1338, 1474, 1463, 1103, 1082, 1157, 1535], cheapestMonth: "April · $1,022", priciestMonth: "December · $1,535", typical: "$1,088–$1,483", cheapestDay: "Tuesday", cheapestAirlines: ["Delta", "Air France", "Brussels Airlines"], nonstop: null },
      { from: "Minneapolis (MSP)", kayak: "Minneapolis-MSP/Nairobi-NBO", monthly: [1184, 1085, 1137, 1227, 1414, 1574, 1603, 1477, 1317, 1217, 1346, 1661], cheapestMonth: "February · $1,085", priciestMonth: "December · $1,661", typical: "$1,191–$1,642", cheapestDay: "Monday", cheapestAirlines: ["Lufthansa", "Brussels Airlines", "Turkish Airlines"], nonstop: null },
    ],
    faqs: [
      {
        q: "How much more do Christmas flights to Nairobi cost?",
        a: "December was the priciest month on 6 of 7 routes we checked: for example $1,636 vs $975 from New York and $1,661 vs $1,085 from Minneapolis (KAYAK data, our calculation).",
      },
      {
        q: "Is there a direct flight from the US to Nairobi?",
        a: "Yes, one: Kenya Airways flies nonstop from New York JFK, taking about 13h 30m. From every other US city you need at least one connection.",
      },
      {
        q: "Do Americans need a visa for Kenya?",
        a: "US citizens need an electronic Travel Authorisation (eTA) from etakenya.go.ke before flying. It starts at $30; apply at least 2 weeks ahead.",
      },
    ],
  },
  "addis-ababa": {
    checked: "2026-11-28",
    summary:
      "June is usually the most expensive time to fly from the US to Addis Ababa: it was the priciest month on 6 of the 8 US routes we checked. The cheapest months were January to April or October, with median round-trip fares from $733 (New York, October) to $1,353 (Minneapolis, April).",
    keyFacts: [
      "Priciest month: June on 6 of 8 routes",
      "Cheapest months: January–April on 6 routes, October on 2",
      "Lowest monthly median: $733, New York in October",
      "New York had the lowest 12-month average ($1,145); Minneapolis the highest ($1,607) (our calculation)",
      "Ethiopian Airlines flies from Washington, Chicago, Atlanta and New York",
    ],
    rows: [
      { from: "Washington, DC", kayak: "Washington-WAS/Addis-Ababa-ADD", monthly: [1173, 1100, 1070, 1172, 1383, 1656, 1551, 1291, 1225, 1202, 1210, 1519], cheapestMonth: "March · $1,070", priciestMonth: "June · $1,656", typical: "$1,157–$1,634", cheapestDay: "Wednesday", cheapestAirlines: ["Ethiopian Air", "Turkish Airlines", "Etihad Airways"], nonstop: null },
      { from: "New York (all airports)", kayak: "New-York-NYC/Addis-Ababa-ADD", monthly: [1128, 1074, 1035, 954, 1236, 1523, 1363, 1129, 1110, 733, 984, 1473], cheapestMonth: "October · $733", priciestMonth: "June · $1,523", typical: null, cheapestDay: "Monday", cheapestAirlines: ["Qatar Airways", "JetBlue", "Turkish Airlines"], nonstop: null },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Addis-Ababa-ADD", monthly: [1004, 986, 998, 1154, 1383, 1395, 1278, 1077, 1078, 1137, 1078, 1409], cheapestMonth: "February · $986", priciestMonth: "December · $1,409", typical: null, cheapestDay: "Saturday", cheapestAirlines: ["Turkish Airlines", "Etihad Airways", "Ethiopian Air"], nonstop: null },
      { from: "Dallas–Fort Worth (DFW)", kayak: "Dallas-DFW/Addis-Ababa-ADD", monthly: [1153, 1240, 1209, 1236, 1646, 1652, 1366, 1257, 1330, 1257, 1388, 1482], cheapestMonth: "January · $1,153", priciestMonth: "June · $1,652", typical: null, cheapestDay: "Monday", cheapestAirlines: ["Turkish Airlines", "Emirates", "Qatar Airways"], nonstop: null },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Addis-Ababa-ADD", monthly: [1077, 1227, 1109, 1414, 1415, 1558, 1475, 1309, 1301, 1375, 1439, 1483], cheapestMonth: "January · $1,077", priciestMonth: "June · $1,558", typical: null, cheapestDay: "Monday", cheapestAirlines: ["Emirates", "Turkish Airlines", "ITA Airways"], nonstop: null },
      { from: "Chicago", kayak: "Chicago-CHI/Addis-Ababa-ADD", monthly: [1342, 1236, 1208, 1217, 1462, 1528, 1622, 1400, 1456, 1082, 1239, 1819], cheapestMonth: "October · $1,082", priciestMonth: "December · $1,819", typical: "$1,238–$1,627", cheapestDay: "Saturday", cheapestAirlines: ["Turkish Airlines", "Qatar Airways", "Etihad Airways"], nonstop: null },
      { from: "Minneapolis (MSP)", kayak: "Minneapolis-MSP/Addis-Ababa-ADD", monthly: [1435, 1454, 1444, 1353, 1820, 2050, 1893, 1459, 1416, 1580, 1582, 1793], cheapestMonth: "April · $1,353", priciestMonth: "June · $2,050", typical: null, cheapestDay: "Tuesday", cheapestAirlines: ["Qatar Airways", "Turkish Airlines", "Ethiopian Air"], nonstop: null },
      { from: "Seattle (SEA)", kayak: "Seattle-SEA/Addis-Ababa-ADD", monthly: [1317, 1276, 1246, 1204, 1341, 1796, 1622, 1361, 1280, 1306, 1339, 1453], cheapestMonth: "April · $1,204", priciestMonth: "June · $1,796", typical: "$1,244–$1,578", cheapestDay: "Monday", cheapestAirlines: ["Emirates", "Qatar Airways", "SAUDIA"], nonstop: null },
    ],
    faqs: [
      {
        q: "When are flights to Addis Ababa most expensive?",
        a: "June was the priciest month on 6 of 8 routes we checked, followed by December. From Washington, June cost $1,656 vs $1,070 in March (KAYAK data, our calculation).",
      },
      {
        q: "Does Ethiopian Airlines fly nonstop from the US?",
        a: "Yes, from Chicago and Atlanta to Addis Ababa (returns stop in Rome). Washington and New York flights stop in Rome, Lomé or Abidjan on the winter 2026–27 schedule.",
      },
      {
        q: "Do Americans need a visa for Ethiopia?",
        a: "Yes. Apply for an e-visa at evisa.gov.et before you fly and enter through Bole International Airport.",
      },
    ],
  },
  "abuja": {
    checked: "2026-11-28",
    summary:
      "December is the most expensive time to fly from the US to Abuja: it was the priciest month on 6 of the 7 US routes we checked, at 49–106% above the cheapest month. January to March is cheapest on 6 of the 7 routes, with median round-trip fares from $969 (Los Angeles, January) to $1,092 (Boston, March).",
    keyFacts: [
      "Priciest month: December on 6 of 7 routes",
      "Cheapest months: January–March on 6 of 7 routes",
      "Lowest monthly median: $969, Los Angeles in January",
      "Washington had the lowest 12-month average ($1,214); Los Angeles the highest ($1,403) (our calculation)",
      "No nonstop flights from the US; connect via Africa, Europe or the Gulf",
    ],
    rows: [
      { from: "Washington, DC", kayak: "Washington-WAS/Abuja-ABV", monthly: [1075, 1040, 1113, 1099, 1177, 1361, 1342, 1173, 1118, 1316, 1087, 1670], cheapestMonth: "February · $1,040", priciestMonth: "December · $1,670", typical: "$1,104–$1,665", cheapestDay: "Sunday", cheapestAirlines: ["Ethiopian Air", "Turkish Airlines", "Royal Air Maroc"], nonstop: null },
      { from: "New York (all airports)", kayak: "New-York-NYC/Abuja-ABV", monthly: [1288, 1048, 979, 1238, 1350, 1322, 1528, 1515, 1052, 1183, 1250, 1744], cheapestMonth: "March · $979", priciestMonth: "December · $1,744", typical: "$1,166–$1,790", cheapestDay: "Tuesday", cheapestAirlines: ["Ethiopian Air", "Turkish Airlines", "Qatar Airways"], nonstop: null },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Abuja-ABV", monthly: [1064, 1082, 1217, 1168, 1255, 1256, 1324, 1327, 1201, 1211, 1277, 1739], cheapestMonth: "January · $1,064", priciestMonth: "December · $1,739", typical: "$1,174–$1,634", cheapestDay: "Sunday", cheapestAirlines: ["Turkish Airlines", "Qatar Airways", "Ethiopian Air"], nonstop: null },
      { from: "Dallas–Fort Worth (DFW)", kayak: "Dallas-DFW/Abuja-ABV", monthly: [1182, 1114, 1064, 1162, 1402, 1634, 1699, 1146, 1285, 1333, 1302, 2077], cheapestMonth: "March · $1,064", priciestMonth: "December · $2,077", typical: "$1,208–$1,855", cheapestDay: "Thursday", cheapestAirlines: ["Turkish Airlines", "British Airways", "Qatar Airways"], nonstop: null },
      { from: "Chicago", kayak: "Chicago-CHI/Abuja-ABV", monthly: [1662, 1200, 1357, 1149, 1340, 1299, 1385, 1181, 1461, 1168, 1142, 1699], cheapestMonth: "November · $1,142", priciestMonth: "December · $1,699", typical: "$1,190–$1,714", cheapestDay: "Tuesday", cheapestAirlines: ["Turkish Airlines", "Qatar Airways", "British Airways"], nonstop: null },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Abuja-ABV", monthly: [969, 1094, 1318, 1136, 1388, 1430, 2214, 1499, 1323, 1307, 1160, 1996], cheapestMonth: "January · $969", priciestMonth: "July · $2,214", typical: "$1,165–$2,061", cheapestDay: "Tuesday", cheapestAirlines: ["Qatar Airways", "Royal Air Maroc", "American Airlines"], nonstop: null },
      { from: "Boston (BOS)", kayak: "Boston-BOS/Abuja-ABV", monthly: [1196, 1178, 1092, 1197, 1313, 1287, 1711, 1508, 1260, 1211, 1319, 2132], cheapestMonth: "March · $1,092", priciestMonth: "December · $2,132", typical: null, cheapestDay: "Tuesday", cheapestAirlines: ["Turkish Airlines", "Lufthansa", "British Airways"], nonstop: null },
    ],
    faqs: [
      {
        q: "How much more do Christmas flights to Abuja cost?",
        a: "December was the priciest month on 6 of 7 routes: for example $2,077 vs $1,064 from Dallas and $1,744 vs $979 from New York (KAYAK data, our calculation).",
      },
      {
        q: "Is there a direct flight from the US to Abuja?",
        a: "No. All flights connect. Ethiopian, Turkish, Qatar, Royal Air Maroc and British Airways were the cheapest airlines on the routes we checked.",
      },
      {
        q: "Can I get a visa on arrival in Nigeria?",
        a: "No. Visa on arrival ended in May 2025. Apply for an e-visa at evisa.immigration.gov.ng before you travel.",
      },
    ],
  },
  "mexico-city": {
    checked: "2026-11-28",
    summary:
      "January and February are the cheapest months to fly from the US to Mexico City, and December is the most expensive on every route we checked. Median round-trip fares in the cheapest month ranged from $309 (Dallas, January) to $639 (Atlanta, April); December cost 52–100% more.",
    keyFacts: [
      "Priciest month: December on all 7 routes",
      "Cheapest months: January–February on 5 of 7 routes",
      "Lowest monthly median: $309, Dallas in January",
      "Dallas had the lowest 12-month average ($390); Atlanta the highest ($721) (our calculation)",
      "Nonstops from most large US cities; Volaris, Viva and Frontier were often cheapest",
    ],
    rows: [
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Mexico-City-MEX", monthly: [384, 360, 395, 406, 374, 426, 430, 414, 425, 445, 483, 600], cheapestMonth: "February · $360", priciestMonth: "December · $600", typical: "$349–$539", cheapestDay: "Monday", cheapestAirlines: ["Volaris", "Viva", "Frontier"], nonstop: "Aeromexico, Volaris and others, about 3h 44m" },
      { from: "Chicago", kayak: "Chicago-CHI/Mexico-City-MEX", monthly: [343, 327, 410, 348, 378, 430, 478, 415, 371, 434, 412, 653], cheapestMonth: "February · $327", priciestMonth: "December · $653", typical: "$335–$542", cheapestDay: "Sunday", cheapestAirlines: ["Volaris", "Viva", "Frontier"], nonstop: null },
      { from: "Dallas–Fort Worth (DFW)", kayak: "Dallas-DFW/Mexico-City-MEX", monthly: [309, 318, 368, 331, 353, 458, 444, 358, 344, 401, 388, 602], cheapestMonth: "January · $309", priciestMonth: "December · $602", typical: "$311–$527", cheapestDay: "Tuesday", cheapestAirlines: ["Volaris", "Frontier", "Viva"], nonstop: "American Airlines, Aeromexico and Volaris, about 2h 47m" },
      { from: "New York (all airports)", kayak: "New-York-NYC/Mexico-City-MEX", monthly: [576, 584, 612, 599, 571, 563, 623, 664, 544, 645, 676, 850], cheapestMonth: "September · $544", priciestMonth: "December · $850", typical: null, cheapestDay: "Tuesday", cheapestAirlines: ["Viva", "Frontier", "Aeromexico"], nonstop: "Aeromexico, United Airlines and others, about 5h 44m" },
      { from: "San Francisco (SFO)", kayak: "San-Francisco-SFO/Mexico-City-MEX", monthly: [456, 537, 531, 554, 532, 581, 565, 580, 604, 658, 714, 789], cheapestMonth: "January · $456", priciestMonth: "December · $789", typical: "$484–$722", cheapestDay: "Monday", cheapestAirlines: ["Frontier", "Aeromexico", "American Airlines"], nonstop: null },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Mexico-City-MEX", monthly: [660, 679, 680, 639, 664, 772, 723, 647, 731, 749, 729, 974], cheapestMonth: "April · $639", priciestMonth: "December · $974", typical: "$612–$903", cheapestDay: "Thursday", cheapestAirlines: ["Frontier", "Volaris", "Aeromexico"], nonstop: null },
      { from: "Miami (MIA)", kayak: "Miami-MIA/Mexico-City-MEX", monthly: [381, 360, 388, 412, 395, 518, 461, 445, 420, 474, 458, 579], cheapestMonth: "February · $360", priciestMonth: "December · $579", typical: null, cheapestDay: "Wednesday", cheapestAirlines: ["Volaris", "Viva", "Frontier"], nonstop: "Aeromexico, American Airlines and Volaris, about 3h 47m" },
    ],
    faqs: [
      {
        q: "How much more do Christmas flights to Mexico City cost?",
        a: "December was the most expensive month on all 7 routes we checked, 52–100% above the cheapest month: for example $653 vs $327 from Chicago (KAYAK data, our calculation).",
      },
      {
        q: "Which US city has the cheapest flights to Mexico City?",
        a: "In our data, Dallas–Fort Worth had the lowest 12-month average median fare ($390), followed by Chicago ($417) and Los Angeles ($428). Atlanta was the most expensive ($721).",
      },
      {
        q: "Do I need a visa to fly to Mexico City?",
        a: "No. US citizens need a valid passport; air arrivals receive a digital FMM entry permit, with stays of up to 180 days at the officer's discretion.",
      },
    ],
  },
  "guatemala-city": {
    checked: "2026-11-28",
    summary:
      "January and February are the cheapest months to fly from the US to Guatemala City. Median round-trip fares in each route's cheapest month ranged from $286 (Atlanta, January) to $434 (New York, May). Prices rise from June and peak in October–December, when fares were 69–159% above the cheapest month.",
    keyFacts: [
      "Cheapest months: January–February on 5 of 7 routes",
      "Priciest months: October–December on all 7 routes",
      "Lowest monthly median: $286, Atlanta in January",
      "Miami had the lowest 12-month average ($439); New York the highest ($586) (our calculation)",
      "Nonstop from at least 9 US cities on United, American, Delta, JetBlue, Avianca and Frontier",
    ],
    rows: [
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Guatemala-City-GUA", monthly: [410, 372, 526, 437, 420, 533, 545, 449, 459, 525, 613, 750], cheapestMonth: "February · $372", priciestMonth: "December · $750", typical: null, cheapestDay: "Wednesday", cheapestAirlines: ["Volaris Costa Rica", "Avianca", "Frontier"], nonstop: null },
      { from: "New York (all airports)", kayak: "New-York-NYC/Guatemala-City-GUA", monthly: [442, 445, 520, 501, 434, 572, 713, 681, 579, 686, 735, 721], cheapestMonth: "May · $434", priciestMonth: "November · $735", typical: null, cheapestDay: "Sunday", cheapestAirlines: ["Arajet", "Frontier", "Copa Airlines"], nonstop: "United Airlines and Avianca, about 5h 09m" },
      { from: "Miami (MIA)", kayak: "Miami-MIA/Guatemala-City-GUA", monthly: [373, 333, 379, 308, 373, 377, 369, 515, 539, 589, 554, 556], cheapestMonth: "April · $308", priciestMonth: "October · $589", typical: "$311–$617", cheapestDay: "Thursday", cheapestAirlines: ["Frontier", "Avianca", "Arajet"], nonstop: "American Airlines and Frontier, about 2h 58m" },
      { from: "Dallas–Fort Worth (DFW)", kayak: "Dallas-DFW/Guatemala-City-GUA", monthly: [474, 354, 540, 390, 510, 617, 584, 563, 563, 633, 615, 806], cheapestMonth: "February · $354", priciestMonth: "December · $806", typical: "$432–$739", cheapestDay: "Monday", cheapestAirlines: ["Frontier", "Avianca", "American Airlines"], nonstop: "American Airlines and Frontier, about 3h 22m" },
      { from: "Chicago", kayak: "Chicago-CHI/Guatemala-City-GUA", monthly: [389, 408, 528, 432, 421, 576, 586, 527, 450, 484, 543, 668], cheapestMonth: "January · $389", priciestMonth: "December · $668", typical: null, cheapestDay: "Tuesday", cheapestAirlines: ["Volaris", "Avianca", "Frontier"], nonstop: "Avianca, United Airlines and American Airlines, about 4h 37m" },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Guatemala-City-GUA", monthly: [286, 438, 445, 439, 491, 718, 739, 632, 650, 742, 701, 638], cheapestMonth: "January · $286", priciestMonth: "October · $742", typical: null, cheapestDay: "Wednesday", cheapestAirlines: ["Frontier", "Delta", "Copa Airlines"], nonstop: null },
      { from: "Washington, DC", kayak: "Washington-WAS/Guatemala-City-GUA", monthly: [433, 353, 455, 461, 500, 542, 647, 607, 661, 676, 654, 860], cheapestMonth: "February · $353", priciestMonth: "December · $860", typical: "$408–$752", cheapestDay: "Sunday", cheapestAirlines: ["Frontier", "Air Canada", "Volaris"], nonstop: null },
    ],
    faqs: [
      {
        q: "How much more do Christmas flights to Guatemala cost?",
        a: "December was the priciest month on 4 of 7 routes: for example $860 vs $353 from Washington and $806 vs $354 from Dallas (KAYAK data, our calculation).",
      },
      {
        q: "Which US city has the cheapest flights to Guatemala City?",
        a: "In our data, Miami had the lowest 12-month average median fare ($439), with Chicago ($501) and Los Angeles ($503) next. New York was highest ($586).",
      },
      {
        q: "Do Americans need a visa for Guatemala?",
        a: "No. US citizens can stay up to 90 days without a visa, shared across the CA-4 countries. Fill in the SAT traveller declaration before arrival.",
      },
    ],
  },
  "montego-bay": {
    checked: "2026-11-28",
    summary:
      "Montego Bay is one of the cheaper international trips from the US, with route averages of $448–$728 round trip. December is the most expensive month on 5 of the 8 US routes we checked. The cheapest months fall between January and May on 7 of the 8 routes, with median fares from $307 (Miami, March) to $548 (Dallas, May).",
    keyFacts: [
      "Priciest month: December on 5 of 8 routes",
      "Cheapest months: January–May on 7 of 8 routes",
      "Lowest monthly median: $307, Miami in March",
      "Miami had the lowest 12-month average ($448); Dallas the highest ($728) (our calculation)",
      "Nonstops from at least 14 US cities",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Montego-Bay-MBJ", monthly: [459, 526, 508, 523, 489, 566, 652, 636, 518, 521, 493, 704], cheapestMonth: "January · $459", priciestMonth: "December · $704", typical: "$439–$744", cheapestDay: "Monday", cheapestAirlines: ["Delta", "JetBlue", "American Airlines"], nonstop: "JetBlue, United Airlines and others, about 4h 10m" },
      { from: "Miami (MIA)", kayak: "Miami-MIA/Montego-Bay-MBJ", monthly: [372, 361, 307, 417, 392, 467, 494, 441, 563, 539, 494, 533], cheapestMonth: "March · $307", priciestMonth: "September · $563", typical: "$352–$580", cheapestDay: "Saturday", cheapestAirlines: ["American Airlines", "Copa Airlines"], nonstop: null },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Montego-Bay-MBJ", monthly: [456, 396, 436, 509, 508, 580, 580, 564, 585, 565, 549, 560], cheapestMonth: "February · $396", priciestMonth: "September · $585", typical: null, cheapestDay: "Sunday", cheapestAirlines: ["Frontier", "Air Canada", "Delta"], nonstop: null },
      { from: "Chicago", kayak: "Chicago-CHI/Montego-Bay-MBJ", monthly: [570, 511, 586, 477, 512, 590, 558, 538, 512, 519, 601, 696], cheapestMonth: "April · $477", priciestMonth: "December · $696", typical: "$452–$718", cheapestDay: "Tuesday", cheapestAirlines: ["American Airlines", "Air Canada", "JetBlue"], nonstop: null },
      { from: "Boston (BOS)", kayak: "Boston-BOS/Montego-Bay-MBJ", monthly: [487, 532, 462, 657, 517, 534, 561, 582, 520, 606, 621, 674], cheapestMonth: "March · $462", priciestMonth: "December · $674", typical: "$461–$719", cheapestDay: "Monday", cheapestAirlines: ["JetBlue", "Air Canada", "Delta"], nonstop: "Delta and JetBlue, about 4h 32m" },
      { from: "Dallas–Fort Worth (DFW)", kayak: "Dallas-DFW/Montego-Bay-MBJ", monthly: [728, 800, 713, 603, 548, 781, 777, 817, 802, 797, 785, 587], cheapestMonth: "May · $548", priciestMonth: "August · $817", typical: null, cheapestDay: "Tuesday", cheapestAirlines: ["Frontier", "Air Canada", "American Airlines"], nonstop: null },
      { from: "Philadelphia (PHL)", kayak: "Philadelphia-PHL/Montego-Bay-MBJ", monthly: [598, 609, 621, 601, 608, 590, 677, 659, 585, 640, 710, 762], cheapestMonth: "September · $585", priciestMonth: "December · $762", typical: null, cheapestDay: "Tuesday", cheapestAirlines: ["JetBlue", "Delta", "Air Canada"], nonstop: null },
      { from: "Washington, DC", kayak: "Washington-WAS/Montego-Bay-MBJ", monthly: [501, 635, 707, 549, 592, 634, 652, 655, 581, 555, 620, 774], cheapestMonth: "January · $501", priciestMonth: "December · $774", typical: "$501–$782", cheapestDay: "Sunday", cheapestAirlines: ["American Airlines", "JetBlue", "Southwest"], nonstop: null },
    ],
    faqs: [
      {
        q: "Is hurricane season cheaper for Jamaica?",
        a: "Not much in our data. Across the 8 routes, the average fare for June–November was higher than for January–May. September was the priciest month from Miami ($563) and Atlanta ($585) (KAYAK data, our calculation).",
      },
      {
        q: "Which US city has the cheapest flights to Montego Bay?",
        a: "Miami had the lowest 12-month average median fare in our data ($448), then Atlanta ($524). Dallas was the highest ($728).",
      },
      {
        q: "Do Americans need a visa for Jamaica?",
        a: "No. You need a valid passport and must complete the free online C5 immigration and customs form before arrival.",
      },
    ],
  },
  "lisbon": {
    checked: "2026-11-28",
    summary:
      "January and February are the cheapest months to fly from the US to Lisbon, and June is the most expensive on all 8 routes we checked. Median round-trip fares in the cheapest month ranged from $543 (New York, January) to $698 (Boston, February); June cost 57–119% more.",
    keyFacts: [
      "Cheapest months: January–February on all 8 routes",
      "Priciest month: June on all 8 routes",
      "Lowest monthly median: $543, New York in January",
      "New York had the lowest 12-month average ($792); Washington the highest ($1,035) (our calculation)",
      "Nonstop: TAP from 9 US cities, plus United, Delta and American",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Lisbon-LIS", monthly: [543, 616, 697, 731, 853, 983, 973, 878, 856, 793, 709, 868], cheapestMonth: "January · $543", priciestMonth: "June · $983", typical: "$664–$1,045", cheapestDay: "Monday", cheapestAirlines: ["Icelandair", "TAP AIR PORTUGAL", "Scandinavian Airlines"], nonstop: null },
      { from: "Boston (BOS)", kayak: "Boston-BOS/Lisbon-LIS", monthly: [737, 698, 744, 876, 994, 1099, 1071, 881, 902, 836, 753, 936], cheapestMonth: "February · $698", priciestMonth: "June · $1,099", typical: "$757–$1,107", cheapestDay: "Tuesday", cheapestAirlines: ["TAP AIR PORTUGAL", "Aer Lingus", "Iberia"], nonstop: null },
      { from: "Miami (MIA)", kayak: "Miami-MIA/Lisbon-LIS", monthly: [591, 597, 670, 708, 917, 1296, 1113, 999, 855, 763, 757, 958], cheapestMonth: "January · $591", priciestMonth: "June · $1,296", typical: "$662–$1,128", cheapestDay: "Wednesday", cheapestAirlines: ["Delta", "TAP AIR PORTUGAL", "Finnair"], nonstop: "TAP AIR PORTUGAL, about 8h 10m" },
      { from: "Chicago", kayak: "Chicago-CHI/Lisbon-LIS", monthly: [624, 558, 785, 677, 982, 1101, 1056, 949, 906, 795, 777, 1087], cheapestMonth: "February · $558", priciestMonth: "June · $1,101", typical: "$692–$1,124", cheapestDay: "Tuesday", cheapestAirlines: ["Iberia", "TAP AIR PORTUGAL", "Air Canada"], nonstop: null },
      { from: "Washington, DC", kayak: "Washington-WAS/Lisbon-LIS", monthly: [665, 769, 1045, 882, 1198, 1418, 1257, 1110, 1045, 916, 908, 1206], cheapestMonth: "January · $665", priciestMonth: "June · $1,418", typical: "$855–$1,356", cheapestDay: "Wednesday", cheapestAirlines: ["TAP AIR PORTUGAL", "Air Canada", "Royal Air Maroc"], nonstop: "TAP AIR PORTUGAL and United Airlines, about 7h 03m" },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Lisbon-LIS", monthly: [559, 579, 718, 700, 1005, 1193, 1173, 1093, 947, 865, 752, 1095], cheapestMonth: "January · $559", priciestMonth: "June · $1,193", typical: "$702–$1,201", cheapestDay: "Monday", cheapestAirlines: ["Air Canada", "Lufthansa", "United Airlines"], nonstop: null },
      { from: "San Francisco (SFO)", kayak: "San-Francisco-SFO/Lisbon-LIS", monthly: [654, 630, 698, 704, 928, 1244, 1097, 984, 980, 838, 878, 1086], cheapestMonth: "February · $630", priciestMonth: "June · $1,244", typical: "$694–$1,176", cheapestDay: "Monday", cheapestAirlines: ["Scandinavian Airlines", "Air Canada", "TAP AIR PORTUGAL"], nonstop: null },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Lisbon-LIS", monthly: [705, 647, 742, 758, 1094, 1327, 1222, 951, 942, 1004, 790, 1145], cheapestMonth: "February · $647", priciestMonth: "June · $1,327", typical: null, cheapestDay: "Wednesday", cheapestAirlines: ["British Airways", "Air Canada", "Iberia"], nonstop: null },
    ],
    faqs: [
      {
        q: "How much more do summer flights to Lisbon cost?",
        a: "June was the most expensive month on all 8 routes, 57–119% above the cheapest month: for example $1,296 vs $591 from Miami (KAYAK data, our calculation).",
      },
      {
        q: "Which US city has the cheapest flights to Lisbon?",
        a: "New York had the lowest 12-month average median fare in our data ($792), followed by Miami ($852) and Chicago ($858). Washington was the highest ($1,035).",
      },
      {
        q: "How long is the flight from the US to Lisbon?",
        a: "About 6h 35m–7h from New York, one of the shortest transatlantic flights. TAP flies nonstop from 9 US cities.",
      },
    ],
  },
  "athens": {
    checked: "2026-11-28",
    summary:
      "January and February are the cheapest months to fly from the US to Athens, and June is the most expensive on all 8 routes we checked. Median round-trip fares in the cheapest month ranged from $520 (Los Angeles, February) to $734 (Atlanta, January). June cost 81–163% more.",
    keyFacts: [
      "Cheapest months: January–February on all 8 routes",
      "Priciest month: June on all 8 routes, 81–163% above the cheapest",
      "Lowest monthly median: $520, Los Angeles in February",
      "New York had the lowest 12-month average ($836); Washington the highest ($1,063) (our calculation)",
      "Year-round nonstop: Emirates from Newark; US airlines fly summer-only",
    ],
    rows: [
      { from: "New York (all airports)", kayak: "New-York-NYC/Athens-ATH", monthly: [599, 644, 773, 730, 866, 1083, 996, 910, 842, 824, 782, 987], cheapestMonth: "January · $599", priciestMonth: "June · $1,083", typical: "$702–$1,150", cheapestDay: "Monday", cheapestAirlines: ["SWISS", "Scandinavian Airlines", "Air Canada"], nonstop: "Emirates and Delta, about 9h 21m" },
      { from: "Chicago", kayak: "Chicago-CHI/Athens-ATH", monthly: [728, 602, 699, 808, 1264, 1478, 1258, 977, 1092, 993, 775, 1069], cheapestMonth: "February · $602", priciestMonth: "June · $1,478", typical: "$834–$1,394", cheapestDay: "Monday", cheapestAirlines: ["Scandinavian Airlines", "Lufthansa", "Air Canada"], nonstop: null },
      { from: "Boston (BOS)", kayak: "Boston-BOS/Athens-ATH", monthly: [688, 678, 748, 1015, 1187, 1396, 1123, 1055, 1082, 1072, 777, 1207], cheapestMonth: "February · $678", priciestMonth: "June · $1,396", typical: "$864–$1,394", cheapestDay: "Wednesday", cheapestAirlines: ["Turkish Airlines", "Scandinavian Airlines", "SWISS"], nonstop: null },
      { from: "Los Angeles (LAX)", kayak: "Los-Angeles-LAX/Athens-ATH", monthly: [618, 520, 739, 763, 881, 1283, 1085, 885, 898, 800, 815, 1204], cheapestMonth: "February · $520", priciestMonth: "June · $1,283", typical: "$746–$1,197", cheapestDay: "Wednesday", cheapestAirlines: ["Turkish Airlines", "Scandinavian Airlines", "Air Canada"], nonstop: null },
      { from: "Washington, DC", kayak: "Washington-WAS/Athens-ATH", monthly: [720, 630, 888, 796, 1422, 1438, 1310, 1221, 1197, 972, 852, 1308], cheapestMonth: "February · $630", priciestMonth: "June · $1,438", typical: "$899–$1,518", cheapestDay: "Sunday", cheapestAirlines: ["TAP AIR PORTUGAL", "Scandinavian Airlines", "Turkish Airlines"], nonstop: null },
      { from: "Atlanta (ATL)", kayak: "Atlanta-ATL/Athens-ATH", monthly: [734, 748, 774, 845, 1452, 1693, 1137, 1018, 1000, 1143, 941, 1180], cheapestMonth: "January · $734", priciestMonth: "June · $1,693", typical: "$835–$1,479", cheapestDay: "Sunday", cheapestAirlines: ["Scandinavian Airlines", "Turkish Airlines", "Air Canada"], nonstop: null },
      { from: "Miami (MIA)", kayak: "Miami-MIA/Athens-ATH", monthly: [694, 744, 703, 755, 1123, 1399, 1092, 821, 803, 910, 853, 1123], cheapestMonth: "January · $694", priciestMonth: "June · $1,399", typical: "$764–$1,230", cheapestDay: "Friday", cheapestAirlines: ["Scandinavian Airlines", "SWISS", "TAP AIR PORTUGAL"], nonstop: null },
      { from: "Dallas–Fort Worth (DFW)", kayak: "Dallas-DFW/Athens-ATH", monthly: [684, 621, 751, 709, 1269, 1631, 1396, 1004, 939, 920, 804, 1033], cheapestMonth: "February · $621", priciestMonth: "June · $1,631", typical: "$750–$1,332", cheapestDay: "Tuesday", cheapestAirlines: ["Iberia", "British Airways", "Air Canada"], nonstop: null },
    ],
    faqs: [
      {
        q: "How much more do summer flights to Athens cost?",
        a: "June was the most expensive month on all 8 routes, 81–163% above the cheapest month: for example $1,631 vs $621 from Dallas (KAYAK data, our calculation).",
      },
      {
        q: "Are there nonstop flights to Athens in winter?",
        a: "Yes, one: Emirates flies Newark–Athens year-round. Delta, United and American fly nonstop only in summer, so winter trips from other cities connect in Europe.",
      },
      {
        q: "Which US city has the cheapest flights to Athens?",
        a: "New York had the lowest 12-month average median fare in our data ($836), followed by Los Angeles ($874). Washington was highest ($1,063).",
      },
    ],
  },
};
