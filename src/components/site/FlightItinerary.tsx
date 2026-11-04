/**
 * Flight itinerary pieces shared by the Select window and the checkout pages: the timeline
 * with layovers, included baggage and fare rules. Only shows what the fare provider sent.
 */
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import {
  Briefcase,
  CalendarCheck,
  CircleDollarSign,
  Clock,
  Luggage,
  type LucideIcon,
} from "lucide-react";
import { cityOf } from "@/lib/airports";
import { minutesLabel } from "@/lib/fare-filters";
import { currencySymbol } from "@/lib/flight-search-params";
import { CANCEL_SERVICE_FEE_USD, CHANGE_SERVICE_FEE_USD } from "@/lib/brand";
import type { FareJourney, FareRule, FareSegment, PkfareNormalisedFare } from "@/lib/pkfare-types";

const CABIN_NAMES: Record<string, string> = { PremiumEconomy: "Premium Economy" };

const stamp = (local: string) => Date.parse(`${local}:00Z`) / 60_000;

/** "Sat 21 Nov · 21:35" from a local "yyyy-MM-ddTHH:mm". */
const whenText = (local: string) =>
  `${format(parseISO(local.slice(0, 10)), "EEE d MMM")} · ${local.slice(11, 16)}`;

const stopsText = (j: FareJourney) =>
  j.stops === 0 ? "Direct" : `${j.stops} stop${j.stops > 1 ? "s" : ""}`;

/** Fewest bags across the trip's flights, so we never promise more than every flight allows. */
function bagCount(fare: PkfareNormalisedFare, key: "checkedBags" | "carryOnBags") {
  const counts = [...(fare.segments ?? []), ...(fare.inbound?.segments ?? [])]
    .map((s) => s[key])
    .filter((n): n is number => n !== undefined);
  return counts.length ? Math.min(...counts) : undefined;
}

function Mark({ code, logoUrl }: { code: string; logoUrl?: string | undefined }) {
  return logoUrl ? (
    <img src={logoUrl} alt="" className="size-8 shrink-0 object-contain" />
  ) : (
    <span className="grid size-8 shrink-0 place-items-center rounded-md bg-navy text-[10px] font-bold text-navy-foreground">
      {code}
    </span>
  );
}

type Line = "solid" | "dotted";

/** A piece of the timeline's vertical line; solid while flying, dotted during a layover. */
const lineCls = (line: Line) =>
  `absolute left-[0.4375rem] border-l-2 ${
    line === "solid" ? "border-solid border-foreground/70" : "border-dotted border-foreground/60"
  }`;

/**
 * One airport on the timeline. Each stop draws its own line above and below its circle
 * (centre 10px down), so the line stays joined however long the airport name wraps.
 */
function Stop({
  at,
  code,
  name,
  above,
  below,
  className = "",
}: {
  at: string;
  code: string;
  name?: string | undefined;
  above?: Line | undefined;
  below?: Line | undefined;
  className?: string;
}) {
  return (
    <div className={`relative pl-9 ${className}`}>
      {above ? <span className={`${lineCls(above)} top-0 h-[0.625rem]`} /> : null}
      {below ? <span className={`${lineCls(below)} bottom-0 top-[0.625rem]`} /> : null}
      <span className="absolute left-0 top-0.5 z-10 size-4 rounded-full border-2 border-foreground/80 bg-card" />
      <p className="text-xs text-muted-foreground">{whenText(at)}</p>
      <p className="font-semibold text-foreground">
        {code} · {name ?? cityOf(code)}
      </p>
    </div>
  );
}

function SegmentRow({
  s,
  airline,
  fareName,
  first,
  last,
}: {
  s: FareSegment;
  airline: string;
  fareName: string;
  first: boolean;
  last: boolean;
}) {
  const info = (
    <>
      <Mark code={s.carrierCode} logoUrl={s.logoUrl} />
      <div className="min-w-0">
        <p className="text-foreground">{s.carrierName ?? airline}</p>
        <p>
          {s.flightNo} · {fareName}
        </p>
        {s.durationMinutes ? <p>Flight time {minutesLabel(s.durationMinutes)}</p> : null}
        {s.aircraft ? <p className="text-xs">{s.aircraft}</p> : null}
        {s.operatedBy ? <p className="text-xs">Operated by {s.operatedBy}</p> : null}
      </div>
    </>
  );
  // Airline details sit to the right on wider screens and between the two stops on phones.
  // The departure stretches (flex-1) so the solid line fills any extra row height.
  return (
    <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,13.75rem)] sm:gap-6">
      <div className="flex flex-col">
        <Stop
          at={s.departAt}
          code={s.origin}
          name={s.originName}
          above={first ? undefined : "dotted"}
          below="solid"
          className="flex-1 pb-5"
        />
        <div className="relative pb-4 pl-9 sm:hidden">
          <span className={`${lineCls("solid")} inset-y-0`} />
          <div className="flex gap-3 text-sm text-muted-foreground">{info}</div>
        </div>
        <Stop
          at={s.arriveAt}
          code={s.destination}
          name={s.destinationName}
          above="solid"
          below={last ? undefined : "dotted"}
        />
      </div>
      <div className="hidden gap-3 self-center text-sm text-muted-foreground sm:flex">{info}</div>
    </div>
  );
}

function JourneyTimeline({
  journey,
  airline,
  fareName,
}: {
  journey: FareJourney;
  airline: string;
  fareName: string;
}) {
  const segments = journey.segments;
  return (
    <section>
      <h3 className="text-base font-bold text-foreground">
        Flight to {cityOf(journey.destination)}
      </h3>
      <p className="text-sm text-muted-foreground">
        {stopsText(journey)} · {journey.duration}
      </p>
      <div className="mt-4">
        {segments.length === 0 ? (
          <p className="text-sm text-foreground">
            {journey.flightNo} · {journey.origin} {journey.departTime} → {journey.destination}{" "}
            {journey.arriveTime}
          </p>
        ) : (
          segments.map((s, i) => {
            const prev = segments[i - 1];
            const layover = prev ? stamp(s.departAt) - stamp(prev.arriveAt) : 0;
            return (
              <div key={`${s.flightNo}-${s.departAt}`}>
                {prev ? (
                  <div className="relative py-4 pl-9">
                    <span className={`${lineCls("dotted")} inset-y-0`} />
                    <p className="flex items-center gap-2 text-sm text-foreground">
                      <Clock className="size-4 text-muted-foreground" />
                      Layover {layover > 0 ? minutesLabel(layover) : ""} in {cityOf(s.origin)}
                    </p>
                  </div>
                ) : null}
                <SegmentRow
                  s={s}
                  airline={airline}
                  fareName={fareName}
                  first={i === 0}
                  last={i === segments.length - 1}
                />
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

/** One labelled block (Included baggage, Fare rules, …): title on the left, rows on the right. */
export function InfoBlock({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-4 border-t border-border py-5 sm:grid-cols-[minmax(0,12.5rem)_minmax(0,1fr)] sm:gap-8">
      <div>
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
      <div className="space-y-4 sm:border-l sm:border-border sm:pl-8">{children}</div>
    </section>
  );
}

export function InfoRow({
  icon: Icon,
  title,
  detail,
  status,
}: {
  icon: LucideIcon;
  title: string;
  detail?: string | undefined;
  status?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-foreground" strokeWidth={1.6} />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">{title}</p>
        {detail ? <p className="text-sm text-muted-foreground">{detail}</p> : null}
      </div>
      {status ? <div className="shrink-0 text-sm">{status}</div> : null}
    </div>
  );
}

const bagStatus = (n: number | undefined) =>
  n === undefined ? null : n > 0 ? (
    <span className="text-emerald-700">Included</span>
  ) : (
    <span className="text-muted-foreground">Not included</span>
  );

/** The airline fee covers the whole booking, so say so when there are several travellers. */
const penaltyText = (rule: FareRule, fare: PkfareNormalisedFare, travellers: number) =>
  `${currencySymbol(rule.currency ?? fare.currency)}${(rule.penalty ?? 0).toLocaleString()}${
    travellers > 1 ? " for this booking" : ""
  }`;

function cancelRow(fare: PkfareNormalisedFare, travellers: number) {
  const rule = fare.refundRule;
  const ours = `FaresDream fee USD ${CANCEL_SERVICE_FEE_USD} per passenger once ticketed`;
  if (!rule) return { title: "Cancellation rules are confirmed in writing before you pay" };
  if (!rule.allowed)
    return { title: "This fare can't be cancelled for a refund", detail: "Non-refundable" };
  if (!rule.penalty)
    return {
      title: "You're allowed to cancel this flight",
      detail: `${rule.penalty === 0 ? "No airline fee" : "Airline fee confirmed before you pay"} · ${ours}`,
    };
  return {
    title: "You're allowed to cancel this flight for a fee",
    detail: `Airline fee up to ${penaltyText(rule, fare, travellers)} · ${ours}`,
  };
}

function changeRow(fare: PkfareNormalisedFare, travellers: number) {
  const rule = fare.changeRule;
  const ours = `FaresDream fee USD ${CHANGE_SERVICE_FEE_USD} per passenger`;
  if (!rule) return { title: "Change rules are confirmed in writing before you pay" };
  if (!rule.allowed) return { title: "You can't change this flight" };
  if (!rule.penalty)
    return {
      title: "You're allowed to change this flight",
      detail: `${rule.penalty === 0 ? "No airline fee" : "Airline fee confirmed before you pay"}, plus any fare difference · ${ours}`,
    };
  return {
    title: "You're allowed to change this flight for a fee",
    detail: `Airline fee up to ${penaltyText(rule, fare, travellers)}, plus any fare difference · ${ours}`,
  };
}

/** The whole trip: outbound timeline, then the return journey on round trips. */
export function TripTimeline({ fare, airline }: { fare: PkfareNormalisedFare; airline: string }) {
  const outbound: FareJourney = { ...fare, segments: fare.segments ?? [] };
  const fareName = fare.fareBrand ?? CABIN_NAMES[fare.cabin] ?? fare.cabin;
  return (
    <div className="space-y-7">
      <JourneyTimeline journey={outbound} airline={airline} fareName={fareName} />
      {fare.inbound ? (
        <JourneyTimeline journey={fare.inbound} airline={airline} fareName={fareName} />
      ) : null}
    </div>
  );
}

export function BaggageInfo({ fare }: { fare: PkfareNormalisedFare }) {
  const checked = bagCount(fare, "checkedBags");
  const carryOn = bagCount(fare, "carryOnBags");
  return (
    <InfoBlock title="Included baggage" hint="The baggage included in the price">
      {checked === undefined && carryOn === undefined ? (
        <p className="text-sm text-muted-foreground">
          The baggage allowance is confirmed in writing before you pay.
        </p>
      ) : (
        <>
          {carryOn !== undefined ? (
            <InfoRow
              icon={Briefcase}
              title={carryOn > 0 ? `${carryOn} cabin bag${carryOn > 1 ? "s" : ""}` : "Cabin bag"}
              detail="Per traveller, on every flight"
              status={bagStatus(carryOn)}
            />
          ) : null}
          {checked !== undefined ? (
            <InfoRow
              icon={Luggage}
              title={
                checked > 0 ? `${checked} checked bag${checked > 1 ? "s" : ""}` : "Checked bag"
              }
              detail={checked > 0 ? "Per traveller, on every flight" : undefined}
              status={bagStatus(checked)}
            />
          ) : null}
        </>
      )}
    </InfoBlock>
  );
}

export function FareRulesInfo({
  fare,
  travellers,
}: {
  fare: PkfareNormalisedFare;
  travellers: number;
}) {
  const cancel = cancelRow(fare, travellers);
  const change = changeRow(fare, travellers);
  return (
    <InfoBlock title="Fare rules" hint="Helpful policy information">
      <InfoRow icon={CircleDollarSign} title={cancel.title} detail={cancel.detail} />
      <InfoRow icon={CalendarCheck} title={change.title} detail={change.detail} />
      <Link to="/refund-policy" className="inline-block text-sm text-primary hover:underline">
        Refund &amp; Cancellation Policy
      </Link>
    </InfoBlock>
  );
}
