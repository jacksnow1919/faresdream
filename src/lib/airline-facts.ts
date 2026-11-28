/**
 * Checked facts for /airlines/$slug pages: hubs, US airports, baggage by fare.
 * Sources are listed per airline (official airline pages first, then route news / Wikipedia).
 * Airline networks and baggage rules change: re-check every 3 months and update `checked`.
 */
export type BaggageRow = { fare: string; checked: string; cabin: string };
export type AirlineFacts = {
  checked: string;
  hub: string;
  alliance: string;
  /** One-sentence answer shown at the top of the page. */
  summary: string;
  usAirports: { code: string; city: string; note?: string }[];
  usNote: string;
  baggage: BaggageRow[];
  baggageNote: string;
  tips: { title: string; text: string }[];
  /** Related destination pages on this site. */
  destinations: string[];
  extraFaqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
};

export const airlineFacts: Record<string, AirlineFacts> = {
  emirates: {
    checked: "2026-11-26",
    hub: "Dubai International (DXB)",
    alliance: "No alliance (codeshare partner of United)",
    summary:
      "Emirates flies from 12 US airports to its Dubai hub, then on to India, the Middle East, Africa and Asia. On US routes most Economy fares include 2 checked bags of 23 kg; the cheapest Economy Special fare includes 1, and Business includes 2 bags of 32 kg.",
    usAirports: [
      { code: "BOS", city: "Boston" },
      { code: "ORD", city: "Chicago" },
      { code: "DFW", city: "Dallas" },
      { code: "IAH", city: "Houston" },
      { code: "LAX", city: "Los Angeles" },
      { code: "MIA", city: "Miami" },
      { code: "JFK", city: "New York" },
      { code: "EWR", city: "Newark", note: "via Athens" },
      { code: "MCO", city: "Orlando" },
      { code: "SFO", city: "San Francisco" },
      { code: "SEA", city: "Seattle" },
      { code: "IAD", city: "Washington, DC" },
    ],
    usNote:
      "Nonstop to Dubai unless noted. Newark is served via Athens. Emirates' president has named Denver, Detroit and Philadelphia as possible future routes, but none was confirmed when we checked.",
    baggage: [
      { fare: "Economy Special", checked: "1 bag, 23 kg", cabin: "1 bag, 7 kg" },
      { fare: "Economy Saver / Flex / Flex Plus", checked: "2 bags, 23 kg each", cabin: "1 bag, 7 kg" },
      { fare: "Premium Economy", checked: "2 bags, 23 kg each", cabin: "1 bag, 10 kg" },
      { fare: "Business and First", checked: "2 bags, 32 kg each", cabin: "1 bag 7 kg + 1 briefcase 7 kg" },
    ],
    baggageNote:
      "Allowances for flights to or from the US (piece concept). On the US–Europe legs, such as Newark–Athens, Economy Special and Saver include only 1 bag of 23 kg.",
    tips: [
      {
        title: "Long layover in Dubai",
        text: "Dubai Connect can include a hotel, meals and a transit visa on eligible long connections. Check the conditions on Emirates' Dubai Connect page before you book.",
      },
      {
        title: "Check the fare, not just the price",
        text: "The cheapest Economy Special fare includes 1 checked bag instead of 2. If you travel with two bags, compare it with Saver before you pay.",
      },
    ],
    destinations: ["dubai", "mumbai", "delhi"],
    extraFaqs: [
      {
        q: "Which US cities does Emirates fly from?",
        a: "Boston, Chicago, Dallas, Houston, Los Angeles, Miami, New York JFK, Newark (via Athens), Orlando, San Francisco, Seattle and Washington Dulles, based on route sources we checked on Nov 26, 2026.",
      },
      {
        q: "How many bags can I check on Emirates from the US?",
        a: "Economy Saver, Flex and Flex Plus include 2 bags of 23 kg each, Economy Special includes 1 bag of 23 kg, and Business and First include 2 bags of 32 kg each, according to Emirates' US baggage page.",
      },
    ],
    sources: [
      { label: "Emirates: checked baggage (US)", url: "https://www.emirates.com/us/english/before-you-fly/baggage/checked-baggage/" },
      { label: "Emirates: cabin baggage", url: "https://www.emirates.com/us/english/before-you-fly/baggage/cabin-baggage-rules/" },
      { label: "Emirates: Dubai Connect", url: "https://www.emirates.com/us/english/before-you-fly/dubai-international-airport/dubai-connect/" },
      { label: "Wikipedia: Emirates destinations", url: "https://en.wikipedia.org/wiki/List_of_Emirates_destinations" },
    ],
  },
  "qatar-airways": {
    checked: "2026-11-26",
    hub: "Hamad International, Doha (DOH)",
    alliance: "oneworld",
    summary:
      "Qatar Airways flies nonstop from 12 US airports to Doha, about 93 flights a week in mid-2026, with connections to India, the Middle East, Africa and Asia. On US routes Economy Classic and higher include 2 checked bags of 23 kg; Economy Lite includes 1, and Business includes 2 bags of 32 kg.",
    usAirports: [
      { code: "ATL", city: "Atlanta", note: "4 a week" },
      { code: "BOS", city: "Boston", note: "4 a week" },
      { code: "ORD", city: "Chicago", note: "daily" },
      { code: "DFW", city: "Dallas", note: "twice daily" },
      { code: "IAH", city: "Houston", note: "daily" },
      { code: "LAX", city: "Los Angeles", note: "4 a week" },
      { code: "MIA", city: "Miami", note: "daily" },
      { code: "JFK", city: "New York", note: "18 a week" },
      { code: "PHL", city: "Philadelphia", note: "daily from Aug 2026" },
      { code: "SFO", city: "San Francisco", note: "4 a week" },
      { code: "SEA", city: "Seattle", note: "daily" },
      { code: "IAD", city: "Washington, DC", note: "10 a week" },
    ],
    usNote:
      "Weekly frequencies as reported in mid-2026; they change by season. Newark and Pittsburgh are no longer served.",
    baggage: [
      { fare: "Economy Lite", checked: "1 bag, 23 kg", cabin: "1 bag, 7 kg" },
      { fare: "Economy Classic / Convenience / Comfort", checked: "2 bags, 23 kg each", cabin: "1 bag, 7 kg" },
      { fare: "Business and First", checked: "2 bags, 32 kg each", cabin: "2 bags, 15 kg in total" },
    ],
    baggageNote: "Allowances for flights to or from the Americas. Each checked bag can be up to 158 cm (length + width + height).",
    tips: [
      {
        title: "Doha stopover",
        text: "Qatar Airways sells stopover hotel packages in Doha, from USD 14 per person per night when we checked, for transits of 12 to 96 hours.",
      },
      {
        title: "Qsuite",
        text: "Qsuite business class (seats with a closing door) is on many US routes, but not every aircraft. Check the seat map for your flight before you book.",
      },
    ],
    destinations: ["mumbai", "delhi", "dubai"],
    extraFaqs: [
      {
        q: "Which US cities does Qatar Airways fly from?",
        a: "Atlanta, Boston, Chicago, Dallas, Houston, Los Angeles, Miami, New York JFK, Philadelphia, San Francisco, Seattle and Washington Dulles, all nonstop to Doha, based on route reports from mid-2026.",
      },
      {
        q: "How many bags can I check on Qatar Airways from the US?",
        a: "Economy Classic, Convenience and Comfort include 2 bags of 23 kg each, Economy Lite includes 1 bag of 23 kg, and Business and First include 2 bags of 32 kg each, according to Qatar Airways' baggage page.",
      },
    ],
    sources: [
      { label: "Qatar Airways: baggage allowance", url: "https://www.qatarairways.com/en-us/baggage/allowance.html" },
      { label: "Qatar Airways: Qatar Stopover", url: "https://www.qatarairways.com/en/offers/qatar-stopover.html" },
      { label: "Simple Flying: Qatar Airways US network (Jun 2026)", url: "https://simpleflying.com/massive-expansion-qatar-airways-adds-new-12th-us-route/" },
    ],
  },
  lufthansa: {
    checked: "2026-11-26",
    hub: "Frankfurt (FRA) and Munich (MUC)",
    alliance: "Star Alliance",
    summary:
      "Lufthansa flies from about 19 US airports to Frankfurt and Munich (some only in summer), with connections across Europe, India and the Middle East. On long-haul flights the Economy Light fare includes no checked bag; Economy includes 1 bag of 23 kg and Business 2 bags of 32 kg.",
    usAirports: [
      { code: "ATL", city: "Atlanta" },
      { code: "AUS", city: "Austin" },
      { code: "BOS", city: "Boston" },
      { code: "CLT", city: "Charlotte" },
      { code: "ORD", city: "Chicago" },
      { code: "DFW", city: "Dallas" },
      { code: "DEN", city: "Denver" },
      { code: "DTW", city: "Detroit" },
      { code: "IAH", city: "Houston" },
      { code: "LAX", city: "Los Angeles" },
      { code: "MIA", city: "Miami" },
      { code: "JFK", city: "New York" },
      { code: "EWR", city: "Newark" },
      { code: "RDU", city: "Raleigh-Durham" },
      { code: "SAN", city: "San Diego" },
      { code: "SFO", city: "San Francisco" },
      { code: "SEA", city: "Seattle" },
      { code: "STL", city: "St. Louis", note: "summer only" },
      { code: "IAD", city: "Washington, DC" },
    ],
    usNote:
      "Lufthansa's own flights only (not SWISS, Austrian or other group airlines). Some routes are seasonal; check your dates.",
    baggage: [
      { fare: "Economy Light", checked: "No free checked bag", cabin: "1 personal item + 1 bag, 8 kg" },
      { fare: "Economy", checked: "1 bag, 23 kg", cabin: "1 personal item + 1 bag, 8 kg" },
      { fare: "Premium Economy", checked: "2 bags, 23 kg each (Light: 1)", cabin: "1 personal item + 1 bag, 8 kg" },
      { fare: "Business", checked: "2 bags, 32 kg each (Light: 1)", cabin: "1 personal item + 2 bags, 8 kg each" },
      { fare: "First", checked: "3 bags, 32 kg each", cabin: "1 personal item + 2 bags, 8 kg each" },
    ],
    baggageNote: "Long-haul allowances from Lufthansa's baggage page. Status in Miles & More or Star Alliance can add bags.",
    tips: [
      {
        title: "Economy Light has no checked bag",
        text: "Lufthansa's cheapest long-haul fare does not include a checked bag. Add the cost of a bag before comparing it with other airlines.",
      },
      {
        title: "New Allegris cabins",
        text: "Lufthansa's new Allegris seats are on some A350s from Munich and 787s from Frankfurt, including some Chicago, New York, Newark, San Diego, Austin and Los Angeles flights. Look for \"Allegris\" when you choose a flight; many business seats cost extra to select.",
      },
    ],
    destinations: ["london", "paris", "rome", "istanbul", "delhi", "mumbai"],
    extraFaqs: [
      {
        q: "Does Lufthansa Economy include a checked bag from the US?",
        a: "Economy does (1 bag of 23 kg), but the Economy Light fare does not include any free checked bag on long-haul flights, according to Lufthansa's baggage page.",
      },
      {
        q: "Which US cities does Lufthansa fly from?",
        a: "About 19 US airports, including Atlanta, Boston, Chicago, Dallas, Denver, Houston, Los Angeles, Miami, New York, Newark, San Francisco, Seattle and Washington, with St. Louis in summer only.",
      },
    ],
    sources: [
      { label: "Lufthansa: free baggage allowance", url: "https://www.lufthansa.com/us/en/prepare-for-your-trip/baggage/free-baggage" },
      { label: "Wikipedia: Lufthansa destinations", url: "https://en.wikipedia.org/wiki/List_of_Lufthansa_destinations" },
      { label: "One Mile at a Time: Lufthansa Allegris routes", url: "https://onemileatatime.com/guides/lufthansa-allegris-routes/" },
    ],
  },
  "turkish-airlines": {
    checked: "2026-11-26",
    hub: "Istanbul Airport (IST)",
    alliance: "Star Alliance",
    summary:
      "Turkish Airlines flies nonstop from 14 US airports to Istanbul, about 10 hours from the East Coast and 13 to 14 hours from the West Coast, with one of the widest onward networks to Europe, the Middle East, Africa and Asia. Business includes 2 bags of 32 kg and 2 cabin bags.",
    usAirports: [
      { code: "ATL", city: "Atlanta" },
      { code: "BOS", city: "Boston" },
      { code: "ORD", city: "Chicago" },
      { code: "DFW", city: "Dallas" },
      { code: "DEN", city: "Denver" },
      { code: "DTW", city: "Detroit" },
      { code: "IAH", city: "Houston" },
      { code: "LAX", city: "Los Angeles" },
      { code: "MIA", city: "Miami" },
      { code: "JFK", city: "New York" },
      { code: "EWR", city: "Newark" },
      { code: "SFO", city: "San Francisco" },
      { code: "SEA", city: "Seattle" },
      { code: "IAD", city: "Washington, DC" },
    ],
    usNote: "All nonstop to Istanbul. Frequencies vary by season.",
    baggage: [
      { fare: "Economy", checked: "Bags up to 23 kg each; number depends on fare", cabin: "1 bag 8 kg + 1 personal item 4 kg" },
      { fare: "Business", checked: "Bags up to 32 kg each", cabin: "2 bags 8 kg each + 1 personal item 4 kg" },
    ],
    baggageNote:
      "Turkish Airlines' baggage page lists the weight per bag; the number of bags depends on your fare. Check \"baggage\" on the fare you choose before paying. Star Alliance Gold members get an extra bag.",
    tips: [
      {
        title: "Free Istanbul tour on a long layover",
        text: "Touristanbul is a free guided city tour for international connecting passengers with a layover of 6 to 24 hours in Istanbul.",
      },
      {
        title: "Time difference",
        text: "Turkey is on UTC+3 all year: 7 hours ahead of New York in summer and 8 hours in winter.",
      },
    ],
    destinations: ["istanbul", "lagos", "accra", "london", "rome", "delhi"],
    extraFaqs: [
      {
        q: "Which US cities does Turkish Airlines fly from?",
        a: "Atlanta, Boston, Chicago, Dallas, Denver, Detroit, Houston, Los Angeles, Miami, New York JFK, Newark, San Francisco, Seattle and Washington Dulles, all nonstop to Istanbul.",
      },
      {
        q: "What is Touristanbul?",
        a: "A free guided city tour run by Turkish Airlines for international connecting passengers with a 6 to 24 hour layover in Istanbul.",
      },
    ],
    sources: [
      { label: "Turkish Airlines: checked baggage", url: "https://www.turkishairlines.com/en-us/any-questions/checked-baggage/" },
      { label: "Turkish Airlines: Touristanbul", url: "https://www.turkishairlines.com/en-us/flights/fly-different/touristanbul/" },
      { label: "Wikipedia: Turkish Airlines destinations", url: "https://en.wikipedia.org/wiki/List_of_Turkish_Airlines_destinations" },
    ],
  },
  "singapore-airlines": {
    checked: "2026-11-26",
    hub: "Singapore Changi (SIN)",
    alliance: "Star Alliance",
    summary:
      "Singapore Airlines flies nonstop from 5 US airports to Singapore: New York JFK, Newark, Los Angeles, San Francisco and Seattle. The New York and Newark nonstops (about 19 hours) have no Economy cabin, only Premium Economy and Business. On US routes Economy includes 2 bags of 23 kg and Business 2 bags of 32 kg.",
    usAirports: [
      { code: "JFK", city: "New York", note: "daily, about 19h 15m, no Economy" },
      { code: "EWR", city: "Newark", note: "daily, about 19h 10m, no Economy" },
      { code: "LAX", city: "Los Angeles", note: "about 17h 50m" },
      { code: "SFO", city: "San Francisco", note: "twice daily, about 17h 30m" },
      { code: "SEA", city: "Seattle", note: "about 17h" },
    ],
    usNote:
      "Flight times are the longest scheduled times, US to Singapore. Singapore Airlines also flies one-stop from New York via Frankfurt and from Los Angeles via Tokyo.",
    baggage: [
      { fare: "Economy and Premium Economy", checked: "2 bags, 23 kg each", cabin: "1 bag, 7 kg" },
      { fare: "Business and First / Suites", checked: "2 bags, 32 kg each", cabin: "2 bags, 7 kg each" },
    ],
    baggageNote: "Allowances for flights to or from the USA and Canada. Each checked bag can be up to 158 cm (length + width + height).",
    tips: [
      {
        title: "No Economy on the New York nonstops",
        text: "The A350-900ULR used from JFK and Newark has 161 seats: 67 Business and 94 Premium Economy. For Economy, fly via Frankfurt or from the West Coast.",
      },
      {
        title: "West Coast is cheaper",
        text: "In KAYAK's fare data, typical round trips to Singapore were about $840–$920 from San Francisco and Los Angeles versus about $1,250 from New York. See our Singapore page for the month-by-month fares.",
      },
    ],
    destinations: ["singapore", "tokyo", "manila", "ho-chi-minh-city"],
    extraFaqs: [
      {
        q: "Does Singapore Airlines have Economy on the New York to Singapore nonstop?",
        a: "No. The nonstop JFK and Newark flights use the A350-900ULR, which has only Business and Premium Economy seats. Economy travellers can fly one-stop via Frankfurt or nonstop from Los Angeles, San Francisco or Seattle.",
      },
      {
        q: "Which US cities does Singapore Airlines fly nonstop from?",
        a: "New York JFK, Newark, Los Angeles, San Francisco and Seattle.",
      },
    ],
    sources: [
      { label: "Singapore Airlines: checked baggage (US)", url: "https://www.singaporeair.com/en_UK/us/travel-info/baggage/checked-baggage/" },
      { label: "Singapore Airlines: cabin baggage", url: "https://www.singaporeair.com/en_UK/us/travel-info/baggage/cabin-baggage/" },
      { label: "Simple Flying: Singapore Airlines ultra-long-haul routes (Feb 2026)", url: "https://simpleflying.com/up-to-19-hour-nonstop-flights-singapore-airlines-10-new-ultra-long-routes-in-2026/" },
    ],
  },
  "air-india": {
    checked: "2026-11-27",
    hub: "Delhi Indira Gandhi International (DEL)",
    alliance: "Star Alliance",
    summary:
      "Air India flies nonstop from New York JFK, Newark and San Francisco to Delhi and Mumbai. On US routes Economy Classic and Flex fares include 2 checked bags of 23 kg, Economy Value includes 1, and Business includes 2 bags of 32 kg.",
    usAirports: [
      { code: "JFK", city: "New York", note: "Delhi daily (A350-900), Mumbai daily (777-300ER)" },
      { code: "EWR", city: "Newark", note: "Mumbai 3 a week; Delhi seasonal" },
      { code: "SFO", city: "San Francisco", note: "Delhi; SFO–Delhi makes a stop" },
    ],
    usNote:
      "Schedules as reported in November 2026. Chicago has been suspended since June 2026, Washington Dulles ended in September 2025, and Mumbai/Bengaluru–San Francisco ended in March 2026. Newark–Delhi was due to return in January 2027 in one report, so check before you book.",
    baggage: [
      { fare: "Economy Value", checked: "1 bag, 23 kg", cabin: "1 bag, 7 kg" },
      { fare: "Economy Classic / Flex", checked: "2 bags, 23 kg each", cabin: "1 bag, 7 kg" },
      { fare: "Premium Economy", checked: "2 bags, 23 kg each", cabin: "1 bag, 7 kg" },
      { fare: "Business and First", checked: "2 bags, 32 kg each", cabin: "Check your fare rules" },
    ],
    baggageNote:
      "Flights to and from the USA and Canada use the piece concept (a number of bags, each with a weight limit). Allowances can differ by fare, so check your fare rules before you pay.",
    tips: [
      {
        title: "Check each direction",
        text: "A route can be nonstop one way and not the other. In November 2026, Delhi–San Francisco was nonstop but San Francisco–Delhi stopped on the way, so look at the flight time on both legs.",
      },
      {
        title: "Connecting in Delhi",
        text: "On one ticket with bags checked through, an international-to-international connection at Delhi Terminal 3 doesn't need an Indian visa. Connecting to a domestic flight does.",
      },
    ],
    destinations: ["delhi", "mumbai"],
    extraFaqs: [
      {
        q: "Which US cities does Air India fly nonstop from?",
        a: "New York JFK, Newark and San Francisco, based on schedules we checked on Nov 27, 2026. Chicago and Washington Dulles flights are suspended or ended.",
      },
      {
        q: "Does Air India fly nonstop from New York to Delhi?",
        a: "Yes. Air India flies Delhi–New York JFK daily on an A350-900, and it was nonstop in both directions in November 2026. It also flies Mumbai–New York JFK daily.",
      },
      {
        q: "How many bags can I check on Air India from the US?",
        a: "Economy Classic and Flex include 2 bags of 23 kg each, Economy Value includes 1 bag of 23 kg, and Business includes 2 bags of 32 kg each on US routes.",
      },
      {
        q: "Can I use United miles on Air India?",
        a: "Yes. Air India is a Star Alliance member, so you can earn and redeem United MileagePlus miles on its flights.",
      },
    ],
    sources: [],
  },
  "british-airways": {
    checked: "2026-11-27",
    hub: "London Heathrow (LHR)",
    alliance: "oneworld",
    summary:
      "British Airways flies nonstop to London from 27 US airports, mostly to Heathrow. On transatlantic routes Basic economy includes no checked bag, Standard economy includes 1 bag of 23 kg, Premium Economy includes 2, and Club (business) includes 2 bags of 32 kg.",
    usAirports: [
      { code: "ATL", city: "Atlanta" },
      { code: "AUS", city: "Austin" },
      { code: "BWI", city: "Baltimore" },
      { code: "BOS", city: "Boston" },
      { code: "ORD", city: "Chicago" },
      { code: "CVG", city: "Cincinnati" },
      { code: "DFW", city: "Dallas" },
      { code: "DEN", city: "Denver" },
      { code: "IAH", city: "Houston" },
      { code: "LAS", city: "Las Vegas" },
      { code: "LAX", city: "Los Angeles" },
      { code: "MIA", city: "Miami" },
      { code: "BNA", city: "Nashville" },
      { code: "MSY", city: "New Orleans" },
      { code: "JFK", city: "New York" },
      { code: "EWR", city: "Newark" },
      { code: "MCO", city: "Orlando" },
      { code: "PHL", city: "Philadelphia" },
      { code: "PHX", city: "Phoenix" },
      { code: "PIT", city: "Pittsburgh" },
      { code: "PDX", city: "Portland" },
      { code: "STL", city: "St. Louis", note: "seasonal" },
      { code: "SAN", city: "San Diego" },
      { code: "SFO", city: "San Francisco" },
      { code: "SEA", city: "Seattle" },
      { code: "TPA", city: "Tampa" },
      { code: "IAD", city: "Washington, DC" },
    ],
    usNote:
      "Destinations listed as of autumn 2026; some are seasonal and frequencies change. St. Louis launched in April 2026 and Tampa moved from Gatwick to Heathrow in October 2026.",
    baggage: [
      { fare: "Economy Basic", checked: "None included", cabin: "1 bag + 1 handbag" },
      { fare: "Economy Standard", checked: "1 bag, 23 kg", cabin: "1 bag + 1 handbag" },
      { fare: "Premium Economy", checked: "2 bags, 23 kg each", cabin: "1 bag + 1 handbag" },
      { fare: "Club (business)", checked: "2 bags, 32 kg each", cabin: "1 bag + 1 handbag" },
      { fare: "First", checked: "3 bags, 32 kg each", cabin: "1 bag + 1 handbag" },
    ],
    baggageNote:
      "Cabin bag up to 56 x 45 x 25 cm and handbag up to 40 x 30 x 15 cm on every fare. No checked bag can weigh more than 32 kg.",
    tips: [
      {
        title: "Basic fares have no checked bag",
        text: "If you're checking a bag, compare a Standard fare with Basic plus a paid bag. Adding a bag online before you fly is usually cheaper than paying at the airport.",
      },
      {
        title: "Heathrow connections and the UK ETA",
        text: "BA's minimum connection time at Heathrow is 75 minutes. US citizens need a UK Electronic Travel Authorisation (ETA) to enter the UK; check gov.uk for the current rules if you're only connecting.",
      },
    ],
    destinations: ["london", "rome", "paris", "lagos", "accra", "delhi", "mumbai"],
    extraFaqs: [
      {
        q: "Which US cities have nonstop British Airways flights to London?",
        a: "27 US airports, including New York JFK, Newark, Boston, Chicago, Washington Dulles, Los Angeles, San Francisco, Miami, Dallas, Houston, Atlanta and Seattle, based on BA's network in autumn 2026.",
      },
      {
        q: "Does a British Airways Basic fare include a checked bag?",
        a: "No. Basic economy on transatlantic flights includes a cabin bag and a handbag only. Standard economy includes 1 checked bag of 23 kg.",
      },
      {
        q: "What is the difference between Club Suite and Club World?",
        a: "Club Suite is BA's newer business seat, with a door and direct aisle access in a 1-2-1 layout. Club World is the older seat, with more seats across and some seats facing backwards. Most BA long-haul aircraft had Club Suite by November 2026.",
      },
      {
        q: "Do I need a UK ETA to connect at Heathrow?",
        a: "US citizens need an ETA to enter the UK, which has been required since February 2026. Rules for passengers who stay airside while connecting can change, so check gov.uk before you travel.",
      },
    ],
    sources: [],
  },
  "etihad-airways": {
    checked: "2026-11-27",
    hub: "Zayed International, Abu Dhabi (AUH)",
    alliance: "No alliance (codeshare partner of American Airlines)",
    summary:
      "Etihad flies nonstop from 6 US airports to Abu Dhabi: Atlanta, Boston, Charlotte, Chicago, New York JFK and Washington Dulles. On US routes Economy (except Basic) includes 2 checked bags of 23 kg, Basic includes none, and Business includes 2 bags of 32 kg.",
    usAirports: [
      { code: "ATL", city: "Atlanta", note: "A350-1000" },
      { code: "BOS", city: "Boston", note: "787-9" },
      { code: "CLT", city: "Charlotte", note: "new in 2026, 787-9" },
      { code: "ORD", city: "Chicago", note: "787-9" },
      { code: "JFK", city: "New York", note: "twice daily, A350-1000" },
      { code: "IAD", city: "Washington, DC", note: "daily, 787-9" },
    ],
    usNote:
      "Schedules as reported in autumn 2026; frequencies change by season. Etihad doesn't currently fly to Los Angeles, Dallas or Florida.",
    baggage: [
      { fare: "Economy Basic", checked: "None included", cabin: "1 bag, 7 kg" },
      { fare: "Economy Value / Comfort / Deluxe", checked: "2 bags, 23 kg each", cabin: "1 bag, 7 kg" },
      { fare: "Business", checked: "2 bags, 32 kg each", cabin: "Check your fare rules" },
    ],
    baggageNote:
      "Allowances for flights to and from the US. Extra bags are up to 65% cheaper if you buy them online at least 30 hours before departure.",
    tips: [
      {
        title: "US preclearance",
        text: "On flights to the US you clear US immigration and customs in Abu Dhabi. Be at preclearance at least 2 hours before departure (90 minutes in Business); it closes 1 hour before.",
      },
      {
        title: "Free Abu Dhabi stopover",
        text: "Eligible return Etihad trips connecting in Abu Dhabi can include up to 2 free hotel nights. Check the terms on Etihad's stopover page before you book.",
      },
    ],
    destinations: ["mumbai", "delhi", "dubai"],
    extraFaqs: [
      {
        q: "Which US cities does Etihad fly from?",
        a: "Atlanta, Boston, Charlotte, Chicago O'Hare, New York JFK and Washington Dulles, all nonstop to Abu Dhabi, based on schedules we checked on Nov 27, 2026.",
      },
      {
        q: "Do I clear US customs in Abu Dhabi?",
        a: "Yes. Etihad flights to the US use US Customs and Border Protection preclearance at Zayed International, so you clear US immigration and customs before you board.",
      },
      {
        q: "Does Etihad Economy Basic include a checked bag?",
        a: "No. Basic includes no checked bag. Value, Comfort and Deluxe Economy fares include 2 bags of 23 kg each on US routes.",
      },
      {
        q: "Is Etihad in an airline alliance?",
        a: "No. Etihad isn't in Star Alliance, oneworld or SkyTeam, but it codeshares with partners including American Airlines.",
      },
    ],
    sources: [],
  },
  "cathay-pacific": {
    checked: "2026-11-27",
    hub: "Hong Kong International (HKG)",
    alliance: "oneworld",
    summary:
      "Cathay Pacific flies nonstop to Hong Kong from 7 US cities: Boston, Chicago, Dallas, Los Angeles, New York JFK, San Francisco and Seattle. On US routes Economy Light includes 1 checked bag of 23 kg, Economy Essential and Flex include 2, and Business includes 2 bags of 32 kg.",
    usAirports: [
      { code: "BOS", city: "Boston", note: "daily" },
      { code: "ORD", city: "Chicago" },
      { code: "DFW", city: "Dallas", note: "daily, up to 17h15m" },
      { code: "LAX", city: "Los Angeles", note: "up to 3 a day" },
      { code: "JFK", city: "New York", note: "up to 3 a day" },
      { code: "SFO", city: "San Francisco", note: "twice daily" },
      { code: "SEA", city: "Seattle", note: "seasonal; daily from Mar 2027" },
    ],
    usNote:
      "Schedules as reported in autumn 2026. At New York JFK, Cathay moves from Terminal 8 to Terminal 6 from Dec 15, 2026, so check your terminal.",
    baggage: [
      { fare: "Economy Light", checked: "1 bag, 23 kg", cabin: "1 bag, 7 kg" },
      { fare: "Economy Essential / Flex", checked: "2 bags, 23 kg each", cabin: "1 bag, 7 kg" },
      { fare: "Premium Economy", checked: "2 bags, 23 kg each", cabin: "1 bag, 7 kg" },
      { fare: "Business and First", checked: "2 bags, 32 kg each", cabin: "2 bags, 7 kg each" },
    ],
    baggageNote:
      "Flights to and from the Americas use the piece concept. Use Cathay's baggage calculator to confirm your exact allowance; prepaid extra bags are cheaper at least 24 hours before departure.",
    tips: [
      {
        title: "Check the aircraft",
        text: "The same flight number can have the new Aria Suite or the older business seat. Look at the seat map before you book if the cabin matters to you.",
      },
      {
        title: "Hong Kong entry",
        text: "US passport holders can usually visit Hong Kong visa-free for up to 90 days, so a stopover is easy to add.",
      },
    ],
    destinations: ["manila", "ho-chi-minh-city", "tokyo", "singapore", "delhi", "mumbai"],
    extraFaqs: [
      {
        q: "Which US cities does Cathay Pacific fly nonstop from?",
        a: "Boston, Chicago, Dallas, Los Angeles, New York JFK, San Francisco and Seattle, all to Hong Kong, based on schedules we checked on Nov 27, 2026. Seattle is seasonal until it goes daily in March 2027.",
      },
      {
        q: "What is Cathay Pacific's longest flight?",
        a: "Dallas–Hong Kong, at up to about 17 hours 15 minutes, launched in April 2025.",
      },
      {
        q: "Which Cathay Pacific flights have the Aria Suite?",
        a: "Selected refitted Boeing 777-300ERs, including some Los Angeles and San Francisco flights in winter 2026. Check the seat map for your flight.",
      },
      {
        q: "Is Cathay Pacific in oneworld?",
        a: "Yes. Cathay Pacific is a founding member of oneworld, so you can earn American AAdvantage and Alaska miles on its flights.",
      },
    ],
    sources: [],
  },
  "eva-air": {
    checked: "2026-11-27",
    hub: "Taiwan Taoyuan International (TPE)",
    alliance: "Star Alliance",
    summary:
      "EVA Air flies nonstop to Taipei from 8 US airports: Chicago, Dallas, Houston, Los Angeles, New York JFK, San Francisco, Seattle and Washington Dulles. On US routes most Economy fares include 2 checked bags of 23 kg, the Discount fare includes 1, and Royal Laurel business includes 2 bags of 32 kg.",
    usAirports: [
      { code: "ORD", city: "Chicago" },
      { code: "DFW", city: "Dallas", note: "since Oct 2025, 787-9" },
      { code: "IAH", city: "Houston" },
      { code: "LAX", city: "Los Angeles" },
      { code: "JFK", city: "New York" },
      { code: "SFO", city: "San Francisco" },
      { code: "SEA", city: "Seattle" },
      { code: "IAD", city: "Washington, DC", note: "since Jun 2026, 4 a week" },
    ],
    usNote:
      "EVA has 10 North American gateways in total, including Vancouver and Toronto. Frequencies change by season.",
    baggage: [
      { fare: "Economy Discount", checked: "1 bag, 23 kg", cabin: "1 bag, 7 kg" },
      { fare: "Economy Basic / Standard / Up", checked: "2 bags, 23 kg each", cabin: "1 bag, 7 kg" },
      { fare: "Premium Economy", checked: "2 bags, 23 kg each", cabin: "1 bag, 7 kg" },
      { fare: "Royal Laurel (business)", checked: "2 bags, 32 kg each", cabin: "2 bags, 7 kg each" },
    ],
    baggageNote:
      "US routes use the piece concept; each checked bag can be up to 158 cm (length + width + height). Every cabin also allows 1 personal item.",
    tips: [
      {
        title: "Free Taipei transit tour",
        text: "With a layover of 7 to 24 hours, US passport holders can join Taiwan's free half-day transit tour from Taoyuan. Book 5 to 90 days ahead.",
      },
      {
        title: "Check the fare family",
        text: "Baggage and change rules depend on the fare family (Discount, Basic, Standard or Up), not only the cabin. Discount Economy includes just 1 checked bag.",
      },
    ],
    destinations: ["ho-chi-minh-city", "manila", "tokyo", "singapore", "delhi"],
    extraFaqs: [
      {
        q: "Which US cities does EVA Air fly nonstop from?",
        a: "Chicago, Dallas, Houston, Los Angeles, New York JFK, San Francisco, Seattle and Washington Dulles, all to Taipei, based on information we checked on Nov 27, 2026.",
      },
      {
        q: "Does EVA Air have first class?",
        a: "No. Royal Laurel business class, with fully flat seats and direct aisle access, is EVA's top cabin on long-haul flights.",
      },
      {
        q: "Do US citizens need a visa for Taiwan?",
        a: "No, for visits of up to 90 days. You need a valid passport and a return or onward ticket.",
      },
      {
        q: "Is there a Hello Kitty flight from the US?",
        a: "Yes. EVA's Hello Kitty 777-300ER has flown Chicago–Taipei (BR55/56) about three times a week. There's no extra charge, but the aircraft can change.",
      },
    ],
    sources: [],
  },
  "philippine-airlines": {
    checked: "2026-11-27",
    hub: "Manila Ninoy Aquino International (MNL)",
    alliance: "Joining oneworld (expected 2027)",
    summary:
      "Philippine Airlines flies nonstop to Manila from Los Angeles, San Francisco, New York JFK, Seattle, Chicago and Honolulu, plus Guam and Saipan. On US routes every Economy fare includes 2 checked bags of 23 kg, Premium Economy includes 2 bags of 25 kg, and Business includes 2 bags of 32 kg.",
    usAirports: [
      { code: "LAX", city: "Los Angeles", note: "18 a week" },
      { code: "SFO", city: "San Francisco", note: "daily, A350-1000" },
      { code: "JFK", city: "New York", note: "5 a week from Dec 2, 2026" },
      { code: "SEA", city: "Seattle", note: "5 a week" },
      { code: "ORD", city: "Chicago", note: "3 a week, since Nov 9, 2026" },
      { code: "HNL", city: "Honolulu" },
      { code: "GUM", city: "Guam", note: "daily" },
    ],
    usNote:
      "Schedules as reported in late 2026; frequencies change by season. PAL also flies to Saipan twice a week.",
    baggage: [
      { fare: "Economy (Supersaver, Saver, Value, Flex)", checked: "2 bags, 23 kg each", cabin: "1 bag, 7 kg" },
      { fare: "Premium Economy", checked: "2 bags, 25 kg each", cabin: "1 bag, 7 kg" },
      { fare: "Business", checked: "2 bags, 32 kg each", cabin: "Check your fare rules" },
    ],
    baggageNote:
      "Allowances for US and Canada routes from PAL's baggage table. Carry-on bags can be up to 56 x 36 x 23 cm, plus one small personal item.",
    tips: [
      {
        title: "Register for eTravel",
        text: "Everyone arriving in or leaving the Philippines must register free at etravel.gov.ph within 72 hours before the flight and show the QR code.",
      },
      {
        title: "Allow time in Manila",
        text: "PAL asks international passengers to arrive at Manila airport at least 4 hours before departure. All PAL international flights use Terminal 1.",
      },
    ],
    destinations: ["manila", "tokyo", "singapore", "ho-chi-minh-city"],
    extraFaqs: [
      {
        q: "Which US cities have nonstop Philippine Airlines flights?",
        a: "Los Angeles, San Francisco, New York JFK, Seattle, Chicago and Honolulu, plus Guam and Saipan, based on schedules we checked on Nov 27, 2026. Chicago started on Nov 9, 2026.",
      },
      {
        q: "How many bags can I check on Philippine Airlines from the US?",
        a: "Every Economy fare includes 2 bags of 23 kg each, Premium Economy includes 2 bags of 25 kg each, and Business includes 2 bags of 32 kg each on US routes.",
      },
      {
        q: "Is Philippine Airlines in oneworld?",
        a: "Not yet. PAL accepted an invitation in June 2026 to join oneworld, expected in 2027. It already codeshares with American Airlines.",
      },
      {
        q: "Do I need eTravel to fly to the Philippines?",
        a: "Yes. Register free at etravel.gov.ph within 72 hours before arrival and keep the QR code ready to show.",
      },
    ],
    sources: [],
  },
};
