import { Link } from "@tanstack/react-router";
import { FileText, Mail, Phone, RotateCcw, ShieldCheck } from "lucide-react";
import { CtaBand, ctaOutlineCls, ctaPrimaryCls, PageShell } from "@/components/site/ui";
import { PHONE_DISPLAY, PHONE_TEL, SUPPORT_EMAIL } from "@/lib/brand";

/** One numbered section of a policy, e.g. "1. Agreement". */
export type LegalSection = { h: string; p: string[] };

const LEGAL_PAGES = [
  { to: "/privacy", label: "Privacy Policy", icon: ShieldCheck },
  { to: "/terms", label: "Terms of Use", icon: FileText },
  { to: "/refund-policy", label: "Refund & Cancellation", icon: RotateCcw },
] as const;

/** "3. Fares, quotes and price parity" -> "fares-quotes-and-price-parity" */
const anchorOf = (h: string) =>
  h
    .toLowerCase()
    .replace(/^\d+\.\s*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Policy page: switcher between policies and a section index beside the text. */
export function LegalPage({
  crumb,
  title,
  subtitle,
  sections,
}: {
  crumb: string;
  title: string;
  subtitle: string;
  sections: LegalSection[];
}) {
  return (
    <PageShell crumb={crumb} title={title} subtitle={subtitle}>
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <aside className="min-w-0 space-y-4 lg:sticky lg:top-20">
          <nav
            aria-label="Policies"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:block lg:space-y-1 lg:rounded-2xl lg:border lg:border-border lg:bg-card lg:p-2 lg:shadow-card [&::-webkit-scrollbar]:hidden"
          >
            {LEGAL_PAGES.map((p) => (
              <Link
                key={p.to}
                to={p.to}
                activeProps={{
                  className:
                    "border-primary bg-primary text-primary-foreground lg:bg-primary/10 lg:text-primary",
                }}
                inactiveProps={{ className: "border-border bg-card text-navy hover:text-primary" }}
                className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition lg:rounded-xl lg:border-0 lg:px-3 lg:py-2.5"
              >
                <p.icon className="size-4" /> {p.label}
              </Link>
            ))}
          </nav>

          <nav
            aria-label="On this page"
            className="hidden rounded-2xl border border-border bg-card p-4 shadow-card lg:block"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              On this page
            </p>
            <ol className="mt-3 space-y-2 text-sm">
              {sections.map((s) => (
                <li key={s.h}>
                  <a
                    href={`#${anchorOf(s.h)}`}
                    className="block leading-snug text-muted-foreground transition hover:text-primary"
                  >
                    {s.h}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="min-w-0 space-y-6">
          <article className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-8">
            <div className="space-y-8">
              {sections.map((s) => (
                <section key={s.h} id={anchorOf(s.h)} className="scroll-mt-24">
                  <h2 className="font-display text-lg font-bold text-navy sm:text-xl">{s.h}</h2>
                  {s.p.map((para) => (
                    <p
                      key={para}
                      className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground"
                    >
                      {para}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </article>

          <CtaBand title="Questions about this policy?" text="Our travel desk is available 24/7.">
            <a href={`tel:${PHONE_TEL}`} className={ctaPrimaryCls}>
              <Phone className="size-4" /> {PHONE_DISPLAY}
            </a>
            <a href={`mailto:${SUPPORT_EMAIL}`} className={ctaOutlineCls}>
              <Mail className="size-4" /> Email us
            </a>
          </CtaBand>
        </div>
      </div>
    </PageShell>
  );
}
