import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isValid,
  parseISO,
  setMonth,
  setYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = Array.from({ length: 12 }, (_, i) => format(new Date(2000, i, 1), "MMM"));

const parse = (v?: string | undefined) => {
  if (!v) return null;
  const d = parseISO(v);
  return isValid(d) ? d : null;
};

const arrowCls =
  "grid size-8 shrink-0 place-items-center rounded-full text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30";
const panelCls =
  "absolute left-0 z-50 w-[18.5rem] max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-card p-3 text-left text-foreground shadow-lux";

/**
 * Open/close for a picker panel: closes on outside click or Escape, and opens upward when
 * there isn't room below the field inside the nearest scrolling box (e.g. a pop-up) or window.
 */
function usePickerPanel(onClose?: () => void) {
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(
    (refocus = false) => {
      setOpen(false);
      onClose?.();
      if (refocus) triggerRef.current?.focus();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const openPanel = (panelHeight: number) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const r = trigger.getBoundingClientRect();
    let top = 0;
    let bottom = window.innerHeight;
    for (let el = trigger.parentElement; el; el = el.parentElement) {
      if (/auto|scroll|hidden/.test(getComputedStyle(el).overflowY)) {
        const box = el.getBoundingClientRect();
        top = Math.max(top, box.top);
        bottom = Math.min(bottom, box.bottom);
        break;
      }
    }
    const below = bottom - r.bottom;
    setAbove(below < panelHeight && r.top - top > below);
    setOpen(true);
  };

  return { open, above, rootRef, triggerRef, openPanel, close };
}

function Trigger({
  triggerRef,
  open,
  onClick,
  text,
  empty,
  className,
  ariaLabel,
  invalid,
}: {
  triggerRef: RefObject<HTMLButtonElement | null>;
  open: boolean;
  onClick: () => void;
  text: string;
  empty: boolean;
  className: string;
  ariaLabel: string;
  invalid?: boolean | undefined;
}) {
  return (
    <button
      ref={triggerRef}
      type="button"
      aria-label={`${ariaLabel}${empty ? "" : `: ${text}`}`}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-invalid={invalid ? true : undefined}
      onClick={onClick}
      className={`flex items-center justify-between gap-2 text-left ${className}`}
    >
      <span className={`truncate ${empty ? "opacity-60" : ""}`}>{text}</span>
      <CalendarDays className="size-4 shrink-0 opacity-60" />
    </button>
  );
}

/** Margin classes go on the wrapper so the calendar icon stays centred on the box itself. */
const isMargin = (cls: string) => /^!?-?m[trblxy]?-/.test(cls);

/**
 * Branded date field: type the date (DD/MM/YYYY, slashes added as you go) or pick it from the
 * calendar icon, which has month and year dropdowns (quick for birthdays). Limited to
 * `min`–`max`; values are yyyy-MM-dd. Shows "15 May 1990" when not being edited, so the
 * day/month order is never in doubt. Don't wrap it in a <label>: clicks inside the calendar
 * would re-trigger the label's control.
 */
export function DatePicker({
  value,
  onChange,
  min,
  max,
  defaultMonth,
  placeholder = "DD/MM/YYYY",
  ariaLabel,
  className,
  invalid,
  error,
  onClose,
}: {
  value: string;
  onChange: (value: string) => void;
  min?: string | undefined;
  max?: string | undefined;
  /** Month to show first while empty (yyyy-MM-dd), e.g. ~30 years ago for a birthday. */
  defaultMonth?: string | undefined;
  placeholder?: string;
  ariaLabel: string;
  className: string;
  invalid?: boolean | undefined;
  /** Message from the form's own validation; a typed-date problem is shown instead. */
  error?: string | undefined;
  /** Called when the field loses focus or the calendar closes (e.g. to mark it touched). */
  onClose?: () => void;
}) {
  const selected = parse(value);
  const minD = parse(min);
  const maxD = parse(max);
  const today = startOfDay(new Date());
  const { open, above, rootRef, triggerRef, openPanel, close } = usePickerPanel(onClose);
  const [view, setView] = useState(() => startOfMonth(selected ?? parse(defaultMonth) ?? today));

  const clampView = (d: Date) => {
    if (minD && isBefore(d, startOfMonth(minD))) return startOfMonth(minD);
    if (maxD && isAfter(d, startOfMonth(maxD))) return startOfMonth(maxD);
    return startOfMonth(d);
  };
  const outOfRange = (d: Date) =>
    (!!minD && isBefore(d, startOfDay(minD))) || (!!maxD && isAfter(d, startOfDay(maxD)));

  const toggle = () => {
    if (open) return close();
    setView(clampView(selected ?? parse(defaultMonth) ?? today));
    openPanel(345);
  };
  const pick = (d: Date) => {
    setTypedError(null);
    onChange(format(d, "yyyy-MM-dd"));
    close(true);
  };

  const [text, setText] = useState(() => (selected ? format(selected, "dd/MM/yyyy") : ""));
  const [focused, setFocused] = useState(false);
  const [typedError, setTypedError] = useState<string | null>(null);
  const rangeText =
    minD && maxD
      ? `Enter a date between ${format(minD, "d MMM yyyy")} and ${format(maxD, "d MMM yyyy")}.`
      : minD
        ? `Enter a date from ${format(minD, "d MMM yyyy")}.`
        : `Enter a date up to ${format(maxD ?? today, "d MMM yyyy")}.`;

  const typed = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    setText([digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join("/"));
    if (digits.length < 8) {
      setTypedError(null);
      if (value) onChange("");
      return;
    }
    const [d, m, y] = [
      Number(digits.slice(0, 2)),
      Number(digits.slice(2, 4)),
      Number(digits.slice(4)),
    ];
    const date = new Date(y, m - 1, d);
    const real = date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
    const problem = !real
      ? "Enter a real date as DD/MM/YYYY."
      : outOfRange(date)
        ? rangeText
        : null;
    setTypedError(problem);
    onChange(problem ? "" : format(date, "yyyy-MM-dd"));
  };

  const tokens = className.split(/\s+/).filter(Boolean);
  const boxCls = tokens.filter((t) => !isMargin(t)).join(" ");
  const message = typedError ?? error;

  const firstYear = minD?.getFullYear() ?? today.getFullYear() - 100;
  const lastYear = maxD?.getFullYear() ?? today.getFullYear() + 10;
  const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => lastYear - i);
  const year = view.getFullYear();
  const monthOff = (m: number) =>
    (!!minD && year === minD.getFullYear() && m < minD.getMonth()) ||
    (!!maxD && year === maxD.getFullYear() && m > maxD.getMonth());
  const days = eachDayOfInterval({ start: startOfWeek(view), end: endOfWeek(endOfMonth(view)) });

  return (
    <div ref={rootRef} className={tokens.filter(isMargin).join(" ")}>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          aria-label={`${ariaLabel} (day/month/year)`}
          aria-invalid={invalid || message ? true : undefined}
          placeholder={placeholder}
          value={focused ? text : selected ? format(selected, "d MMM yyyy") : text}
          onFocus={() => {
            setFocused(true);
            if (selected) setText(format(selected, "dd/MM/yyyy"));
          }}
          onBlur={() => {
            setFocused(false);
            onClose?.();
          }}
          onChange={(e) => typed(e.target.value)}
          className={`${boxCls} pr-11`}
        />
        <button
          ref={triggerRef}
          type="button"
          aria-label={`Choose ${ariaLabel.toLowerCase()} from calendar`}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={toggle}
          className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md opacity-70 transition hover:bg-black/5 hover:opacity-100"
        >
          <CalendarDays className="size-4" />
        </button>
        {open ? (
          <div
            role="dialog"
            aria-label={ariaLabel}
            className={`${panelCls} ${above ? "bottom-[calc(100%+0.4rem)]" : "top-[calc(100%+0.4rem)]"}`}
          >
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous month"
                disabled={!!minD && !isAfter(view, startOfMonth(minD))}
                onClick={() => setView(clampView(addMonths(view, -1)))}
                className={arrowCls}
              >
                <ChevronLeft className="size-4" />
              </button>
              <select
                aria-label="Month"
                value={view.getMonth()}
                onChange={(e) => setView(clampView(setMonth(view, Number(e.target.value))))}
                className="h-8 min-w-0 flex-1 cursor-pointer rounded-md border border-border bg-card px-1.5 text-sm font-semibold text-foreground"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i} disabled={monthOff(i)}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                aria-label="Year"
                value={year}
                onChange={(e) => setView(clampView(setYear(view, Number(e.target.value))))}
                className="h-8 min-w-0 flex-1 cursor-pointer rounded-md border border-border bg-card px-1.5 text-sm font-semibold text-foreground"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <button
                type="button"
                aria-label="Next month"
                disabled={!!maxD && !isBefore(view, startOfMonth(maxD))}
                onClick={() => setView(clampView(addMonths(view, 1)))}
                className={arrowCls}
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
              {WEEKDAYS.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-y-1">
              {days.map((d) => {
                if (!isSameMonth(d, view)) return <span key={d.toISOString()} aria-hidden="true" />;
                const off = outOfRange(d);
                const isSelected = !!selected && isSameDay(d, selected);
                const isToday = isSameDay(d, today);
                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    disabled={off}
                    aria-pressed={isSelected}
                    aria-label={format(d, "EEEE, d MMMM yyyy")}
                    onClick={() => pick(d)}
                    className={`relative mx-auto grid size-9 place-items-center rounded-full text-sm transition ${
                      isSelected
                        ? "bg-navy font-semibold text-navy-foreground"
                        : off
                          ? "cursor-not-allowed text-muted-foreground/35"
                          : "text-foreground hover:bg-sky-50"
                    } ${isToday && !isSelected ? "after:absolute after:bottom-1 after:h-0.5 after:w-3 after:rounded-full after:bg-gold" : ""}`}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-sm">
              {value ? (
                <button
                  type="button"
                  onClick={() => {
                    setText("");
                    setTypedError(null);
                    onChange("");
                    close(true);
                  }}
                  className="text-muted-foreground transition hover:text-navy"
                >
                  Clear
                </button>
              ) : (
                <span />
              )}
              {outOfRange(today) ? null : (
                <button
                  type="button"
                  onClick={() => pick(today)}
                  className="font-medium text-primary hover:underline"
                >
                  Today
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
      {message ? <p className="mt-1 text-xs font-medium text-destructive">{message}</p> : null}
    </div>
  );
}

/**
 * Month-only field ("June 2026") with a year header and a 3×4 month grid. Values are yyyy-MM;
 * empty means "any month". Months before `min` (yyyy-MM) can't be picked.
 */
export function MonthPicker({
  value,
  onChange,
  min,
  placeholder = "Any month",
  ariaLabel,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  min?: string | undefined;
  placeholder?: string;
  ariaLabel: string;
  className: string;
}) {
  const selected = parse(value ? `${value}-01` : "");
  const minD = parse(min ? `${min}-01` : "");
  const { open, above, rootRef, triggerRef, openPanel, close } = usePickerPanel();
  const [year, setYearView] = useState(() => (selected ?? new Date()).getFullYear());

  const toggle = () => {
    if (open) return close();
    setYearView((selected ?? minD ?? new Date()).getFullYear());
    openPanel(265);
  };
  const off = (m: number) =>
    !!minD && (year < minD.getFullYear() || (year === minD.getFullYear() && m < minD.getMonth()));

  return (
    <div ref={rootRef} className="relative">
      <Trigger
        triggerRef={triggerRef}
        open={open}
        onClick={toggle}
        text={selected ? format(selected, "MMMM yyyy") : placeholder}
        empty={!selected}
        className={className}
        ariaLabel={ariaLabel}
      />
      {open ? (
        <div
          role="dialog"
          aria-label={ariaLabel}
          className={`${panelCls} ${above ? "bottom-[calc(100%+0.4rem)]" : "top-[calc(100%+0.4rem)]"}`}
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous year"
              disabled={!!minD && year <= minD.getFullYear()}
              onClick={() => setYearView(year - 1)}
              className={arrowCls}
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="font-display text-sm font-semibold">{year}</span>
            <button
              type="button"
              aria-label="Next year"
              onClick={() => setYearView(year + 1)}
              className={arrowCls}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {MONTHS.map((m, i) => {
              const isSelected =
                !!selected && selected.getFullYear() === year && selected.getMonth() === i;
              return (
                <button
                  key={m}
                  type="button"
                  disabled={off(i)}
                  aria-pressed={isSelected}
                  onClick={() => {
                    onChange(`${year}-${String(i + 1).padStart(2, "0")}`);
                    close(true);
                  }}
                  className={`h-10 rounded-lg text-sm transition ${
                    isSelected
                      ? "bg-navy font-semibold text-navy-foreground"
                      : off(i)
                        ? "cursor-not-allowed text-muted-foreground/35"
                        : "text-foreground hover:bg-sky-50"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
          {value ? (
            <div className="mt-2 border-t border-border pt-2 text-sm">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  close(true);
                }}
                className="text-muted-foreground transition hover:text-navy"
              >
                Any month
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
