import { useEffect, useState } from "react";
import { useCurrency } from "@/components/site/CurrencyContext";
import { Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { ArrowUpRight, Plane } from "lucide-react";
import { airportByCode, cityOf, useAirports } from "@/lib/airports";
import { clearRecentSearches, loadRecentSearches, type RecentSearch } from "@/lib/recent-searches";

/** Saved cabins come from the results page ("PremiumEconomy") or checkout ("Premium Economy"). */
const toSearchCabin = (cabin: string) => {
  const c = cabin.replace(/\s+/g, "").toLowerCase();
  if (c === "premiumeconomy") return "PremiumEconomy" as const;
  if (c === "business") return "Business" as const;
  if (c === "first") return "First" as const;
  return "Economy" as const;
};

function RecentSearchCard({ s }: { s: RecentSearch }) {
  const { money } = useCurrency();
  return (
    <div className="w-[85%] shrink-0 snap-start overflow-hidden rounded-2xl border-2 border-primary bg-linear-to-r from-navy to-primary shadow-card sm:w-[18.75rem]">
      <div className="rounded-b-2xl bg-card px-4 py-3">
        <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
          <span className="min-w-0 truncate">{cityOf(s.origin)}</span>
          <span className="relative h-px min-w-6 flex-1 bg-border">
            <Plane className="absolute left-1/2 top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 bg-card text-muted-foreground" />
          </span>
          <span className="min-w-0 truncate text-right">{cityOf(s.destination)}</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-navy">
            {s.passengers} {s.passengers === 1 ? "Traveller" : "Travellers"}
          </span>
          <span className="text-sm text-muted-foreground">
            {format(parseISO(s.date), "EEE, d MMM yy")}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
        {s.price ? (
          <span>
            <span className="block font-display text-lg font-bold leading-tight">
              {money(s.price, s.currency)}
            </span>
            <span className="block text-xs text-white/80">Per person · last seen</span>
          </span>
        ) : (
          <span className="text-sm font-medium text-white/90">See today&apos;s prices</span>
        )}
        <Link
          to="/flight/search"
          search={{
            origin: s.origin,
            destination: s.destination,
            date: s.date,
            passengers: s.passengers,
            cabin: toSearchCabin(s.cabin),
            currency: s.currency,
          }}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-gold-foreground transition hover:brightness-110"
        >
          Continue <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

/**
 * The visitor's last flight searches (from this browser), so someone who left at
 * results or checkout can pick up where they stopped. Renders nothing without any.
 */
export function RecentSearches() {
  const [items, setItems] = useState<RecentSearch[]>([]);

  // localStorage is only available after mount, which also keeps SSR markup stable.
  useEffect(() => setItems(loadRecentSearches()), []);

  // Only a search involving a smaller airport needs the full airport list.
  useAirports(items.some((s) => !airportByCode(s.origin) || !airportByCode(s.destination)));

  if (items.length === 0) return null;

  return (
    <section className="pt-12 lg:pt-16">
      <div className="page-container">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-navy sm:text-2xl">Recent Searches</h2>
          <button
            type="button"
            onClick={() => {
              clearRecentSearches();
              setItems([]);
            }}
            className="text-sm font-semibold text-muted-foreground transition hover:text-navy"
          >
            Clear
          </button>
        </div>
        <div className="-my-2 mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((s) => (
            <RecentSearchCard key={`${s.origin}-${s.destination}-${s.date}`} s={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
