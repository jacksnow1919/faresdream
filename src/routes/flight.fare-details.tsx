import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { ArrowRight, Info } from "lucide-react";
import { cityOf, useAirports } from "@/lib/airports";
import { parseFlightSearch, currencySymbol, travellerText } from "@/lib/flight-search-params";
import { loadSelectedFare, type SelectedFare } from "@/lib/selected-fare";
import {
  ChangeFlightLink,
  CheckoutCard,
  CheckoutShell,
  PriceSummary,
  TripSummary,
  TrustPoints,
} from "@/components/site/checkout";
import { BaggageInfo, FareRulesInfo, TripTimeline } from "@/components/site/FlightItinerary";

export const Route = createFileRoute("/flight/fare-details")({
  validateSearch: parseFlightSearch,
  head: () => ({
    meta: [
      { title: "Review Your Flight | FaresDream" },
      {
        name: "description",
        content:
          "Review your flight times, layovers, included baggage, fare rules and price before you add traveller details.",
      },
      { property: "og:title", content: "Review Your Flight" },
      {
        property: "og:description",
        content: "Flight times, baggage, fare rules and price in one place.",
      },
    ],
  }),
  component: FareDetails,
});

const dayText = (ymd: string) => {
  try {
    return format(parseISO(ymd), "EEE, d MMM");
  } catch {
    return ymd;
  }
};

function FareDetails() {
  useAirports();
  const s = Route.useSearch();
  const sym = currencySymbol(s.currency);
  const total = Number(s.price) || 0;
  const base = Number(s.baseFare);
  const taxes = Number(s.taxes);
  const travellers = (s.adults ?? 1) + (s.children ?? 0) + (s.infants ?? 0);

  // The picked fare's timeline/baggage/rules live in this tab's storage (after mount, so SSR matches).
  const [selected, setSelected] = useState<SelectedFare | null>(null);
  useEffect(() => {
    setSelected(loadSelectedFare(s));
  }, [s]);

  const continueLink = (className: string) => (
    <Link to="/flight/booking" search={s} className={className}>
      Continue to traveller details <ArrowRight className="size-4" />
    </Link>
  );

  return (
    <CheckoutShell
      step={2}
      title={`Review your ${s.returnDate ? "trip" : "flight"} to ${cityOf(s.destination)}`}
      subtitle={`${cityOf(s.origin)} to ${cityOf(s.destination)} · ${dayText(s.departDate)}${
        s.returnDate ? ` – ${dayText(s.returnDate)}` : ""
      } · ${travellerText(s)} · ${s.cabin}`}
      action={<ChangeFlightLink flight={s} />}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_21.25rem]">
        <div className="space-y-4">
          <CheckoutCard title="Flight details">
            {selected ? (
              <>
                <TripTimeline fare={selected.fare} airline={selected.airline} />
                <div className="mt-5">
                  <BaggageInfo fare={selected.fare} />
                  <FareRulesInfo fare={selected.fare} travellers={travellers} />
                </div>
              </>
            ) : (
              <div className="space-y-3 text-sm">
                <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  <Detail label="Airline" value={s.airline} />
                  <Detail label="Flight" value={s.flightNo} />
                  <Detail
                    label="Route"
                    value={`${cityOf(s.origin)} (${s.origin}) → ${cityOf(s.destination)} (${s.destination})`}
                  />
                  <Detail label="Cabin" value={s.cabin} />
                  <Detail label="Depart" value={dayText(s.departDate)} />
                  {s.returnDate ? <Detail label="Return" value={dayText(s.returnDate)} /> : null}
                </dl>
                <p className="flex items-start gap-2 rounded-lg bg-sky-50 px-3 py-2.5 text-foreground">
                  <Info className="mt-0.5 size-4 shrink-0 text-primary" />
                  Flight times, baggage allowance and the airline&apos;s refund and change rules for
                  this fare are confirmed in writing before you pay.
                </p>
              </div>
            )}
          </CheckoutCard>

          <div className="hidden justify-end lg:flex">
            {continueLink(
              "inline-flex items-center gap-2 rounded-lg bg-navy px-7 py-3 text-base font-semibold text-navy-foreground transition hover:brightness-110",
            )}
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <TripSummary flight={s} selected={selected}>
            <PriceSummary
              sym={sym}
              currency={s.currency}
              lines={
                base > 0 && taxes > 0
                  ? [
                      { label: `Base fare (${travellerText(s)})`, value: base },
                      { label: "Taxes and airline charges", value: taxes },
                    ]
                  : []
              }
              total={total}
              totalLabel={travellers > 1 ? `Total (${travellers} travellers)` : "Total"}
            />
            {continueLink(
              "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-navy-foreground transition hover:brightness-110",
            )}
          </TripSummary>
          <TrustPoints />
        </aside>
      </div>
    </CheckoutShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
