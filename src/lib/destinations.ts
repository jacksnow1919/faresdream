/**
 * Destination guides for /destinations/$slug.
 * Facts are general and stable (airports, transport, seasons). No prices: fares change daily,
 * so pages send people to live search instead of quoting a number we can't stand behind.
 * Review these at least twice a year; airline routes in particular change.
 */
export type DestinationAirport = { code: string; name: string; note: string };

export type Destination = {
  slug: string;
  city: string;
  country: string;
  /** Main airport code, used for search links and route matching. */
  code: string;
  airports: DestinationAirport[];
  /** Unsplash photo id (same source as the home page cards). Without one the page shows a plain brand header. */
  photo?: string;
  intro: string;
  bestTime: string;
  cheapest: string;
  fromUs: string;
  transfer: string;
  tips: string[];
  region: "Europe" | "Middle East" | "Asia" | "Africa" | "Americas";
};

export const destinations: Destination[] = [
  {
    slug: "london",
    city: "London",
    country: "United Kingdom",
    code: "LHR",
    region: "Europe",
    photo: "1454793147212-9e7e57e89a4f",
    airports: [
      { code: "LHR", name: "Heathrow", note: "Most long-haul flights from the US land here." },
      { code: "LGW", name: "Gatwick", note: "Some transatlantic and many low-cost European flights." },
      { code: "STN", name: "Stansted", note: "Mainly low-cost flights within Europe." },
      { code: "LCY", name: "London City", note: "Small airport close to the financial district." },
    ],
    intro:
      "London is one of the busiest routes from the United States, with nonstop flights from most large US cities. Because so many airlines compete, comparing fares across carriers and London's different airports often makes a real difference to the price.",
    bestTime:
      "Late spring (May–June) and early autumn (September) usually bring mild weather and fewer crowds than July and August.",
    cheapest:
      "Fares are often lowest from mid-January to March, outside school holidays. Summer, Thanksgiving week and the Christmas period are normally the most expensive times to fly.",
    fromUs:
      "British Airways, Virgin Atlantic, American, United and Delta fly nonstop to Heathrow from cities such as New York, Boston, Washington, Chicago, Miami, Dallas and Los Angeles. A New York–London flight takes about 7 hours eastbound.",
    transfer:
      "From Heathrow, the Heathrow Express reaches Paddington in about 15 minutes, the Elizabeth line runs across central London, and the Piccadilly line (Underground) is the cheapest rail option but slower. From Gatwick, the Gatwick Express and Thameslink trains run into central London.",
    tips: [
      "Check Gatwick as well as Heathrow; the cheapest fare is not always into the main airport.",
      "Overnight eastbound flights arrive in the morning, so plan your first day lightly.",
      "UK entry rules can change; check gov.uk for the latest requirements before you fly.",
    ],
  },
  {
    slug: "paris",
    city: "Paris",
    country: "France",
    code: "CDG",
    region: "Europe",
    photo: "1439393161192-32360eb753f1",
    airports: [
      { code: "CDG", name: "Charles de Gaulle", note: "Main hub; nearly all flights from the US." },
      { code: "ORY", name: "Orly", note: "South of the city; mostly European and domestic flights." },
    ],
    intro:
      "Paris has nonstop service from many US cities, and Charles de Gaulle is also a major connecting hub for the rest of Europe, Africa and the Middle East.",
    bestTime:
      "April to June and September to October usually mean pleasant weather. August is quieter in the city because many locals are on holiday.",
    cheapest:
      "In KAYAK's fare data, January and February are the cheapest months from every US city we checked, and November is good value too. June is usually the most expensive month, followed by the Christmas period.",
    fromUs:
      "Air France, Delta, United and American fly nonstop to Charles de Gaulle from cities including New York, Atlanta, Boston, Washington, Chicago, Miami and Los Angeles. New York–Paris takes about 7 to 7.5 hours.",
    transfer:
      "RER B trains run from Charles de Gaulle to central Paris in roughly 35–50 minutes. From Orly, Metro line 14 now connects the airport directly to the city centre.",
    tips: [
      "Compare one-way combinations: flying into Paris and home from another European city can work out cheaper.",
      "Strikes occasionally affect French transport; check your airline's status page before you travel.",
    ],
  },
  {
    slug: "dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    code: "DXB",
    region: "Middle East",
    photo: "1635857161777-2383f2e4a82d",
    airports: [
      { code: "DXB", name: "Dubai International", note: "Main airport and Emirates' hub." },
      { code: "DWC", name: "Al Maktoum (Dubai World Central)", note: "Second airport south of the city; a few airlines use it." },
    ],
    intro:
      "Dubai is both a destination and one of the world's biggest connecting hubs, which is why so many trips from the US to India, Africa and Asia stop here. Flying nonstop or stopping over, comparing carriers is the easiest way to save.",
    bestTime:
      "November to March is the most comfortable time to visit, with warm days and cool evenings.",
    cheapest:
      "June to August is very hot, and fares and hotel rates are often lower then. Christmas, New Year and big events push prices up.",
    fromUs:
      "Emirates flies nonstop to Dubai from many US cities, including New York, Newark, Boston, Washington Dulles, Chicago, Houston, Dallas, Miami, Orlando, Seattle, San Francisco and Los Angeles. From the East Coast the flight is about 12–13 hours.",
    transfer:
      "The Dubai Metro Red Line stops at Terminals 1 and 3 and reaches Downtown Dubai in roughly 20–30 minutes. Taxis are metered and wait outside every terminal.",
    tips: [
      "If you're flying on to India or Africa, a Dubai stopover can sometimes cost little or nothing extra. Ask an agent.",
      "Check visa rules for your passport on the official UAE government site before you book.",
    ],
  },
  {
    slug: "delhi",
    city: "Delhi",
    country: "India",
    code: "DEL",
    region: "Asia",
    airports: [
      { code: "DEL", name: "Indira Gandhi International", note: "International flights use Terminal 3." },
    ],
    intro:
      "Delhi is the main gateway for families and business travellers flying between the US and North India. Nonstop flights save hours, but one-stop routes through Europe or the Gulf are often cheaper, so it pays to compare both.",
    bestTime:
      "October to March has the most comfortable weather. April to June is very hot, and July to September is monsoon season.",
    cheapest:
      "Demand peaks around Diwali and from mid-December to early January, when fares rise sharply. Booking those dates well in advance helps; spring and the monsoon months are often cheaper.",
    fromUs:
      "Air India flies nonstop to Delhi from several US cities, and American and United also run nonstop flights from the New York area. Many travellers connect through London, Frankfurt, Dubai, Doha or Istanbul instead. Nonstop flights take roughly 14–16 hours.",
    transfer:
      "The Airport Express metro line runs from Terminal 3 to New Delhi railway station in about 20 minutes. Prepaid taxis and app cabs are available outside arrivals.",
    tips: [
      "Check baggage allowances carefully. Many fares to India include two checked bags, but not all do.",
      "Travelling for an emergency or with a student visa? Call us; some airlines have specific fares and rules.",
      "Indian visa and e-visa rules change; check the official Indian government visa site before booking.",
    ],
  },
  {
    slug: "mumbai",
    city: "Mumbai",
    country: "India",
    code: "BOM",
    region: "Asia",
    airports: [
      { code: "BOM", name: "Chhatrapati Shivaji Maharaj International", note: "International flights use Terminal 2." },
    ],
    intro:
      "Mumbai is India's financial capital and the main gateway to West India. Travellers from the US either fly nonstop from the New York area or connect in Europe or the Gulf.",
    bestTime:
      "November to February brings the driest, most comfortable weather. June to September is heavy monsoon season.",
    cheapest:
      "February to April is cheapest from most US cities. December is the most expensive month, and June and July are also expensive because of US summer holidays.",
    fromUs:
      "In KAYAK's route data, Air India is the only nonstop option from the US, from the New York area (JFK and Newark), at about 14h 45m. From every other US city you connect, usually in Europe (Copenhagen, Paris, Amsterdam, Istanbul) or the Gulf (Dubai, Doha, Abu Dhabi). The cheapest fares are often on one-stop carriers such as Scandinavian Airlines, Emirates, Qatar Airways and Royal Jordanian.",
    transfer:
      "Prepaid taxis and app cabs run from Terminal 2. Allow extra time at rush hour; traffic into South Mumbai can be heavy.",
    tips: [
      "Compare nearby dates: moving a holiday trip by a few days can change the fare a lot.",
      "Check your fare's baggage allowance before you pack gifts and extra luggage.",
    ],
  },
  {
    slug: "tokyo",
    city: "Tokyo",
    country: "Japan",
    code: "HND",
    region: "Asia",
    photo: "1714197279362-0d5b155bb974",
    airports: [
      { code: "HND", name: "Haneda", note: "Closest to the city centre; many US flights now use it." },
      { code: "NRT", name: "Narita", note: "About an hour east of the city; still served by several US routes." },
    ],
    intro:
      "Tokyo has two big international airports, and US airlines and Japanese carriers fly to both. Haneda is closer to the city, but Narita fares are sometimes lower, so search both.",
    bestTime:
      "Late March to May and October to November are the most popular times, for cherry blossoms and autumn leaves.",
    cheapest:
      "January and February (after New Year) and June are often cheaper. Cherry-blossom season and Golden Week (late April to early May) are usually the most expensive.",
    fromUs:
      "ANA, Japan Airlines, United, American and Delta fly nonstop to Tokyo from cities such as Los Angeles, San Francisco, Seattle, Chicago, Dallas, Houston, New York and Honolulu. West Coast flights take about 11–12 hours.",
    transfer:
      "From Haneda, the Keikyu line and Tokyo Monorail reach central Tokyo in about 15–30 minutes. From Narita, the Narita Express and Keisei Skyliner take roughly 40–60 minutes.",
    tips: [
      "Search with HND and NRT separately to see both airports' fares.",
      "Flights home to the US cross the date line, so you may land 'before' you took off.",
    ],
  },
  {
    slug: "singapore",
    city: "Singapore",
    country: "Singapore",
    code: "SIN",
    region: "Asia",
    photo: "1761138785953-a49d2488d8cd",
    airports: [{ code: "SIN", name: "Changi", note: "Singapore's only major airport." }],
    intro:
      "Singapore has some of the longest nonstop flights in the world from the US, and Changi is a popular stopover on the way to Southeast Asia and Australia.",
    bestTime:
      "Singapore is warm and humid all year. February to April tends to be a little drier.",
    cheapest:
      "In KAYAK's fare data, August and September are the cheapest months from most US cities and December is by far the most expensive. June and July are also expensive because of US summer holidays.",
    fromUs:
      "Singapore Airlines flies nonstop from Newark, New York JFK, Los Angeles, San Francisco and Seattle, and United flies nonstop from San Francisco. Newark–Singapore takes about 19 hours, one of the longest flights in the world.",
    transfer:
      "The MRT (metro) runs from Changi Airport station to the city in about 30–40 minutes, changing at Tanah Merah. Taxis take roughly 20–30 minutes to the centre.",
    tips: [
      "One-stop routes via Tokyo, Hong Kong or the Gulf can be much cheaper than nonstop flights.",
      "Changi has free things to do between flights, which makes a long layover easier.",
    ],
  },
  {
    slug: "cancun",
    city: "Cancún",
    country: "Mexico",
    code: "CUN",
    region: "Americas",
    photo: "1772656945540-77583e484667",
    airports: [{ code: "CUN", name: "Cancún International", note: "Gateway to Cancún, Playa del Carmen and Tulum." }],
    intro:
      "Cancún is one of the easiest beach trips from the US, with nonstop flights from dozens of cities and short flight times from the South and East Coast.",
    bestTime:
      "December to April is dry and sunny, which is why it's peak season.",
    cheapest:
      "Late August to early December (outside Thanksgiving) is usually cheaper. This overlaps with hurricane season (June–November), so consider travel insurance.",
    fromUs:
      "American, United, Delta, Southwest, JetBlue, Spirit and others fly nonstop to Cancún from many US cities. Miami–Cancún is under 1.5 hours; New York–Cancún about 4 hours.",
    transfer:
      "ADO buses run from the airport to downtown Cancún and Playa del Carmen. Many hotels offer shuttles, and taxis and pre-booked transfers are available outside arrivals.",
    tips: [
      "Spring break (March) fills flights quickly; book early if your dates are fixed.",
      "Tulum has its own new airport (TQO); compare it with Cancún if you're staying further south.",
    ],
  },
  {
    slug: "lagos",
    city: "Lagos",
    country: "Nigeria",
    code: "LOS",
    region: "Africa",
    airports: [{ code: "LOS", name: "Murtala Muhammed International", note: "Nigeria's busiest international airport." }],
    intro:
      "Lagos is the main gateway for travellers flying between the US and Nigeria. There are a few nonstop flights, and many one-stop options through Europe, the Gulf, Casablanca, Addis Ababa or Istanbul.",
    bestTime:
      "November to March is the dry season; December is the busiest month, with many people travelling home for Christmas.",
    cheapest:
      "December fares are usually the highest of the year, so book holiday trips early. Late January to May is often cheaper.",
    fromUs:
      "Delta (from Atlanta) and United (from Washington Dulles) have operated nonstop flights to Lagos; schedules change, so search for current options. One-stop flights on European, Gulf and African airlines are widely available.",
    transfer:
      "Use a pre-arranged pickup or a ride-hailing app from the airport. Allow plenty of time; Lagos traffic can be very heavy.",
    tips: [
      "For December travel, compare connections through different hubs; prices can vary widely.",
      "Check your baggage allowance; many fares to Nigeria include two checked bags, but not all.",
    ],
  },
];
