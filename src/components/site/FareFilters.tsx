import { useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { ChevronDown, Moon, Sun, Sunrise, Sunset, type LucideIcon } from "lucide-react";
import {
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

/**
 * Thomas Cook-style filter column: navy header and collapsible sections. Sections with
 * nothing to choose between (e.g. every fare non-stop) are left out.
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
  const [open, setOpen] = useState<string[]>(["stops"]);
  const section = (id: string) => ({
    open: open.includes(id),
    onToggle: () => setOpen((o) => toggleIn(o, id)),
  });
  const toggleList =
    (
      key: "stops" | "fareRules" | "departBlocks" | "arriveBlocks" | "airlines" | "layoverAirports",
    ) =>
    (id: string) =>
      setFilters((p) => ({ ...p, [key]: toggleIn(p[key], id) }));

  const priceValue = filters.maxPrice ?? bounds.maxPrice;
  const layoverValue = filters.maxLayover ?? bounds.maxLayover;

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

      {bounds.stops.length > 1 ? (
        <Section title="Departure Stops" {...section("stops")}>
          {bounds.stops.map((o) => (
            <CheckRow
              key={o.id}
              option={o}
              money={money}
              checked={filters.stops.includes(o.id)}
              onChange={() => toggleList("stops")(o.id)}
            />
          ))}
        </Section>
      ) : null}

      {bounds.maxPrice > bounds.minPrice ? (
        <Section title="Price" {...section("price")}>
          <input
            type="range"
            aria-label="Maximum price"
            min={bounds.minPrice}
            max={bounds.maxPrice}
            step={1}
            value={priceValue}
            onChange={(e) => setFilters((p) => ({ ...p, maxPrice: Number(e.target.value) }))}
            className="w-full accent-navy"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{money(bounds.minPrice)}</span>
            <span className="font-semibold text-foreground">Up to {money(priceValue)}</span>
          </div>
        </Section>
      ) : null}

      {bounds.fareRules.length > 1 ? (
        <Section title="Fare Rules" {...section("fareRules")}>
          {bounds.fareRules.map((o) => (
            <CheckRow
              key={o.id}
              option={o}
              money={money}
              checked={filters.fareRules.includes(o.id)}
              onChange={() => toggleList("fareRules")(o.id)}
            />
          ))}
        </Section>
      ) : null}

      <Section title="Departure" {...section("depart")}>
        <p className="text-xs text-muted-foreground">Departure from {fromCity}</p>
        <TimeTiles selected={filters.departBlocks} onToggle={toggleList("departBlocks")} />
      </Section>

      <Section title="Arrival" {...section("arrive")}>
        <p className="text-xs text-muted-foreground">Arrival at {toCity}</p>
        <TimeTiles selected={filters.arriveBlocks} onToggle={toggleList("arriveBlocks")} />
      </Section>

      {bounds.airlines.length > 1 ? (
        <Section title="Airlines" {...section("airlines")}>
          {bounds.airlines.map((o) => (
            <CheckRow
              key={o.id}
              option={o}
              money={money}
              checked={filters.airlines.includes(o.id)}
              onChange={() => toggleList("airlines")(o.id)}
            />
          ))}
        </Section>
      ) : null}

      {bounds.maxLayover > 0 ? (
        <Section title="Layover Duration" {...section("layover")}>
          <input
            type="range"
            aria-label="Maximum layover"
            min={0}
            max={bounds.maxLayover}
            step={15}
            value={layoverValue}
            onChange={(e) => setFilters((p) => ({ ...p, maxLayover: Number(e.target.value) }))}
            className="w-full accent-navy"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0h 00m</span>
            <span className="font-semibold text-foreground">
              Up to {minutesLabel(layoverValue)}
            </span>
          </div>
        </Section>
      ) : null}

      {bounds.layoverAirports.length > 0 ? (
        <Section title="Layover Airport" {...section("layoverAirports")}>
          {bounds.layoverAirports.map((o) => (
            <CheckRow
              key={o.id}
              option={o}
              money={money}
              checked={filters.layoverAirports.includes(o.id)}
              onChange={() => toggleList("layoverAirports")(o.id)}
            />
          ))}
        </Section>
      ) : null}
    </div>
  );
}
