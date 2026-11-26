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
    destinations: ["london", "paris", "delhi", "mumbai"],
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
    destinations: ["lagos", "dubai", "london", "delhi"],
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
    destinations: ["singapore", "tokyo"],
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
};
