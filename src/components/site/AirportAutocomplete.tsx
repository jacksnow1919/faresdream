import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { searchAirports, useAirports } from "@/lib/airports";

export function AirportAutocomplete({
  label,
  value,
  onChange,
  placeholder = "Country, city or airport",
  tone = "light",
  required,
}: {
  label: string;
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  /** "dark" renders on navy surfaces (modals); "light" on cards. */
  tone?: "light" | "dark";
  required?: boolean;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => setQuery(value), [value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const airportsStatus = useAirports(open);
  const results = open ? searchAirports(query) : [];

  const pick = (code: string) => {
    onChange(code);
    setQuery(code);
    setOpen(false);
  };

  const dark = tone === "dark";

  return (
    <div ref={wrapRef} className={`relative min-w-0 flex-1 ${open ? "z-40" : "z-20"}`}>
      <label
        className={`flex min-w-0 items-center gap-2 rounded-xl border px-3 py-1.5 sm:py-2 ${
          dark ? "border-white/15 bg-white/5" : "border-border bg-card"
        }`}
      >
        <span className={`shrink-0 ${dark ? "text-gold" : "text-mutedblue"}`}>
          <MapPin className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={`block text-[10px] font-semibold uppercase tracking-widest ${
              dark ? "text-navy-foreground/50" : "text-muted-foreground"
            }`}
          >
            {label}
          </span>
          <input
            value={query}
            placeholder={placeholder}
            required={required}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActive(0);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (!open) return;
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
                setOpen(false);
              }
            }}
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
            className={`w-full border-0 bg-transparent p-0 text-sm font-semibold outline-none ${
              dark
                ? "text-navy-foreground placeholder:text-navy-foreground/40"
                : "text-foreground placeholder:text-muted-foreground/70"
            }`}
          />
        </span>
      </label>

      {open ? (
        <ul className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 max-h-64 w-full max-w-full overflow-y-auto overflow-x-hidden rounded-xl border border-border bg-card p-1 text-left shadow-lux">
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
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(a.code)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left ${
                  i === active ? "bg-secondary" : ""
                }`}
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-navy text-[10px] font-bold text-navy-foreground">
                  {a.code}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-navy">
                    {a.city} ({a.code}) — {a.name}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {a.country}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
