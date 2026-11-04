import type { ReactNode } from "react";
import { useCurrency } from "@/components/site/CurrencyContext";
import { Link } from "@tanstack/react-router";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { ArrowLeft, Check, Headphones, Lock, ReceiptText, ShieldCheck } from "lucide-react";
import { cityOf } from "@/lib/airports";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";
import { travellerText, type FlightSearch } from "@/lib/flight-search-params";
import type { FareJourney } from "@/lib/pkfare-types";
import type { SelectedFare } from "@/lib/selected-fare";

const STEPS = ["Search", "Review", "Traveller", "Contact", "Payment", "Booked"];

/** Progress through checkout, drawn on the blue header (1 = Search … 6 = Booked). */
function CheckoutSteps({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-1.5 sm:gap-2" aria-label="Booking progress">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li
            key={label}
            aria-current={active ? "step" : undefined}
            className={`flex items-center gap-1.5 last:flex-none sm:gap-2 ${
              // The current step keeps room for its label; the others share what's left.
              active ? "flex-auto shrink-0" : "min-w-0 flex-1"
            }`}
          >
            <span
              className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                done
                  ? "bg-white text-primary"
                  : active
                    ? "bg-yellow-300 text-navy"
                    : "border border-white/60 text-white/85"
              }`}
            >
              {done ? <Check className="size-3.5" strokeWidth={3} /> : n}
            </span>
            <span
              className={`text-xs sm:text-sm ${
                active
                  ? "shrink-0 whitespace-nowrap font-semibold text-white"
                  : "hidden truncate text-white/85 md:inline"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 ? (
              <span className={`h-px min-w-2 flex-1 ${done ? "bg-white" : "bg-white/40"}`} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/** Checkout page frame: blue header with progress and title (like the results panel), then content. */
export function CheckoutShell({
  step,
  title,
  subtitle,
  action,
  children,
}: {
  step: number;
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] bg-secondary/40 pb-24">
      <div className="bg-linear-to-r from-primary to-sky-500 pb-5 pt-4 text-white">
        <div className="page-container">
          <CheckoutSteps current={step} />
          <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
            <div className="min-w-0">
              <h1 className="font-display text-xl font-bold sm:text-2xl">{title}</h1>
              {subtitle ? <p className="mt-0.5 text-sm text-white/85">{subtitle}</p> : null}
            </div>
            {action}
          </div>
        </div>
      </div>
      <div className="page-container py-5">{children}</div>
    </div>
  );
}

/** White section card; `number` shows a step badge before the title. */
export function CheckoutCard({
  title,
  number,
  action,
  children,
  className = "",
}: {
  title?: string;
  number?: number;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-border bg-card shadow-[0_1px_6px_rgb(15_23_42/0.06)] ${className}`}
    >
      {title ? (
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
          <h2 className="flex items-center gap-2.5 font-display text-base font-semibold text-foreground">
            {number ? (
              <span className="grid size-6 place-items-center rounded-full bg-navy text-xs text-navy-foreground">
                {number}
              </span>
            ) : null}
            {title}
          </h2>
          {action}
        </header>
      ) : null}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

const SEARCH_CABINS = {
  economy: "Economy",
  "premium economy": "PremiumEconomy",
  premiumeconomy: "PremiumEconomy",
  business: "Business",
  first: "First",
} as const;

/** Back to the results for this route and date (header link on the review page). */
export function ChangeFlightLink({ flight }: { flight: FlightSearch }) {
  const cabin =
    SEARCH_CABINS[flight.cabin.trim().toLowerCase() as keyof typeof SEARCH_CABINS] ?? "Economy";
  return (
    <Link
      to="/flight/search"
      search={{
        origin: flight.origin,
        destination: flight.destination,
        date: flight.departDate,
        ...(flight.returnDate ? { returnDate: flight.returnDate } : {}),
        passengers: (flight.adults ?? 1) + (flight.children ?? 0) + (flight.infants ?? 0),
        cabin,
        currency: flight.currency,
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/70 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-white/10"
    >
      <ArrowLeft className="size-4" /> Change flight
    </Link>
  );
}

const dayText = (ymd: string) => {
  try {
    return format(parseISO(ymd), "EEE, d MMM yyyy");
  } catch {
    return ymd;
  }
};

function LegLine({
  label,
  journey,
  logoUrl,
  code,
}: {
  label: string;
  journey: FareJourney;
  logoUrl?: string | undefined;
  code: string;
}) {
  const arriveAt = journey.segments.at(-1)?.arriveAt;
  const plus =
    arriveAt && journey.departDate
      ? differenceInCalendarDays(parseISO(arriveAt.slice(0, 10)), parseISO(journey.departDate))
      : 0;
  return (
    <div className="flex gap-3">
      {logoUrl ? (
        <img src={logoUrl} alt="" className="mt-0.5 size-7 shrink-0 object-contain" />
      ) : (
        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md bg-navy text-[10px] font-bold text-navy-foreground">
          {code}
        </span>
      )}
      <div className="min-w-0 text-sm">
        <p className="text-xs text-muted-foreground">
          {label} · {dayText(journey.departDate)}
        </p>
        <p className="font-semibold text-foreground">
          {journey.departTime} {journey.origin} → {journey.arriveTime}
          {plus > 0 ? <sup className="text-[10px] text-gold">+{plus}</sup> : null}{" "}
          {journey.destination}
        </p>
        <p className="text-xs text-muted-foreground">
          {journey.stops === 0 ? "Direct" : `${journey.stops} stop${journey.stops > 1 ? "s" : ""}`}{" "}
          · {journey.duration} · {journey.flightNo}
        </p>
      </div>
    </div>
  );
}

/**
 * "Your trip" sidebar card: route, dates and travellers from the URL, plus each journey's
 * times when the picked fare is known (see selected-fare). `children` holds the price block.
 */
export function TripSummary({
  flight,
  selected,
  children,
}: {
  flight: FlightSearch;
  selected: SelectedFare | null;
  children?: ReactNode;
}) {
  const fare = selected?.fare;
  const code = fare?.carrierCode ?? flight.airlineCode ?? flight.flightNo.slice(0, 2);
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_6px_rgb(15_23_42/0.06)]">
      <header className="bg-navy px-4 py-3.5 text-navy-foreground sm:px-5">
        <p className="text-xs text-navy-foreground/70">Your trip</p>
        <p className="font-display text-base font-semibold">
          {cityOf(flight.origin)} {flight.returnDate ? "⇄" : "→"} {cityOf(flight.destination)}
        </p>
        <p className="text-xs text-navy-foreground/80">
          {travellerText(flight)} · {flight.cabin}
        </p>
      </header>
      <div className="space-y-4 px-4 py-4 sm:px-5">
        {fare ? (
          <>
            <LegLine
              label="Depart"
              journey={{ ...fare, segments: fare.segments ?? [] }}
              logoUrl={fare.logoUrl}
              code={code}
            />
            {fare.inbound ? (
              <LegLine label="Return" journey={fare.inbound} logoUrl={fare.logoUrl} code={code} />
            ) : null}
            <p className="text-xs text-muted-foreground">{selected.airline}</p>
          </>
        ) : (
          <dl className="space-y-1.5 text-sm">
            <SummaryRow label="Flight" value={`${flight.flightNo} · ${flight.airline}`} />
            <SummaryRow label="Depart" value={dayText(flight.departDate)} />
            {flight.returnDate ? (
              <SummaryRow label="Return" value={dayText(flight.returnDate)} />
            ) : null}
          </dl>
        )}
        {children ? <div className="border-t border-border pt-4">{children}</div> : null}
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

/** Price lines and a bold total, e.g. Base fare / Taxes & fees / Promo / Total. */
export function PriceSummary({
  sym,
  currency,
  lines,
  total,
  totalLabel,
}: {
  sym: string;
  /** What the customer actually pays in; the visitor's own currency is only an estimate. */
  currency: string;
  lines: { label: string; value: number; discount?: boolean }[];
  total: number;
  totalLabel: string;
}) {
  const { money, displayCurrency } = useCurrency();
  return (
    <div>
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <ReceiptText className="size-4 text-muted-foreground" /> Price details
      </p>
      <dl className="mt-2.5 space-y-1.5 text-sm">
        {lines.map((l) => (
          <div key={l.label} className="flex items-baseline justify-between gap-3">
            <dt className={l.discount ? "text-emerald-700" : "text-muted-foreground"}>{l.label}</dt>
            <dd className={l.discount ? "font-medium text-emerald-700" : "text-foreground"}>
              {l.discount ? "−" : ""}
              {sym}
              {l.value.toLocaleString()}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-border pt-3">
        <span className="text-sm font-semibold text-foreground">{totalLabel}</span>
        <span className="font-display text-2xl font-bold text-foreground">
          {sym}
          {total.toLocaleString()}
        </span>
      </div>
      <p className="text-right text-xs text-muted-foreground">Taxes and fees included</p>
      {displayCurrency(currency) !== currency ? (
        <p className="text-right text-xs text-muted-foreground">
          About {money(total, currency)}. You pay in {currency}.
        </p>
      ) : null}
    </div>
  );
}

/** Reassurance under the summary: secure checkout, no hidden fees, phone support. */
export function TrustPoints() {
  return (
    <ul className="space-y-2.5 rounded-xl border border-border bg-card px-4 py-4 text-sm shadow-[0_1px_6px_rgb(15_23_42/0.06)] sm:px-5">
      <li className="flex items-center gap-2.5 text-foreground">
        <Lock className="size-4 text-primary" /> Secure, encrypted checkout
      </li>
      <li className="flex items-center gap-2.5 text-foreground">
        <ShieldCheck className="size-4 text-primary" /> No hidden booking fees
      </li>
      <li className="flex items-center gap-2.5 text-foreground">
        <Headphones className="size-4 text-primary" /> Help 24/7:{" "}
        <a href={`tel:${PHONE_TEL}`} className="font-semibold text-navy hover:underline">
          {PHONE_DISPLAY}
        </a>
      </li>
    </ul>
  );
}
