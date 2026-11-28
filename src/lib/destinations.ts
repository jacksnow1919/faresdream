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
      "In KAYAK's fare data, January–February and September–October are the cheapest times to fly from the US. Summer is very hot but flights are not cheap then, and December is the most expensive month from most US cities.",
    fromUs:
      "In KAYAK's route data, Emirates flies nonstop to Dubai from New York, Washington Dulles, Chicago, Dallas, San Francisco and Los Angeles, among others. The flight takes about 12h 45m from Washington and 14h 45m from Dallas.",
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
      "In KAYAK's fare data, February to April is the cheapest time to fly from the US. December is the most expensive month from most US cities, and June and July (the monsoon, but also US summer holidays) are expensive too.",
    fromUs:
      "In KAYAK's route data, nonstop flights to Delhi leave from the New York area: Air India, United and American, about 14h 55m. From other US cities you connect, often through London, Frankfurt, Dubai, Doha or Istanbul.",
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
      "In KAYAK's route data, nonstop flights to Mumbai leave from the New York area (JFK and Newark), including Air India, at about 14h 45m. Airline schedules change, so your search shows the nonstops operating on your dates. From every other US city you connect, usually in Europe (Copenhagen, Paris, Amsterdam, Istanbul) or the Gulf (Dubai, Doha, Abu Dhabi). The cheapest fares are often on one-stop carriers such as Scandinavian Airlines, Emirates, Qatar Airways and Royal Jordanian.",
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
      "In KAYAK's fare data, January and February are the cheapest months from most US cities (late summer from Los Angeles). December is the most expensive month from every city we checked, and March (cherry-blossom season) and June are also expensive.",
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
      "In KAYAK's fare data, January to April is the cheapest time to fly from most US cities. September to November, during hurricane season (June 1 to November 30), is usually more expensive for flights, not cheaper.",
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
      "In KAYAK's fare data, February is the cheapest month from most US cities, and December is the most expensive from every city we checked, often 70% or more above the cheapest month.",
    fromUs:
      "In KAYAK's route data, Delta flies nonstop to Lagos from New York (JFK, about 10h 04m) and Atlanta, and United from Washington Dulles, though not every day. From other US cities you connect, usually in Europe, the Gulf, Casablanca, Addis Ababa or Istanbul. Schedules change, so search for current options.",
    transfer:
      "Use a pre-arranged pickup or a ride-hailing app from the airport. Allow plenty of time; Lagos traffic can be very heavy.",
    tips: [
      "For December travel, compare connections through different hubs; prices can vary widely.",
      "Check your baggage allowance; many fares to Nigeria include two checked bags, but not all.",
    ],
  },
  {
    slug: "manila",
    city: "Manila",
    country: "Philippines",
    code: "MNL",
    region: "Asia",
    airports: [
      { code: "MNL", name: "Ninoy Aquino International (NAIA)", note: "Philippine Airlines uses Terminal 1; United uses Terminal 3. Terminal assignments changed in 2026, so check your ticket." },
      { code: "CRK", name: "Clark International", note: "About 80 km north of Manila; some Asian connections, but no nonstop flights from the US." },
    ],
    intro:
      "Manila is the main gateway for Filipino-American families and for travellers heading on to Cebu, Boracay and Palawan. The US–Philippines route is one of the busiest long-haul markets from the West Coast, and nonstop choices are growing: Philippine Airlines added Chicago in November 2026, United now flies San Francisco twice daily, and Delta plans Los Angeles from March 2027.",
    bestTime:
      "December to May is the dry season (PAGASA). December to February is the coolest and most comfortable; March to May is hot and dry. June to November is the rainy season, when most typhoons hit.",
    cheapest:
      "In KAYAK's fare data, March–April or September is the cheapest time to fly from every US city we checked. December is the most expensive month from all of them, and June is the second most expensive.",
    fromUs:
      "Philippine Airlines flies nonstop to Manila from Los Angeles, San Francisco, Seattle, New York JFK, Chicago O'Hare and Honolulu, and United flies nonstop from San Francisco (about 15 hours). Delta's daily Los Angeles–Manila flight is scheduled to start on March 27, 2027. From other US cities you usually connect in Seoul, Tokyo, Taipei, Hong Kong or Singapore, or on a Philippine Airlines domestic US connection to one of its gateways.",
    transfer:
      "Grab and metered taxis run from all NAIA terminals; at Terminal 3 they use a central pickup hub in the car park. UBE Express point-to-point buses link the terminals with Makati, Manila, Pasay, Quezon City and the PITX transport hub. Manila traffic is heavy, so allow extra time.",
    tips: [
      "Register on the official eTravel site (etravel.gov.ph) within 72 hours before arrival. It's free; ignore look-alike sites that charge a fee.",
      "Former Filipino citizens can enter under the Balikbayan privilege (one year visa-free). Carry proof such as an old Philippine passport.",
      "For December, compare Philippine Airlines and United nonstops with one-stop fares via Seoul, Tokyo or Taipei; one-stop fares are often lower on peak dates.",
    ],
  },
  {
    slug: "ho-chi-minh-city",
    city: "Ho Chi Minh City",
    country: "Vietnam",
    code: "SGN",
    region: "Asia",
    airports: [
      { code: "SGN", name: "Tan Son Nhat International", note: "International flights use Terminal 2, inside the city." },
      { code: "LTH", name: "Long Thanh International (new)", note: "About 40 km east of the city. Long-haul flights are planned to move here during 2027, so check which airport your ticket shows." },
    ],
    intro:
      "Ho Chi Minh City (Saigon) is Vietnam's largest city and the main arrival point for Vietnamese-American families, especially from California, Texas and the Pacific Northwest. Only one airline flies nonstop from the US, so most fares are one-stop through an Asian hub, and comparing those hubs is where the savings are.",
    bestTime:
      "The dry season in southern Vietnam runs from about November to April. Tet (Lunar New Year) falls on February 6, 2027; flights around Tet sell out early and many businesses close for the holiday week.",
    cheapest:
      "In KAYAK's fare data, March and April are the cheapest months from 6 of the 8 US cities we checked. June or December is the most expensive month from 7 of the 8.",
    fromUs:
      "Vietnam Airlines flies nonstop from San Francisco, about 15 hours, but not every day. From other US cities you connect: EVA Air, China Airlines and Starlux via Taipei, Korean Air via Seoul, Japan Airlines and ANA via Tokyo, Cathay Pacific and United via Hong Kong, Philippine Airlines via Manila and Singapore Airlines via Singapore.",
    transfer:
      "City buses 109 and 152 leave from the bus station in front of the international terminal, and Grab and metered taxis run from the arrivals area. If your flight uses the new Long Thanh airport, allow much more time to reach the city.",
    tips: [
      "US citizens need a visa. Apply for the e-visa (up to 90 days, single or multiple entry) only on the official portal, evisa.gov.vn; many look-alike sites add fees.",
      "Check the airport code on your ticket: SGN and the new LTH are both 'Ho Chi Minh City' but are about 46 km apart.",
      "Keep connections on one ticket so the airline rebooks you if a long-haul flight is late.",
    ],
  },
  {
    slug: "accra",
    city: "Accra",
    country: "Ghana",
    code: "ACC",
    region: "Africa",
    airports: [
      { code: "ACC", name: "Kotoka International", note: "International flights use Terminal 3." },
    ],
    intro:
      "Accra is the gateway to Ghana and one of the most popular West African destinations for Ghanaian-Americans, heritage travellers and December festival-goers. There are a few nonstop flights from the East Coast and many one-stop options through Europe, North Africa, the Gulf and Addis Ababa.",
    bestTime:
      "November to March is the main dry season, with dusty Harmattan winds from about December to February. December is the busiest month, with Christmas, New Year and 'Detty December' events drawing large crowds from the US and UK.",
    cheapest:
      "In KAYAK's fare data, February is the cheapest month to fly to Accra from 6 of the 7 US cities we checked (Chicago was cheapest in January). December is the most expensive month from 5 of the 7, and July from the other 2.",
    fromUs:
      "Delta flies nonstop from New York JFK (about 11 hours) and United from Washington Dulles. Delta has also flown Atlanta–Accra seasonally around the holidays. From other cities you connect, often in Casablanca (Royal Air Maroc), Addis Ababa (Ethiopian), Istanbul (Turkish), Cairo (Egyptair), Doha (Qatar Airways) or a European hub.",
    transfer:
      "Uber and Bolt both serve Kotoka airport, and there's an official taxi rank outside arrivals. Agree the fare before you get into a taxi, and expect heavy traffic in central Accra.",
    tips: [
      "US citizens need a visa before travel; apply through the Ghana Immigration Service e-visa portal (evisa.immigration.gov.gh) or the embassy, and check the CDC page for the yellow fever certificate requirement.",
      "For mid-December to early January, book early; diaspora demand pushes December fares far above the rest of the year.",
      "Check the checked-bag allowance on your exact fare; it varies by airline and fare type on Africa routes.",
    ],
  },
  {
    slug: "punta-cana",
    city: "Punta Cana",
    country: "Dominican Republic",
    code: "PUJ",
    region: "Americas",
    airports: [
      { code: "PUJ", name: "Punta Cana International", note: "The Dominican Republic's busiest airport, close to the Bávaro resort area." },
      { code: "SDQ", name: "Santo Domingo Las Américas", note: "The capital's airport; sometimes cheaper, but a long drive to the eastern resorts." },
    ],
    intro:
      "Punta Cana is the Caribbean's big all-inclusive resort area and the Dominican Republic's busiest airport. Nonstop flights leave from dozens of US cities, and budget airlines compete with the big carriers, so it's one of the easiest beach trips to price-compare from the US.",
    bestTime:
      "November to March is the cooler, drier period. May to October is hot and humid. Atlantic hurricane season runs June 1 to November 30 (NOAA), and sargassum seaweed tends to wash up in spring and summer.",
    cheapest:
      "In KAYAK's fare data, January or February is the cheapest month from 5 of the 8 US cities we checked. Despite lower hotel rates, summer and autumn are not cheaper for flights: the most expensive month fell between June and November from 7 of the 8 cities.",
    fromUs:
      "Nonstops run from New York, Newark, Boston, Miami, Atlanta, Charlotte, Philadelphia, Chicago, Dallas, Houston, Washington, Orlando and many more, on American, Delta, United, JetBlue, Southwest, Frontier, Arajet and Breeze. Several routes, such as Boston, Detroit and Minneapolis, are winter-seasonal for some airlines.",
    transfer:
      "The main Bávaro resort strip is a short drive from the airport. Most resorts offer pre-booked transfers; taxis wait outside arrivals. Resorts further north, such as Uvero Alto, take longer to reach.",
    tips: [
      "The US$10 tourist card is already included in your airfare. Complete the free official E-Ticket at eticket.migracion.gob.do before you fly.",
      "On budget airlines, add bag fees before comparing; a cheap base fare plus two bags can cost more than a full-service ticket.",
      "If you're staying in Santo Domingo or the south coast, compare fares into SDQ as well.",
    ],
  },
  {
    slug: "san-jose-costa-rica",
    city: "San José, Costa Rica",
    country: "Costa Rica",
    code: "SJO",
    region: "Americas",
    airports: [
      { code: "SJO", name: "Juan Santamaría International", note: "In Alajuela, about 20 km northwest of downtown San José. Best for the Central Valley, Arenal, the central Pacific and the Caribbean coast." },
      { code: "LIR", name: "Guanacaste (Liberia)", note: "Best for Tamarindo and the Guanacaste beaches; the drive between the two airports can take over 5 hours." },
    ],
    intro:
      "San José's Juan Santamaría airport is Costa Rica's main gateway, used for trips to the volcanoes, rainforests and both coasts. Nonstop flights leave from most large US hubs, and Miami, Houston and Dallas usually have the most choice.",
    bestTime:
      "December to April is the dry season. May to November is the 'green season', with September and October the wettest months around San José. The Caribbean side is wetter and more humid than the Pacific side.",
    cheapest:
      "In KAYAK's fare data, January or February is the cheapest month from 6 of the 7 US cities we checked (New York was cheapest in May). The most expensive months were July to October or December.",
    fromUs:
      "United, American, Delta, JetBlue, Southwest, Alaska, Frontier, Avianca and others fly nonstop to SJO from cities including Miami, Fort Lauderdale, Houston, Dallas, Atlanta, Charlotte, Newark, New York JFK, Los Angeles and Orlando. Many routes, including Chicago and Denver, are seasonal.",
    transfer:
      "Official airport taxis are orange; regular red taxis also operate. A 24-hour public bus runs to downtown San José. Ride-hailing exists but its airport status is unsettled, so check before relying on it.",
    tips: [
      "Immigration may ask for a return or onward ticket and proof of funds; book a round trip. See visitcostarica.com for current entry rules.",
      "Fly into the airport closest to where you're staying: SJO for most of the country, Liberia (LIR) for Guanacaste beaches.",
      "Book dry-season trips early; several US routes only fly in the dry season, so there are fewer seats at other times.",
    ],
  },
  {
    slug: "rome",
    city: "Rome",
    country: "Italy",
    code: "FCO",
    region: "Europe",
    airports: [
      { code: "FCO", name: "Fiumicino (Leonardo da Vinci)", note: "All nonstop flights from the US land here." },
      { code: "CIA", name: "Ciampino", note: "Mainly low-cost flights within Europe." },
    ],
    intro:
      "Rome is one of the most popular European trips from the US, with nonstop flights from more than a dozen US cities. ITA Airways, Delta, United and American all fly the route, and one-stop fares through other European hubs are often cheaper, so it pays to compare both.",
    bestTime:
      "April–May and September–October usually bring the best weather and fewer crowds. June to August is hot and busy.",
    cheapest:
      "In KAYAK's fare data, January or February is the cheapest month to fly to Rome from all 8 US cities we checked. June is the most expensive month from 6 of the 8.",
    fromUs:
      "ITA Airways flies nonstop from New York JFK, Boston, Washington Dulles, Miami, Los Angeles, San Francisco and Houston. Delta flies from Atlanta, Boston, Detroit, Minneapolis and New York JFK; United from Newark, Chicago and Washington Dulles; American from Dallas and Philadelphia. Several routes, including Charlotte, Denver and Seattle, are summer-seasonal. New York–Rome takes about 8 hours 20 minutes.",
    transfer:
      "The Leonardo Express train runs nonstop from Fiumicino to Roma Termini in about 32 minutes for €14 (ADR). Official white taxis charge a fixed €55 to anywhere inside the Aurelian Walls.",
    tips: [
      "US citizens can stay up to 90 days in any 180-day period in the Schengen area; the EU's Entry/Exit System now records fingerprints and a photo at the border.",
      "ETIAS is not yet in operation; check travel-europe.europa.eu for the start date before you travel.",
      "Compare nonstops with one-stop fares via London, Madrid, Lisbon or Reykjavik; one-stops were the cheapest airlines on most routes we checked.",
    ],
  },
  {
    slug: "istanbul",
    city: "Istanbul",
    country: "Türkiye",
    code: "IST",
    region: "Europe",
    airports: [
      { code: "IST", name: "Istanbul Airport", note: "On the European side; all nonstop flights from the US land here." },
      { code: "SAW", name: "Sabiha Gökçen", note: "On the Asian side; mainly short- and medium-haul flights." },
    ],
    intro:
      "Istanbul is both a destination and one of the world's biggest connecting hubs. Turkish Airlines flies nonstop from more US cities than any other foreign airline, and one-stop fares through European hubs keep prices competitive.",
    bestTime:
      "April–May and September–October usually bring the most pleasant weather. July and August are hot and crowded.",
    cheapest:
      "In KAYAK's fare data, February is the cheapest month to fly to Istanbul from 5 of the 6 US cities we checked (Chicago was cheapest in March). June is the most expensive month from all 6.",
    fromUs:
      "Turkish Airlines flies nonstop to Istanbul Airport from about 14 US airports, including New York JFK, Newark, Boston, Washington Dulles, Chicago, Atlanta, Miami, Houston, Dallas, Denver, Detroit, Los Angeles, San Francisco and Seattle; some routes fly fewer times a week in winter. New York–Istanbul takes about 10 hours.",
    transfer:
      "The M11 metro links Istanbul Airport with Gayrettepe in about 30 minutes, and Havaist buses run to Taksim and other districts. Taxis are available outside arrivals; journeys into the old city can take an hour or more in traffic.",
    tips: [
      "US citizens with ordinary passports don't need a visa for tourist stays of up to 90 days in 180 (Turkish Ministry of Foreign Affairs). Your passport must be valid at least 60 days beyond your stay.",
      "Flying on to Asia, Africa or the Middle East? Turkish Airlines' free Touristanbul city tour is open to international transfer passengers with a 6–24 hour layover.",
      "Compare the Turkish Airlines nonstop with one-stop fares on Lufthansa, British Airways or Air France; they were among the cheapest airlines on 5 of the 6 routes we checked.",
    ],
  },
  {
    slug: "amman",
    city: "Amman",
    country: "Jordan",
    code: "AMM",
    region: "Middle East",
    airports: [
      { code: "AMM", name: "Queen Alia International", note: "About 35 km south of central Amman; all flights from the US land here." },
    ],
    intro:
      "Amman is Jordan's capital and the gateway to Petra, Wadi Rum and the Dead Sea. It is also a major family-travel route for Jordanian and Palestinian Americans. Royal Jordanian is the only airline flying nonstop from the US; most other fares connect in Europe, Istanbul or the Gulf.",
    bestTime:
      "March to May and September to November bring the most comfortable weather. Summers are hot, and winters are cool with some rain.",
    cheapest:
      "In KAYAK's fare data, January to March is the cheapest time to fly to Amman from all 7 US cities we checked. June is the most expensive month from 5 of the 7.",
    fromUs:
      "Royal Jordanian flies nonstop from New York JFK, Chicago O'Hare, Detroit, Washington Dulles and Dallas–Fort Worth (Dallas launched in May 2026). Detroit–Amman takes about 11h 25m and Chicago–Amman about 11h 45m. From other US cities, one-stop routes via Istanbul, Frankfurt, Doha or Abu Dhabi are common.",
    transfer:
      "The Sariyah Airport Express bus runs between the airport and Amman around the clock, roughly every 30–60 minutes, for about JOD 3.30. Airport taxis charge set fares by zone; agree the price before you leave.",
    tips: [
      "US citizens can get a visa on arrival (JOD 40). A Jordan Pass bought before you fly covers that fee if you stay at least 3 days, and includes Petra entry.",
      "The US State Department rated Jordan Level 3 (Reconsider Travel) in October 2026; check travel.state.gov before you book.",
      "Royal Jordanian schedules changed several times in 2026 because of regional airspace closures, so confirm your flight a few days before departure.",
    ],
  },
  {
    slug: "doha",
    city: "Doha",
    country: "Qatar",
    code: "DOH",
    region: "Middle East",
    airports: [
      { code: "DOH", name: "Hamad International", note: "Qatar Airways hub, with a Metro Red Line station." },
    ],
    intro:
      "Doha is Qatar's capital and Qatar Airways' hub, so it is both a destination and one of the busiest connecting points between the US and India, the Gulf, Africa and Asia. Qatar Airways is the only airline flying nonstop from the US.",
    bestTime:
      "November to March is the best time to visit; summers are extremely hot.",
    cheapest:
      "In KAYAK's fare data, February, March or September is the cheapest month to fly to Doha from the 4 US cities with complete data. December is the most expensive month from 2 of the 4.",
    fromUs:
      "Qatar Airways flies nonstop from about a dozen US cities, including New York JFK, Washington Dulles, Chicago, Dallas–Fort Worth, Houston, Miami, Los Angeles, Atlanta, Boston, Seattle and Philadelphia (Philadelphia returned in August 2026). New York–Doha takes about 12h 10m. Qatar's airspace was closed for part of 2026 and flights now run on approved routes, so check your schedule.",
    transfer:
      "Doha Metro's Red Line runs from the airport to the city for QAR 2 plus a QAR 10 travel card (from 5am, and 9am on Fridays). Karwa taxis start at QAR 25 plus about QAR 1.6 per km.",
    tips: [
      "US citizens can enter Qatar without a visa; check the length of stay at visitqatar.com before you travel.",
      "The US State Department rated Qatar Level 3 (Reconsider Travel) in October 2026; check travel.state.gov before you book.",
      "Flying on to India, Africa or Asia? A stopover in Doha can split a long trip, and Qatar Airways often has the cheapest one-stop fares on those routes.",
    ],
  },
  {
    slug: "tel-aviv",
    city: "Tel Aviv",
    country: "Israel",
    code: "TLV",
    region: "Middle East",
    airports: [
      { code: "TLV", name: "Ben Gurion International", note: "Most international flights use Terminal 3." },
    ],
    intro:
      "Tel Aviv is Israel's beach city and the gateway for trips to Jerusalem. US airlines cut and restored service several times in 2025–2026, so schedules change often and fares have been higher than usual; compare nonstops with one-stop routes through Europe.",
    bestTime:
      "Spring (March–May) and autumn (September–November) have the most comfortable weather. Summer is hot and humid.",
    cheapest:
      "In KAYAK's fare data, January or February is the cheapest month to fly to Tel Aviv from 6 of the 8 US cities we checked. June is the most expensive month from 4 of the 8.",
    fromUs:
      "In late 2026, Delta flies daily from New York JFK and United twice daily from Newark. El Al flies from New York, Newark, Miami, Los Angeles, Boston and San Francisco, and plans more flights in summer 2027. American's JFK flights are suspended, and Delta's Atlanta and Boston flights are paused. New York–Tel Aviv takes about 10–11 hours.",
    transfer:
      "Israel Railways trains run from the airport station to Tel Aviv in about 15–20 minutes, except on Shabbat (Friday evening to Saturday evening). Metered taxis and shared sherut vans also run.",
    tips: [
      "US citizens must get an ETA-IL online before flying (NIS 25, valid up to 2 years).",
      "The US State Department rated Israel Level 3 (Reconsider Travel) in October 2026; check travel.state.gov before you book.",
      "With schedules changing often, booking with a flexible fare or through an agent who can rebook you can save money if a flight is cancelled.",
    ],
  },
  {
    slug: "cairo",
    city: "Cairo",
    country: "Egypt",
    code: "CAI",
    region: "Africa",
    airports: [
      { code: "CAI", name: "Cairo International", note: "EgyptAir hub in Heliopolis, about 15 km from downtown." },
    ],
    intro:
      "Cairo is the gateway to the Pyramids of Giza, the Nile and the rest of Egypt, and a major family-travel route for Egyptian Americans. EgyptAir flies nonstop from the US, and many cheaper fares connect in Europe, Amman or Istanbul.",
    bestTime:
      "October to April is the most comfortable time to visit. Summers are very hot.",
    cheapest:
      "In KAYAK's fare data, the cheapest month to fly to Cairo varies by city (January, February, April or October), but December is the most expensive month from 6 of the 7 US cities we checked.",
    fromUs:
      "EgyptAir flies nonstop from New York JFK, Newark and Washington Dulles, and added Chicago (3 a week, from June 2026) and Los Angeles in 2026. New York–Cairo takes about 10h 15m and Chicago–Cairo about 11h 10m. Royal Jordanian, Turkish Airlines and Delta were among the cheapest one-stop options on many routes.",
    transfer:
      "Taxis and ride-hailing apps are the most common way into the city; agree the fare before you get in a regular taxi. Shuttle buses also run to Downtown and Giza.",
    tips: [
      "US citizens can get an e-visa at visa2egypt.gov.eg (apply at least 7 days before travel) or a visa on arrival; bring US dollars in cash for the arrival option.",
      "Your passport must be valid for at least 6 months on arrival.",
      "Check the US State Department's Egypt advisory at travel.state.gov before you book.",
    ],
  },
  {
    slug: "nairobi",
    city: "Nairobi",
    country: "Kenya",
    code: "NBO",
    region: "Africa",
    airports: [
      { code: "NBO", name: "Jomo Kenyatta International", note: "About 18 km southeast of the city; Kenya Airways uses Terminal 1A." },
    ],
    intro:
      "Nairobi is Kenya's capital and the starting point for most East African safaris, as well as a big family-travel route for Kenyan Americans. Kenya Airways flies the only nonstop from the US (New York JFK); most other routes connect in Europe, the Gulf, Istanbul or Addis Ababa.",
    bestTime:
      "June to October and January to February are usually the driest months and the main safari season. The long rains fall around March to May.",
    cheapest:
      "In KAYAK's fare data, February to April is the cheapest time to fly to Nairobi from all 7 US cities we checked. December is the most expensive month from 6 of the 7.",
    fromUs:
      "Kenya Airways flies nonstop from New York JFK, taking about 13h 30m to Nairobi. From other US cities you connect: Turkish Airlines, Qatar Airways, Etihad, Delta/Air France and Ethiopian were among the cheapest airlines on the routes we checked.",
    transfer:
      "Taxis and ride-hailing apps are the usual way into the city. The Nairobi Expressway links the airport area with Westlands and cuts travel time at busy hours.",
    tips: [
      "US citizens need a Kenya eTA before travel (from $30) at etakenya.go.ke; apply at least 2 weeks ahead.",
      "A yellow fever certificate is needed if you arrive from a country with yellow fever risk, which can include connections through some West African airports.",
      "Kenya Airways lets families pool checked bags on US flights; check the allowance on your ticket.",
    ],
  },
  {
    slug: "addis-ababa",
    city: "Addis Ababa",
    country: "Ethiopia",
    code: "ADD",
    region: "Africa",
    airports: [
      { code: "ADD", name: "Bole International", note: "Ethiopian Airlines' hub and Africa's busiest connecting airport." },
    ],
    intro:
      "Addis Ababa is Ethiopia's capital and Ethiopian Airlines' hub, so it is both a home destination for Ethiopian Americans and one of the main connecting points between the US and East, West and Southern Africa.",
    bestTime:
      "October to May is the main dry season. The heaviest rains fall from June to September.",
    cheapest:
      "In KAYAK's fare data, the cheapest month to fly to Addis Ababa ranges from January to April, or October, depending on the US city. June is the most expensive month from 6 of the 8 US cities we checked.",
    fromUs:
      "Ethiopian Airlines flies to Addis Ababa from Washington Dulles, Chicago, Atlanta and New York JFK. Chicago and Atlanta are nonstop to Addis, with the return via Rome; Washington flights go via Rome or Lomé, and New York flights via Abidjan or Lomé (winter 2026–27 schedule). Turkish Airlines, Qatar Airways and Etihad were also among the cheapest airlines.",
    transfer:
      "Taxis and ride-hailing apps such as Ride serve Bole Airport, which is close to the city centre. Agree the fare before you start.",
    tips: [
      "US citizens can apply for an e-visa at evisa.gov.et; e-visa holders must arrive at Bole Airport.",
      "Ethiopian Airlines allows 2 checked bags of 23 kg in economy on its intercontinental flights.",
      "Holidays such as Ethiopian Christmas (January 7), Timkat and Fasika (Ethiopian Easter) are busy; book early for those dates.",
    ],
  },
  {
    slug: "abuja",
    city: "Abuja",
    country: "Nigeria",
    code: "ABV",
    region: "Africa",
    airports: [
      { code: "ABV", name: "Nnamdi Azikiwe International", note: "About 20 km from the city, with separate international and domestic terminals." },
    ],
    intro:
      "Abuja is Nigeria's capital and a major family-travel route for Nigerian Americans, especially at Christmas. There are no nonstop flights from the US, so every trip connects, usually in Addis Ababa, Istanbul, Doha, London, Casablanca or Lagos.",
    bestTime:
      "November to March is the dry season (with Harmattan haze from December). The rainy season runs from about April to October.",
    cheapest:
      "In KAYAK's fare data, January to March is the cheapest time to fly to Abuja from 6 of the 7 US cities we checked. December is the most expensive month from 6 of the 7.",
    fromUs:
      "No airline flies nonstop from the US to Abuja. Ethiopian Airlines, Turkish Airlines, Qatar Airways, Royal Air Maroc and British Airways were the cheapest airlines on the routes we checked. You can also fly nonstop to Lagos and connect on a domestic flight.",
    transfer:
      "Taxis and ride-hailing apps such as Bolt and Uber are the usual way into the city.",
    tips: [
      "Nigeria ended visa on arrival in May 2025: apply for an e-visa at evisa.immigration.gov.ng and fill in the online landing card before boarding.",
      "Former Nigerian citizens can travel on their foreign passport with their old Nigerian passport; check the Nigeria Immigration Service site for the rules.",
      "Christmas fares can be very high (up to $2,132 median from Boston in our data), so book holiday trips early or call us for multi-city or family itineraries.",
    ],
  },
  {
    slug: "mexico-city",
    city: "Mexico City",
    country: "Mexico",
    code: "MEX",
    region: "Americas",
    airports: [
      { code: "MEX", name: "Benito Juárez International", note: "Terminal 1: American, United, Volaris, Viva. Terminal 2: Aeroméxico and Delta." },
      { code: "NLU", name: "Felipe Ángeles International (AIFA)", note: "About 45 km north; no US passenger routes in late 2026." },
    ],
    intro:
      "Mexico City is one of the cheapest international trips from the US and one of the busiest family routes. Aeroméxico, American, Delta, United, Volaris and Viva all fly nonstop from many US cities, so it pays to compare low-cost and full-service fares.",
    bestTime:
      "November to April is the dry season. June to October brings afternoon storms. The city sits at 2,240 m (7,350 ft), so take it easy on day one.",
    cheapest:
      "In KAYAK's fare data, January or February is the cheapest month to fly to Mexico City from 5 of the 7 US cities we checked. December is the most expensive month from all 7.",
    fromUs:
      "Nonstop flights leave from most large US cities, including Los Angeles, Chicago, Dallas, Houston, New York, Miami, Atlanta and San Francisco. Dallas–Mexico City takes about 2h 50m and Los Angeles–Mexico City about 3h 45m. Volaris, Viva and Frontier were the cheapest airlines on most routes we checked.",
    transfer:
      "Metrobús Line 4 links both terminals with central Mexico City and Reforma for MXN 30. Use the authorised taxi booths inside the terminal, or a ride-hailing app.",
    tips: [
      "US citizens don't need a visa; air arrivals get a digital FMM entry permit.",
      "Check whether your airline uses Terminal 1 or Terminal 2 before you head to the airport.",
      "Low-cost fares (Volaris, Viva, Frontier) charge for carry-on and checked bags; add bags before comparing with full-service airlines.",
    ],
  },
  {
    slug: "guatemala-city",
    city: "Guatemala City",
    country: "Guatemala",
    code: "GUA",
    region: "Americas",
    airports: [
      { code: "GUA", name: "La Aurora International", note: "In Zona 13, close to the city centre and about an hour from Antigua." },
    ],
    intro:
      "Guatemala City is the gateway to Antigua, Lake Atitlán and Tikal, and one of the busiest family-travel routes from the US to Central America. Nonstop flights leave from Los Angeles, Houston, Miami, Dallas, Atlanta, New York and more.",
    bestTime:
      "November to April is the dry season. May to October is the rainy season. Semana Santa (Easter week) is the busiest and priciest time in Antigua.",
    cheapest:
      "In KAYAK's fare data, January or February is the cheapest month to fly to Guatemala City from 5 of the 7 US cities we checked. December is the most expensive month from 4 of the 7, and October–December are expensive from all of them.",
    fromUs:
      "United flies nonstop from Houston, Newark, Chicago and Los Angeles; American from Miami and Dallas; Delta from Atlanta; JetBlue from Fort Lauderdale; Avianca from New York JFK and Los Angeles; and Frontier on seasonal routes. Miami–Guatemala City takes about 3 hours.",
    transfer:
      "Taxis and Uber serve La Aurora; INGUAT sells taxi vouchers in arrivals. Shared shuttles to Antigua cost about US$15–18; book 48 hours ahead.",
    tips: [
      "US citizens don't need a visa for stays up to 90 days; the 90 days are shared across Guatemala, El Salvador, Honduras and Nicaragua (CA-4).",
      "Fill in the free electronic traveller declaration on the SAT website before you fly.",
      "Low-cost airlines (Frontier, Volaris, Arajet) were often cheapest; add bag fees before comparing.",
    ],
  },
  {
    slug: "montego-bay",
    city: "Montego Bay",
    country: "Jamaica",
    code: "MBJ",
    region: "Americas",
    airports: [
      { code: "MBJ", name: "Sangster International", note: "Jamaica's busiest airport, close to the Montego Bay hotel strip." },
    ],
    intro:
      "Montego Bay is Jamaica's main resort airport and the gateway to Negril and Ocho Rios, as well as a busy family route for Jamaican Americans. American, Delta, United, JetBlue, Southwest and others fly nonstop from many US cities.",
    bestTime:
      "December to April is the driest and busiest season. Hurricane season runs from June 1 to November 30, and October is usually the wettest month.",
    cheapest:
      "In KAYAK's fare data, the cheapest month to fly to Montego Bay varies by US city, from January to May (or September from Philadelphia). December is the most expensive month from 5 of the 8 US cities we checked.",
    fromUs:
      "Nonstops leave from cities including New York JFK, Newark, Boston, Philadelphia, Washington, Atlanta, Miami, Fort Lauderdale, Orlando, Charlotte, Chicago, Dallas, Houston and Denver. New York–Montego Bay takes about 4 hours.",
    transfer:
      "Knutsford Express coaches run from a terminal next to the airport to Negril (J$2,500) and Ocho Rios (J$2,900), with small discounts online. Resort shuttles and licensed taxis also run.",
    tips: [
      "US citizens need a passport but no visa; complete the free online C5 immigration and customs form before you fly.",
      "The US State Department rates Jamaica Level 2; check travel.state.gov before you book.",
      "Travelling June–November? Buy travel insurance that covers hurricane disruption.",
    ],
  },
  {
    slug: "lisbon",
    city: "Lisbon",
    country: "Portugal",
    code: "LIS",
    region: "Europe",
    airports: [
      { code: "LIS", name: "Humberto Delgado (Lisbon Airport)", note: "About 7 km from the centre, connected to the Metro red line." },
    ],
    intro:
      "Lisbon is one of the shortest and best-value flights from the US to Europe, with TAP Air Portugal, United, Delta and American flying nonstop. It is also a good starting point for Porto, the Algarve and the rest of Europe.",
    bestTime:
      "April–May and September–October bring warm weather and fewer crowds. July and August are peak season.",
    cheapest:
      "In KAYAK's fare data, January or February is the cheapest month to fly to Lisbon from all 8 US cities we checked, and June is the most expensive month from all 8.",
    fromUs:
      "TAP Air Portugal flies nonstop from Boston, Chicago, Los Angeles, Miami, Newark, New York JFK, Orlando, San Francisco and Washington Dulles. United flies from Newark and Washington, Delta from Boston and JFK, and American from Philadelphia. New York–Lisbon takes about 6h 35m–7h.",
    transfer:
      "The Metro red line runs from the airport into the city for €1.90 plus a €0.50 card (or contactless). Taxis from the official rank charge set fares to central Lisbon (about €19 by day).",
    tips: [
      "US citizens can stay up to 90 days in any 180-day period in the Schengen area; the EU Entry/Exit System records fingerprints and a photo at the border.",
      "ETIAS is not yet in operation; check travel-europe.europa.eu before you travel.",
      "TAP often lets you add a free stopover in Lisbon or Porto on the way to other European cities.",
    ],
  },
  {
    slug: "athens",
    city: "Athens",
    country: "Greece",
    code: "ATH",
    region: "Europe",
    airports: [
      { code: "ATH", name: "Athens International (Eleftherios Venizelos)", note: "Connected to the city by Metro Line 3 and 24-hour buses." },
    ],
    intro:
      "Athens is the gateway to the Greek islands, and the most seasonal European route from the US: most nonstop flights only run in summer, which is also when fares peak. Off-season trips usually connect through another European city.",
    bestTime:
      "April–June and September–October are the best months. August is the hottest and busiest.",
    cheapest:
      "In KAYAK's fare data, January or February is the cheapest month to fly to Athens from all 8 US cities we checked, and June is the most expensive month from all 8.",
    fromUs:
      "Emirates flies nonstop from Newark year-round. Delta (Atlanta, Boston, JFK), United (Chicago, Newark, Washington) and American (Charlotte, Chicago, Dallas, JFK, Philadelphia) fly nonstop in summer only. Alaska plans Seattle–Athens from May 2027. New York–Athens takes about 9h 20m.",
    transfer:
      "Metro Line 3 runs from the airport to central Athens for €9 one way (a regular city ticket is not valid). The X95 bus to Syntagma Square costs €5.50 and runs 24 hours. Taxis charge a flat fare to the centre.",
    tips: [
      "US citizens can stay up to 90 days in any 180-day period in the Schengen area; the EU Entry/Exit System records fingerprints and a photo at the border.",
      "ETIAS is not yet in operation; check travel-europe.europa.eu before you travel.",
      "Heading to the islands? Compare flying straight to Mykonos or Santorini with a connection in Athens plus a ferry.",
    ],
  },
];
