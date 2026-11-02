import { useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { ChevronDown, Moon, Sun, Sunrise, Sunset, type LucideIcon } from "lucide-react";
import {
  LAYOVER_STEP,
  TIME_BLOCKS,
  emptyFilters,
  hasFilters,
  minutesLabel,
  toggleIn,
  type Bounds,
  type Filters,
  type Option,
} from "@/lib/fare-filters";

const BLOCK_ICONS: Record<string, LucideIcon> = {
  early: Sunrise,
  morning: Sun,
  afternoon: Sunset,
  evening: Moon,
};

type ListKey =
  | "stops"
  | "returnStops"
  | "fareRules"
  | "departBlocks"
  | "arriveBlocks"
  | "returnDepartBlocks"
  | "returnArriveBlocks"
  | "airlines"
  | "layoverAirports";

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b-2 border-card last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 bg-secondary px-4 py-3 text-left text-sm font-medium text-foreground transition hover:text-navy"
      >
        {title}
        <ChevronDown className={`size-5 shrink-0 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? <div className="space-y-3 bg-secondary/50 px-4 pb-3.5 pt-1.5">{children}</div> : null}
    </div>
  );
}

function CheckRow({
  option,
  checked,
  onChange,
  money,
}: {
  option: Option;
  checked: boolean;
  onChange: () => void;
  money: (n: number) => string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 shrink-0 accent-navy"
      />
      {option.logoUrl ? (
        <img
          src={option.logoUrl}
          alt=""
          className="size-5 shrink-0 object-contain"
          loading="lazy"
        />
      ) : null}
      <span className="min-w-0 flex-1 truncate">{option.label}</span>
      <span className="shrink-0 text-xs text-muted-foreground">{money(option.price)}</span>
    </label>
  );
}

function TimeTiles({ selected, onToggle }: { selected: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {TIME_BLOCKS.map((b) => {
        const Icon = BLOCK_ICONS[b.id]!;
        const active = selected.includes(b.id);
        return (
          <button
            key={b.id}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(b.id)}
            className={`flex flex-col items-center gap-1 rounded-lg border bg-card px-2 py-2.5 text-xs font-medium transition ${
              active
                ? "border-navy text-navy"
                : "border-border text-muted-foreground hover:border-navy/40 hover:text-foreground"
            }`}
          >
            <Icon className="size-4" />
            {b.label}
          </button>
        );
      })}
    </div>
  );
}

/** Small print inside a section: a caption, or the reason it has nothing to choose from. */
function Note({ children }: { children: ReactNode }) {
  return <p className="text-xs text-muted-foreground">{children}</p>;
}

/**
 * Thomas Cook-style filter column: navy header and collapsible sections. Every section
 * always shows, so the panel looks the same on every search; the Return ones are for
 * round trips only.
 */
export function FareFilters({
  bounds,
  filters,
  setFilters,
  money,
  fromCity,
  toCity,
}: {
  bounds: Bounds;
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  money: (n: number) => string;
  fromCity: string;
  toCity: string;
}) {
  const [open, setOpen] = useState<string[]>(["stops", "returnStops", "price"]);
  const section = (id: string) => ({
    open: open.includes(id),
    onToggle: () => setOpen((o) => toggleIn(o, id)),
  });
  const toggleList = (key: ListKey) => (id: string) =>
    setFilters((p) => ({ ...p, [key]: toggleIn(p[key], id) }));

  const checkList = (key: ListKey, options: Option[]) =>
    options.map((o) => (
      <CheckRow
        key={o.id}
        option={o}
        money={money}
        checked={filters[key].includes(o.id)}
        onChange={() => toggleList(key)(o.id)}
      />
    ));

  const priceValue = filters.maxPrice ?? bounds.maxPrice;
  const layoverValue = filters.maxLayover ?? bounds.maxLayover;
  const roundTrip = bounds.returnStops.length > 0;
  const noLayovers = "No layovers on these flights.";

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between bg-navy px-4 py-2.5 text-navy-foreground">
        <p className="font-display text-[15px] font-semibold">Filter</p>
        {hasFilters(filters) ? (
          <button
            type="button"
            onClick={() => setFilters(emptyFilters)}
            className="text-sm font-medium text-gold-soft underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        ) : null}
      </div>

      {bounds.stops.length === 0 ? (
        // Still searching, or the search found nothing.
        <p className="px-4 py-4 text-sm text-muted-foreground">
          Filters appear here once flights are found.
        </p>
      ) : (
        <>
          <Section title="Departure Stops" {...section("stops")}>
            {checkList("stops", bounds.stops)}
          </Section>

          {roundTrip ? (
            <Section title="Return Stops" {...section("returnStops")}>
              {checkList("returnStops", bounds.returnStops)}
            </Section>
          ) : null}

          <Section title="Price" {...section("price")}>
            {bounds.maxPrice > bounds.minPrice ? (
              <>
                <input
                  type="range"
                  aria-label="Maximum price"
                  min={bounds.minPrice}
                  max={bounds.maxPrice}
                  step={1}
                  value={priceValue}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setFilters((p) => ({ ...p, maxPrice: v === bounds.maxPrice ? null : v }));
                  }}
                  className="w-full accent-navy"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{money(bounds.minPrice)}</span>
                  <span className="font-semibold text-foreground">Up to {money(priceValue)}</span>
                </div>
              </>
            ) : (
              <Note>Every flight on this search costs {money(bounds.minPrice)}.</Note>
            )}
          </Section>

          <Section title="Fare Rules" {...section("fareRules")}>
            {checkList("fareRules", bounds.fareRules)}
          </Section>

          <Section title="Departure" {...section("depart")}>
            <Note>Departure from {fromCity}</Note>
            <TimeTiles selected={filters.departBlocks} onToggle={toggleList("departBlocks")} />
          </Section>

          <Section title="Arrival" {...section("arrive")}>
            <Note>Arrival at {toCity}</Note>
            <TimeTiles selected={filters.arriveBlocks} onToggle={toggleList("arriveBlocks")} />
          </Section>

          {roundTrip ? (
            <>
              <Section title="Return Departure" {...section("returnDepart")}>
                <Note>Departure from {toCity}</Note>
                <TimeTiles
                  selected={filters.returnDepartBlocks}
                  onToggle={toggleList("returnDepartBlocks")}
                />
              </Section>

              <Section title="Return Arrival" {...section("returnArrive")}>
                <Note>Arrival at {fromCity}</Note>
                <TimeTiles
                  selected={filters.returnArriveBlocks}
                  onToggle={toggleList("returnArriveBlocks")}
                />
              </Section>
            </>
          ) : null}

          <Section title="Airlines" {...section("airlines")}>
            {checkList("airlines", bounds.airlines)}
          </Section>

          <Section title="Layover Duration" {...section("layover")}>
            {bounds.maxLayover > 0 ? (
              <>
                <input
                  type="range"
                  aria-label="Maximum layover"
                  min={0}
                  max={bounds.maxLayover}
                  step={LAYOVER_STEP}
                  value={layoverValue}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setFilters((p) => ({ ...p, maxLayover: v === bounds.maxLayover ? null : v }));
                  }}
                  className="w-full accent-navy"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0h 00m</span>
                  <span className="font-semibold text-foreground">
                    Up to {minutesLabel(layoverValue)}
                  </span>
                </div>
              </>
            ) : (
              <Note>{noLayovers}</Note>
            )}
          </Section>

          <Section title="Layover Airport" {...section("layoverAirports")}>
            {bounds.layoverAirports.length > 0 ? (
              checkList("layoverAirports", bounds.layoverAirports)
            ) : (
              <Note>{noLayovers}</Note>
            )}
          </Section>
        </>
      )}
    </div>
  );
}
