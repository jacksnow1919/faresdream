import { useEffect, useRef, useState } from "react";
import { addDays, format, isBefore, max, parseISO, startOfDay, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FlightSearchBar, type SearchStart } from "@/components/site/FlightSearchBar";
import { cabinLabel } from "@/components/site/TravelerSelector";

const ymd = (d: Date) => format(d, "yyyy-MM-dd");

/**
 * Results page search, Thomas Cook style: the shared search bar on the page's blue panel,
 * starting from the current search. Phones get a one-line summary that opens it.
 * Remount it (via `key`) when the URL changes.
 */
export function ResultsSearchBar({ query }: { query: SearchStart }) {
  const [editing, setEditing] = useState(false);
  const dates = `${format(parseISO(query.date), "EEE, d MMM")}${
    query.returnDate ? ` – ${format(parseISO(query.returnDate), "EEE, d MMM")}` : ""
  }`;

  return (
    <div>
      <button
        type="button"
        onClick={() => setEditing((e) => !e)}
        aria-expanded={editing}
        className="flex w-full items-center justify-between gap-3 rounded-lg bg-card px-4 py-3 text-left shadow-lux lg:hidden"
      >
        <span className="min-w-0">
          <span className="block truncate font-display text-base font-semibold text-navy">
            {query.origin} {query.returnDate ? "⇄" : "→"} {query.destination}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {dates} · {query.passengers} {query.passengers === 1 ? "Traveller" : "Travellers"} ·{" "}
            {cabinLabel(query.cabin)}
          </span>
        </span>
        <span className="shrink-0 text-sm font-semibold text-gold">
          {editing ? "Close" : "Modify"}
        </span>
      </button>

      <div className={editing ? "mt-4" : "hidden lg:block"}>
        <FlightSearchBar variant="results" initial={query} />
      </div>
    </div>
  );
}

const STRIP_DAYS = 7;

/**
 * Day-by-day strip under the bar. Only the searched day has a price (the cheapest fare
 * loaded); other days show "--" until searched, since each day is a separate search.
 */
export function DateStrip({
  date,
  price,
  onPick,
}: {
  date: string;
  price?: string | undefined;
  onPick: (date: string) => void;
}) {
  const today = startOfDay(new Date());
  const lastDay = addDays(today, 364);
  const selected = parseISO(date);
  const [start, setStart] = useState(() => max([today, subDays(selected, 3)]));
  const rowRef = useRef<HTMLDivElement>(null);

  // On narrow screens the strip scrolls; keep the searched day in view.
  useEffect(() => {
    const row = rowRef.current;
    const active = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (row && active)
      row.scrollLeft = active.offsetLeft - (row.clientWidth - active.offsetWidth) / 2;
  }, [date, start]);
  const days = Array.from({ length: STRIP_DAYS }, (_, i) => addDays(start, i)).filter(
    (d) => !isBefore(lastDay, d),
  );

  const arrowCls =
    "hidden w-10 shrink-0 place-items-center text-foreground transition hover:text-gold disabled:cursor-not-allowed disabled:opacity-30 sm:grid";

  return (
    <div className="flex overflow-hidden rounded-xl border border-border bg-card">
      <button
        type="button"
        aria-label="Earlier dates"
        disabled={!isBefore(today, start)}
        onClick={() => setStart(max([today, subDays(start, STRIP_DAYS)]))}
        className={`${arrowCls} border-r border-border`}
      >
        <ChevronLeft className="size-5" />
      </button>
      <div
        ref={rowRef}
        className="relative flex min-w-0 flex-1 snap-x overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {days.map((d) => {
          const key = ymd(d);
          const active = key === date;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => !active && onPick(key)}
              className={`relative min-w-[96px] flex-1 snap-start border-r border-border px-3.5 py-2 text-left transition last:border-r-0 hover:bg-secondary/60 ${
                active
                  ? "after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-gold"
                  : ""
              }`}
            >
              <span className="block whitespace-nowrap text-sm text-foreground">
                {format(d, "EEE d MMM")}
              </span>
              <span
                className={`block text-xs ${active && price ? "font-semibold text-navy" : "text-muted-foreground"}`}
              >
                {active && price ? price : "--"}
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        aria-label="Later dates"
        disabled={!isBefore(addDays(start, STRIP_DAYS - 1), lastDay)}
        onClick={() => setStart(addDays(start, STRIP_DAYS))}
        className={`${arrowCls} border-l border-border`}
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
