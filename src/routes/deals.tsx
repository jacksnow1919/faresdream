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
import { MONTHS_LONG, routeInsights, routePages, usd } from "@/lib/route-pages";
import { destinationFares } from "@/lib/destination-fares";
import { destinations } from "@/lib/travel-data";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { breadcrumbLd, faqLd, jsonLdScript } from "@/lib/structured-data";

async function fetchDeals(): Promise<FallbackDeal[]> {
  try {
    const { data, error } = await supabase.from("deals").select("*").order("price", { ascending: true });
    if (error || !data) return [];
    return data as FallbackDeal[];
  } catch {
    return [];
  }
}

const DEAL_FAQS = [
  {
    q: "Are the deal prices guaranteed?",
    a: "No. Deal prices are fares we found recently, per person and one way. Airline prices change many times a day, so tap a deal to see today's live fare for your dates before you book.",
  },
  {
    q: "When are flights usually cheapest?",
    a: "It depends on the route. In KAYAK's 12-month fare data for the routes we track, January and February were the cheapest months on most routes, and December, June and July were usually the most expensive. Each route and destination page below shows the cheapest month for that trip.",
  },
  {
    q: "Can I get a fare that isn't shown online?",
    a: "Call our travel agents 24/7. They can compare published fares and some fares that are not shown online, especially for long-haul and business class trips.",
  },
];

export const Route = createFileRoute("/deals")({
  loader: async () => ({ deals: await fetchDeals() }),
  head: () => ({
    meta: [
      { title: "Cheap Flight Deals from the USA & Cheapest Months by Route | FaresDream" },
      {
        name: "description",
        content:
          "Recently found cheap flight deals on popular routes, plus the cheapest month and typical round-trip fare for popular US and international routes, from KAYAK data.",
      },
      { property: "og:title", content: "Cheap Flight Deals | FaresDream" },
      {
        property: "og:description",
        content: "Recently found fares on popular routes, plus the cheapest month to fly on each route.",
      },
    ],
    scripts: [jsonLdScript([breadcrumbLd([{ name: "Deals", path: "/deals" }]), faqLd(DEAL_FAQS)])],
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
  const loaded = Route.useLoaderData();
  const { data, isLoading } = useQuery({
    queryKey: ["deals"],
    queryFn: fetchDeals,
    // Server-rendered so search engines see the deals; refreshed in the browser.
    initialData: loaded.deals,
  });

  const hasLive = Boolean(data && data.length > 0);
  const deals: FallbackDeal[] = hasLive ? data! : FALLBACK_DEALS;
  const airlineList = ["All", ...Array.from(new Set(deals.map((d) => d.airline)))];
  const filtered = airline === "All" ? deals : deals.filter((d) => d.airline === airline);

  return (
    <PageShell
      crumb="Deals"
      title="Flight deals"
      subtitle={hasLive ? "Cheap fares we've found recently on popular routes." : "Popular routes from the US. Tap one to compare today's live fares."}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Filter by airline"
          className="page-bleed flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {/* Just "All" until the deals load, so the backup list doesn't flash up first. */}
          {(isLoading || !hasLive ? [] : airlineList).map((a) => {
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
        {isLoading || !hasLive ? null : (
          <p className="shrink-0 text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "deal" : "deals"}
          </p>
        )}
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-xl border border-primary/15 bg-sky-50 px-4 py-3 text-sm text-navy">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        {hasLive
          ? "Prices are per person and can change. Tap a deal to see today's live fares, then change the dates if you like."
          : "Fares change many times a day, so we don't show old prices. Tap a route to see today's live fares, then change the dates if you like."}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-[13.375rem] animate-pulse rounded-2xl bg-card shadow-card" />
            ))
          : filtered.map((d) => <DealCard key={d.id} d={d} />)}
      </div>

      <CheapestMonths />

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-bold text-navy">Flight deals: common questions</h2>
        <FaqAccordion items={DEAL_FAQS} initialCount={DEAL_FAQS.length} />
      </section>
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
      aria-label={d.price != null ? `${d.airline} ${d.cabin_class} from ${from} to ${to}, from ${money(d.price, d.currency)}` : `Compare today's fares from ${from} to ${to}`}
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
          {d.price != null ? (
            <>
              <p className="text-xs text-muted-foreground">One way from</p>
              <p className="font-display text-2xl font-bold leading-tight text-gold">
                {money(d.price, d.currency)}
              </p>
            </>
          ) : (
            <p className="text-sm font-semibold text-navy">Check today&apos;s fare</p>
          )}
          {d.expires_at ? (
            <p className="text-[11px] text-muted-foreground">
              Ends {format(parseISO(newYorkYmd(d.expires_at)), "d MMM yyyy")}
            </p>
          ) : null}
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition group-hover:brightness-110">
          {d.price != null ? "View deal" : "Compare fares"} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

/** Server-rendered fare data (KAYAK, 12-month medians) so the page is useful before live deals load. */
function CheapestMonths() {
  const routeRows = routePages.map((r) => ({ r, x: routeInsights(r) }));
  const destRows = destinations
    .map((d) => ({ d, f: destinationFares[d.slug] }))
    .filter((x): x is { d: (typeof destinations)[number]; f: NonNullable<(typeof destinationFares)[string]> } => Boolean(x.f));
  return (
    <>
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-navy">Cheapest month to fly on popular US routes</h2>
        <p className="mt-2 max-w-3xl text-sm text-foreground/80">
          The best deal is often a cheaper month. These are KAYAK&apos;s median round-trip economy fares
          over the past 12 months for the routes we track. Tap a route for prices by month, the
          cheapest day and when to book.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Cheapest month</th>
                <th className="px-4 py-3">Typical round trip</th>
              </tr>
            </thead>
            <tbody>
              {routeRows.map(({ r, x }) => (
                <tr key={r.slug} className="border-b border-border/60">
                  <td className="px-4 py-2">
                    <Link to="/flights/$slug" params={{ slug: r.slug }} className="font-semibold text-primary hover:underline">
                      {r.from.city} ({r.from.code}) to {r.to.city} ({r.to.code})
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    {MONTHS_LONG[x.cheapIdx]} · {usd(x.cheapPrice)}
                  </td>
                  <td className="px-4 py-2">{r.data.range ? usd(r.data.range[2]!) : "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-navy">Cheapest time to fly from the US to popular destinations</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {destRows.map(({ d, f }) => (
            <li key={d.slug} className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <Link to="/destinations/$slug" params={{ slug: d.slug }} className="font-semibold text-navy hover:text-primary">
                Flights to {d.city}
              </Link>
              <p className="mt-1 text-sm text-foreground/80">{f.summary.split(". ")[0]}.</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Source: KAYAK public route pages, 12-month median round-trip fares. Prices change daily.
        </p>
      </section>
    </>
  );
}
