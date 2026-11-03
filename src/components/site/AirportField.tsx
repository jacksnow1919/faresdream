import { useRef, useState } from "react";
import { PlaneTakeoff } from "lucide-react";
import { airportByCode, searchAirports, useAirports } from "@/lib/airports";

/**
 * From/To segment of the search bar: shows "City CODE", becomes a search box on focus.
 * `compact` is the shorter size used on the results page.
 */
export function AirportField({
  label,
  value,
  onChange,
  compact = false,
}: {
  label: string;
  value: string;
  onChange: (code: string) => void;
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = airportByCode(value);
  const airportsStatus = useAirports(open || (Boolean(value) && !selected));
  const results = open ? searchAirports(query) : [];

  const pick = (code: string) => {
    onChange(code);
    setOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div className={`relative min-w-0 ${open ? "z-40" : "z-10"}`}>
      <label
        className={`relative flex h-full w-full cursor-pointer flex-col justify-center text-left lg:min-h-0 lg:py-0 ${
          compact
            ? "min-h-[56px] gap-0.5 px-3.5 py-2 lg:h-[60px] xl:px-[18px]"
            : "min-h-[68px] gap-1 px-[18px] py-3 lg:h-[84px]"
        }`}
      >
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="relative w-full min-w-0">
          <input
            ref={inputRef}
            value={open ? query : ""}
            placeholder={open ? "City or airport" : undefined}
            onFocus={() => {
              setQuery("");
              setActive(0);
              setOpen(true);
            }}
            onBlur={() => setOpen(false)}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && results[active]) {
                e.preventDefault();
                // Wait for the full list, or this could pick a hub instead of the airport typed.
                if (airportsStatus !== "loading") pick(results[active].code);
              } else if (e.key === "Escape") {
                inputRef.current?.blur();
              }
            }}
            role="combobox"
            aria-label={label}
            aria-expanded={open}
            aria-autocomplete="list"
            className={
              open
                ? "block w-full border-0 bg-transparent p-0 font-display text-base font-semibold text-navy outline-none placeholder:font-sans placeholder:font-medium placeholder:text-muted-foreground"
                : "absolute inset-0 size-full cursor-pointer opacity-0"
            }
          />
          {open ? null : !value ? (
            <span className="block font-display text-base font-semibold text-muted-foreground">
              {label}
            </span>
          ) : (
            <span className="flex min-w-0 items-baseline gap-2">
              <span
                className={`truncate font-display font-semibold text-navy ${compact ? "text-sm xl:text-[15px]" : "text-base"}`}
              >
                {selected?.city ?? value}
              </span>
              <span className="shrink-0 text-xs font-semibold text-navy sm:text-[13px]">
                {value}
              </span>
            </span>
          )}
        </span>
      </label>

      {open ? (
        <ul className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 max-h-72 overflow-y-auto overflow-x-hidden rounded-xl border border-border bg-card p-1 text-left shadow-lux">
          {results.length === 0 && airportsStatus !== "loading" ? (
            <li className="px-3 py-2 text-xs text-muted-foreground">No airports found</li>
          ) : null}
          {airportsStatus === "loading" && query ? (
            <li className="px-3 py-2 text-xs text-muted-foreground">Searching all airports…</li>
          ) : null}
          {results.map((a, i) => (
            <li key={a.code}>
              <button
                type="button"
                // Keep focus in the input so blur doesn't close the list before the click lands.
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(a.code)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${
                  i === active ? "bg-gold-soft" : ""
                }`}
              >
                <PlaneTakeoff className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-navy">
                    {a.city}, {a.country}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{a.name}</span>
                </span>
                <span className="shrink-0 text-xs font-bold text-navy">{a.code}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
