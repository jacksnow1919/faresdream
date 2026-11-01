import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Plane } from "lucide-react";
import { ScrollRow } from "@/components/site/ScrollRow";
import { showFlightsTo } from "@/lib/focus-search";

type Destination = {
  city: string;
  /** Airport code searched as the destination. */
  code: string;
  /** Unsplash photo id (free Unsplash License). */
  photo: string;
};

const TABS = [
  {
    id: "international",
    label: "International",
    destinations: [
      { city: "London", code: "LHR", photo: "1454793147212-9e7e57e89a4f" },
      { city: "Paris", code: "CDG", photo: "1439393161192-32360eb753f1" },
      { city: "Rome", code: "FCO", photo: "1632851853187-dae5c83372dc" },
      { city: "Dubai", code: "DXB", photo: "1635857161777-2383f2e4a82d" },
      { city: "Tokyo", code: "HND", photo: "1714197279362-0d5b155bb974" },
      { city: "Sydney", code: "SYD", photo: "1595740229246-cfdda61917c6" },
      { city: "Singapore", code: "SIN", photo: "1761138785953-a49d2488d8cd" },
      { city: "Istanbul", code: "IST", photo: "1527838832700-5059252407fa" },
    ],
  },
  {
    id: "usa",
    label: "USA & Around",
    destinations: [
      { city: "New York", code: "JFK", photo: "1588384153148-ebd739ac430c" },
      { city: "Las Vegas", code: "LAS", photo: "1634400139456-292e44ca5327" },
      { city: "Miami", code: "MIA", photo: "1647188234388-62f4b82ca08c" },
      { city: "Los Angeles", code: "LAX", photo: "1640809307933-566bfa1d21d6" },
      { city: "San Francisco", code: "SFO", photo: "1524523762086-bcecce3611f3" },
      { city: "Honolulu", code: "HNL", photo: "1524565308556-b777381b2f73" },
      { city: "Cancún", code: "CUN", photo: "1772656945540-77583e484667" },
      { city: "Toronto", code: "YYZ", photo: "1603466184840-715063d3e1e3" },
    ],
  },
] as const satisfies readonly { id: string; label: string; destinations: Destination[] }[];

/** ~2 cards per view on phones up to 6 on wide screens (ScrollRow gap is 1.25rem). */
const ITEM_CLS =
  "w-[42%] shrink-0 snap-start sm:w-[calc((100%-2.5rem)/3)] md:w-[calc((100%-3.75rem)/4)] lg:w-[calc((100%-5rem)/5)] xl:w-[calc((100%-6.25rem)/6)]";

const photoUrl = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${Math.round(w * 1.5)}&q=70`;

function DestinationCard({ d }: { d: Destination }) {
  return (
    <button
      type="button"
      onClick={() => showFlightsTo(d.code)}
      aria-label={`Search flights to ${d.city} (${d.code})`}
      className={`group relative block aspect-[2/3] overflow-hidden rounded-full bg-muted text-white shadow-card transition hover:-translate-y-1 hover:shadow-lux ${ITEM_CLS}`}
    >
      <img
        src={photoUrl(d.photo, 300)}
        srcSet={`${photoUrl(d.photo, 300)} 1x, ${photoUrl(d.photo, 600)} 2x`}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
      />
      <span className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-black/55 via-black/20 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/45 to-transparent" />

      <span className="absolute inset-x-3 top-[14%] flex flex-col items-center text-center [text-shadow:0_2px_10px_rgb(0_0_0/0.35)]">
        <span className="font-display text-xl font-extrabold uppercase leading-none tracking-wide sm:text-2xl">
          {d.city}
        </span>
        <span className="mt-1.5 text-xs font-semibold tracking-widest text-white/90">{d.code}</span>
      </span>

      <span className="absolute bottom-[10%] left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-bold text-navy shadow transition md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
        <Plane className="size-3.5" /> Find flights
      </span>
    </button>
  );
}

/** Trending destinations with International / USA tabs; a card shows flights there from the search widget's origin. */
export function TrendingDestinations({ heading }: { heading: ReactNode }) {
  const [tabId, setTabId] = useState<(typeof TABS)[number]["id"]>("international");
  const tab = TABS.find((t) => t.id === tabId) ?? TABS[0];

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        {heading}
        <div
          role="tablist"
          aria-label="Destination region"
          className="inline-flex self-start rounded-full bg-muted p-1 sm:self-auto"
        >
          {TABS.map((t) => {
            const active = t.id === tabId;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTabId(t.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 ${
                  active
                    ? "bg-navy text-navy-foreground shadow-card"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        {/* Remount per tab so the row starts from the first card. */}
        <ScrollRow key={tab.id} label={`${tab.label} destinations`}>
          {tab.destinations.map((d) => (
            <DestinationCard key={d.code} d={d} />
          ))}
        </ScrollRow>
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/destinations"
          className="inline-flex items-center gap-1.5 rounded-full bg-navy px-6 py-3 text-sm font-bold text-navy-foreground shadow-card transition hover:brightness-110"
        >
          Explore Now <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </>
  );
}
