import { useState } from "react";
import { X, Lock, Loader2, CheckCircle2, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AirportAutocomplete } from "@/components/site/AirportAutocomplete";
import { MonthPicker } from "@/components/site/DatePicker";
import { format } from "date-fns";
import { track } from "@/lib/analytics";

const CABINS = ["Business", "First", "Premium Economy"] as const;

export function UnpublishedFaresModal({
  onClose,
  prefillNote,
}: {
  onClose: () => void;
  prefillNote?: string;
}) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [month, setMonth] = useState("");
  const [cabin, setCabin] = useState<string>("Business");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: insertError } = await supabase.from("fare_leads").insert({
      lead_type: "unpublished",
      origin: origin.trim().toUpperCase() || null,
      destination: destination.trim().toUpperCase() || null,
      travel_month: month || null,
      cabin,
      email: email.trim(),
      phone: phone.trim() || null,
      notes: prefillNote ?? null,
    });
    setBusy(false);
    if (insertError) setError("We could not send that. Please call us on +1-888-596-7882.");
    else {
      track("Desk Quote Requested", {
        route: `${origin.trim().toUpperCase()}-${destination.trim().toUpperCase()}`,
        cabin,
      });
      setDone(true);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center px-4">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-navy/75 backdrop-blur-sm"
      />
      <div className="relative max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-gold/25 bg-navy text-navy-foreground shadow-lux">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-lg border border-white/20 text-navy-foreground/70 hover:text-gold"
        >
          <X className="size-4" />
        </button>

        <div className="px-4 py-5 sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
            <Lock className="size-3" /> Private inventory
          </span>

          {done ? (
            <div className="mt-4">
              <h2 className="font-display text-2xl font-semibold">
                <CheckCircle2 className="mr-2 inline size-6 text-gold" />
                Quote Requested!
              </h2>
              <p className="mt-2 text-sm text-navy-foreground/70">
                A dedicated luxury agent will contact you within 15 minutes with unpublished rates.
              </p>
              <a
                href="tel:+18885967882"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-gold-foreground"
              >
                <Phone className="size-4" /> +1-888-596-7882
              </a>
            </div>
          ) : (
            <>
              <h2 className="mt-3 font-display text-xl font-semibold sm:text-2xl">
                Unlock private fares
              </h2>
              <p className="mt-1.5 text-xs text-navy-foreground/70">
                Enter your route and email for an instant desk quote — 50–70% below published fares.
              </p>

              {prefillNote ? (
                <p className="mt-2.5 rounded-xl border border-gold/25 bg-gold/10 px-3 py-2 text-[11px] leading-snug text-gold">
                  {prefillNote}
                </p>
              ) : null}

              <form onSubmit={submit} className="mt-4 grid grid-cols-2 gap-2.5">
                <AirportAutocomplete
                  label="From"
                  tone="dark"
                  value={origin}
                  onChange={setOrigin}
                  required
                />
                <AirportAutocomplete
                  label="To"
                  tone="dark"
                  value={destination}
                  onChange={setDestination}
                  required
                />
                <ModalField label="Travel month" group>
                  <MonthPicker
                    ariaLabel="Travel month"
                    value={month}
                    onChange={setMonth}
                    min={format(new Date(), "yyyy-MM")}
                    className={inputCls}
                  />
                </ModalField>
                <ModalField label="Cabin">
                  <select
                    value={cabin}
                    onChange={(e) => setCabin(e.target.value)}
                    className={inputCls}
                  >
                    {CABINS.map((c) => (
                      <option key={c} value={c} className="text-navy">
                        {c}
                      </option>
                    ))}
                  </select>
                </ModalField>
                <ModalField label="Email" full>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className={inputCls}
                  />
                </ModalField>
                <ModalField label="Phone (optional)" full>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 000 0000"
                    className={inputCls}
                  />
                </ModalField>

                {error ? <p className="col-span-2 text-xs text-destructive">{error}</p> : null}

                <button
                  type="submit"
                  disabled={busy}
                  className="col-span-2 mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-gold-foreground disabled:opacity-60"
                >
                  {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                  Get my instant desk quote
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-navy-foreground outline-none placeholder:text-navy-foreground/40 focus:border-gold";

/** `group` renders a plain block instead of a <label> (for pickers with their own buttons). */
function ModalField({
  label,
  full,
  group = false,
  children,
}: {
  label: string;
  full?: boolean;
  group?: boolean;
  children: React.ReactNode;
}) {
  const Wrapper = group ? "div" : "label";
  return (
    <Wrapper className={`block ${full ? "col-span-2" : ""}`}>
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-navy-foreground/50">
        {label}
      </span>
      {children}
    </Wrapper>
  );
}
