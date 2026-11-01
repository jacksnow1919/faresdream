import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/ui";
import { OFFICE_ADDRESS, PHONE_DISPLAY, PHONE_TEL, PROMO_CODE, SUPPORT_EMAIL } from "@/lib/brand";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact FaresDream — 24/7 Flight Booking Support" },
      {
        name: "description",
        content:
          "Contact FaresDream: call +1-888-596-7882, email support@faresdream.com or message our New York travel desk and we'll respond as soon as possible.",
      },
      { property: "og:title", content: "Contact FaresDream" },
      {
        property: "og:description",
        content: "Call, email or message the FaresDream travel desk — open 24/7.",
      },
    ],
  }),
  component: ContactPage,
});

const TOPICS = [
  "A new booking",
  "An existing booking",
  "A refund or cancellation",
  "Something else",
] as const;

const HELP_LINKS = [
  { to: "/refund-policy", label: "Refund & cancellation policy", icon: RotateCcw },
  { to: "/terms", label: "Terms of use", icon: FileText },
  { to: "/privacy", label: "Privacy policy", icon: ShieldCheck },
] as const;

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  topic: TOPICS[0] as string,
  booking: "",
  message: "",
};

function ContactPage() {
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const set = (k: keyof typeof form) => (v: string) => {
    setError(null);
    setForm((p) => ({ ...p, [k]: v }));
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const booking = form.booking.trim();
    // Messages go to the leads inbox in the admin CRM. "unpublished" is the lead type
    // this table is known to accept (see MultiCityQuoteModal); the notes say it's a message.
    const { error: insertError } = await supabase.from("fare_leads").insert({
      lead_type: "unpublished",
      full_name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      notes: [
        `Contact form message about: ${form.topic}`,
        booking ? `Booking ID: ${booking}` : "",
        form.message.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    });
    setBusy(false);
    if (insertError) {
      setError(
        `We couldn't send that. Please call us on ${PHONE_DISPLAY} or email ${SUPPORT_EMAIL}.`,
      );
      return;
    }
    setSentTo(form.email.trim());
    setForm(emptyForm);
  }

  return (
    <PageShell
      crumb="Contact Us"
      title="Contact us"
      subtitle="Our travel desk is open 24 hours a day, 7 days a week."
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <ContactCard
            icon={Phone}
            title="Call us 24/7"
            href={`tel:${PHONE_TEL}`}
            value={PHONE_DISPLAY}
            note="Fastest for urgent changes and phone-only deals."
          />
          <ContactCard
            icon={Mail}
            title="Email us"
            href={`mailto:${SUPPORT_EMAIL}`}
            value={SUPPORT_EMAIL}
            note="Include your booking ID if you have one."
          />
          <ContactCard icon={MapPin} title="Our office" value={OFFICE_ADDRESS} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-8">
            <h2 className="font-display text-xl font-bold text-navy sm:text-2xl">
              Send us a message
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We&apos;ll reply by email as soon as we can.
            </p>

            {sentTo ? (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="flex items-center gap-2 font-display text-lg font-bold text-emerald-800">
                  <CheckCircle2 className="size-5" /> Message sent
                </p>
                <p className="mt-1 text-sm text-emerald-900/80">
                  Thanks. Our travel desk will reply to {sentTo}. For anything urgent, call{" "}
                  <a href={`tel:${PHONE_TEL}`} className="font-semibold underline">
                    {PHONE_DISPLAY}
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setSentTo(null)}
                  className="mt-4 text-sm font-bold text-primary hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={submit}>
                <Field label="Full name" required>
                  <input
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => set("name")(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => set("email")(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Phone number">
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => set("phone")(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="What's it about?">
                  <select
                    value={form.topic}
                    onChange={(e) => set("topic")(e.target.value)}
                    className={`${inputCls} cursor-pointer`}
                  >
                    {TOPICS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Booking ID (if you have one)" full>
                  <input
                    value={form.booking}
                    onChange={(e) => set("booking")(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Message" required full>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => set("message")(e.target.value)}
                    className={`${inputCls} h-auto py-2.5`}
                  />
                </Field>
                <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gold px-7 text-sm font-bold text-gold-foreground transition hover:brightness-110 disabled:opacity-70"
                  >
                    {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                    {busy ? "Sending…" : "Send message"}
                  </button>
                  {error ? (
                    <p role="alert" className="text-sm font-medium text-destructive">
                      {error}
                    </p>
                  ) : null}
                </div>
              </form>
            )}
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <p className="font-display text-base font-bold text-navy">Quick answers</p>
              <ul className="mt-3 divide-y divide-border">
                {HELP_LINKS.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="group flex items-center gap-3 py-3 text-sm font-semibold text-navy hover:text-primary"
                    >
                      <l.icon className="size-4 text-primary" />
                      <span className="flex-1">{l.label}</span>
                      <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-navy p-5 text-white shadow-card">
              <p className="font-display text-base font-bold">Phone-only deals</p>
              <p className="mt-1 text-sm text-white/75">
                Call and mention code <span className="font-bold text-gold">{PROMO_CODE}</span> to
                save up to $50 on your booking.
              </p>
              <a
                href={`tel:${PHONE_TEL}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-bold text-gold-foreground transition hover:brightness-110"
              >
                <Phone className="size-4" /> {PHONE_DISPLAY}
              </a>
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

const inputCls =
  "mt-1.5 h-11 w-full rounded-lg border border-border bg-card px-3.5 text-[15px] text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

function Field({
  label,
  required,
  full,
  children,
}: {
  label: string;
  required?: boolean;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-sm font-medium text-foreground">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

function ContactCard({
  icon: Icon,
  title,
  value,
  href,
  note,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  href?: string;
  note?: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        {href ? (
          <a
            href={href}
            className="mt-1 block break-words font-display text-base font-bold text-navy hover:text-primary"
          >
            {value}
          </a>
        ) : (
          <p className="mt-1 text-sm font-semibold leading-snug text-navy">{value}</p>
        )}
        {note ? <p className="mt-1 text-xs text-muted-foreground">{note}</p> : null}
      </div>
    </div>
  );
}
