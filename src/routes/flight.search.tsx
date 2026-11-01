import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowUp,
  ChevronRight,
  History,
  Loader2,
  Phone,
  SlidersHorizontal,
  ThumbsUp,
  X,
} from "lucide-react";
import { searchFlights, type PkfareNormalisedFare } from "@/services/pkfareApi";
import { saveRecentSearch } from "@/lib/recent-searches";
import { saveSelectedFare } from "@/lib/selected-fare";
import { currencySymbol } from "@/lib/flight-search-params";
import { PHONE_DISPLAY, PHONE_TEL, PROMO_CODE } from "@/lib/brand";
import {
  AIRLINE_NAMES,
  airlineNameOf,
  applyFilters,
  carrierOf,
  computeBounds,
  emptyFilters,
  sortFares,
  type Filters,
  type SortKey,
} from "@/lib/fare-filters";
import { DateStrip, ResultsSearchBar } from "@/components/site/ResultsSearchBar";
import { FareFilters } from "@/components/site/FareFilters";
import { FareCard } from "@/components/site/FareCard";
import { FlightSelectModal } from "@/components/site/FlightSelectModal";
import { cityOf } from "@/lib/airports";

type SearchParams = {
  origin: string;
  destination: string;
  date: string;
  /** Present on round trips; fares then cover both directions. */
  returnDate?: string | undefined;
  passengers: number;
  cabin: "Economy" | "PremiumEconomy" | "Business" | "First";
  currency?: string | undefined;
  airline?: string | undefined;
};

const asStr = (v: unknown, fallback: string) =>
  typeof v === "string" && v.trim() !== "" ? v.trim() : fallback;

const isYmd = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);

export const Route = createFileRoute("/flight/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    const pax = Number(search["passengers"]);
    const date = asStr(search["date"], format(new Date(), "yyyy-MM-dd"));
    const returnDate = asStr(search["returnDate"], "");
    return {
      origin: asStr(search["origin"], "JFK").toUpperCase(),
      destination: asStr(search["destination"], "MIA").toUpperCase(),
      date,
      ...(isYmd(returnDate) && returnDate >= date ? { returnDate } : {}),
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
      { title: "Flight Search Results | FaresDream" },
      {
        name: "description",
        content:
          "Compare live flight fares with filters for stops, price, times, airlines and layovers.",
      },
      { property: "og:title", content: "Flight Search Results" },
      {
        property: "og:description",
        content: "Filter live fares by stops, price, airline and departure time.",
      },
    ],
  }),
  component: SearchPage,
  errorComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold text-navy">
        We are currently checking live rates with our airline desk.
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Please refresh or call our 24/7 concierge on {PHONE_DISPLAY} for instant options.
      </p>
    </div>
  ),
});

const money = (amount: number, currency: string) =>
  `${currencySymbol(currency)}${amount.toLocaleString()}`;

/** "06h 05m", as on the sort tabs. */
const clockDuration = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}h ${String(minutes % 60).padStart(2, "0")}m`;

function SearchPage() {
  const search = Route.useSearch();
  const { origin, destination, date, returnDate, passengers, cabin, currency } = search;
  const airline = search.airline ?? "";
  const navigate = Route.useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedFare, setSelectedFare] = useState<PkfareNormalisedFare | null>(null);
  const closeSelected = useCallback(() => setSelectedFare(null), []);
  const [sort, setSort] = useState<SortKey>("cheapest");
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  // Fresh bounds whenever the query changes, so stale slider caps can't hide results.
  useEffect(() => {
    setFilters(emptyFilters);
  }, [origin, destination, date, returnDate, passengers, cabin, airline]);

  const {
    data: allFlights = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: [
      "flight-search",
      origin,
      destination,
      date,
      returnDate,
      passengers,
      cabin,
      airline,
      currency,
    ],
    retry: false,
    queryFn: () =>
      searchFlights({
        origin,
        destination,
        departDate: date,
        ...(returnDate ? { returnDate } : {}),
        adults: passengers,
        cabinClass: cabin,
        currency: currency || "USD",
        ...(airline ? { airline } : {}),
      }),
  });

  const airlineName = airline ? (AIRLINE_NAMES[airline] ?? airline) : "";
  const carrierFlights = useMemo(
    () =>
      airline
        ? allFlights.filter(
            (f) =>
              carrierOf(f) === airline.slice(0, 2) ||
              f.flightNo.toUpperCase().startsWith(airline) ||
              f.airline.toLowerCase().includes(airlineName.toLowerCase()),
          )
        : allFlights,
    [allFlights, airline, airlineName],
  );

  const bounds = useMemo(
    () => computeBounds(carrierFlights, (code) => `${cityOf(code)} (${code})`),
    [carrierFlights],
  );

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
  const showEmpty = !isLoading && (isError || carrierFlights.length === 0);
  const filteredOut = !isLoading && !showEmpty && flights.length === 0;
  const fareCurrency = carrierFlights[0]?.currency ?? currency ?? "USD";
  const fmt = (n: number) => money(n, fareCurrency);

  const cheapest = flights.length
    ? flights.reduce((a, b) => (a.price <= b.price ? a : b))
    : undefined;
  const fastest = flights.length
    ? flights.reduce((a, b) => ((a.durationMinutes || 0) <= (b.durationMinutes || 0) ? a : b))
    : undefined;

  const fromCity = cityOf(origin);
  const toCity = cityOf(destination);

  // Checkout charges `price` as the booking total, so send per-person amounts × travellers.
  const fareDetailsSearch = (f: PkfareNormalisedFare) => ({
    origin: f.origin,
    destination: f.destination,
    departDate: f.departDate,
    ...(f.inbound ? { returnDate: f.inbound.departDate } : {}),
    airline: f.airline,
    flightNo: f.flightNo,
    cabin: f.cabin,
    currency: f.currency,
    price: String(f.price * passengers),
    ...(f.baseFare !== undefined && f.taxes !== undefined
      ? { baseFare: String(f.baseFare * passengers), taxes: String(f.taxes * passengers) }
      : {}),
    adults: passengers,
  });

  // Select opens the flight details window; its Continue goes on to the next step.
  const selectButton = (f: PkfareNormalisedFare) => (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => setSelectedFare(f)}
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-navy-foreground transition hover:brightness-110"
    >
      Select
    </button>
  );

  const filterPanel = (
    <FareFilters
      bounds={bounds}
      filters={filters}
      setFilters={setFilters}
      money={fmt}
      fromCity={fromCity}
      toCity={toCity}
    />
  );

  const best = flights.length ? sortFares(flights, "best", bounds)[0] : undefined;
  const sortTabs: { key: SortKey; label: string; fare: PkfareNormalisedFare | undefined }[] = [
    { key: "best", label: "Best", fare: best },
    { key: "cheapest", label: "Cheapest", fare: cheapest },
    { key: "fastest", label: "Fastest", fare: fastest },
  ];

  return (
    <div className="min-h-[100dvh] bg-secondary/40 pb-20">
      {/* Search bar: pinned under the site header while the results scroll (like Thomas Cook) */}
      <section className="sticky top-16 z-30 bg-linear-to-r from-primary to-sky-500 px-4 py-3 shadow-[0_6px_16px_rgb(15_23_42/0.12)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ResultsSearchBar
            key={`${origin}-${destination}-${date}-${returnDate ?? ""}-${passengers}-${cabin}`}
            query={{ origin, destination, date, returnDate, passengers, cabin }}
          />
        </div>
      </section>

      <section className="border-b border-border bg-card px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <DateStrip
            key={date}
            date={date}
            price={!isLoading && bounds.minPrice > 0 ? fmt(bounds.minPrice) : undefined}
            onPick={(d) =>
              navigate({
                search: (prev: SearchParams) => ({
                  ...prev,
                  date: d,
                  ...(prev.returnDate && prev.returnDate < d ? { returnDate: d } : {}),
                }),
              })
            }
          />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link to="/" className="text-navy hover:underline">
            Home
          </Link>
          <ChevronRight className="size-3.5" />
          <span>Flights</span>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">
            {fromCity} to {toCity} flights
          </span>
        </nav>

        <div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            {/* Pinned below the header (4rem) and the blue search panel (~7.75rem) */}
            <div className="sticky top-[12.75rem] space-y-3">
              <div className="max-h-[calc(100dvh-17rem)] overflow-y-auto rounded-lg [scrollbar-width:thin]">
                {filterPanel}
              </div>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex w-full items-center justify-center gap-1.5 rounded-full border border-sky-500 bg-card py-2 text-sm font-medium uppercase tracking-wide text-sky-700 transition hover:bg-sky-50"
              >
                Scroll to top <ArrowUp className="size-4" />
              </button>
            </div>
          </aside>

          <main className="min-w-0 space-y-3">
            <a
              href={`tel:${PHONE_TEL}`}
              className="flex items-center justify-between gap-4 rounded-xl bg-linear-to-r from-navy to-primary px-4 py-2.5 text-white shadow-card transition hover:brightness-110"
            >
              <span className="font-display text-sm font-bold sm:text-base">
                Call {PHONE_DISPLAY} and use code <span className="text-gold">{PROMO_CODE}</span> to
                save up to $50
              </span>
              <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 text-xs font-semibold text-gold-foreground sm:inline-flex">
                <Phone className="size-4" /> Call now
              </span>
            </a>

            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <h1 className="font-display text-base font-semibold text-foreground sm:text-lg">
                {fromCity} ({origin}) to {toCity} ({destination}) flights
                {returnDate ? (
                  <span className="font-normal text-muted-foreground"> · Round trip</span>
                ) : null}
              </h1>
              <div className="flex items-center gap-3">
                {!isLoading && !showEmpty ? (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{flights.length}</span> Flights
                    Available
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-navy lg:hidden"
                >
                  <SlidersHorizontal className="size-4" /> Filter
                </button>
              </div>
            </div>

            {airline ? (
              <Link
                from={Route.fullPath}
                to="."
                search={(prev: SearchParams) => ({ ...prev, airline: "" })}
                className="inline-flex items-center gap-1.5 rounded-full border border-navy/30 bg-card px-3 py-1 text-xs font-semibold text-navy hover:border-navy"
              >
                {airlineName} only <X className="size-3" />
              </Link>
            ) : null}

            {!isLoading && !showEmpty ? (
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {sortTabs.map((t) => {
                  const active = sort === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSort(t.key)}
                      className={`flex min-w-0 items-center gap-3 rounded-xl border px-3 py-2 text-left transition sm:px-4 sm:py-2.5 ${
                        active
                          ? "border-navy bg-sky-50 text-navy"
                          : "border-border bg-card text-foreground hover:border-navy/40"
                      }`}
                    >
                      <span className="hidden shrink-0 sm:block" aria-hidden="true">
                        {t.key === "best" ? (
                          <ThumbsUp className="size-6" strokeWidth={1.6} />
                        ) : t.key === "cheapest" ? (
                          <span className="block w-6 text-center text-2xl leading-none">
                            {currencySymbol(fareCurrency).trim()}
                          </span>
                        ) : (
                          <History className="size-6" strokeWidth={1.6} />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-bold uppercase tracking-wide sm:text-sm">
                          {t.label}
                        </span>
                        {t.fare ? (
                          <span className="block text-[11px] text-muted-foreground sm:text-xs">
                            {money(t.fare.price, t.fare.currency)}
                            <span className="hidden sm:inline"> | </span>
                            <span className="block sm:inline">
                              {clockDuration(t.fare.durationMinutes)}
                            </span>
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {isLoading ? (
              <div className="space-y-4">
                <p className="flex items-center gap-2 text-sm font-medium text-navy">
                  <Loader2 className="size-4 animate-spin text-gold" />
                  Searching live fares…
                </p>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-40 animate-pulse rounded-xl border border-border bg-card"
                  />
                ))}
              </div>
            ) : null}

            {showEmpty ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center shadow-card">
                <p className="font-display text-lg font-semibold text-navy">
                  {isError
                    ? "We are currently checking live rates with our airline desk."
                    : "No flights found for this route on this date."}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isError
                    ? "Please refresh or call our 24/7 concierge for instant options."
                    : "Please try another date or nearby airport."}
                </p>
              </div>
            ) : null}

            {filteredOut ? (
              <div className="rounded-xl border border-border bg-card p-6 text-center shadow-card">
                <p className="font-display text-base font-semibold text-navy">
                  No flights match your filters.
                </p>
                <button
                  type="button"
                  onClick={() => setFilters(emptyFilters)}
                  className="mt-2 text-sm font-semibold text-gold underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : null}

            {flights.map((f) => (
              <FareCard
                key={f.id}
                fare={f}
                airline={airlineNameOf(f)}
                price={money(f.price, f.currency)}
                action={selectButton(f)}
              />
            ))}
          </main>
        </div>
      </div>

      {selectedFare ? (
        <FlightSelectModal
          fare={selectedFare}
          airline={airlineNameOf(selectedFare)}
          travellers={passengers}
          continueTo={(className) => (
            <Link
              to="/flight/fare-details"
              search={fareDetailsSearch(selectedFare)}
              onClick={() =>
                saveSelectedFare({ fare: selectedFare, airline: airlineNameOf(selectedFare) })
              }
              className={className}
            >
              Continue
            </Link>
          )}
          onClose={closeSelected}
        />
      ) : null}

      {filtersOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-navy/60 backdrop-blur-sm lg:hidden">
          <div className="flex max-h-[85dvh] w-full flex-col rounded-t-2xl bg-card">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <h2 className="font-display text-lg font-semibold text-navy">Filter</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-full p-2 hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4">{filterPanel}</div>
            <div className="border-t border-border p-4">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="w-full rounded-full bg-navy px-4 py-3 text-sm font-semibold text-navy-foreground"
              >
                Show {flights.length} flights
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
