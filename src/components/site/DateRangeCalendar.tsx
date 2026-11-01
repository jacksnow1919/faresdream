import { useEffect, useRef, useState } from "react";
import {
  addMonths,
  differenceInCalendarMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

/** How many months ahead (including this one) can be booked. */
const BOOKABLE_MONTHS = 12;
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/**
 * Depart/return date panel: a two-month dropdown on desktop (right-aligned under
 * the nearest positioned ancestor), a full-screen scrolling month list on phones.
 * Elements marked `data-date-field` don't count as outside clicks, so switching
 * between the Depart and Return fields keeps the panel open.
 */
export function DateRangeCalendar({
  depart,
  ret,
  selecting,
  onSelect,
  onClose,
  minDate,
}: {
  /** Departure date, or null when none is picked yet (multi-city flights). */
  depart: Date | null;
  /** Return date, or null for one-way trips. */
  ret: Date | null;
  selecting: "depart" | "return";
  onSelect: (d: Date) => void;
  onClose: () => void;
  /** Earliest selectable day (e.g. the previous multi-city flight); defaults to today. */
  minDate?: Date | undefined;
}) {
  const isMobile = useIsMobile();
  const panelRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<Date | null>(null);

  const today = startOfDay(new Date());
  const earliest = minDate && isAfter(minDate, today) ? startOfDay(minDate) : today;
  const firstMonth = startOfMonth(today);
  const lastMonth = addMonths(firstMonth, BOOKABLE_MONTHS - 1);
  const lastDay = endOfMonth(lastMonth);
  const anchor = depart ?? earliest;

  // Desktop: first of the two visible months.
  const [view, setView] = useState(() => {
    const target =
      selecting === "return" && ret && differenceInCalendarMonths(ret, anchor) > 1
        ? addMonths(startOfMonth(ret), -1)
        : startOfMonth(anchor);
    return isBefore(target, firstMonth) ? firstMonth : target;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onDown = (e: MouseEvent) => {
      const t = e.target as Element;
      if (panelRef.current?.contains(t) || t.closest?.("[data-date-field]")) return;
      onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [onClose]);

  // Desktop: make sure the whole panel is on screen. Phones: full-screen, so lock
  // page scroll and jump to the selected month.
  useEffect(() => {
    if (!isMobile) {
      panelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current
      ?.querySelector(
        `[data-month="${format(selecting === "return" && ret ? ret : anchor, "yyyy-MM")}"]`,
      )
      ?.scrollIntoView({ block: "start" });
    return () => {
      document.body.style.overflow = prev;
    };
    // Only on open / layout switch, not on every date change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // While picking a return date, preview the range up to the hovered day.
  const end = selecting === "return" && hover && depart && !isBefore(hover, depart) ? hover : ret;

  const months = isMobile
    ? Array.from({ length: BOOKABLE_MONTHS }, (_, i) => addMonths(firstMonth, i))
    : [view, addMonths(view, 1)];

  const renderMonth = (month: Date, i: number) => {
    const first = startOfMonth(month);
    const days = eachDayOfInterval({ start: first, end: endOfMonth(month) });
    const showPrev = !isMobile && i === 0;
    const showNext = !isMobile && i === months.length - 1;
    const navBtn =
      "grid size-8 place-items-center rounded-full text-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-30";

    return (
      <div key={format(month, "yyyy-MM")} data-month={format(month, "yyyy-MM")} className="min-w-0">
        <div className="flex h-8 items-center justify-between">
          {showPrev ? (
            <button
              type="button"
              aria-label="Previous month"
              disabled={!isAfter(view, firstMonth)}
              onClick={() => setView((v) => addMonths(v, -1))}
              className={navBtn}
            >
              <ChevronLeft className="size-5" />
            </button>
          ) : (
            <span className="size-8" />
          )}
          <p className="text-base font-semibold text-foreground md:text-lg">
            {format(month, "MMMM yyyy")}
          </p>
          {showNext ? (
            <button
              type="button"
              aria-label="Next month"
              disabled={!isBefore(month, lastMonth)}
              onClick={() => setView((v) => addMonths(v, 1))}
              className={navBtn}
            >
              <ChevronRight className="size-5" />
            </button>
          ) : (
            <span className="size-8" />
          )}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-1 text-center text-sm font-medium text-foreground/70">
          {WEEKDAYS.map((w) => (
            <span key={w} className="py-1">
              {w}
            </span>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1" onMouseLeave={() => setHover(null)}>
          {Array.from({ length: getDay(first) }, (_, k) => (
            <span key={`pad-${k}`} />
          ))}
          {days.map((d) => {
            const disabled = isBefore(d, earliest) || isAfter(d, lastDay);
            const isEnd =
              (depart !== null && isSameDay(d, depart)) || (end !== null && isSameDay(d, end));
            const inRange =
              depart !== null && end !== null && isAfter(d, depart) && isBefore(d, end);
            const isToday = isSameDay(d, today);

            let cls = "text-foreground hover:bg-muted";
            if (disabled) cls = "cursor-not-allowed text-muted-foreground/40";
            else if (isEnd) cls = "bg-foreground text-background";
            else if (inRange)
              cls = "bg-muted text-foreground hover:ring-1 hover:ring-foreground/30";

            return (
              <button
                key={d.toISOString()}
                type="button"
                disabled={disabled}
                aria-label={format(d, "EEEE, d MMMM yyyy")}
                aria-pressed={isEnd}
                onMouseEnter={() => setHover(d)}
                onClick={() => onSelect(d)}
                className={`h-11 rounded-lg text-base font-medium transition md:h-10 ${cls} ${
                  isToday && !isEnd
                    ? "font-bold underline decoration-gold decoration-2 underline-offset-4"
                    : ""
                }`}
              >
                {format(d, "d")}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Select dates"
      className="fixed inset-0 z-50 flex flex-col bg-card text-left md:absolute md:inset-auto md:right-0 md:top-[calc(100%+0.75rem)] md:w-[min(860px,calc(100vw-2rem))] md:rounded-xl md:border md:border-border md:shadow-lux"
    >
      <div className="flex items-center gap-3 border-b border-border px-5 py-4 md:px-6 md:py-3">
        <CalendarDays className="size-5 shrink-0 text-foreground" strokeWidth={1.5} />
        <p className="text-base font-semibold text-foreground md:text-lg">
          {selecting === "depart" ? "Select Departure Date" : "Select Return Date"}
        </p>
        <button
          type="button"
          aria-label="Close calendar"
          onClick={onClose}
          className="ml-auto grid size-9 place-items-center rounded-full text-foreground transition hover:bg-muted"
        >
          <X className="size-5" />
        </button>
      </div>

      {isMobile ? (
        <div className="flex-1 space-y-8 overflow-y-auto px-4 py-5">{months.map(renderMonth)}</div>
      ) : (
        <div className="grid grid-cols-2 gap-10 px-6 pb-5 pt-4">{months.map(renderMonth)}</div>
      )}

      {isMobile ? (
        <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
          <p className="min-w-0 truncate text-sm font-semibold text-navy">
            {depart ? format(depart, "d MMM") : "Pick a date"}
            {ret ? ` – ${format(ret, "d MMM")}` : ""}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg bg-gold px-8 py-3 font-display text-base font-bold text-gold-foreground"
          >
            Done
          </button>
        </div>
      ) : null}
    </div>
  );
}
