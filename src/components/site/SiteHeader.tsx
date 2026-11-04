import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Phone,
  Menu,
  X,
  User,
  Compass,
  Briefcase,
  Star,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { useCurrency } from "@/components/site/CurrencyContext";
import { RegionalSettingsDialog, RegionalSummary } from "@/components/site/RegionalSettings";
import { AgentAvatar } from "@/components/site/ui";
import { LOGO_ON_DARK, LOGO_ON_LIGHT, PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";
import { countryByCode } from "@/lib/regional";

const drawerLinks = [
  { to: "/destinations", label: "Explore Travel", icon: Compass },
  { to: "/dashboard", label: "My Trips", icon: Briefcase },
  { to: "/deals", label: "My Rewards", icon: Star },
  { to: "/contact", label: "Need Help?", icon: HelpCircle },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [regionalOpen, setRegionalOpen] = useState(false);
  const { country, currency } = useCurrency();
  const regionalLabel = `Regional settings: English, ${countryByCode(country)?.name ?? country}, ${currency}`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-blue-950 text-white">
        <div className="mx-auto flex h-16 max-w-page-padded items-center gap-4 px-4 sm:px-6 lg:gap-6 lg:px-8">
          <Link to="/" className="flex min-w-0 shrink-0 items-center">
            <img
              src={LOGO_ON_DARK.src}
              alt="FaresDream — cheap flights and airfare comparison"
              className="h-5 w-auto sm:h-6"
              width={LOGO_ON_DARK.width}
              height={LOGO_ON_DARK.height}
            />
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-2 whitespace-nowrap lg:gap-3">
            <a
              href={`tel:${PHONE_TEL}`}
              className="hidden items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition hover:bg-white/10 lg:flex"
            >
              <span className="grid size-8 place-items-center rounded-full bg-white/10">
                <Phone className="size-4" />
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] font-medium text-white/70">Call us</span>
                <span className="block text-sm font-semibold">{PHONE_DISPLAY}</span>
              </span>
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-xs font-semibold transition hover:bg-white/20 lg:hidden"
            >
              <Phone className="size-4" /> Call us
            </a>

            <button
              type="button"
              onClick={() => setRegionalOpen(true)}
              aria-haspopup="dialog"
              aria-label={regionalLabel}
              className="hidden h-10 cursor-pointer items-center gap-3.5 rounded-xl px-3 text-sm font-medium transition hover:bg-white/10 lg:inline-flex"
            >
              <RegionalSummary />
            </button>
            <RegionalSettingsDialog open={regionalOpen} onOpenChange={setRegionalOpen} />

            <Link
              to="/auth"
              className="hidden h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition hover:bg-white/10 lg:inline-flex"
            >
              <User className="size-4" />
              Sign in
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid size-9 place-items-center rounded-xl transition hover:bg-white/10 lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
          />
          <aside className="absolute right-0 top-0 flex h-full w-80 max-w-[88vw] flex-col bg-background shadow-lux">
            <div className="flex items-center justify-between px-4 pt-4">
              <img
                src={LOGO_ON_LIGHT.src}
                alt="FaresDream"
                loading="lazy"
                width={LOGO_ON_LIGHT.width}
                height={LOGO_ON_LIGHT.height}
                className="h-5 w-auto"
              />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid size-9 place-items-center rounded-xl border border-border"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {/* Insider-Deal Club banner */}
              <div className="mt-4 rounded-2xl bg-navy p-4 text-navy-foreground">
                <p className="font-display text-base font-bold">Insider-Deal Club</p>
                <p className="mt-1 text-xs text-navy-foreground/80">
                  Earn points &amp; unlock member-only fares.
                </p>
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="mt-3 flex w-full items-center justify-center rounded-full bg-background px-4 py-2.5 text-sm font-bold text-primary"
                >
                  Sign in / Join
                </Link>
              </div>

              <nav className="mt-4 flex flex-col gap-1 text-sm font-semibold">
                {drawerLinks.map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-navy hover:bg-accent"
                  >
                    <l.icon className="size-4 text-primary" /> {l.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-3 space-y-2 border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setRegionalOpen(true);
                  }}
                  aria-label={regionalLabel}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl bg-navy px-3.5 py-3 text-left text-sm font-medium text-navy-foreground transition hover:brightness-110"
                >
                  <RegionalSummary />
                </button>
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-navy hover:bg-accent"
                >
                  <MessageSquare className="size-4 text-primary" /> Feedback
                </Link>
              </div>
            </div>

            {/* Sticky agent card */}
            <div className="border-t border-border bg-secondary p-4">
              <div className="flex items-start gap-3">
                <AgentAvatar className="size-12 bg-card text-primary" iconClassName="size-6" />
                <p className="min-w-0 text-xs leading-relaxed text-muted-foreground">
                  <span className="block text-sm font-bold text-navy">
                    Access phone-only deals!
                  </span>
                  Talk to a real agent 24/7. Call us and we&apos;ll assist you.
                </p>
              </div>
              <a
                href={`tel:${PHONE_TEL}`}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
              >
                <Phone className="size-4" /> Call For Deals: {PHONE_DISPLAY}
              </a>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
