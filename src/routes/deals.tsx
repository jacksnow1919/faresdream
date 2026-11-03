import { createFileRoute, Link } from "@tanstack/react-router";
import { useCurrency } from "@/components/site/CurrencyContext";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ArrowRight, Info, Plane } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/ui";
import { cityOf, useAirports } from "@/lib/airports";
import { shortcutDates } from "@/lib/focus-search";
import { newYorkYmd } from "@/lib/admin-logic";
import { FALLBACK_DEALS, type FallbackDeal } from "@/lib/fallback-deals";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Cheap Flight Deals | FaresDream" },
      {
        name: "description",
        content:
          "Recently found cheap flight deals on popular routes. Filter by airline and see today's live fares for your dates.",
      },
      { property: "og:title", content: "Cheap Flight Deals | FaresDream" },
      {
        property: "og:description",
        content: "Recently found fares on popular routes, filterable by airline.",
      },
    ],
  }),
  component: DealsPage,
});

const CABINS = {
  economy: "Economy",
  "premium economy": "PremiumEconomy",
  premiumeconomy: "PremiumEconomy",
  business: "Business",
  first: "First",
} as const;

const cabinOf = (cabin: string) => CABINS[cabin.toLowerCase() as keyof typeof CABINS] ?? "Economy";

/**
 * Live results for a deal: one way (as the deal price is quoted), a week out, one adult.
 */
function dealSearch(d: FallbackDeal) {
  return {
    origin: d.origin,
    destination: d.destination,
    date: format(shortcutDates().depart, "yyyy-MM-dd"),
    passengers: 1,
    cabin: cabinOf(d.cabin_class),
    currency: d.currency,
  };
}

function DealsPage() {
  useAirports();
  const [airline, setAirline] = useState("All");
  const { data, isLoading } = useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("price", { ascending: true });
      if (error) return [];
      return data ?? [];
    },
  });

  const deals: FallbackDeal[] = data && data.length > 0 ? data : FALLBACK_DEALS;
  const airlineList = ["All", ...Array.from(new Set(deals.map((d) => d.airline)))];
  const filtered = airline === "All" ? deals : deals.filter((d) => d.airline === airline);

  return (
    <PageShell
      crumb="Deals"
      title="Flight deals"
      subtitle="Cheap fares we've found recently on popular routes."
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Filter by airline"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {/* Just "All" until the deals load, so the backup list doesn't flash up first. */}
          {(isLoading ? ["All"] : airlineList).map((a) => {
            const active = airline === a;
            return (
              <button
                key={a}
                type="button"
                aria-pressed={active}
                onClick={() => setAirline(a)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-card"
                    : "border-border bg-card text-navy hover:border-primary/50"
                }`}
              >
                {a === "All" ? "All airlines" : a}
              </button>
            );
          })}
        </div>
        {isLoading ? null : (
          <p className="shrink-0 text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "deal" : "deals"}
          </p>
        )}
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-xl border border-primary/15 bg-sky-50 px-4 py-3 text-sm text-navy">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        Prices are per person and can change. Tap a deal to see today&apos;s live fares, then change
        the dates if you like.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-[214px] animate-pulse rounded-2xl bg-card shadow-card" />
            ))
          : filtered.map((d) => <DealCard key={d.id} d={d} />)}
      </div>
    </PageShell>
  );
}

function DealCard({ d }: { d: FallbackDeal }) {
  const { money } = useCurrency();
  const from = cityOf(d.origin);
  const to = cityOf(d.destination);
  return (
    <Link
      to="/flight/search"
      search={dealSearch(d)}
      aria-label={`${d.airline} ${d.cabin_class} from ${from} to ${to}, from ${money(d.price, d.currency)}`}
      className="group flex flex-col rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lux"
    >
      <div className="flex items-center justify-between gap-3 px-5 pt-5">
        <p className="min-w-0 truncate text-sm font-semibold text-navy">{d.airline}</p>
        <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-navy">
          {d.cabin_class}
        </span>
      </div>

      <div className="flex items-center gap-3 px-5 pb-5 pt-4">
        <div className="min-w-0">
          <p className="font-display text-2xl font-bold text-navy">{d.origin}</p>
          <p className="truncate text-xs text-muted-foreground">{from}</p>
        </div>
        <div className="relative flex flex-1 items-center justify-center">
          <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-border" />
          <span className="relative grid size-8 place-items-center rounded-full border border-border bg-card text-primary">
            <Plane className="size-4" />
          </span>
        </div>
        <div className="min-w-0 text-right">
          <p className="font-display text-2xl font-bold text-navy">{d.destination}</p>
          <p className="truncate text-xs text-muted-foreground">{to}</p>
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-dashed border-border px-5 py-4">
        <div>
          <p className="text-xs text-muted-foreground">One way from</p>
          <p className="font-display text-2xl font-bold leading-tight text-gold">
            {money(d.price, d.currency)}
          </p>
          {d.expires_at ? (
            <p className="text-[11px] text-muted-foreground">
              Ends {format(parseISO(newYorkYmd(d.expires_at)), "d MMM yyyy")}
            </p>
          ) : null}
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition group-hover:brightness-110">
          View deal <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
