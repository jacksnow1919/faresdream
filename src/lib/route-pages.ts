/**
 * Route pages (/flights/$slug, e.g. /flights/jfk-to-mco): one template, real data per route.
 *
 * - Fare data comes from KAYAK's public route pages (tools/kroute.py -> tools/gen_routes.py ->
 *   route-data.gen.ts). Every number on the page is read or computed from that file.
 * - Hand-written, checked facts live in `routes` below (tips). Keep them short and true.
 * - A route only gets a page when it has 12 months of fare data (see `routePages`).
 */
import { routeFareData } from "./route-data.gen.ts";

export type RouteFareData = {
  key: string;
  source: string;
  checked: string; // yyyy-mm-dd
  /** Round-trip price by departure month, Jan..Dec (USD). */
  monthly: number[];
  /** Round-trip price by departure weekday, Mon..Sun (USD). */
  weekday: number[] | null;
  /** [low, high, average] typical round trip (USD). */
  range: number[] | null;
  /** Price by weeks before departure: index 0 = 26 weeks out ... last = 1 week out. */
  bookWeeks: number[] | null;
  cheapestAirlines: { name: string; price: number }[];
  onTime: { name: string; pct: number }[];
  /** Direct flights per weekday, Mon..Sun. */
  directPerDay: number[] | null;
  /** % of flights leaving morning / afternoon / evening / night. */
  departTimes: number[] | null;
  /** % of flights delayed, by month Jan..Dec. */
  delayByMonth: number[] | null;
  direct: { airlines: string; duration: string } | null;
};

export type RouteAirport = {
  code: string;
  city: string;
  name: string;
  /** IANA time zone, used to compute the clock change. */
  tz: string;
  lat: number;
  lon: number;
  /** City-level header photo (free-licence stock). */
  photo?: string;
};

type RouteDef = {
  from: string;
  to: string;
  /** Short, checked facts that the data can't tell you. */
  tips: string[];
  guide?: { label: string; href: string };
};

const P = {
  orlando:
    "https://images.pexels.com/photos/20486251/pexels-photo-20486251.jpeg?auto=compress&cs=tinysrgb&w=1600&h=640&fit=crop",
  vegas: "https://images.unsplash.com/photo-1634400139456-292e44ca5327?auto=format&fit=crop&w=1600&h=640&q=65",
  hawaii: "https://images.unsplash.com/photo-1524565308556-b777381b2f73?auto=format&fit=crop&w=1600&h=640&q=65",
  nyc: "https://images.unsplash.com/photo-1588384153148-ebd739ac430c?auto=format&fit=crop&w=1600&h=640&q=65",
  india:
    "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1600&h=640&fit=crop",
};

export const routeAirports: Record<string, RouteAirport> = {
  JFK: { code: "JFK", city: "New York", name: "John F. Kennedy International", tz: "America/New_York", lat: 40.6413, lon: -73.7781, photo: P.nyc },
  EWR: { code: "EWR", city: "Newark", name: "Newark Liberty International", tz: "America/New_York", lat: 40.6895, lon: -74.1745, photo: P.nyc },
  MCO: { code: "MCO", city: "Orlando", name: "Orlando International", tz: "America/New_York", lat: 28.4312, lon: -81.3081, photo: P.orlando },
  ATL: { code: "ATL", city: "Atlanta", name: "Hartsfield-Jackson Atlanta International", tz: "America/New_York", lat: 33.6407, lon: -84.4277 },
  BOS: { code: "BOS", city: "Boston", name: "Boston Logan International", tz: "America/New_York", lat: 42.3656, lon: -71.0096 },
  ORD: { code: "ORD", city: "Chicago", name: "Chicago O'Hare International", tz: "America/Chicago", lat: 41.9742, lon: -87.9073 },
  LAX: { code: "LAX", city: "Los Angeles", name: "Los Angeles International", tz: "America/Los_Angeles", lat: 33.9416, lon: -118.4085 },
  SFO: { code: "SFO", city: "San Francisco", name: "San Francisco International", tz: "America/Los_Angeles", lat: 37.6213, lon: -122.379 },
  SEA: { code: "SEA", city: "Seattle", name: "Seattle-Tacoma International", tz: "America/Los_Angeles", lat: 47.4502, lon: -122.3088 },
  MIA: { code: "MIA", city: "Miami", name: "Miami International", tz: "America/New_York", lat: 25.7959, lon: -80.287 },
  LAS: { code: "LAS", city: "Las Vegas", name: "Harry Reid International", tz: "America/Los_Angeles", lat: 36.084, lon: -115.1537, photo: P.vegas },
  HNL: { code: "HNL", city: "Honolulu", name: "Daniel K. Inouye International", tz: "Pacific/Honolulu", lat: 21.3245, lon: -157.9251, photo: P.hawaii },
  DEL: { code: "DEL", city: "New Delhi", name: "Indira Gandhi International", tz: "Asia/Kolkata", lat: 28.5562, lon: 77.1, photo: P.india },
  BOM: { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International", tz: "Asia/Kolkata", lat: 19.0896, lon: 72.8656 },
};

const G = {
  orlando: { label: "Cheapest time to fly to Orlando", href: "/guides/cheapest-time-to-fly-to-orlando" },
  vegas: { label: "Cheapest time to fly to Las Vegas", href: "/guides/cheapest-time-to-fly-to-las-vegas" },
  hawaii: { label: "Cheapest time to fly to Hawaii", href: "/guides/cheapest-time-to-fly-to-hawaii" },
  nyc: { label: "Cheapest time to fly to New York", href: "/guides/cheapest-time-to-fly-to-new-york" },
  india: { label: "Cheapest time to fly to India from the USA", href: "/guides/cheapest-time-to-fly-to-india-from-usa" },
};

const HAWAII_DST =
  "Hawaii does not use daylight saving time, so the clock difference with the mainland is one hour bigger in winter than in summer.";
const HAWAII_AG =
  "Hawaii asks arriving passengers to complete a plants-and-animals declaration, and fresh fruit and plants are restricted, so check before you pack food.";
const INDIA_VISA =
  "US citizens need an Indian visa before they fly; tourists can apply online for an e-Visa. Check the official Indian e-Visa site for current rules.";

const routes: RouteDef[] = [
  {
    from: "JFK",
    to: "MCO",
    tips: [
      "New York has three big airports. LaGuardia (LGA) and Newark (EWR) also fly nonstop to Orlando, so compare all three before you book.",
      "Orlando International (MCO) is the main airport for Walt Disney World and Universal. Orlando Sanford (SFB), farther north, is mostly served by Allegiant.",
    ],
    guide: G.orlando,
  },
  {
    from: "ATL",
    to: "MCO",
    tips: [
      "Atlanta and Orlando are both on Eastern Time, so there is no clock change.",
      "This is one of the cheapest routes to Orlando in our data, so it is often worth checking even if you are flying from farther away and connecting in Atlanta.",
    ],
    guide: G.orlando,
  },
  {
    from: "BOS",
    to: "MCO",
    tips: [
      "Fares jump in April compared with March in this data; the Massachusetts April school vacation week is a likely reason, so book early if you are travelling then.",
      "Providence (PVD) and Manchester (MHT) also have Orlando flights and can be worth comparing.",
    ],
    guide: G.orlando,
  },
  {
    from: "ORD",
    to: "MCO",
    tips: [
      "Chicago Midway (MDW) also has Orlando flights, so compare both Chicago airports.",
      "Chicago is on Central Time and Orlando on Eastern Time: clocks go forward one hour when you land.",
    ],
    guide: G.orlando,
  },
  {
    from: "LAX",
    to: "LAS",
    tips: [
      "Las Vegas's airport was renamed Harry Reid International in December 2021; it still uses the code LAS.",
      "Burbank (BUR), Long Beach (LGB) and Ontario (ONT) also have Las Vegas flights, which can be quicker to reach than LAX.",
    ],
    guide: G.vegas,
  },
  {
    from: "ORD",
    to: "LAS",
    tips: [
      "Chicago Midway (MDW) also has Las Vegas flights, so compare both Chicago airports.",
      "Big conventions and holiday weekends push up Las Vegas fares; if your dates are flexible, check a week either side.",
    ],
    guide: G.vegas,
  },
  { from: "LAX", to: "HNL", tips: [HAWAII_DST, HAWAII_AG], guide: G.hawaii },
  { from: "SFO", to: "HNL", tips: [HAWAII_DST, "Oakland (OAK) and San Jose (SJC) also have Hawaii flights, so compare all three Bay Area airports."], guide: G.hawaii },
  { from: "SEA", to: "HNL", tips: [HAWAII_DST, HAWAII_AG], guide: G.hawaii },
  {
    from: "LAX",
    to: "JFK",
    tips: [
      "Flights from Los Angeles to New York also land at Newark (EWR), which can be cheaper or closer depending on where you are going.",
      "Eastbound overnight (red-eye) flights land early in the morning and can save a hotel night.",
    ],
    guide: G.nyc,
  },
  {
    from: "MIA",
    to: "JFK",
    tips: [
      "Fort Lauderdale (FLL), north of Miami, often has lower fares to New York and is worth comparing.",
      "LaGuardia (LGA) and Newark (EWR) also have Miami flights, so compare all three New York airports.",
    ],
    guide: G.nyc,
  },
  {
    from: "JFK",
    to: "DEL",
    tips: [INDIA_VISA, "December and June–July are peak months for this route (holidays and summer), so book those dates early."],
    guide: G.india,
  },
  {
    from: "EWR",
    to: "BOM",
    tips: [INDIA_VISA, "The nonstop is a very long flight; a one-stop trip via Europe or the Gulf can be cheaper and break up the journey."],
    guide: G.india,
  },
];

export type RoutePage = {
  slug: string;
  from: RouteAirport;
  to: RouteAirport;
  data: RouteFareData;
  tips: string[];
  guide?: { label: string; href: string } | undefined;
};

export const routeSlug = (from: string, to: string) => `${from.toLowerCase()}-to-${to.toLowerCase()}`;

export const routePages: RoutePage[] = routes.flatMap((r) => {
  const data = routeFareData[`${r.from}-${r.to}`];
  const from = routeAirports[r.from];
  const to = routeAirports[r.to];
  if (!data || !from || !to || data.monthly.length !== 12) return [];
  return [{ slug: routeSlug(r.from, r.to), from, to, data, tips: r.tips, guide: r.guide }];
});

export const routePageBySlug = (slug: string) => routePages.find((r) => r.slug === slug);

/* ---------- computed insights (pure functions, unit-tested) ---------- */

export const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const DAYS_LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const DEPART_LABELS = ["morning", "afternoon", "evening", "night"];

const argMin = (v: number[]) => v.indexOf(Math.min(...v));
const argMax = (v: number[]) => v.indexOf(Math.max(...v));

/** Great-circle distance in miles. */
export function distanceMiles(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round(3958.8 * 2 * Math.asin(Math.sqrt(h)));
}

/** UTC offset in minutes for a zone on a given date. */
function offsetMinutes(tz: string, date: Date) {
  const part = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "longOffset" })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName")?.value;
  const m = part?.match(/GMT([+-])(\d{2}):?(\d{2})?/);
  if (!m) return 0;
  return (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] ?? 0));
}

/** Clock change (hours, destination minus origin) in January and July. */
export function clockChange(from: string, to: string) {
  const jan = new Date(Date.UTC(2027, 0, 15, 12));
  const jul = new Date(Date.UTC(2027, 6, 15, 12));
  return {
    winter: (offsetMinutes(to, jan) - offsetMinutes(from, jan)) / 60,
    summer: (offsetMinutes(to, jul) - offsetMinutes(from, jul)) / 60,
  };
}

export const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export function routeInsights(p: RoutePage) {
  const d = p.data;
  const m = d.monthly;
  const cheapIdx = argMin(m);
  const peakIdx = argMax(m);
  const avg = d.range?.[2] ?? Math.round(m.reduce((a, b) => a + b, 0) / 12);
  const monthSavingPct = Math.round((1 - m[cheapIdx]! / m[peakIdx]!) * 100);

  const day = d.weekday && d.weekday.length === 7 ? { cheap: argMin(d.weekday), peak: argMax(d.weekday) } : null;

  let book: { weeks: number; price: number; lastMinute: number; savingPct: number } | null = null;
  if (d.bookWeeks && d.bookWeeks.length >= 4) {
    const w = d.bookWeeks;
    const i = argMin(w);
    const last = w[w.length - 1]!;
    book = { weeks: w.length - i, price: w[i]!, lastMinute: last, savingPct: Math.round((1 - w[i]! / last) * 100) };
  }

  const directPerWeek = d.directPerDay ? d.directPerDay.reduce((a, b) => a + b, 0) : 0;
  const cheapestAirline = [...d.cheapestAirlines].sort((a, b) => a.price - b.price)[0] ?? null;
  const punctual = d.onTime[0] ?? null;
  const departPeak = d.departTimes && d.departTimes.some((x) => x > 0) ? argMax(d.departTimes) : null;
  const delay =
    d.delayByMonth && d.delayByMonth.length === 12
      ? { worst: argMax(d.delayByMonth), best: argMin(d.delayByMonth), worstPct: Math.max(...d.delayByMonth), bestPct: Math.min(...d.delayByMonth) }
      : null;

  return {
    cheapIdx,
    peakIdx,
    cheapPrice: m[cheapIdx]!,
    peakPrice: m[peakIdx]!,
    monthSavingPct,
    avg,
    /** Lowest price we can honestly quote: the cheapest month or the bottom of the typical range. */
    fromPrice: Math.min(d.range?.[0] ?? Infinity, ...m),
    low: d.range?.[0] ?? Math.min(...m),
    high: d.range?.[1] ?? Math.max(...m),
    day,
    book,
    directPerWeek,
    cheapestAirline,
    punctual,
    departPeak,
    delay,
    miles: distanceMiles(p.from, p.to),
    clock: clockChange(p.from.tz, p.to.tz),
  };
}

export type RouteInsights = ReturnType<typeof routeInsights>;

const hrs = (h: number) => {
  const a = Math.abs(h);
  return `${a} hour${a === 1 ? "" : "s"}`;
};

export function clockText(c: { winter: number; summer: number }) {
  const one = (h: number) => (h === 0 ? "no change" : `${hrs(h)} ${h > 0 ? "ahead" : "behind"}`);
  if (c.winter === c.summer) return c.winter === 0 ? "Same time zone" : one(c.winter);
  return `${one(c.winter)} in winter, ${one(c.summer)} in summer`;
}

/** "Honolulu is 3 hours behind Los Angeles in winter and 2 hours behind in summer." */
export function clockSentence(fromCity: string, toCity: string, c: { winter: number; summer: number }) {
  const dir = (h: number) => (h > 0 ? "ahead of" : "behind");
  if (c.winter === 0 && c.summer === 0) return `${toCity} is in the same time zone as ${fromCity}.`;
  if (c.winter === c.summer) return `${toCity} is ${hrs(c.winter)} ${dir(c.winter)} ${fromCity}.`;
  return `${toCity} is ${hrs(c.winter)} ${dir(c.winter)} ${fromCity} in winter and ${hrs(c.summer)} ${dir(c.summer).replace(" of", "")} in summer.`;
}

/** Route-specific FAQ, every answer built from this route's numbers. */
export function routeFaqs(p: RoutePage, x: RouteInsights) {
  const A = `${p.from.city} (${p.from.code})`;
  const B = `${p.to.city} (${p.to.code})`;
  const faqs: { q: string; a: string }[] = [
    {
      q: `What is the cheapest month to fly from ${p.from.city} to ${p.to.city}?`,
      a: `${MONTHS_LONG[x.cheapIdx]} is the cheapest month in KAYAK's data, at about ${usd(x.cheapPrice)} round trip. ${MONTHS_LONG[x.peakIdx]} is the most expensive at about ${usd(x.peakPrice)}, so the cheapest month costs ${x.monthSavingPct}% less.`,
    },
    {
      q: `How much is a flight from ${A} to ${B}?`,
      a: `A typical round trip costs ${usd(x.low)} to ${usd(x.high)}, with an average of about ${usd(x.avg)} (KAYAK, last 12 months). Today's fares can be higher or lower; search your dates to see live prices.`,
    },
  ];
  if (x.book) {
    faqs.push({
      q: `How far ahead should I book ${p.from.code} to ${p.to.code}?`,
      a: `Fares were lowest about ${x.book.weeks} weeks before departure (around ${usd(x.book.price)}), compared with about ${usd(x.book.lastMinute)} in the final week, a saving of ${x.book.savingPct}%.`,
    });
  }
  if (x.day) {
    faqs.push({
      q: `What is the cheapest day to fly from ${p.from.city} to ${p.to.city}?`,
      a: `${DAYS_LONG[x.day.cheap]} departures were cheapest in KAYAK's data, at about ${usd(p.data.weekday![x.day.cheap]!)} round trip; ${DAYS_LONG[x.day.peak]} was the most expensive day, at about ${usd(p.data.weekday![x.day.peak]!)}.`,
    });
  }
  faqs.push({
    q: `Are there nonstop flights from ${p.from.code} to ${p.to.code}?`,
    a:
      x.directPerWeek > 0
        ? `Yes. KAYAK counts about ${x.directPerWeek} direct flights a week${p.data.direct ? `, flown by ${p.data.direct.airlines}, taking about ${p.data.direct.duration}` : ""}.`
        : `KAYAK shows no regular direct flights on this route, so plan for at least one stop.`,
  });
  faqs.push({
    q: `How far is ${p.from.city} from ${p.to.city} and is there a time difference?`,
    a: `The airports are about ${x.miles.toLocaleString("en-US")} miles apart in a straight line. ${clockSentence(p.from.city, p.to.city, x.clock)}`,
  });
  if (x.cheapestAirline) {
    faqs.push({
      q: `Which airline is cheapest from ${p.from.city} to ${p.to.city}?`,
      a: `${x.cheapestAirline.name} had the lowest typical round trip in KAYAK's data, at about ${usd(x.cheapestAirline.price)}.${x.punctual ? ` ${x.punctual.name} was the most punctual, on time about ${Math.round(x.punctual.pct)}% of the time.` : ""}`,
    });
  }
  return faqs;
}

/** Other route pages sharing this route's origin or destination (for internal links). */
export function relatedRoutes(p: RoutePage) {
  const score = (r: RoutePage) =>
    (r.to.city === p.to.city ? 2 : 0) + (r.from.code === p.to.code && r.to.code === p.from.code ? 3 : 0) + (r.from.code === p.from.code ? 1 : 0);
  return routePages
    .filter((r) => r.slug !== p.slug && score(r) > 0)
    .sort((a, b) => score(b) - score(a));
}
