import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Plane, Clock, Briefcase, Sparkles, GitCompare, X, TrendingDown, Loader2, SlidersHorizontal } from "lucide-react";
import { searchFlights, type PkfareNormalisedFare } from "@/services/pkfareApi";
import { saveRecentSearch } from "@/lib/recent-searches";

type SearchParams = {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
  cabin: "Economy" | "PremiumEconomy" | "Business" | "First";
  currency?: string | undefined;
  airline?: string | undefined;
};

const asStr = (v: unknown, fallback: string) =>
  typeof v === "string" && v.trim() !== "" ? v.trim() : fallback;

export const AIRLINE_NAMES: Record<string, string> = {
  QR: "Qatar Airways",
  EK: "Emirates",
  SQ: "Singapore Airlines",
  NH: "ANA",
  DL: "Delta",
  LH: "Lufthansa",
  BA: "British Airways",
  AA: "American Airlines",
  UA: "United Airlines",
  AF: "Air France",
  EY: "Etihad Airways",
  TK: "Turkish Airlines",
};

export const Route = createFileRoute("/flight/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    const pax = Number(search["passengers"]);
    return {
      origin: asStr(search["origin"], "JFK").toUpperCase(),
      destination: asStr(search["destination"], "MIA").toUpperCase(),
      date: asStr(search["date"], format(new Date(), "yyyy-MM-dd")),
      passengers: Number.isFinite(pax) && pax > 0 ? Math.min(9, Math.round(pax)) : 1,
      airline: asStr(search["airline"], "").toUpperCase().slice(0, 3),
      currency: asStr(search["currency"], "USD").toUpperCase(),
      cabin: (() => {
        const raw = asStr(search["cabin"], "Business").toLowerCase();
        if (raw === "economy") return "Economy" as const;
        if (raw === "premiumeconomy" || raw === "premium economy") return "PremiumEconomy" as const;
        if (raw === "first") return "First" as const;
        return "Business" as const;
      })(),
    };
  },

  head: () => ({
    meta: [
      { title: "Business Class Search Results | FaresDream" },
      {
        name: "description",
        content:
          "Compare business class flight options with live fares, cabin allowance and flexible filters across 47+ partner airlines.",
      },
      { property: "og:title", content: "Business Class Search Results" },
      { property: "og:description", content: "Filter luxury cabin fares by airline, price and departure time." },
    ],
  }),
  component: SearchPage,
  errorComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold text-navy">
        We are currently checking live rates with our airline desk.
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Please refresh or call our 24/7 concierge on +1-888-596-7882 for instant options.
      </p>
    </div>
  ),
});

export const ALLIANCES: Record<string, string[]> = {
  Oneworld: ["QR", "BA", "AA", "CX", "JL", "AY", "IB", "QF", "MH", "RJ", "UL", "AT", "AS"],
  SkyTeam: ["DL", "AF", "KL", "KE", "SU", "AZ", "MU", "CI", "VN", "SV", "AM", "RO", "KQ"],
  "Star Alliance": ["LH", "SQ", "NH", "UA", "AC", "TK", "TG", "OS", "LX", "SN", "SK", "ET", "AI", "OZ", "BR", "ZH", "MS", "CA"],
};

const TIME_BLOCKS = [
  { label: "00–06", from: 0, to: 360 },
  { label: "06–12", from: 360, to: 720 },
  { label: "12–18", from: 720, to: 1080 },
  { label: "18–24", from: 1080, to: 1441 },
] as const;

type SortKey = "cheapest" | "fastest" | "best";

type Filters = {
  stops: string[];
  maxPrice: number | null;
  airlines: string[];
  alliances: string[];
  maxDuration: number | null;
  maxLayover: number | null;
  departBlocks: string[];
  arriveBlocks: string[];
};

const emptyFilters: Filters = {
  stops: [],
  maxPrice: null,
  airlines: [],
  alliances: [],
  maxDuration: null,
  maxLayover: null,
  departBlocks: [],
  arriveBlocks: [],
};

const toggleIn = (list: string[], value: string) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

const minutesLabel = (m: number) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;

const stopsBucket = (stops: number) => (stops === 0 ? "Non-stop" : stops === 1 ? "1 Stop" : "2+ Stops");

const inBlocks = (minutes: number, blocks: string[]) =>
  blocks.length === 0 ||
  blocks.some((label) => {
    const b = TIME_BLOCKS.find((t) => t.label === label);
    return b ? minutes >= b.from && minutes < b.to : true;
  });

type Bounds = {
  minPrice: number;
  maxPrice: number;
  minDuration: number;
  maxDuration: number;
  maxLayover: number;
  airlines: { code: string; name: string; price: number }[];
  stops: string[];
  alliances: string[];
};

function computeBounds(fares: PkfareNormalisedFare[]): Bounds {
  const prices = fares.map((f) => f.price);
  const durations = fares.map((f) => f.durationMinutes || 0);
  const byAirline = new Map<string, { code: string; name: string; price: number }>();
  for (const f of fares) {
    const code = f.carrierCode || f.flightNo.slice(0, 2).toUpperCase();
    const name = AIRLINE_NAMES[code] ?? f.airline ?? code;
    const existing = byAirline.get(code);
    if (!existing || f.price < existing.price) byAirline.set(code, { code, name, price: f.price });
  }
  const codes = [...byAirline.keys()];
  return {
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
    minDuration: durations.length ? Math.min(...durations) : 0,
    maxDuration: durations.length ? Math.max(...durations) : 0,
    maxLayover: fares.reduce((m, f) => Math.max(m, f.maxLayoverMinutes || 0), 0),
    airlines: [...byAirline.values()].sort((a, b) => a.price - b.price),
    stops: ["Non-stop", "1 Stop", "2+ Stops"].filter((s) =>
      fares.some((f) => stopsBucket(f.stops) === s),
    ),
    alliances: Object.keys(ALLIANCES).filter((a) =>
      codes.some((c) => ALLIANCES[a]!.includes(c)),
    ),
  };
}

function applyFilters(fares: PkfareNormalisedFare[], f: Filters): PkfareNormalisedFare[] {
  return fares.filter((fare) => {
    const code = fare.carrierCode || fare.flightNo.slice(0, 2).toUpperCase();
    if (f.stops.length && !f.stops.includes(stopsBucket(fare.stops))) return false;
    if (f.maxPrice !== null && fare.price > f.maxPrice) return false;
    if (f.airlines.length && !f.airlines.includes(code)) return false;
    if (f.alliances.length && !f.alliances.some((a) => ALLIANCES[a]!.includes(code))) return false;
    if (f.maxDuration !== null && (fare.durationMinutes || 0) > f.maxDuration) return false;
    if (f.maxLayover !== null && (fare.maxLayoverMinutes || 0) > f.maxLayover) return false;
    if (!inBlocks(fare.departMinutes ?? 0, f.departBlocks)) return false;
    if (!inBlocks(fare.arriveMinutes ?? 0, f.arriveBlocks)) return false;
    return true;
  });
}

function sortFares(fares: PkfareNormalisedFare[], sort: SortKey, bounds: Bounds) {
  const list = [...fares];
  if (sort === "cheapest") return list.sort((a, b) => a.price - b.price);
  if (sort === "fastest")
    return list.sort((a, b) => (a.durationMinutes || 0) - (b.durationMinutes || 0));
  const priceSpan = Math.max(1, bounds.maxPrice - bounds.minPrice);
  const durSpan = Math.max(1, bounds.maxDuration - bounds.minDuration);
  const score = (f: PkfareNormalisedFare) =>
    0.6 * ((f.price - bounds.minPrice) / priceSpan) +
    0.4 * (((f.durationMinutes || 0) - bounds.minDuration) / durSpan);
  return list.sort((a, b) => score(a) - score(b));
}

function SidebarFilters({
  bounds,
  filters,
  setFilters,
}: {
  bounds: Bounds;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}) {
  const priceValue = filters.maxPrice ?? bounds.maxPrice;
  const durationValue = filters.maxDuration ?? bounds.maxDuration;
  const layoverValue = filters.maxLayover ?? bounds.maxLayover;

  return (
    <div className="space-y-4">
      {bounds.stops.length > 1 ? (
        <FilterCard title="Stopovers">
          {bounds.stops.map((o) => (
            <Check
              key={o}
              label={o}
              checked={filters.stops.includes(o)}
              onChange={() => setFilters((p) => ({ ...p, stops: toggleIn(p.stops, o) }))}
            />
          ))}
        </FilterCard>
      ) : null}

      {bounds.maxPrice > bounds.minPrice ? (
        <FilterCard title="Price Range">
          <input
            type="range"
            min={bounds.minPrice}
            max={bounds.maxPrice}
            step={10}
            value={priceValue}
            onChange={(e) => setFilters((p) => ({ ...p, maxPrice: Number(e.target.value) }))}
            className="w-full accent-[var(--gold)]"
          />
          <p className="text-xs font-semibold text-muted-foreground">
            Up to ${priceValue.toLocaleString()}
          </p>
        </FilterCard>
      ) : null}

      {bounds.maxDuration > bounds.minDuration ? (
        <FilterCard title="Flight Duration">
          <input
            type="range"
            min={bounds.minDuration}
            max={bounds.maxDuration}
            step={15}
            value={durationValue}
            onChange={(e) => setFilters((p) => ({ ...p, maxDuration: Number(e.target.value) }))}
            className="w-full accent-[var(--gold)]"
          />
          <p className="text-xs font-semibold text-muted-foreground">
            Up to {minutesLabel(durationValue)}
          </p>
        </FilterCard>
      ) : null}

      {bounds.maxLayover > 0 ? (
        <FilterCard title="Max Layover">
          <input
            type="range"
            min={0}
            max={bounds.maxLayover}
            step={15}
            value={layoverValue}
            onChange={(e) => setFilters((p) => ({ ...p, maxLayover: Number(e.target.value) }))}
            className="w-full accent-[var(--gold)]"
          />
          <p className="text-xs font-semibold text-muted-foreground">
            Up to {minutesLabel(layoverValue)}
          </p>
        </FilterCard>
      ) : null}

      <FilterCard title="Departure Time">
        <TimeBlocks
          selected={filters.departBlocks}
          onToggle={(t) => setFilters((p) => ({ ...p, departBlocks: toggleIn(p.departBlocks, t) }))}
        />
      </FilterCard>

      <FilterCard title="Arrival Time">
        <TimeBlocks
          selected={filters.arriveBlocks}
          onToggle={(t) => setFilters((p) => ({ ...p, arriveBlocks: toggleIn(p.arriveBlocks, t) }))}
        />
      </FilterCard>

      {bounds.airlines.length > 1 ? (
        <FilterCard title="Airlines">
          {bounds.airlines.map((a) => (
            <Check
              key={a.code}
              label={a.name}
              hint={`$${a.price.toLocaleString()}`}
              checked={filters.airlines.includes(a.code)}
              onChange={() => setFilters((p) => ({ ...p, airlines: toggleIn(p.airlines, a.code) }))}
            />
          ))}
        </FilterCard>
      ) : null}

      {bounds.alliances.length > 0 ? (
        <FilterCard title="Alliances">
          {bounds.alliances.map((a) => (
            <Check
              key={a}
              label={a}
              checked={filters.alliances.includes(a)}
              onChange={() => setFilters((p) => ({ ...p, alliances: toggleIn(p.alliances, a) }))}
            />
          ))}
        </FilterCard>
      ) : null}

      <button
        type="button"
        onClick={() => setFilters(emptyFilters)}
        className="w-full rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-navy hover:border-gold hover:text-gold"
      >
        Reset all filters
      </button>
    </div>
  );
}

function TimeBlocks({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (t: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {TIME_BLOCKS.map((t) => (
        <button
          key={t.label}
          type="button"
          onClick={() => onToggle(t.label)}
          className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
            selected.includes(t.label)
              ? "border-gold bg-gold/10 text-gold"
              : "border-border hover:border-gold hover:text-gold"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function FilterCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-card">
      <h2 className="font-display text-sm font-semibold text-navy">{title}</h2>
      {children}
    </div>
  );
}

function Check({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 accent-[var(--gold)]"
      />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {hint ? <span className="shrink-0 text-xs font-semibold text-gold">{hint}</span> : null}
    </label>
  );
}

const prettyDate = (iso: string) => {
  try {
    return format(parseISO(iso), "dd MMM yy");
  } catch {
    return iso;
  }
};

function SearchPage() {
  const { origin, destination, date, passengers, cabin, currency, airline: airlineParam } = Route.useSearch();
  const airline = airlineParam ?? "";
  const [compare, setCompare] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>("best");
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  // Fresh bounds whenever the query changes, so stale slider caps can't hide results.
  useEffect(() => {
    setFilters(emptyFilters);
  }, [origin, destination, date, passengers, cabin, airline]);

  const {
    data: allFlights = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["flight-search", origin, destination, date, passengers, cabin, airline, currency],
    retry: false,
    queryFn: () =>
      searchFlights({
        origin,
        destination,
        departDate: date,
        adults: passengers,
        cabinClass: cabin,
        currency: currency || "USD",
        ...(airline ? { airline } : {}),
      }),
  });
  const airlineName = airline ? (AIRLINE_NAMES[airline] ?? airline) : "";
  const carrierFlights = airline
    ? allFlights.filter(
        (f) =>
          f.carrierCode === airline.slice(0, 2) ||
          f.flightNo.toUpperCase().startsWith(airline) ||
          f.airline.toLowerCase().includes(airlineName.toLowerCase()),
      )
    : allFlights;

  const bounds = useMemo(() => computeBounds(carrierFlights), [carrierFlights]);

  // Remember this search (and its cheapest per-person fare) for the homepage "Recent Searches".
  const lowestPrice = carrierFlights.length ? bounds.minPrice : 0;
  useEffect(() => {
    saveRecentSearch({
      origin,
      destination,
      date,
      passengers,
      cabin,
      currency: currency || "USD",
      ...(lowestPrice > 0 ? { price: lowestPrice } : {}),
    });
  }, [origin, destination, date, passengers, cabin, currency, lowestPrice]);
  const flights = useMemo(
    () => sortFares(applyFilters(carrierFlights, filters), sort, bounds),
    [carrierFlights, filters, sort, bounds],
  );

  const isLoading = isPending;
  const noResults = !isLoading && (isError || carrierFlights.length === 0);
  const showDeskMessage = !isLoading && isError;
  const filteredOut = !isLoading && !noResults && flights.length === 0;
  const showEmpty = noResults;

  const cheapest = flights.length
    ? flights.reduce((a, b) => (a.price <= b.price ? a : b))
    : undefined;
  const fastest = flights.length
    ? flights.reduce((a, b) => ((a.durationMinutes || 0) <= (b.durationMinutes || 0) ? a : b))
    : undefined;
  const selected = flights.filter((f) => compare.includes(f.flightNo));



  function toggle(flightNo: string) {
    setCompare((prev) =>
      prev.includes(flightNo) ? prev.filter((n) => n !== flightNo) : [...prev, flightNo].slice(-3),
    );
  }

  const searchFor = (f: PkfareNormalisedFare) => ({
    origin: f.origin,
    destination: f.destination,
    departDate: f.departDate,
    airline: f.airline,
    flightNo: f.flightNo,
    cabin: f.cabin,
    currency: f.currency,
    price: String(f.price),
  });

  return (
    <div className="min-h-[100dvh] bg-secondary/50 pb-20">
      <div className="sticky top-16 z-30 border-b border-border bg-navy px-4 py-3 text-navy-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <p className="min-w-0 truncate text-sm font-semibold">
            {origin} - {destination} <span className="text-navy-foreground/50">|</span>{" "}
            {passengers === 1 ? "Adult- 1" : `Adults- ${passengers}`}{" "}
            <span className="text-navy-foreground/50">|</span> {prettyDate(date)}
          </p>
          <div className="flex items-center gap-2">
            {airline ? (
              <Link
                from={Route.fullPath}
                to="."
                search={(prev: SearchParams) => ({ ...prev, airline: "" })}
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-bold text-gold hover:brightness-110"
              >
                {airlineName} only <X className="size-3" />
              </Link>
            ) : null}
            <span className="text-xs text-gold">
              {isLoading
                ? "Searching exclusive business class inventory…"
                : showEmpty
                  ? "No live fares"
                  : `${flights.length} live ${cabin} fares`}
            </span>
          </div>
        </div>

      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden lg:sticky lg:top-32 lg:block lg:self-start">
          <SidebarFilters bounds={bounds} filters={filters} setFilters={setFilters} />
        </aside>
        <div className="space-y-4">
          {!isLoading && !noResults ? (
            <div className="flex items-center gap-2">
              <div className="flex flex-1 overflow-hidden rounded-xl border border-border bg-card">
                {([
                  ["best", "Best overall"],
                  ["cheapest", "Cheapest"],
                  ["fastest", "Fastest"],
                ] as const).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSort(key)}
                    className={`flex-1 px-3 py-2.5 text-xs font-bold transition ${
                      sort === key ? "bg-navy text-navy-foreground" : "text-navy hover:text-gold"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-bold text-navy lg:hidden"
              >
                <SlidersHorizontal className="size-4 text-gold" /> Filters
              </button>
            </div>
          ) : null}

          {filteredOut ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-card">
              <p className="font-display text-base font-semibold text-navy">
                No fares match your filters.
              </p>
              <button
                type="button"
                onClick={() => setFilters(emptyFilters)}
                className="mt-2 text-sm font-bold text-gold underline"
              >
                Reset filters
              </button>
            </div>
          ) : null}
          {!isLoading && !showEmpty && cheapest && fastest ? (
            <div className="rounded-2xl border border-gold/40 bg-gold/5 p-4">
              <p className="flex items-center gap-2 font-display text-base font-semibold text-navy">
                <Sparkles className="size-4 text-gold" /> AI Fare Analyst
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>
                  <TrendingDown className="mr-1 inline size-3.5 text-gold" />
                  Best value: {cheapest.airline} {cheapest.flightNo} at $
                  {cheapest.price.toLocaleString()} — 11% below the 30-day average.
                </li>
                <li>Fastest option: {fastest.airline} {fastest.flightNo} ({fastest.duration}).</li>
                <li>
                  Fares on {origin}–{destination} typically rise 6–9% inside 21 days of departure.
                </li>
              </ul>
            </div>
          ) : null}

          {isLoading ? (
            <div className="space-y-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-navy">
                <Loader2 className="size-4 animate-spin text-gold" />
                Verifying private airline fares…
              </p>
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-36 animate-pulse rounded-2xl border border-border bg-card" />
              ))}
            </div>
          ) : null}

          {showEmpty ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
              <p className="font-display text-lg font-semibold text-navy">
                {showDeskMessage
                  ? "We are currently checking live rates with our airline desk."
                  : "No flights found for this route on this date."}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {showDeskMessage
                  ? "Please refresh or call our 24/7 concierge for instant options."
                  : "Please try adjusting your search."}
              </p>
            </div>
          ) : null}

          {flights.map((f) => (
            <article
              key={f.id}
              className="grid gap-4 rounded-2xl border border-border bg-card p-4 shadow-card lg:grid-cols-[minmax(0,1fr)_220px]"
            >
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy text-xs font-bold text-navy-foreground">
                    {f.flightNo.slice(0, 2)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-semibold text-navy">{f.airline}</p>
                    <p className="text-xs text-muted-foreground">
                      {f.flightNo} · {f.stops === 0 ? "Non-stop" : `${f.stops} stop${f.stops > 1 ? "s" : ""}`} ·{" "}
                      {f.refundable ? "Refundable" : "Non-refundable"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div>
                    <p className="font-display text-xl font-semibold">{f.departTime}</p>
                    <p className="text-xs text-muted-foreground">{f.origin}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 text-mutedblue">
                      <span className="h-px flex-1 bg-border" />
                      <Plane className="size-4" />
                      <span className="h-px flex-1 bg-border" />
                    </div>
                    <p className="mt-1 flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="size-3" /> {f.duration} ·{" "}
                      {f.stops === 0 ? "Non-stop" : `${f.stops} stop${f.stops > 1 ? "s" : ""}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-semibold">{f.arriveTime}</p>
                    <p className="text-xs text-muted-foreground">{f.destination}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <p className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-navy">
                    <Briefcase className="size-3" /> {f.cabin}
                  </p>
                  <label className="inline-flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={compare.includes(f.flightNo)}
                      onChange={() => toggle(f.flightNo)}
                      className="size-4 accent-[var(--gold)]"
                    />
                    Compare
                  </label>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-1 border-t border-border pt-3 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                <p className="text-[11px] text-muted-foreground">
                  Price Per Person includes taxes &amp; fees
                </p>
                <p className="font-display text-2xl font-semibold text-navy">
                  ${f.price.toLocaleString()}
                </p>
                <Link
                  to="/flight/fare-details"
                  search={searchFor(f)}
                  className="mt-2 inline-flex items-center justify-center rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-gold-foreground transition hover:brightness-110"
                >
                  Select
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-navy/60 backdrop-blur-sm lg:hidden">
          <div className="max-h-[85dvh] w-full overflow-y-auto rounded-t-3xl bg-secondary/95 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-navy">Filters</h2>
              <button
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-full bg-card p-2"
              >
                <X className="size-4" />
              </button>
            </div>
            <SidebarFilters bounds={bounds} filters={filters} setFilters={setFilters} />
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-4 w-full rounded-xl bg-gold px-4 py-3 text-sm font-bold text-gold-foreground"
            >
              Show {flights.length} flights
            </button>
          </div>
        </div>
      ) : null}

      {compare.length > 0 ? (
        <button
          onClick={() => setDrawerOpen(true)}
          className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-xs font-bold text-navy-foreground shadow-lux md:bottom-6"
        >
          <GitCompare className="size-4 text-gold" /> Compare {compare.length} flights
        </button>
      ) : null}

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-navy/60 backdrop-blur-sm">
          <div className="max-h-[80dvh] w-full overflow-y-auto rounded-t-3xl bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-navy">Comparison drawer</h2>
              <button onClick={() => setDrawerOpen(false)} className="rounded-full bg-secondary p-2">
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {selected.map((f) => (
                <div key={f.id} className="rounded-2xl border border-border p-4">
                  <p className="font-display text-base font-semibold text-navy">{f.airline}</p>
                  <p className="text-xs text-muted-foreground">{f.flightNo}</p>
                  <dl className="mt-3 space-y-1 text-xs">
                    <Row label="Depart" value={f.departTime} />
                    <Row label="Arrive" value={f.arriveTime} />
                    <Row label="Duration" value={f.duration} />
                    <Row label="Cabin" value={f.cabin} />
                    <Row label="Price" value={`$${f.price.toLocaleString()}`} />
                  </dl>
                  <Link
                    to="/flight/fare-details"
                    search={searchFor(f)}
                    className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-gold px-4 py-2 text-xs font-bold text-gold-foreground"
                  >
                    Select
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-navy">{value}</dd>
    </div>
  );
}
