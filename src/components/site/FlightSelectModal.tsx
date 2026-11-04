import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useCurrency } from "@/components/site/CurrencyContext";
import { format, parseISO } from "date-fns";
import { ReceiptText, Share2, X } from "lucide-react";
import { cityOf } from "@/lib/airports";
import { currencySymbol } from "@/lib/flight-search-params";
import type { PkfareNormalisedFare } from "@/lib/pkfare-types";
import {
  BaggageInfo,
  FareRulesInfo,
  InfoBlock,
  InfoRow,
  TripTimeline,
} from "@/components/site/FlightItinerary";

/**
 * Booking.com-style "Your flight" window, opened by a result's Select button: timeline with
 * layovers, included baggage, fare rules and price, then Continue to the next step.
 */
export function FlightSelectModal({
  fare,
  airline,
  travellers,
  continueTo,
  onClose,
}: {
  fare: PkfareNormalisedFare;
  airline: string;
  travellers: number;
  /** The Continue button, a Link to the next step that the page builds. */
  continueTo: (className: string) => ReactNode;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [shared, setShared] = useState(false);
  const sym = currencySymbol(fare.currency);
  const { money: shownMoney, displayCurrency } = useCurrency();
  const money = (n: number) => shownMoney(n, fare.currency);
  const estimated = displayCurrency(fare.currency) !== fare.currency;
  const travellerText = `${travellers} traveller${travellers > 1 ? "s" : ""}`;

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const share = async () => {
    const when = `${format(parseISO(fare.departDate), "EEE d MMM")} · ${fare.departTime}`;
    const text = `${airline} ${fare.flightNo}: ${cityOf(fare.origin)} to ${cityOf(fare.destination)}, ${when}, from ${money(fare.price)}`;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "FaresDream flight", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setShared(true);
      window.setTimeout(() => setShared(false), 2500);
    } catch {
      // The visitor closed the share sheet or the clipboard is blocked; nothing to do.
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="absolute inset-0 bg-navy/50" aria-hidden="true" onClick={onClose} />
      <div className="modal-in relative flex h-[100dvh] w-full flex-col bg-card shadow-2xl sm:h-auto sm:max-h-[92dvh] sm:max-w-[55rem] sm:rounded-2xl">
        <header className="flex items-start justify-between gap-4 px-5 pb-2 pt-5 sm:px-8 sm:pt-7">
          <div className="min-w-0">
            <h2 id={titleId} className="font-display text-xl font-bold text-foreground sm:text-2xl">
              Your {fare.inbound ? "trip" : "flight"} to {cityOf(fare.destination)}
            </h2>
            <button
              type="button"
              onClick={share}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <Share2 className="size-4" /> {shared ? "Link copied" : "Share this flight"}
            </button>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-10 shrink-0 place-items-center rounded-lg border border-border text-foreground transition hover:border-navy hover:text-navy"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 sm:px-8">
          <div className="pb-6 pt-3">
            <TripTimeline fare={fare} airline={airline} />
          </div>

          <BaggageInfo fare={fare} />
          <FareRulesInfo fare={fare} travellers={travellers} />

          <InfoBlock title="Price details" hint="Taxes and charges included">
            {fare.baseFare !== undefined && fare.taxes !== undefined ? (
              <>
                <InfoRow
                  icon={ReceiptText}
                  title={`Base fare (${travellerText})`}
                  status={money(fare.baseFare * travellers)}
                />
                <InfoRow
                  icon={ReceiptText}
                  title="Taxes and airline charges"
                  status={money(fare.taxes * travellers)}
                />
              </>
            ) : null}
            <InfoRow icon={ReceiptText} title="FaresDream service fee" status={money(0)} />
          </InfoBlock>
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-border px-5 py-4 sm:px-8">
          <div>
            <p className="font-display text-2xl font-bold text-foreground">
              {money(fare.price * travellers)}
            </p>
            <p className="text-xs text-muted-foreground">
              Total for {travellerText}
              {fare.inbound ? ", round trip" : ""} · taxes included
            </p>
            {estimated ? (
              <p className="text-xs text-muted-foreground">
                Estimate. You pay {sym}
                {(fare.price * travellers).toLocaleString()} {fare.currency} at checkout.
              </p>
            ) : null}
          </div>
          {continueTo(
            "inline-flex shrink-0 items-center justify-center rounded-lg bg-navy px-7 py-3 text-base font-semibold text-navy-foreground transition hover:brightness-110",
          )}
        </footer>
      </div>
    </div>
  );
}
