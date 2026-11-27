import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BedDouble,
  DoorClosed,
  Utensils,
  Wine,
  MessageSquare,
  ArrowRight,
  Phone,
  CalendarDays,
  Repeat,
  PlaneTakeoff,
  Headset,
} from "lucide-react";
import { CabinRouteModal, type CabinRouteTarget } from "@/components/site/CabinRouteModal";
import { UnpublishedFaresModal } from "@/components/site/UnpublishedFaresModal";
import { PageShell, Card, SectionTitle } from "@/components/site/ui";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";
import { breadcrumbLd, jsonLdScript } from "@/lib/structured-data";

const TITLE = "Business Class Suites Compared: Qsuite, Delta One, ANA The Room | FaresDream";
const DESCRIPTION =
  "Compare the best business and first class suites from the USA: Qatar Qsuite, Emirates First, Delta One, ANA The Room, Singapore and Lufthansa Allegris. Beds, doors, dining and routes, plus a free fare quote 24/7.";

const faqs = [
  {
    q: "Which business class suites have a closing door?",
    a: "Qatar Airways Qsuite, Delta One Suites, ANA The Room, the Emirates First Class private suite and selected Lufthansa Allegris Business suites all have a door. Singapore Airlines business class has high side walls but no door.",
  },
  {
    q: "What is the difference between business class and first class?",
    a: "Business class gives you a flat bed and direct aisle access on most long-haul jets. First class adds a larger, fully enclosed suite, more staff per guest, upgraded dining and lounges. Few airlines still sell first class from the US, so business class suites are now the main premium option.",
  },
  {
    q: "How can I pay less for business class?",
    a: "Be flexible by a few days, compare one-stop routings through hubs like Doha, Dubai, Istanbul or Frankfurt, book outside peak holiday weeks, and ask our 24/7 agents for unpublished business class fares that do not show in public search.",
  },
  {
    q: "Is every business class seat lie-flat?",
    a: "No. Some airlines still use angled or older seats on certain aircraft, so the same airline can have very different cabins. Every product on this page is fully flat; check the aircraft type before you book.",
  },
];

export const Route = createFileRoute("/cabin-suites")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [jsonLdScript([breadcrumbLd([{ name: "Business Class Suites", path: "/cabin-suites" }])])],
  }),
  component: CabinSuitesPage,
});

type Suite = {
  airline: string;
  code: string;
  slug?: string;
  product: string;
  cabin: "Business" | "First";
  bed: string;
  privacy: string;
  dining: string;
  aircraft: string;
  routes: string;
  door: string;
};

const suites: Suite[] = [
  {
    airline: "Qatar Airways",
    code: "QR",
    slug: "qatar-airways",
    product: "Qsuite",
    cabin: "Business",
    bed: "Fully flat bed; centre suites can join into a double bed",
    privacy: "Sliding door; four centre seats can open into a private quad",
    dining: "Dine-on-demand à la carte menu",
    aircraft: "Selected A350 and 777",
    routes: "US → Doha, then on to India, Asia, Africa and the Middle East",
    door: "Yes",
  },
  {
    airline: "Emirates",
    code: "EK",
    slug: "emirates",
    product: "First Class Private Suite",
    cabin: "First",
    bed: "Fully enclosed suite that turns into a flat bed with mattress",
    privacy: "Floor-to-ceiling sliding doors (virtual windows on the newest 777s)",
    dining: "On-demand fine dining with caviar service",
    aircraft: "Selected 777-300ER and A380",
    routes: "New York, Los Angeles and other US gateways → Dubai",
    door: "Yes",
  },
  {
    airline: "Singapore Airlines",
    code: "SQ",
    slug: "singapore-airlines",
    product: "Business Class",
    cabin: "Business",
    bed: "Extra-wide seat that flips into a fully flat bed, 1-2-1 layout",
    privacy: "High side walls, every seat has aisle access",
    dining: "\"Book the Cook\" pre-order menu",
    aircraft: "A350, 777-300ER and A380",
    routes: "New York, Newark, Los Angeles, San Francisco, Seattle → Singapore",
    door: "No",
  },
  {
    airline: "ANA",
    code: "NH",
    product: "The Room",
    cabin: "Business",
    bed: "One of the widest business class seats flying today, fully flat",
    privacy: "Sliding door, seats alternate forward and rear facing",
    dining: "Japanese kaiseki or Western menu",
    aircraft: "Selected 777-300ER",
    routes: "New York and other US gateways → Tokyo",
    door: "Yes",
  },
  {
    airline: "Delta",
    code: "DL",
    product: "Delta One Suite",
    cabin: "Business",
    bed: "Fully flat bed with bedding and amenity kit",
    privacy: "Sliding door on every suite",
    dining: "Chef-curated plated meals",
    aircraft: "A350, A330-900neo and selected 767-400ER",
    routes: "US hubs → Europe, Asia and beyond",
    door: "Yes",
  },
  {
    airline: "Lufthansa",
    code: "LH",
    slug: "lufthansa",
    product: "Allegris Business",
    cabin: "Business",
    bed: "Fully flat bed, with extra-space and longer-bed seat options",
    privacy: "Selected suites have a door; every seat has aisle access",
    dining: "Multi-course European menu",
    aircraft: "Selected A350-900 and 787-9",
    routes: "US → Frankfurt and Munich, then on to Europe, India and Asia",
    door: "Some seats",
  },
];

const HUBS: Record<string, string> = {
  QR: "Doha",
  EK: "Dubai",
  SQ: "Singapore",
  NH: "Tokyo",
  DL: "Atlanta, New York, Detroit and more",
  LH: "Frankfurt, Munich",
};

const promises = [
  {
    icon: BedDouble,
    title: "Truly lie-flat",
    body: "Every cabin on this page goes fully flat, never an angled recliner sold as business.",
  },
  {
    icon: DoorClosed,
    title: "Direct aisle access",
    body: "1-2-1 layouts, so you never climb over another traveller.",
  },
  {
    icon: Utensils,
    title: "Dining that matters",
    body: "Dine-on-demand, pre-order menus and proper wine lists.",
  },
  {
    icon: Wine,
    title: "Lounges included",
    body: "Business and first class fares include airport lounge access on these airlines.",
  },
];

const tips = [
  {
    icon: CalendarDays,
    title: "Shift by a few days",
    body: "Business fares often change a lot between days of the week. A flexible date search shows the cheaper ones.",
  },
  {
    icon: Repeat,
    title: "Compare one-stop hubs",
    body: "Doha, Dubai, Istanbul and Frankfurt routings often beat nonstop prices to India, Asia and Africa.",
  },
  {
    icon: PlaneTakeoff,
    title: "Avoid peak weeks",
    body: "Christmas, New Year and summer holidays push premium fares up. Book shoulder seasons when you can.",
  },
  {
    icon: Headset,
    title: "Ask for unpublished fares",
    body: "Our agents can check business class fares that do not show in public search. Quotes are free.",
  },
];

function CabinSuitesPage() {
  const [routeTarget, setRouteTarget] = useState<CabinRouteTarget | null>(null);
  const [deskNote, setDeskNote] = useState<string | null>(null);

  return (
    <PageShell
      eyebrow="Business class"
      crumb="Business Class Suites"
      title="Business Class Suites: Know What You're Paying For"
      photo="/hero/sky-960.webp"
      subtitle="Not all business class is the same seat or the same bed. Compare the premium cabins our agents book most from the USA, then search your route or get a free quote."
      action={
        <a
          href={`tel:${PHONE_TEL}`}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold text-gold-foreground transition hover:brightness-110"
        >
          <Phone className="size-4" /> Call 24/7: {PHONE_DISPLAY}
        </a>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {promises.map((p) => (
          <div key={p.title} className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <span className="grid size-10 place-items-center rounded-xl bg-gold/10 text-gold">
              <p.icon className="size-5" aria-hidden="true" />
            </span>
            <p className="mt-3 font-display text-base font-semibold text-navy">{p.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-10 font-display text-2xl font-semibold text-navy">
        The best premium cabins from the USA
      </h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {suites.map((s) => (
          <article
            key={`${s.airline}-${s.product}`}
            className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition hover:border-gold/60"
          >
            <div className="flex items-start gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-xl border border-border bg-white p-1.5">
                <img
                  src={`/airlines/${s.code}.svg`}
                  alt={`${s.airline} logo`}
                  width={44}
                  height={44}
                  loading="lazy"
                  decoding="async"
                  className="size-11 object-contain"
                />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
                  {s.cabin} class
                </p>
                <h3 className="mt-0.5 font-display text-xl font-semibold text-navy">
                  {s.airline} {s.product}
                </h3>
                <p className="text-xs text-muted-foreground">{s.aircraft}</p>
              </div>
            </div>

            <dl className="mt-4 space-y-2 text-sm">
              <Spec label="Bed" value={s.bed} />
              <Spec label="Privacy" value={s.privacy} />
              <Spec label="Dining" value={s.dining} />
              <Spec label="Best on" value={s.routes} />
            </dl>

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
              <button
                type="button"
                onClick={() =>
                  setRouteTarget({
                    product: s.product,
                    airline: s.airline,
                    airlineCode: s.code,
                    cabin: s.cabin,
                  })
                }
                className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-gold-foreground transition hover:brightness-110"
              >
                Search this cabin <ArrowRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setDeskNote(`Interested in ${s.airline} ${s.product} (${s.cabin} class, ${s.aircraft}).`)
                }
                className="inline-flex items-center gap-2 rounded-xl border border-navy/25 px-4 py-2.5 text-sm font-bold text-navy transition hover:border-gold hover:text-gold"
              >
                <MessageSquare className="size-4" /> Get a free quote
              </button>
              {s.slug ? (
                <Link
                  to="/airlines/$slug"
                  params={{ slug: s.slug }}
                  className="ml-auto text-sm font-semibold text-primary underline-offset-2 hover:underline"
                >
                  About {s.airline}
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <Card className="mt-10 overflow-x-auto">
        <SectionTitle>Side-by-side comparison</SectionTitle>
        <table className="mt-4 w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              <th className="py-2 pr-3">Cabin</th>
              <th className="py-2 pr-3">Class</th>
              <th className="py-2 pr-3">Door</th>
              <th className="py-2">Hub</th>
            </tr>
          </thead>
          <tbody>
            {suites.map((s) => (
              <tr key={s.code} className="border-b border-border/60 last:border-0">
                <td className="py-2.5 pr-3 font-semibold text-navy">
                  {s.airline} {s.product}
                </td>
                <td className="py-2.5 pr-3">{s.cabin}</td>
                <td className="py-2.5 pr-3">{s.door}</td>
                <td className="py-2.5">{HUBS[s.code]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-muted-foreground">
          Seats vary by aircraft and route. Our agents confirm the exact cabin before you book.
        </p>
      </Card>

      <h2 className="mb-4 mt-10 font-display text-2xl font-semibold text-navy">
        How to pay less for business class
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tips.map((t) => (
          <div key={t.title} className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <t.icon className="size-5 text-primary" aria-hidden="true" />
            <p className="mt-2 font-display text-base font-semibold text-navy">{t.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-navy p-6 text-navy-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xl font-semibold">Want a business class quote?</p>
          <p className="mt-1 text-sm text-white/80">
            Tell us your route and dates. An agent compares airlines and gets back to you, free.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDeskNote("Business class quote request from the Cabin Suites page.")}
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-gold-foreground transition hover:brightness-110"
          >
            Get a free quote <ArrowRight className="size-4" />
          </button>
          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-bold transition hover:bg-white/10"
          >
            <Phone className="size-4" /> {PHONE_DISPLAY}
          </a>
        </div>
      </div>

      <Card className="mt-10">
        <SectionTitle>Business class questions</SectionTitle>
        <div className="mt-4 divide-y divide-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-3">
              <summary className="cursor-pointer list-none font-semibold text-navy marker:hidden">
                {f.q}
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Card>

      {routeTarget ? <CabinRouteModal target={routeTarget} onClose={() => setRouteTarget(null)} /> : null}
      {deskNote ? <UnpublishedFaresModal prefillNote={deskNote} onClose={() => setDeskNote(null)} /> : null}
    </PageShell>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-20 shrink-0 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="min-w-0 text-foreground/85">{value}</dd>
    </div>
  );
}
