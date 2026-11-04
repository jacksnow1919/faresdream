import { useEffect, useRef, type ReactNode } from "react";
import { Minus, Plus, X } from "lucide-react";

export type Travelers = { adults: number; children: number; infants: number };

export type Cabin = "Economy" | "PremiumEconomy" | "Business" | "First";

export const CABINS: { id: Cabin; label: string }[] = [
  { id: "Economy", label: "Economy" },
  { id: "PremiumEconomy", label: "Premium Economy" },
  { id: "Business", label: "Business" },
  { id: "First", label: "First Class" },
];

/** Airlines cap a booking at 9 seated passengers (adults + children). */
const MAX_SEATED = 9;

export const cabinLabel = (c: Cabin) => CABINS.find((x) => x.id === c)?.label ?? c;

export const travelerCount = (t: Travelers) => t.adults + t.children + t.infants;

export const travelerLabel = (t: Travelers) => {
  const n = travelerCount(t);
  return `${n} ${n === 1 ? "Passenger" : "Passengers"}`;
};

function Counter({
  title,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  title: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${title}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="grid size-8 place-items-center rounded-full border border-border text-foreground transition hover:border-foreground/40 disabled:pointer-events-none disabled:text-muted-foreground/50"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-5 text-center text-base font-semibold text-foreground">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${title}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="grid size-8 place-items-center rounded-full bg-foreground text-background transition hover:opacity-85 disabled:pointer-events-none disabled:opacity-25"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Travellers + cabin class field: `children` is the trigger's content, and the
 * panel drops down under it (a bottom sheet on phones). Changes apply as you go.
 * The caller positions it, so wrap it in a `relative` element.
 */
export function TravelerSelector({
  value,
  onChange,
  cabin,
  onCabinChange,
  open,
  onOpenChange,
  className = "",
  children,
}: {
  value: Travelers;
  onChange: (t: Travelers) => void;
  cabin: Cabin;
  onCabinChange: (c: Cabin) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open, onOpenChange]);

  const { adults, children: kids, infants } = value;
  const setAdults = (n: number) =>
    // One lap infant per adult.
    onChange({ adults: n, children: kids, infants: Math.min(infants, n) });

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
        className={className}
      >
        {children}
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-40 bg-navy/40 md:hidden" aria-hidden="true" />
          <div
            ref={panelRef}
            role="dialog"
            aria-label="Travellers and class"
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-card text-left shadow-lux md:absolute md:bottom-auto md:left-auto md:right-0 md:top-[calc(100%+0.75rem)] md:w-[22.5rem] md:rounded-xl md:border md:border-border xl:left-0 xl:right-auto"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <p className="text-base font-semibold text-foreground md:text-lg">
                Travellers &amp; Class
              </p>
              <button
                type="button"
                aria-label="Close travellers and class"
                onClick={() => onOpenChange(false)}
                className="grid size-9 place-items-center rounded-full text-foreground transition hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="px-5 py-2">
              <Counter
                title="Adults"
                hint="12+ years"
                value={adults}
                min={1}
                max={MAX_SEATED - kids}
                onChange={setAdults}
              />
              <Counter
                title="Children"
                hint="2–11 years"
                value={kids}
                min={0}
                max={MAX_SEATED - adults}
                onChange={(n) => onChange({ ...value, children: n })}
              />
              <Counter
                title="Infants"
                hint="Under 2 years, on lap"
                value={infants}
                min={0}
                max={adults}
                onChange={(n) => onChange({ ...value, infants: n })}
              />
            </div>

            <div className="px-5 pb-5 pt-1">
              <p className="text-base font-semibold text-foreground">Travel Class</p>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {CABINS.map((c) => {
                  const active = cabin === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onCabinChange(c.id)}
                      className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                        active
                          ? "border-foreground text-foreground"
                          : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="mt-5 h-12 w-full rounded-lg bg-gold font-display text-base font-bold text-gold-foreground md:hidden"
              >
                Done
              </button>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
