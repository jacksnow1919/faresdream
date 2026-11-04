import type { ReactNode } from "react";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { BadgeCheck, Cloud, Plane } from "lucide-react";
import { cityOf } from "@/lib/airports";
import type { FareJourney, PkfareNormalisedFare } from "@/lib/pkfare-types";

/** Calendar days between leaving and landing, e.g. 1 for an overnight flight. */
const extraDays = (journey: FareJourney) => {
  const arriveAt = journey.segments.at(-1)?.arriveAt;
  if (!arriveAt || !journey.departDate) return 0;
  return Math.max(
    0,
    differenceInCalendarDays(parseISO(arriveAt.slice(0, 10)), parseISO(journey.departDate)),
  );
};

const stopsText = (journey: FareJourney) => {
  if (journey.stops === 0) return "Non stop";
  const via = journey.segments.slice(1).map((s) => s.origin);
  const label = `${journey.stops} stop${journey.stops > 1 ? "s" : ""}`;
  return via.length ? `${label} · ${via.join(", ")}` : label;
};

function AirlineMark({ code, logoUrl }: { code: string; logoUrl?: string | undefined }) {
  return logoUrl ? (
    <img src={logoUrl} alt="" className="size-9 shrink-0 object-contain" loading="lazy" />
  ) : (
    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-navy text-xs font-bold text-navy-foreground">
      {code}
    </span>
  );
}

function JourneyRow({
  journey,
  airline,
  code,
  logoUrl,
}: {
  journey: FareJourney;
  airline: string;
  code: string;
  logoUrl?: string | undefined;
}) {
  const plus = extraDays(journey);
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,10.625rem)_minmax(0,1fr)] sm:items-center sm:gap-4 xl:grid-cols-[minmax(0,11.25rem)_minmax(0,1fr)] xl:gap-5">
      <div className="flex min-w-0 items-center gap-3">
        <AirlineMark code={code} logoUrl={logoUrl} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground xl:text-[15px]">{airline}</p>
          <p className="text-xs text-muted-foreground">{journey.flightNo}</p>
        </div>
      </div>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 sm:gap-4">
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">{journey.departTime}</p>
          <p className="max-w-24 truncate text-xs text-muted-foreground">
            {cityOf(journey.origin)}
          </p>
        </div>
        <div className="min-w-0 text-center">
          <p className="text-sm font-semibold text-sky-700">{journey.duration}</p>
          <div className="my-1 flex items-center gap-1 text-sky-500">
            <Plane className="size-3.5 shrink-0" />
            <span className="h-px flex-1 bg-sky-400" />
            <span className="size-2 shrink-0 rounded-full border border-sky-500" />
          </div>
          <p className="truncate text-xs text-muted-foreground">{stopsText(journey)}</p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">
            {journey.arriveTime}
            {plus > 0 ? (
              <sup className="ml-0.5 text-[10px] font-semibold text-gold">+{plus}</sup>
            ) : null}
          </p>
          <p className="max-w-24 truncate text-xs text-muted-foreground">
            {cityOf(journey.destination)}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Thomas Cook-style result card; round trips show the return journey as a second row.
 * `action` is the Select button; the page opens the flight details window from it.
 */
export function FareCard({
  fare,
  airline,
  price,
  action,
}: {
  fare: PkfareNormalisedFare;
  airline: string;
  price: string;
  action: ReactNode;
}) {
  const outbound: FareJourney = { ...fare, segments: fare.segments ?? [] };
  const code = fare.carrierCode || fare.flightNo.slice(0, 2);

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_6px_rgb(15_23_42/0.06)] transition hover:shadow-[0_6px_18px_rgb(15_23_42/0.1)]">
      <div className="relative px-4 pb-3 pt-7 sm:px-5">
        {fare.co2Kg ? (
          <span className="absolute left-3 top-0 inline-flex items-center gap-1 rounded-b-md bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-navy">
            <Cloud className="size-3 text-sky-500" /> {fare.co2Kg} kg CO₂
          </span>
        ) : null}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-5 xl:gap-8">
          <div className="space-y-4">
            <JourneyRow journey={outbound} airline={airline} code={code} logoUrl={fare.logoUrl} />
            {fare.inbound ? (
              <JourneyRow
                journey={fare.inbound}
                airline={airline}
                code={code}
                logoUrl={fare.logoUrl}
              />
            ) : null}
          </div>
          <div className="flex items-center justify-between gap-6 border-t border-dashed border-border pt-3 lg:border-0 lg:pt-0">
            <div className="lg:text-right">
              <p className="font-display text-xl font-bold text-foreground">{price}</p>
              <p className="text-xs text-muted-foreground">
                {fare.inbound ? "Round trip, per person" : "Per person"}
              </p>
            </div>
            {action}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 bg-linear-to-r from-sky-50 via-sky-50/50 to-gold-soft/60 px-4 py-1.5 sm:px-5">
        {fare.refundable ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
            <BadgeCheck className="size-3.5" /> Refundable
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            Non-refundable
          </span>
        )}
      </div>
    </article>
  );
}
