import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
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
import logoAsset from "@/assets/faresdream-logo.png.asset.json";
import agentAsset from "@/assets/agent-avatar.jpg.asset.json";
import { focusFlightSearch, FLIGHT_SEARCH_ID } from "@/lib/focus-search";
import { CurrencySelect } from "@/components/site/CurrencyContext";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";

const navLinks = [
  { to: "/deals", label: "Deals" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
] as const;

const drawerLinks = [
  { to: "/destinations", label: "Explore Travel", icon: Compass },
  { to: "/dashboard", label: "My Trips", icon: Briefcase },
  { to: "/deals", label: "My Rewards", icon: Star },
  { to: "/contact", label: "Need Help?", icon: HelpCircle },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function goToFlights() {
    if (!focusFlightSearch()) void navigate({ to: "/", hash: FLIGHT_SEARCH_ID });
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background shadow-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex min-w-0 items-center">
            <img
              src={logoAsset.url}
              alt="FaresDream — cheap flights and airfare comparison"
              className="h-8 w-auto max-w-[170px] object-contain"
              width={1920}
              height={640}
            />
          </Link>

          <nav className="hidden items-center gap-6 whitespace-nowrap text-sm font-semibold text-foreground lg:flex">
            <button type="button" onClick={goToFlights} className="hover:text-primary">
              Flights
            </button>
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 whitespace-nowrap lg:gap-3">
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition hover:brightness-110 lg:pl-1.5 lg:pr-4 lg:text-sm"
            >
              <img
                src={agentAsset.url}
                alt=""
                loading="lazy"
                width={512}
                height={512}
                className="hidden size-8 rounded-full object-cover lg:block"
              />
              <Phone className="size-4 lg:hidden" />
              <span className="hidden lg:inline">Call Us: {PHONE_DISPLAY}</span>
              <span className="lg:hidden">Call</span>
            </a>

            <CurrencySelect className="hidden lg:inline-flex" />

            <Link
              to="/auth"
              className="hidden items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm font-semibold text-navy hover:border-primary hover:text-primary lg:inline-flex"
            >
              <User className="size-4" /> Sign In / Join
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
                src={logoAsset.url}
                alt="FaresDream"
                loading="lazy"
                width={1920}
                height={640}
                className="h-7 w-auto max-w-[140px] object-contain"
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
