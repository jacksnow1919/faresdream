import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CreditCard,
  Globe2,
  Headphones,
  MapPin,
  Phone,
  Plane,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { guides } from "@/lib/guides";
import { destinations } from "@/lib/destinations";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";

/** Trust chips + phone call-out shown under the search bar in the hero. */
export function HeroTrust() {
  const chips = [
    { icon: Globe2, label: "Compare airlines in one search" },
    { icon: Headphones, label: "Real agents 24/7" },
    { icon: ShieldCheck, label: "Secure checkout" },
    { icon: CreditCard, label: "No hidden fees" },
  ];
  return (
    <div className="mx-auto mt-6 flex max-w-[1116px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <ul className="flex flex-wrap gap-2">
        {chips.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-2 text-xs font-semibold text-navy shadow-sm backdrop-blur sm:text-sm"
          >
            <Icon className="size-4 text-primary" aria-hidden />
            {label}
          </li>
        ))}
      </ul>
      <a
        href={`tel:${PHONE_TEL}`}
        className="inline-flex items-center gap-3 self-start rounded-2xl bg-navy/90 px-4 py-2.5 text-white shadow-lg backdrop-blur transition hover:bg-navy lg:self-auto"
      >
        <span className="grid size-9 place-items-center rounded-full bg-gold">
          <Phone className="size-4" aria-hidden />
        </span>
        <span className="leading-tight">
          <span className="block text-xs text-white/80">Fares not shown online? Call us</span>
          <span className="block font-display text-base font-bold">{PHONE_DISPLAY}</span>
        </span>
      </a>
    </div>
  );
}

/** Three-step explainer, the pattern ASAP Tickets and others use under their search box. */
export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Search",
      text: "Enter your route and dates. We check fares from many airlines and travel providers at once.",
    },
    {
      icon: SlidersHorizontal,
      title: "Compare",
      text: "Sort by price, stops and flight time, and see the full price before you choose.",
    },
    {
      icon: Plane,
      title: "Book online or by phone",
      text: "Book in a few clicks, or call a FaresDream agent 24/7 for help and fares that aren't published online.",
    },
  ];
  return (
    <ol className="grid gap-5 md:grid-cols-3">
      {steps.map(({ icon: Icon, title, text }, i) => (
        <li
          key={title}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card"
        >
          <span
            aria-hidden
            className="absolute -right-2 -top-6 font-display text-[7rem] font-extrabold leading-none text-accent"
          >
            {i + 1}
          </span>
          <span className="relative grid size-12 place-items-center rounded-xl bg-primary text-white shadow-md">
            <Icon className="size-6" aria-hidden />
          </span>
          <h3 className="relative mt-4 font-display text-lg font-bold text-navy">
            {i + 1}. {title}
          </h3>
          <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
        </li>
      ))}
    </ol>
  );
}

/** Latest travel guides as photo cards: gives Google and visitors a path into the guides. */
export function GuidesTeaser() {
  const list = [...guides].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 3);
  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        {list.map((g) => (
          <Link
            key={g.slug}
            to="/guides/$slug"
            params={{ slug: g.slug }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-linear-to-br from-navy to-primary">
              {g.photo ? (
                <img
                  src={g.photo.replace("w=1600", "w=640").replace("h=640", "h=360")}
                  alt={g.photoAlt ?? ""}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : null}
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-navy">
                <BookOpen className="size-3.5" aria-hidden /> Guide
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-lg font-bold text-navy group-hover:text-primary">{g.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{g.description}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-bold text-primary">
                Read guide <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
        >
          All travel guides <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

/** Plain links to every destination and guide, grouped by region: crawlable paths for indexing. */
export function ExploreLinks() {
  const regions = ["Americas", "Europe", "Middle East", "Asia", "Africa"] as const;
  const usaGuides = guides.filter((g) => g.region === "USA");
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-navy">
          <MapPin className="size-4 text-gold" aria-hidden /> Flights within the USA
        </h3>
        <ul className="mt-3 space-y-2 text-sm">
          {usaGuides.map((g) => (
            <li key={g.slug}>
              <Link to="/guides/$slug" params={{ slug: g.slug }} className="text-foreground hover:text-primary hover:underline">
                {g.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {regions.map((r) => {
        const list = destinations.filter((d) => d.region === r);
        if (!list.length) return null;
        return (
          <div key={r} className="rounded-2xl border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 font-display text-base font-bold text-navy">
              <Globe2 className="size-4 text-gold" aria-hidden /> {r}
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {list.map((d) => (
                <li key={d.slug}>
                  <Link
                    to="/destinations/$slug"
                    params={{ slug: d.slug }}
                    className="text-foreground hover:text-primary hover:underline"
                  >
                    Cheap flights to {d.city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
