import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Briefcase,
  Users,
  ReceiptText,
  Clock,
  Phone,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/corporate")({
  head: () => ({
    meta: [
      { title: "Corporate Travel Desk — Business Class for Teams & Executives" },
      {
        name: "description",
        content:
          "A dedicated corporate desk for executive assistants, founders and group bookings: negotiated business class fares, held itineraries, consolidated invoicing and 24/7 changes.",
      },
      { property: "og:title", content: "Corporate Travel Desk | FaresDream" },
      {
        property: "og:description",
        content:
          "Negotiated premium cabin fares, one point of contact and consolidated invoicing for your team.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CorporatePage,
});

const benefits = [
  {
    icon: Briefcase,
    title: "Negotiated contract fares",
    body: "Corporate and consolidator contracts across 47+ carriers, priced below anything on public channels.",
  },
  {
    icon: Users,
    title: "Group & delegation travel",
    body: "From 4 to 40 travellers on one itinerary, with seat blocks held while approvals move.",
  },
  {
    icon: ReceiptText,
    title: "Consolidated invoicing",
    body: "One monthly statement, cost centres, VAT-ready documentation and travel policy controls.",
  },
  {
    icon: Clock,
    title: "24/7 disruption cover",
    body: "A named agent reachable day or night for reroutes, upgrades and irregular operations.",
  },
];

const SPEND_RANGES = [
  "Under $25,000",
  "$25,000 – $75,000",
  "$75,000 – $250,000",
  "$250,000+",
] as const;

const inputCls =
  "mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm outline-none placeholder:text-navy-foreground/40 focus:border-gold";

function CorporatePage() {
  const [form, setForm] = useState({
    company: "",
    contact_name: "",
    email: "",
    phone: "",
    monthly_spend: "",
    group_size: "",
    routes: "",
    notes: "",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: insertError } = await supabase.from("corporate_leads").insert({
      company: form.company.trim(),
      contact_name: form.contact_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      monthly_spend: form.monthly_spend || null,
      group_size: form.group_size.trim() || null,
      routes: form.routes.trim() || null,
      notes: form.notes.trim() || null,
    });
    setBusy(false);
    if (insertError) setError("We could not send that. Please call +1-888-596-7882.");
    else {
      track("Desk Quote Requested", {
        route: form.routes.trim() || "unspecified",
        cabin: "Business",
      });
      setDone(true);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-navy text-navy-foreground">
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-page gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
              Corporate desk
            </span>
            <h1 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-5xl">
              Premium travel for teams that <span className="text-gold">can&apos;t miss</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-navy-foreground/70 sm:text-base">
              One dedicated agent for your executives, board and delegations. We hold fares while
              approvals move, keep travellers in lie-flat cabins, and invoice you once a month.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {benefits.map((b) => (
                <div key={b.title} className="rounded-2xl border border-white/10 bg-navy-soft/60 p-4">
                  <b.icon className="size-5 text-gold" />
                  <p className="mt-3 font-display text-base font-semibold">{b.title}</p>
                  <p className="mt-1 text-xs text-navy-foreground/60">{b.body}</p>
                </div>
              ))}
            </div>

            <a
              href="tel:+18885967882"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold hover:border-gold hover:text-gold"
            >
              <Phone className="size-4" /> +1-888-596-7882 · 24/7 corporate line
            </a>
          </div>

          <div className="rounded-2xl border border-gold/20 bg-navy-soft/60 p-5 sm:p-6">
            {done ? (
              <div>
                <h2 className="font-display text-2xl font-semibold">
                  <CheckCircle2 className="mr-2 inline size-6 text-gold" /> Thank you
                </h2>
                <p className="mt-2 text-sm text-navy-foreground/70">
                  A corporate specialist will call you within one business hour with contract fare
                  options for your routes.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-semibold">Open a corporate account</h2>
                <p className="mt-1 text-xs text-navy-foreground/60">
                  Tell us about your travel pattern — we&apos;ll come back with negotiated fares.
                </p>
                <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Field label="Company name">
                    <input required value={form.company} onChange={set("company")} className={inputCls} placeholder="Northline Capital" />
                  </Field>
                  <Field label="Contact person">
                    <input required value={form.contact_name} onChange={set("contact_name")} className={inputCls} placeholder="Alex Morgan" />
                  </Field>
                  <Field label="Work email">
                    <input required type="email" value={form.email} onChange={set("email")} className={inputCls} placeholder="alex@company.com" />
                  </Field>
                  <Field label="Phone">
                    <input required value={form.phone} onChange={set("phone")} className={inputCls} placeholder="+1 555 000 0000" />
                  </Field>
                  <Field label="Estimated monthly flight spend">
                    <select value={form.monthly_spend} onChange={set("monthly_spend")} className={`${inputCls} cursor-pointer`}>
                      <option value="" className="text-navy">Select a range</option>
                      {SPEND_RANGES.map((r) => (
                        <option key={r} value={r} className="text-navy">
                          {r}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Group size (travellers per trip)">
                    <input value={form.group_size} onChange={set("group_size")} className={inputCls} placeholder="6 executives" />
                  </Field>
                  <Field label="Main routes" full>
                    <input value={form.routes} onChange={set("routes")} className={inputCls} placeholder="New York → London, Dubai → Singapore" />
                  </Field>
                  <Field label="Anything else we should know?" full>
                    <textarea
                      rows={4}
                      value={form.notes}
                      onChange={set("notes")}
                      className={inputCls}
                      placeholder="6 executives, monthly New York → London, business class, flexible tickets."
                    />
                  </Field>
                  {error ? <p className="text-xs text-destructive sm:col-span-2">{error}</p> : null}
                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-gold-foreground disabled:opacity-60 sm:col-span-2"
                  >
                    {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                    Request corporate pricing
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-navy-foreground/50">
        {label}
      </span>
      {children}
    </label>
  );
}
