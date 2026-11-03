import { useCallback, useEffect, useEffectEvent, useRef, useState, type ReactNode } from "react";
import { countryByCode } from "@/lib/regional";
import { useNavigate } from "@tanstack/react-router";
import { format, isBefore, parseISO } from "date-fns";
import {
  ArrowLeftRight,
  CalendarDays,
  ChevronDown,
  MapPinned,
  Phone,
  PlaneTakeoff,
  Plus,
  Repeat,
  X,
  type LucideIcon,
} from "lucide-react";
import { AirportField } from "@/components/site/AirportField";
import { DateRangeCalendar } from "@/components/site/DateRangeCalendar";
import { MultiCityQuoteModal, type MultiCityLeg } from "@/components/site/MultiCityQuoteModal";
import {
  TravelerSelector,
  cabinLabel,
  travelerCount,
  type Cabin,
  type Travelers,
} from "@/components/site/TravelerSelector";
import { useCurrency } from "@/components/site/CurrencyContext";
import { DEFAULT_CURRENCY, PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";
import {
  FLIGHT_SEARCH_ID,
  SEARCH_DESTINATION_EVENT,
  searchFlightsTo,
  shortcutDates,
  type SearchDestination,
} from "@/lib/focus-search";

type Trip = "one" | "round" | "multi";

const TRIPS: { id: Trip; label: string; icon: LucideIcon }[] = [
  { id: "one", label: "One Way", icon: PlaneTakeoff },
  { id: "round", label: "Round Trip", icon: Repeat },
  { id: "multi", label: "Multi City", icon: MapPinned },
];

const FARES = [
  { id: "regular", label: "Regular" },
  { id: "student", label: "Student Fare" },
] as const;

/** One segment of the joined bar; the active one gets an orange underline. */
const segCls = (active = false, compact = false) =>
  `relative flex h-full w-full min-w-0 flex-col justify-center px-3.5 text-left lg:min-h-0 lg:py-0 after:absolute after:inset-x-[18px] after:bottom-0 after:h-0.5 after:rounded-full after:transition ${
    compact
      ? "min-h-[56px] gap-0.5 py-2 lg:h-[60px] xl:px-[18px]"
      : "min-h-[68px] gap-1 py-3 sm:px-[18px] lg:h-[84px]"
  } ${active ? "after:bg-gold" : "after:bg-transparent"}`;

function SegLabel({ icon: Icon, children }: { icon?: LucideIcon; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {children}
      {Icon ? <Icon className="size-3.5" strokeWidth={1.75} /> : null}
    </span>
  );
}

const valueCls = "block truncate font-display text-base font-semibold text-navy";
const compactValueCls =
  "block truncate font-display text-sm font-semibold text-navy xl:text-[15px]";

/** "Mon, 16 Nov", with the year only on wide screens: it gets cut off in narrower fields. */
function DateValue({ date, className }: { date: Date; className: string }) {
  return (
    <span className={className}>
      {format(date, "EEE, d MMM")}
      <span className="hidden xl:inline"> {format(date, "yy")}</span>
    </span>
  );
}

/** One flight of a multi-city trip; `date` is null until picked. */
type Leg = { id: number; from: string; to: string; date: Date | null };

const MAX_LEGS = 5;

function SwapButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Swap origin and destination"
      className="absolute right-5 top-1/2 z-30 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-primary/50 bg-card text-navy transition hover:border-gold hover:text-gold md:left-1/2 md:right-auto md:-translate-x-1/2"
    >
      <ArrowLeftRight className="size-4 rotate-90 md:rotate-0" />
    </button>
  );
}

/** A search to start from (the results page passes its current one); dates are yyyy-MM-dd. */
export type SearchStart = {
  origin: string;
  destination: string;
  date: string;
  returnDate?: string | undefined;
  passengers: number;
  cabin: Cabin;
};

/**
 * Flight search: trip-type pills, one joined white bar, fare type.
 * - "home" sits on MovingSky; `prefill` (from the home URL's ?from=&to=) sets
 *   From/To and opens the calendar.
 * - "results" sits on the results page's blue panel and starts from `initial`.
 */
export function FlightSearchBar({
  prefill,
  initial,
  variant = "home",
}: {
  prefill?: { to?: string | undefined; from?: string | undefined } | undefined;
  initial?: SearchStart | undefined;
  variant?: "home" | "results";
}) {
  const navigate = useNavigate();
  const { currency, country } = useCurrency();
  // The results page uses a compact bar (60px fields, fare type beside the trip pills).
  const onBlue = variant === "results";
  const seg = (active = false) => segCls(active, onBlue);
  const value = onBlue ? compactValueCls : valueCls;
  const [trip, setTrip] = useState<Trip>(
    initial ? (initial.returnDate ? "round" : "one") : "round",
  );
  const [fare, setFare] = useState<(typeof FARES)[number]["id"]>("regular");
  const [origin, setOrigin] = useState(
    initial?.origin ?? prefill?.from ?? (prefill?.to === "JFK" ? "MIA" : "JFK"),
  );
  const [destination, setDestination] = useState(initial?.destination ?? prefill?.to ?? "MIA");

  // A new search starts from the main airport of the visitor's country.
  useEffect(() => {
    if (initial || prefill?.from) return;
    const airport = countryByCode(country)?.airport;
    if (airport && airport !== destination) setOrigin(airport);
    // Only when the country changes, so a route the visitor picked isn't overwritten.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);
  // A new search starts a week out with a week's stay, not "leave today, back today".
  const [date, setDate] = useState<Date>(() =>
    initial ? parseISO(initial.date) : shortcutDates().depart,
  );
  const [returnDate, setReturnDate] = useState<Date>(() =>
    initial ? parseISO(initial.returnDate ?? initial.date) : shortcutDates().back,
  );
  const [travelers, setTravelers] = useState<Travelers>({
    adults: initial?.passengers ?? 1,
    children: 0,
    infants: 0,
  });
  const [cabin, setCabin] = useState<Cabin>(initial?.cabin ?? "Economy");
  const [dateField, setDateField] = useState<"depart" | "return" | null>(null);
  const [travellersOpen, setTravellersOpen] = useState(false);
  const [legs, setLegs] = useState<Leg[]>([]);
  const [legDateOpen, setLegDateOpen] = useState<number | null>(null);
  const [legError, setLegError] = useState<string | null>(null);
  const [quoteLegs, setQuoteLegs] = useState<MultiCityLeg[] | null>(null);
  const legId = useRef(0);

  const round = trip === "round";
  const closeCalendar = useCallback(() => setDateField(null), []);
  const closeLegCalendar = useCallback(() => setLegDateOpen(null), []);
  const closeQuote = useCallback(() => setQuoteLegs(null), []);

  const makeLeg = (from: string, to: string, d: Date | null): Leg => ({
    id: ++legId.current,
    from,
    to,
    date: d,
  });

  const updateLeg = (i: number, patch: Partial<Omit<Leg, "id">>) => {
    setLegError(null);
    setLegs((prev) =>
      prev.map((leg, j) => {
        if (j === i) return { ...leg, ...patch };
        // A new "To" also becomes the next flight's "From" unless that was set separately.
        const before = prev[i]!;
        if (j === i + 1 && patch.to !== undefined && (!leg.from || leg.from === before.to))
          return { ...leg, from: patch.to };
        return leg;
      }),
    );
  };

  /** Flights can't depart before the previous one. */
  const legMinDate = (i: number) =>
    legs
      .slice(0, i)
      .map((l) => l.date)
      .filter((d): d is Date => d !== null)
      .at(-1);

  const selectLegDate = (i: number, d: Date) => {
    setLegError(null);
    setLegs((prev) =>
      prev.map((leg, j) =>
        j === i
          ? { ...leg, date: d }
          : j > i && leg.date && isBefore(leg.date, d)
            ? { ...leg, date: null }
            : leg,
      ),
    );
    setLegDateOpen(null);
  };

  const addLeg = () =>
    setLegs((prev) =>
      prev.length >= MAX_LEGS ? prev : [...prev, makeLeg(prev.at(-1)?.to ?? "", "", null)],
    );

  const removeLeg = (i: number) => {
    setLegDateOpen(null);
    setLegs((prev) => prev.filter((_, j) => j !== i));
  };

  const searchMulti = () => {
    if (legs.some((l) => !l.from || !l.to || !l.date)) {
      setLegError("Add From, To and a departure date for every flight.");
      return;
    }
    const same = legs.findIndex((l) => l.from === l.to);
    if (same >= 0) {
      setLegError(`Flight ${same + 1}: From and To can't be the same airport.`);
      return;
    }
    setQuoteLegs(legs.map((l) => ({ from: l.from, to: l.to, date: l.date! })));
  };

  const runSearch = (from: string, to: string, roundTrip: boolean, depart: Date, back: Date) =>
    navigate({
      to: "/flight/search",
      search: {
        origin: from,
        destination: to,
        date: format(depart, "yyyy-MM-dd"),
        ...(roundTrip ? { returnDate: format(back, "yyyy-MM-dd") } : {}),
        passengers: travelerCount(travelers),
        cabin,
        currency: currency || DEFAULT_CURRENCY,
      },
    });

  const submitSearch = () => runSearch(origin, destination, round, date, returnDate);

  // Destination shortcuts elsewhere on the page (see searchFlightsTo): fill "To"
  // (and "From" when given), bring the bar into view, then ask for the departure date.
  // With `go` (showFlightsTo) they open the results page instead.
  const onPick = useEffectEvent(({ to, from, trip: pickedTrip, go }: SearchDestination) => {
    const nextTrip = pickedTrip ?? (trip === "multi" ? "round" : trip);
    const nextOrigin = from ?? (to === origin ? destination : origin);
    if (go) {
      // One-way searches leave the return date alone, so it can sit before the new departure.
      const back = isBefore(returnDate, date) ? shortcutDates(date).back : returnDate;
      void runSearch(nextOrigin, to, nextTrip === "round", date, back);
      return;
    }
    setTrip(nextTrip);
    setOrigin(nextOrigin);
    setDestination(to);
    setTravellersOpen(false);
    document
      .getElementById(FLIGHT_SEARCH_ID)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => setDateField("depart"), 600);
  });
  useEffect(() => {
    const listener = (e: Event) => onPick((e as CustomEvent<SearchDestination>).detail);
    window.addEventListener(SEARCH_DESTINATION_EVENT, listener);
    return () => window.removeEventListener(SEARCH_DESTINATION_EVENT, listener);
    // onPick is an effect event (always sees the latest state), so it isn't a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A URL prefill goes through the same path (after the listener above is attached),
  // so it also scrolls to the bar and opens the calendar, on load or on a later link click.
  const prefillTo = prefill?.to;
  const prefillFrom = prefill?.from;
  useEffect(() => {
    if (prefillTo) searchFlightsTo(prefillTo, prefillFrom);
  }, [prefillTo, prefillFrom]);

  const changeTrip = (t: Trip) => {
    setTrip(t);
    setDateField(t === "round" ? "return" : null);
    setLegError(null);
    // First switch to multi-city: start from the current route plus an onward flight.
    if (t === "multi" && legs.length === 0)
      setLegs([makeLeg(origin, destination, date), makeLeg(destination, "", null)]);
  };

  const selectDate = (d: Date) => {
    if (dateField === "depart") {
      setDate(d);
      if (round) {
        if (isBefore(returnDate, d)) setReturnDate(d);
        setDateField("return");
      } else {
        setDateField(null);
      }
    } else if (isBefore(d, date)) {
      setDate(d);
    } else {
      setReturnDate(d);
      setTrip("round");
      setDateField(null);
    }
  };

  const count = travelerCount(travelers);
  const travellersLabel = `${count} ${count === 1 ? "Traveller" : "Travellers"}`;

  const renderTravellers = (wrapperCls: string) => (
    <div className={wrapperCls}>
      <TravelerSelector
        value={travelers}
        onChange={setTravelers}
        cabin={cabin}
        onCabinChange={setCabin}
        open={travellersOpen}
        onOpenChange={setTravellersOpen}
        className={seg(travellersOpen)}
      >
        <SegLabel icon={ChevronDown}>Travellers/Class</SegLabel>
        <span className={value}>
          {travellersLabel}{" "}
          <span className="font-sans text-[15px] font-semibold text-muted-foreground">
            {cabinLabel(cabin)}
          </span>
        </span>
      </TravelerSelector>
    </div>
  );

  // Fare type: under the bar on the home page, beside the trip pills on the results page.
  const fareTypes = (
    <div
      role="radiogroup"
      aria-label="Fare type"
      className={`flex flex-wrap items-center ${onBlue ? "ml-auto gap-4" : "mt-4 gap-6"}`}
    >
      {FARES.map((f) => (
        <label
          key={f.id}
          className={`flex cursor-pointer items-center gap-2 font-medium ${onBlue ? "text-sm" : "text-base"} ${
            onBlue ? "text-white" : "text-navy [text-shadow:0_0_10px_rgb(255_255_255/0.9)]"
          }`}
        >
          <input
            type="radio"
            name="fare-type"
            value={f.id}
            checked={fare === f.id}
            onChange={() => setFare(f.id)}
            className={`cursor-pointer accent-navy ${onBlue ? "size-4" : "size-[18px]"}`}
          />
          {f.label}
        </label>
      ))}
    </div>
  );

  return (
    <div
      id={onBlue ? undefined : FLIGHT_SEARCH_ID}
      className={onBlue ? "text-left" : "mx-auto max-w-[1116px] text-left"}
    >
      {/* Trip type (and, on the results page, fare type on the same row) */}
      <div
        className={`flex flex-wrap items-center ${onBlue ? "gap-2 sm:gap-3" : "gap-2 sm:gap-4"}`}
      >
        {TRIPS.map((t) => {
          const active = trip === t.id;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={active}
              onClick={() => changeTrip(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${onBlue ? "h-[30px]" : "h-[33px]"} ${
                onBlue
                  ? active
                    ? "border border-yellow-300 bg-yellow-300/10 text-yellow-300"
                    : "border border-white/70 text-white hover:bg-white/10"
                  : active
                    ? "bg-navy text-navy-foreground"
                    : "bg-card text-foreground hover:bg-gold-soft"
              }`}
            >
              <t.icon className="size-4" strokeWidth={2} />
              {t.label}
            </button>
          );
        })}
        {onBlue ? fareTypes : null}
      </div>

      {trip === "multi" ? (
        /* Multi-city: one row per flight; travellers on the first, Add city + Search beside the last */
        <div className={`space-y-4 ${onBlue ? "mt-2.5" : "mt-4"}`}>
          {legs.map((leg, i) => (
            <div key={leg.id} className="grid gap-3 lg:grid-cols-4 lg:gap-0">
              <p className="-mb-1 text-xs font-semibold text-white [text-shadow:0_1px_6px_rgb(0_0_0/0.35)] md:hidden">
                Flight {i + 1}
              </p>
              <div
                className={`relative grid divide-y divide-border rounded-lg bg-card shadow-lux md:grid-cols-3 md:divide-y-0 ${
                  i === 0 ? "lg:col-span-4 lg:grid-cols-4" : "lg:col-span-3"
                }`}
              >
                <div className="relative grid divide-y divide-border md:col-span-2 md:grid-cols-2 md:divide-x md:divide-y-0">
                  <AirportField
                    compact={onBlue}
                    label="From"
                    value={leg.from}
                    onChange={(v) => updateLeg(i, { from: v })}
                  />
                  <SwapButton onClick={() => updateLeg(i, { from: leg.to, to: leg.from })} />
                  <AirportField
                    compact={onBlue}
                    label="To"
                    value={leg.to}
                    onChange={(v) => updateLeg(i, { to: v })}
                  />
                </div>

                <div className="relative min-w-0 md:border-l md:border-border">
                  <button
                    type="button"
                    data-date-field
                    aria-haspopup="dialog"
                    aria-expanded={legDateOpen === i}
                    onClick={() => setLegDateOpen(i)}
                    className={`${seg(legDateOpen === i)} ${i >= 2 ? "pr-9" : ""}`}
                  >
                    <SegLabel icon={CalendarDays}>Departure</SegLabel>
                    {leg.date ? (
                      <DateValue date={leg.date} className={value} />
                    ) : (
                      <span className={`${value} !text-muted-foreground`}>Select date</span>
                    )}
                  </button>
                  {i >= 2 ? (
                    <button
                      type="button"
                      aria-label={`Remove flight ${i + 1}`}
                      onClick={() => removeLeg(i)}
                      className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-muted text-muted-foreground transition hover:bg-border hover:text-navy"
                    >
                      <X className="size-3.5" />
                    </button>
                  ) : null}
                </div>

                {i === 0
                  ? renderTravellers(
                      "relative min-w-0 border-border md:col-span-3 md:border-t lg:col-span-1 lg:border-l lg:border-t-0",
                    )
                  : null}

                {legDateOpen === i ? (
                  <DateRangeCalendar
                    depart={leg.date}
                    ret={null}
                    selecting="depart"
                    minDate={legMinDate(i)}
                    onSelect={(d) => selectLegDate(i, d)}
                    onClose={closeLegCalendar}
                  />
                ) : null}
              </div>

              {i === legs.length - 1 ? (
                <div className="flex gap-3 lg:pl-5">
                  {legs.length < MAX_LEGS ? (
                    <button
                      type="button"
                      onClick={addLeg}
                      className={`flex h-12 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/80 bg-white/10 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/25 ${onBlue ? "lg:h-[60px]" : "lg:h-[84px]"}`}
                    >
                      <Plus className="size-5" /> Add city
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={searchMulti}
                    className={`h-12 flex-1 rounded-lg bg-navy font-display text-lg font-semibold text-navy-foreground transition hover:brightness-110 ${onBlue ? "lg:h-[60px]" : "lg:h-[84px]"}`}
                  >
                    Search
                  </button>
                </div>
              ) : null}
            </div>
          ))}
          {legError ? (
            <p
              role="alert"
              className="inline-block rounded-lg bg-card px-3 py-2 text-sm font-semibold text-destructive"
            >
              {legError}
            </p>
          ) : null}
        </div>
      ) : (
        <div
          className={`relative flex flex-col rounded-lg bg-card shadow-lux lg:flex-row ${onBlue ? "mt-2.5" : "mt-4"}`}
        >
          <div className="relative grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0 lg:w-[44.3%] lg:flex-none">
            <AirportField compact={onBlue} label="From" value={origin} onChange={setOrigin} />
            <SwapButton
              onClick={() => {
                setOrigin(destination);
                setDestination(origin);
              }}
            />
            <AirportField
              compact={onBlue}
              label="To"
              value={destination}
              onChange={setDestination}
            />
          </div>

          <div className="relative grid grid-cols-2 border-t border-border md:grid-cols-[165fr_165fr_208fr] lg:flex-1 lg:border-l lg:border-t-0">
            <button
              type="button"
              data-date-field
              aria-haspopup="dialog"
              aria-expanded={dateField === "depart"}
              onClick={() => setDateField("depart")}
              className={seg(dateField === "depart")}
            >
              <SegLabel icon={CalendarDays}>Departure</SegLabel>
              <DateValue date={date} className={value} />
            </button>

            <div className="relative min-w-0 border-l border-border">
              <button
                type="button"
                data-date-field
                aria-haspopup="dialog"
                aria-expanded={dateField === "return"}
                onClick={() => setDateField("return")}
                className={`${seg(dateField === "return")} ${round ? "pr-8" : ""}`}
              >
                <SegLabel icon={CalendarDays}>Return</SegLabel>
                {round ? (
                  <DateValue date={returnDate} className={value} />
                ) : (
                  <span className={`${value} !text-muted-foreground`}>Select Date</span>
                )}
              </button>
              {round ? (
                <button
                  type="button"
                  aria-label="Remove return flight"
                  onClick={() => changeTrip("one")}
                  className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-muted text-muted-foreground transition hover:bg-border hover:text-navy"
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </div>

            {renderTravellers(
              "relative col-span-2 min-w-0 border-t border-border md:col-span-1 md:border-l md:border-t-0",
            )}

            {dateField ? (
              <DateRangeCalendar
                depart={date}
                ret={round ? returnDate : null}
                selecting={dateField}
                onSelect={selectDate}
                onClose={closeCalendar}
              />
            ) : null}
          </div>

          <button
            type="button"
            onClick={submitSearch}
            className={`rounded-b-lg bg-navy px-6 font-display font-semibold text-navy-foreground transition hover:brightness-110 lg:h-auto lg:shrink-0 lg:rounded-none lg:rounded-r-lg lg:px-0 ${
              onBlue ? "h-11 text-base lg:w-[88px] xl:w-[104px]" : "h-12 text-lg lg:w-[84px]"
            }`}
          >
            Search
          </button>
        </div>
      )}

      {onBlue ? null : fareTypes}

      {quoteLegs ? (
        <MultiCityQuoteModal
          legs={quoteLegs}
          travellers={travellersLabel}
          cabin={cabinLabel(cabin)}
          onClose={closeQuote}
        />
      ) : null}

      {/* Secondary phone CTA — mobile first view */}
      {onBlue ? null : (
        <a
          href={`tel:${PHONE_TEL}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary bg-card px-4 py-2.5 text-xs font-bold text-primary transition hover:bg-accent lg:hidden"
        >
          <Phone className="size-4" /> Call for special phone deals: {PHONE_DISPLAY}
        </a>
      )}
    </div>
  );
}
