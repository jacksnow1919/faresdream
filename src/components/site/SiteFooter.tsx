import { useState, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowRight, ArrowUp, ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import { useCurrency } from "@/components/site/CurrencyContext";
import {
  DEFAULT_CURRENCY,
  LOGO_ON_DARK,
  OFFICE_ADDRESS,
  PHONE_DISPLAY,
  PHONE_TEL,
  SUPPORT_EMAIL,
} from "@/lib/brand";
import { shortcutDates, showFlightsTo } from "@/lib/focus-search";

/** A route to show results for; without `from`, flights leave from New York (JFK). */
type FooterFlights = { to: string; from?: string };

type FooterLink =
  | { label: string; to: "/deals" | "/about" | "/contact" | "/privacy" | "/terms" | "/sitemap" }
  | { label: string; flights: FooterFlights };

const route = (label: string, from: string, to: string): FooterLink => ({
  label,
  flights: { from, to },
});
const city = (label: string, to: string): FooterLink => ({ label, flights: { to } });

/** Results page search for a footer route: round trip a week out, one adult in economy. */
function flightsSearch({ to, from = "JFK" }: FooterFlights, currency: string) {
  const { depart, back } = shortcutDates();
  return {
    origin: from,
    destination: to,
    date: format(depart, "yyyy-MM-dd"),
    returnDate: format(back, "yyyy-MM-dd"),
    passengers: 1,
    cabin: "Economy" as const,
    currency,
  };
}

/** On the home page the search bar runs the search instead, keeping the visitor's picks. */
function searchFromBar(e: MouseEvent, { to, from }: FooterFlights) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (showFlightsTo(to, from)) e.preventDefault();
}

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Popular Airlines",
    links: [
      "Delta Air Lines",
      "American Airlines",
      "United Airlines",
      "British Airways",
      "Emirates",
      "Qatar Airways",
    ].map((label) => ({ label, to: "/deals" })),
  },
  {
    title: "Popular Routes",
    links: [
      route("New York to London", "JFK", "LHR"),
      route("Los Angeles to Paris", "LAX", "CDG"),
      route("Miami to Cancun", "MIA", "CUN"),
      route("Chicago to Rome", "ORD", "FCO"),
      route("New York to Dubai", "JFK", "DXB"),
      route("Boston to Lisbon", "BOS", "LIS"),
    ],
  },
  {
    title: "Cheap Flights To",
    links: [
      city("Orlando", "MCO"),
      city("Las Vegas", "LAS"),
      city("Cancun", "CUN"),
      city("London", "LHR"),
      city("Tokyo", "HND"),
      city("Delhi", "DEL"),
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Contact Us", to: "/contact" },
      { label: "Deals", to: "/deals" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Use", to: "/terms" },
      { label: "Sitemap", to: "/sitemap" },
    ],
  },
];

const BADGES = [
  { label: "Accredited by", items: ["IATAN", "ARC", "ASTA"] },
  { label: "Secure payments", items: ["Norton Secured", "Trustwave"] },
  {
    label: "We accept",
    items: ["VISA", "Mastercard", "American Express", "Discover", "PayPal", "Affirm"],
  },
];

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  const [open, setOpen] = useState(false);
  const { currency } = useCurrency();
  return (
    <div className="border-b border-white/10 lg:border-none">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-white lg:pointer-events-none lg:py-0"
      >
        {title}
        <ChevronDown
          className={`size-4 text-white/60 transition lg:hidden ${open ? "rotate-180" : ""}`}
        />
      </button>
      <ul
        className={`space-y-2.5 pb-4 text-sm lg:mt-4 lg:block lg:pb-0 ${open ? "block" : "hidden"}`}
      >
        {links.map((l) => {
          const cls =
            "group inline-flex items-center gap-1.5 text-white/65 transition hover:text-white";
          const body = (
            <>
              {l.label}
              <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
            </>
          );
          return (
            <li key={l.label}>
              {"flights" in l ? (
                <Link
                  to="/flight/search"
                  search={flightsSearch(l.flights, currency || DEFAULT_CURRENCY)}
                  onClick={(e) => searchFromBar(e, l.flights)}
                  className={cls}
                >
                  {body}
                </Link>
              ) : (
                <Link to={l.to} className={cls}>
                  {body}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Site footer: brand + link columns, grouped trust badges, bottom bar. */
export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-blue-950 pb-24 text-white lg:pb-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.09)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_65%)]"
      />

      <div className="page-container relative">
        {/* Brand + links */}
        <div className="grid gap-8 py-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center">
              <img
                src={LOGO_ON_DARK.src}
                alt="FaresDream"
                className="h-7 w-auto lg:h-8"
                loading="lazy"
                width={LOGO_ON_DARK.width}
                height={LOGO_ON_DARK.height}
              />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-white/65">
              Faresdream is an online flight booking and comparison website. Enjoy the cheapest
              flight deals at wholesale prices and dedicated customer support.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-gold">
                  <MapPin className="size-4" />
                </span>
                <span className="pt-1.5 text-white/80">{OFFICE_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-gold">
                  <Phone className="size-4" />
                </span>
                <a href={`tel:${PHONE_TEL}`} className="text-white/80 hover:text-white">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-gold">
                  <Mail className="size-4" />
                </span>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-white/80 hover:text-white">
                  {SUPPORT_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <div className="grid lg:col-span-8 lg:grid-cols-4 lg:gap-6">
            {COLUMNS.map((c) => (
              <LinkColumn key={c.title} title={c.title} links={c.links} />
            ))}
          </div>
        </div>

        {/* Trust and payment badges */}
        <div className="grid gap-6 border-t border-white/10 py-8 md:grid-cols-[auto_auto_1fr] md:gap-10">
          {BADGES.map((g) => (
            <div key={g.label}>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                {g.label}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {g.items.map((b) => (
                  <li key={b}>
                    <span
                      role="img"
                      aria-label={b}
                      className="grid h-8 place-items-center rounded-md bg-white px-2.5 text-[10px] font-extrabold uppercase tracking-wide text-navy"
                    >
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Faresdream. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link to="/sitemap" className="hover:text-white">
              Sitemap
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 font-semibold text-white/80 transition hover:border-white/50 hover:text-white"
            >
              Back to top <ArrowUp className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
