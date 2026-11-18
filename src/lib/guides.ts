/**
 * Travel guides for /guides/$slug. Every number here must come from a named, dated source
 * listed in `sources`, and the page shows those sources. Update `updated` when the data changes.
 */

export type GuideSource = { label: string; url: string; checked: string };
export type GuideRouteRow = {
  route: string;
  cheapestMonth: string;
  priciestMonths: string;
  typical: string;
  bookAhead: string;
  cheapestDay: string;
};
export type GuideSection = { id: string; heading: string; paragraphs: string[]; bullets?: string[] };

export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  published: string; // yyyy-mm-dd
  updated: string; // yyyy-mm-dd
  author: string;
  /** The 2–3 sentence direct answer shown in a box at the top. */
  answer: string;
  keyFacts: string[];
  table?: { caption: string; rows: GuideRouteRow[]; note: string };
  sections: GuideSection[];
  faqs: { q: string; a: string }[];
  sources: GuideSource[];
  related: { label: string; href: string }[];
};

export const guides: Guide[] = [
  {
    slug: "cheapest-time-to-fly-to-india-from-usa",
    title: "Cheapest Time to Fly to India from the USA",
    metaTitle: "Cheapest Time to Fly to India from the USA (2027) | FaresDream",
    description:
      "February to April is usually cheapest for US–India flights; December and June cost the most. Route-by-route data, 2027 festival dates and when to book.",
    published: "2026-11-18",
    updated: "2026-11-18",
    author: "FaresDream Travel Desk",
    answer:
      "For most US–India routes, the cheapest months to fly are February, March and April, and the most expensive are December and June. On New York–Delhi, KAYAK's 12-month average was $816 round trip in February against $1,312 in December. Booking about 10 to 12 weeks ahead usually beats booking in the last two weeks.",
    keyFacts: [
      "Cheapest month: February (New York–Delhi), March (New York–Mumbai, San Francisco–Delhi), April (Chicago–Delhi).",
      "Most expensive: December on three of the four routes we checked; June and July from San Francisco.",
      "Gap between the cheapest and priciest month: 56% to 81% depending on the route.",
      "Book ahead: 10–12 weeks from New York and Chicago; about 26 weeks from San Francisco.",
      "2027 dates that push fares up: Holi (March 22), Diwali (October 29), and Christmas–New Year.",
    ],
    table: {
      caption: "US–India round-trip economy fares by route",
      rows: [
        {
          route: "New York (NYC) – Delhi (DEL)",
          cheapestMonth: "February · $816",
          priciestMonths: "December $1,312 · June $1,141",
          typical: "$790–$1,257",
          bookAhead: "10 weeks (≈22% saving)",
          cheapestDay: "Monday",
        },
        {
          route: "New York (NYC) – Mumbai (BOM)",
          cheapestMonth: "March · $750",
          priciestMonths: "December $1,322 · June $1,145",
          typical: "$772–$1,252",
          bookAhead: "11 weeks (≈17% saving)",
          cheapestDay: "Tuesday",
        },
        {
          route: "Chicago (ORD) – Delhi (DEL)",
          cheapestMonth: "April · $779",
          priciestMonths: "December $1,412 · June $1,229",
          typical: "$833–$1,267",
          bookAhead: "12 weeks (≈24% saving)",
          cheapestDay: "Monday",
        },
        {
          route: "San Francisco (SFO) – Delhi (DEL)",
          cheapestMonth: "March · $888",
          priciestMonths: "July $1,389 · June $1,362",
          typical: "$905–$1,317",
          bookAhead: "26 weeks (≈16% saving)",
          cheapestDay: "Tuesday",
        },
      ],
      note: "Source: KAYAK route pages, which average KAYAK users' searches over the past 12 months. Checked November 17–18, 2026. Savings are against fares booked within two weeks of departure. These are averages, not quotes; today's fare for your dates can be higher or lower.",
    },
    sections: [
      {
        id: "month-by-month",
        heading: "When is it cheapest to fly to India, month by month?",
        paragraphs: [
          "Fares to India follow demand from the Indian-American community visiting family more than tourist seasons. That is why December and June, when US schools are out, cost the most even though June is one of India's hottest months.",
        ],
        bullets: [
          "January: fares start falling after the New Year rush; the first week stays expensive.",
          "February–April: the cheapest window on all four routes we checked, and the weather in most of India is still pleasant. Book Holi week (March 22, 2027) early if you want to be there for it.",
          "May: still mid-priced, but it is very hot in North India.",
          "June–August: summer-holiday peak. June and July were the most expensive months from San Francisco, and June the second most expensive from New York and Chicago.",
          "September–early October: usually calmer, until demand builds for Diwali (October 29, 2027).",
          "November–December: Diwali, the wedding season and Christmas make this the most expensive period. December was the priciest month on three of the four routes.",
        ],
      },
      {
        id: "how-far-ahead",
        heading: "How far ahead should I book flights to India?",
        paragraphs: [
          "From the East Coast and Chicago, KAYAK's data puts the best booking point at 10 to 12 weeks before departure, with savings of about 17% to 24% against last-minute fares. From San Francisco it is much earlier: about 26 weeks.",
          "For December, Diwali or a June family trip, start looking earlier than that. Cheaper fare classes on peak dates are limited, and once they sell out the price only moves up.",
        ],
      },
      {
        id: "which-day",
        heading: "Which day of the week is cheapest?",
        paragraphs: [
          "Leaving on a Monday or Tuesday was cheapest on these routes, but the difference was small: 3% to 5% below an average day. Being flexible by a week or choosing a cheaper month saves far more than picking the right weekday.",
        ],
      },
      {
        id: "airports-and-stops",
        heading: "Nonstop or one stop: which airports are cheapest?",
        paragraphs: [
          "From the New York area you can fly nonstop to Delhi with Air India, United or American, and Air India flies nonstop from Newark to Mumbai. KAYAK listed no nonstop between San Francisco and Delhi when we checked. Nonstops are convenient but not always cheapest.",
          "One-stop trips through the Gulf, Europe or Africa (for example Dubai, Doha, Bahrain, Istanbul or Addis Ababa) often come in lower. In KAYAK's data, itineraries starting from LaGuardia and connecting elsewhere averaged less than other New York departures for both Delhi and Mumbai.",
          "Compare more than one Indian city too. If your family is in Punjab, Gujarat or the south, flying into Delhi, Mumbai, Ahmedabad, Hyderabad or Bengaluru and taking a short domestic flight can cost less than a through ticket.",
        ],
      },
      {
        id: "tips",
        heading: "How to get the lowest fare to India",
        paragraphs: [],
        bullets: [
          "Fly in February to April, or in September before Diwali demand builds.",
          "Book 10–12 weeks ahead from the East Coast or Chicago, and around six months ahead from the West Coast.",
          "Avoid starting a trip in the week before Christmas or the week of Diwali.",
          "Check one-stop itineraries and nearby airports, not just nonstops from your home airport.",
          "Check the baggage allowance before you compare prices; some low fares include fewer checked bags.",
          "For families, groups or complex trips, call a travel agent: agents can sometimes access fares that are not shown online.",
        ],
      },
      {
        id: "method",
        heading: "How we put this guide together",
        paragraphs: [
          "We read KAYAK's published route data for four of the busiest US–India routes on November 17–18, 2026 and copied the figures as published. Festival dates come from published 2027 calendars. We did not use FaresDream booking data for this guide. We will update the table as new data is published.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the cheapest month to fly to India from the USA?",
        a: "February to April. In KAYAK's 12-month averages, February was cheapest from New York to Delhi ($816 round trip), March from New York to Mumbai ($750) and San Francisco to Delhi ($888), and April from Chicago to Delhi ($779).",
      },
      {
        q: "What is the most expensive time to fly to India?",
        a: "December, followed by June. December averaged $1,312 from New York to Delhi and $1,412 from Chicago to Delhi. From San Francisco, July and June were the most expensive months.",
      },
      {
        q: "How far in advance should I book a flight to India?",
        a: "About 10 to 12 weeks ahead from New York and Chicago, which saved 17% to 24% against last-minute fares in KAYAK's data. From San Francisco, about 26 weeks ahead. Book earlier for December, Diwali or June.",
      },
      {
        q: "When is Diwali in 2027?",
        a: "Diwali (Lakshmi Puja) falls on Friday, October 29, 2027. Holi is on Monday, March 22, 2027. Fares rise around both dates.",
      },
      {
        q: "Is it cheaper to fly nonstop or with a stop to India?",
        a: "One-stop trips through the Gulf, Europe or Africa are often cheaper than nonstops, though they take longer. Compare both before you book.",
      },
    ],
    sources: [
      {
        label: "KAYAK: New York to New Delhi flights",
        url: "https://www.kayak.com/flight-routes/New-York-NYC/New-Delhi-Indira-Gandhi-Intl-DEL",
        checked: "2026-11-18",
      },
      {
        label: "KAYAK: New York to Mumbai flights",
        url: "https://www.kayak.com/flight-routes/New-York-NYC/Mumbai-Chhatrapati-Shivaji-BOM",
        checked: "2026-11-18",
      },
      {
        label: "KAYAK: Chicago O'Hare to New Delhi flights",
        url: "https://www.kayak.com/flight-routes/Chicago-O-Hare-Intl-ORD/New-Delhi-Indira-Gandhi-Intl-DEL",
        checked: "2026-11-18",
      },
      {
        label: "KAYAK: San Francisco to New Delhi flights",
        url: "https://www.kayak.com/flight-routes/San-Francisco-SFO/New-Delhi-Indira-Gandhi-Intl-DEL",
        checked: "2026-11-18",
      },
      {
        label: "Indian festival dates 2027 (Diwali, Holi)",
        url: "https://www.publicholidaycalendar.com/indian-festival-dates-2027/",
        checked: "2026-11-18",
      },
    ],
    related: [
      { label: "Cheap flights to Delhi", href: "/destinations/delhi" },
      { label: "Cheap flights to Mumbai", href: "/destinations/mumbai" },
      { label: "All destinations", href: "/destinations" },
    ],
  },
];

export const guideBySlug = (slug: string) => guides.find((g) => g.slug === slug);
