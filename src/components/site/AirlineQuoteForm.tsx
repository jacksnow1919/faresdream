import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Phone } from "lucide-react";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";
import { AirportAutocomplete } from "@/components/site/AirportAutocomplete";
import { MonthPicker } from "@/components/site/DatePicker";

/**
 * Free-quote form for airline pages. Saves to fare_leads (admin CRM inbox).
 * The Supabase client is imported only on submit, so the form adds no JS weight on page load.
 */
export function AirlineQuoteForm({ airline, to = "", title, note }: { airline: string; to?: string; title?: string; note?: string }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", from: "", to, month: "", cabin: "Economy" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => {
    setError(null);
    setForm((p) => ({ ...p, [k]: e.target.value }));
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.email.trim() || !form.phone.trim()) {
      setError("Please add your email and phone so an agent can send your quote.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error: insertError } = await supabase.from("fare_leads").insert({
        lead_type: "unpublished",
        full_name: form.name.trim() || null,
        email: form.email.trim(),
        phone: form.phone.trim(),
        origin: form.from.trim() || null,
        destination: form.to.trim() || null,
        travel_month: form.month || null,
        cabin: form.cabin,
        notes: note ?? `Airline page quote request: ${airline}`,
      });
      if (insertError) throw insertError;
      setDone(true);
    } catch {
      setError(`Something went wrong. Please call ${PHONE_DISPLAY} and we'll quote you by phone.`);
    } finally {
      setBusy(false);
    }
  }

  const input =
    "w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary";

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <p className="flex items-center gap-2 font-display text-lg font-semibold text-navy">
          <CheckCircle2 className="size-5 text-emerald-600" /> Request received
        </p>
        <p className="mt-2 text-sm text-foreground/80">
          An agent will contact you with {airline} fares. For urgent trips call{" "}
          <a href={`tel:${PHONE_TEL}`} className="font-semibold text-navy underline">
            {PHONE_DISPLAY}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border bg-white p-5 shadow-sm" aria-label={`Get a free ${airline} quote`}>
      <a
        href={`tel:${PHONE_TEL}`}
        className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3 text-emerald-800 transition hover:bg-emerald-100"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-600 text-white">
          <Phone className="size-5" aria-hidden="true" />
        </span>
        <span>
          <span className="block font-display text-xl font-bold leading-tight">Call {PHONE_DISPLAY}</span>
          <span className="block text-xs font-semibold">24/7 travel agents, fares not shown online</span>
        </span>
      </a>
      <p className="my-4 flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or submit a request <span className="h-px flex-1 bg-border" />
      </p>
      <h2 className="font-display text-lg font-semibold text-navy">{title ?? `Get a free ${airline} quote`}</h2>
      <p className="mt-1 text-xs text-muted-foreground">An agent compares airlines and calls or emails you back.</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <AirportAutocomplete label="From" value={form.from} onChange={(v) => set("from")({ target: { value: v } })} placeholder="City or airport" />
        </div>
        <div className="col-span-2">
          <AirportAutocomplete label="To" value={form.to} onChange={(v) => set("to")({ target: { value: v } })} placeholder="City or airport" />
        </div>
        <div className="col-span-1 text-xs font-semibold text-navy">
          Month
          <div className="mt-1">
            <MonthPicker
              ariaLabel="Travel month"
              value={form.month}
              onChange={(v) => set("month")({ target: { value: v } })}
              min={new Date().toISOString().slice(0, 7)}
              className={input}
            />
          </div>
        </div>
        <label className="col-span-1 text-xs font-semibold text-navy">
          Cabin
          <select className={`${input} mt-1`} value={form.cabin} onChange={set("cabin")}>
            <option>Economy</option>
            <option>Premium Economy</option>
            <option>Business</option>
            <option>First</option>
          </select>
        </label>
        <label className="col-span-2 text-xs font-semibold text-navy">
          Name
          <input className={`${input} mt-1`} value={form.name} onChange={set("name")} autoComplete="name" />
        </label>
        <label className="col-span-1 text-xs font-semibold text-navy">
          Email
          <input type="email" required className={`${input} mt-1`} value={form.email} onChange={set("email")} autoComplete="email" />
        </label>
        <label className="col-span-1 text-xs font-semibold text-navy">
          Phone
          <input type="tel" required className={`${input} mt-1`} value={form.phone} onChange={set("phone")} autoComplete="tel" />
        </label>
      </div>
      {error ? <p className="mt-3 text-xs font-semibold text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-gold-foreground transition hover:brightness-110 disabled:opacity-70"
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : null} Get my free quote
      </button>
      <a
        href={`tel:${PHONE_TEL}`}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold text-navy transition hover:border-primary"
      >
        <Phone className="size-4" /> Call 24/7: {PHONE_DISPLAY}
      </a>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        We use your details only to send this quote. See our{" "}
        <a href="/privacy" className="underline">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
