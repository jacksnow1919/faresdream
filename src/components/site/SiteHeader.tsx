import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Phone,
  Menu,
  X,
  User,
  Globe,
  Compass,
  Briefcase,
  Star,
  HelpCircle,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import agentAsset from "@/assets/agent-avatar.jpg.asset.json";
import { CurrencySelect } from "@/components/site/CurrencyContext";
import { LOGO, PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";

const drawerLinks = [
  { to: "/destinations", label: "Explore Travel", icon: Compass },
  { to: "/dashboard", label: "My Trips", icon: Briefcase },
  { to: "/deals", label: "My Rewards", icon: Star },
  { to: "/contact", label: "Need Help?", icon: HelpCircle },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background shadow-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:gap-6">
          <Link to="/" className="flex min-w-0 shrink-0 items-center">
            <img
              src={LOGO.src}
              alt="FaresDream — cheap flights and airfare comparison"
              className="h-6 w-auto max-w-[130px] object-contain sm:h-7 sm:max-w-[150px]"
              width={LOGO.width}
              height={LOGO.height}
            />
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-2 whitespace-nowrap lg:gap-3">
            <a
              href={`tel:${PHONE_TEL}`}
              className="hidden items-center gap-2.5 rounded-full border border-primary/15 bg-sky-50 py-1.5 pl-1.5 pr-4 transition hover:border-primary/40 lg:flex"
            >
              <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
                <Phone className="size-4" />
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] font-medium text-muted-foreground">
                  24/7 phone deals
                </span>
                <span className="block text-sm font-bold text-navy">{PHONE_DISPLAY}</span>
              </span>
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground transition hover:brightness-110 lg:hidden"
            >
              <Phone className="size-4" /> Call
            </a>

            <CurrencySelect className="hidden h-9 py-0 lg:inline-flex" />

            <Link
              to="/auth"
              className="hidden items-center gap-2 rounded-full px-2 py-1.5 text-sm font-semibold text-navy transition hover:text-primary lg:inline-flex"
            >
              <span className="grid size-8 place-items-center rounded-full border border-border">
                <User className="size-4" />
              </span>
              Sign in
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid size-9 place-items-center rounded-xl border border-border text-navy lg:hidden"
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
                src={LOGO.src}
                alt="FaresDream"
                loading="lazy"
                width={LOGO.width}
                height={LOGO.height}
                className="h-6 w-auto max-w-[130px] object-contain"
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
                <div className="flex items-center justify-between gap-3 px-3 py-1.5">
                  <span className="flex items-center gap-2 text-sm font-semibold text-navy">
                    <Globe className="size-4 text-primary" /> Change Language
                  </span>
                  <select
                    aria-label="Change language"
                    defaultValue="en"
                    className="cursor-pointer rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-navy outline-none focus:border-primary"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
                <div className="flex items-center justify-between gap-3 px-3 py-1.5">
                  <span className="flex items-center gap-2 text-sm font-semibold text-navy">
                    <DollarSign className="size-4 text-primary" /> Change Currency
                  </span>
                  <CurrencySelect className="px-3 py-1.5 text-xs" />
                </div>
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
                <img
                  src={agentAsset.url}
                  alt="FaresDream travel agent"
                  loading="lazy"
                  width={512}
                  height={512}
                  className="size-12 shrink-0 rounded-full object-cover"
                />
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
