import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Check, Clock, Mail, Phone, Printer } from "lucide-react";
import { cityOf } from "@/lib/airports";
import { parseFlightSearch, currencySymbol, travellerText } from "@/lib/flight-search-params";
import { PHONE_DISPLAY, PHONE_TEL, SUPPORT_EMAIL } from "@/lib/brand";
import {
  readBookingLocal,
  PENDING_REFERENCE,
  formatBookingDate,
  type BookingRecord,
} from "@/lib/booking-store";
import { loadSelectedFare, type SelectedFare } from "@/lib/selected-fare";
import { CheckoutCard, CheckoutShell, PriceSummary } from "@/components/site/checkout";
import { TripTimeline } from "@/components/site/FlightItinerary";

export const Route = createFileRoute("/flight/Confirm")({
  validateSearch: parseFlightSearch,
  head: () => ({
    meta: [
      { title: "Online Booking Received | FaresDream" },
      {
        name: "description",
        content:
          "Your online booking has been received and sent to the airline for confirmation. Review your booking reference, flight details and price summary.",
      },
      { property: "og:title", content: "Online Booking Received — FaresDream" },
      {
        property: "og:description",
        content: "Booking received and sent to the airline for confirmation.",
      },
    ],
  }),
  component: ConfirmPage,
});

const dayText = (ymd: string) => {
  try {
    return format(parseISO(ymd), "EEE, d MMM yyyy");
  } catch {
    return ymd;
  }
};

function ConfirmPage() {
  const s = Route.useSearch();
  const sym = currencySymbol(s.currency);
  // The booking record and picked fare live in this tab's storage; read them after mount.
  const [record, setRecord] = useState<BookingRecord | null>(null);
  const [selected, setSelected] = useState<SelectedFare | null>(null);
  useEffect(() => {
    setRecord(readBookingLocal());
    setSelected(loadSelectedFare(s));
  }, [s]);

  const bookingId = record?.bookingId ?? PENDING_REFERENCE;
  const bookingDate = record?.bookingDate ?? formatBookingDate();
  const fullName = record ? `${record.title} ${record.firstName} ${record.lastName}`.trim() : "";
  const billing = record
    ? [record.address, record.city, record.postalCode, record.country].filter(Boolean).join(", ")
    : "";
  const total = record?.total ?? (Number(s.price) || 0);
  const discount = record?.promoDiscount ?? 0;
  const passengers = record?.passengers ?? (s.adults ?? 1) + (s.children ?? 0) + (s.infants ?? 0);

  return (
    <CheckoutShell
      step={6}
      title="Booking received"
      subtitle={`${cityOf(s.origin)} to ${cityOf(s.destination)} · ${dayText(s.departDate)}`}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <section className="flex gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-600 text-white">
              <Check className="size-6" strokeWidth={3} />
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-lg font-bold text-foreground">
                Thank you{fullName ? `, ${fullName}` : ""}. We&apos;ve received your booking.
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                It has been sent to the airline for confirmation. One of our team will contact you
                with an update shortly. You can also call us on{" "}
                <a href={`tel:${PHONE_TEL}`} className="font-semibold text-navy hover:underline">
                  {PHONE_DISPLAY}
                </a>{" "}
                or email{" "}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-semibold text-navy hover:underline"
                >
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Please note: these are your booking details, not your e-ticket.
              </p>
            </div>
          </section>

          <CheckoutCard title={`Your ${s.returnDate ? "trip" : "flight"}`}>
            {selected ? (
              <TripTimeline fare={selected.fare} airline={selected.airline} />
            ) : (
              <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
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
            )}
          </CheckoutCard>

          <CheckoutCard title="Traveller and contact">
            {record ? (
              <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                <Detail label="Lead traveller" value={fullName} />
                <Detail label="Travellers" value={travellerText(s)} />
                <Detail label="Email" value={record.email} />
                <Detail label="Phone" value={record.phone} />
                {billing ? <Detail label="Billing address" value={billing} wide /> : null}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">
                Traveller details are kept with your booking. Contact us if you need a copy.
              </p>
            )}
          </CheckoutCard>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <CheckoutCard title="Booking details">
            <dl className="space-y-2.5 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">Booking reference</dt>
                <dd className="font-display text-base font-bold text-foreground">{bookingId}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">Booking date</dt>
                <dd className="font-medium text-foreground">{bookingDate}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    <Clock className="size-3.5" /> Awaiting airline confirmation
                  </span>
                </dd>
              </div>
            </dl>
            <div className="mt-4 border-t border-border pt-4">
              <PriceSummary
                sym={sym}
                lines={[
                  ...(discount > 0 ? [{ label: "Fare", value: total + discount }] : []),
                  ...(discount > 0
                    ? [
                        {
                          label: `Promo ${record?.promoCode ?? ""}`.trim(),
                          value: discount,
                          discount: true,
                        },
                      ]
                    : []),
                ]}
                total={total}
                totalLabel={passengers > 1 ? `Total (${passengers} travellers)` : "Total"}
              />
            </div>
          </CheckoutCard>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-navy px-4 py-3 text-sm font-semibold text-navy transition hover:bg-navy hover:text-navy-foreground"
            >
              <Printer className="size-4" /> Print
            </button>
            <Link
              to="/"
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-navy-foreground transition hover:brightness-110"
            >
              Back to home
            </Link>
          </div>

          <ul className="space-y-2.5 rounded-xl border border-border bg-card px-4 py-4 text-sm shadow-[0_1px_6px_rgb(15_23_42/0.06)] sm:px-5">
            <li className="font-semibold text-foreground">Need help with this booking?</li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 text-primary" />
              <a href={`tel:${PHONE_TEL}`} className="font-medium text-navy hover:underline">
                {PHONE_DISPLAY}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 text-primary" />
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-navy hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </CheckoutShell>
  );
}

function Detail({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
