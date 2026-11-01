import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CheckCircle2, Loader2, Phone, PlaneTakeoff, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";

export type MultiCityLeg = { from: string; to: string; date: Date };

const inputCls =
  "h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-navy";

/**
 * Multi-city trips can't be priced by the live fare search, so the itinerary is
 * sent to the travel desk as a quote request (fare_leads, shown in the admin CRM).
 */
export function MultiCityQuoteModal({
  legs,
  travellers,
  cabin,
  onClose,
}: {
  legs: MultiCityLeg[];
  /** e.g. "2 Travellers"; stored with the request. */
  travellers: string;
  cabin: string;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const itinerary = legs
    .map((l, i) => `${i + 1}) ${l.from} → ${l.to} on ${format(l.date, "EEE d MMM yyyy")}`)
    .join(" · ");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const first = legs[0]!;
    const last = legs[legs.length - 1]!;
    // lead_type "unpublished" is the desk-quote type this table is known to accept.
    const { error: insertError } = await supabase.from("fare_leads").insert({
      lead_type: "unpublished",
      origin: first.from,
      destination: last.to,
      travel_month: format(first.date, "yyyy-MM"),
      cabin,
      full_name: name.trim() || null,
      email: email.trim(),
      phone: phone.trim() || null,
      notes: `Multi-city request (${legs.length} flights, ${travellers}): ${itinerary}`,
    });
    setBusy(false);
    if (insertError) {
      setError(`We couldn't send that. Call us on ${PHONE_DISPLAY}.`);
      return;
    }
    track("Desk Quote Requested", {
      route: [first.from, ...legs.map((l) => l.to)].join("-"),
      cabin,
      trip: "multi-city",
    });
    setDone(true);
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center px-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Multi-city quote"
        className="relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl bg-card text-left shadow-lux"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <p className="text-lg font-semibold text-foreground">
            {done ? "Request sent" : "Get your multi-city fare"}
          </p>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full text-foreground transition hover:bg-muted"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-5 py-4">
          <ol className="space-y-2 rounded-xl bg-secondary p-3">
            {legs.map((l, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-navy text-[11px] font-bold text-navy-foreground">
                  {i + 1}
                </span>
                <span className="font-semibold text-navy">
                  {l.from} <PlaneTakeoff className="inline size-3.5 text-muted-foreground" /> {l.to}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {format(l.date, "EEE, d MMM yy")}
                </span>
              </li>
            ))}
            <li className="border-t border-border pt-2 text-xs text-muted-foreground">
              {travellers} · {cabin}
            </li>
          </ol>

          {done ? (
            <div className="mt-4">
              <p className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                Our travel desk will contact you shortly with the best fare for this itinerary.
              </p>
              <a
                href={`tel:${PHONE_TEL}`}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-navy text-sm font-bold text-navy-foreground"
              >
                <Phone className="size-4" /> Prefer to talk now? {PHONE_DISPLAY}
              </a>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Multi-city trips are priced by our travel desk. Leave your details and an agent will
                send you the best fare.
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                autoComplete="name"
                className={inputCls}
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className={inputCls}
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone (for a faster callback)"
                autoComplete="tel"
                className={inputCls}
              />
              {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}
              <button
                type="submit"
                disabled={busy}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-navy font-display text-base font-semibold text-navy-foreground transition hover:brightness-110 disabled:opacity-70"
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : null} Request my fare
              </button>
              <a
                href={`tel:${PHONE_TEL}`}
                className="flex items-center justify-center gap-1.5 text-sm font-semibold text-primary"
              >
                <Phone className="size-4" /> Or call {PHONE_DISPLAY}
              </a>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
