import { Phone, Plane, Search } from "lucide-react";
import { useCurrency } from "@/components/site/CurrencyContext";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";

const POPULAR_FROM = { code: "JFK", city: "New York" };

/** Average round-trip fares per person (taxes and fees included) from New York. */
const ROUTES = [
  { code: "LAX", city: "Los Angeles", price: 340, photo: "1640809307933-566bfa1d21d6" },
  { code: "BCN", city: "Barcelona", price: 740, photo: "1728249960363-13079cc2c6f6" },
  { code: "DFW", city: "Dallas", price: 140, photo: "1621904878414-d4ca4756bd7e" },
  { code: "MIA", city: "Miami", price: 100, photo: "1647188234388-62f4b82ca08c" },
  { code: "LHR", city: "London", price: 640, photo: "1454793147212-9e7e57e89a4f" },
];

const thumbUrl = (id: string, size: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${size}&h=${size}&q=70`;

/**
 * Boarding-pass style route cards, two per row. `onPick` receives the destination
 * and origin airport codes; `onSearchOther` handles the "Don't see your route?" card.
 */
export function PopularRoutes({
  onPick,
  onSearchOther,
}: {
  onPick?: (to: string, from: string) => void;
  onSearchOther?: () => void;
}) {
  const { money } = useCurrency();
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {ROUTES.map((r) => (
        <button
          key={r.code}
          type="button"
          onClick={() => onPick?.(r.code, POPULAR_FROM.code)}
          aria-label={`Search round-trip flights from ${POPULAR_FROM.city} to ${r.city}, average ${money(r.price)}`}
          className="group flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 text-left shadow-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lux sm:gap-4 sm:px-4"
        >
          <img
            src={thumbUrl(r.photo, 96)}
            srcSet={`${thumbUrl(r.photo, 96)} 1x, ${thumbUrl(r.photo, 192)} 2x`}
            alt=""
            loading="lazy"
            decoding="async"
            className="hidden size-12 shrink-0 rounded-lg object-cover sm:block"
          />

          <span className="w-14 shrink-0 sm:w-20">
            <span className="block font-display text-lg font-bold leading-tight text-navy">
              {POPULAR_FROM.code}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {POPULAR_FROM.city}
            </span>
          </span>

          <span className="min-w-0 flex-1 text-center">
            <span className="hidden whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:block">
              Round trip
            </span>
            <span className="relative block h-4 sm:my-1">
              <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-border" />
              <span className="absolute left-1/2 top-1/2 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-card text-muted-foreground transition group-hover:text-gold">
                <Plane className="size-3.5" />
              </span>
            </span>
            <span className="hidden whitespace-nowrap text-[11px] text-muted-foreground sm:block">
              Any dates
            </span>
          </span>

          <span className="w-[4.75rem] shrink-0 text-right sm:w-24">
            <span className="block font-display text-lg font-bold leading-tight text-navy">
              {r.code}
            </span>
            <span className="block truncate text-xs text-muted-foreground">{r.city}</span>
          </span>

          <span className="ml-1 shrink-0 border-l border-border pl-3 text-right sm:pl-4">
            <span className="block whitespace-nowrap text-[11px] text-muted-foreground">
              Avg. round trip
            </span>
            <span className="block font-display text-xl font-bold leading-tight text-gold">
              {money(r.price)}
            </span>
          </span>
        </button>
      ))}

      <div className="flex flex-col justify-center gap-3 rounded-xl border border-dashed border-primary/40 bg-card/60 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-base font-bold text-navy">Don&apos;t see your route?</p>
          <p className="text-xs text-muted-foreground">We search 47+ partner airlines.</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onSearchOther}
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 text-xs font-bold text-navy-foreground transition hover:brightness-110"
          >
            <Search className="size-3.5" /> Search flights
          </button>
          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 px-3.5 py-2 text-xs font-bold text-primary transition hover:bg-accent"
          >
            <Phone className="size-3.5" /> {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </div>
  );
}
