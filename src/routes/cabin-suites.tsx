import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BedDouble, DoorClosed, Utensils, Wine, MessageSquare, ArrowRight } from "lucide-react";
import { CabinRouteModal, type CabinRouteTarget } from "@/components/site/CabinRouteModal";
import { UnpublishedFaresModal } from "@/components/site/UnpublishedFaresModal";


export const Route = createFileRoute("/cabin-suites")({
  head: () => ({
    meta: [
      { title: "Cabin Suites — Qsuite, Delta One & Lie-Flat Business Class" },
      {
        name: "description",
        content:
          "Compare the world's best premium cabins: Qatar Qsuite, Emirates First, Delta One, Singapore Business and ANA The Room — beds, doors, dining and direct aisle access.",
      },
      { property: "og:title", content: "Cabin Suites — The World's Best Premium Cabins" },
      {
        property: "og:description",
        content:
          "Know exactly what you're paying for: lie-flat beds, closing doors, chef dining and lounge access.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CabinSuitesPage,
});

type Suite = {
  airline: string;
  code: string;
  product: string;
  cabin: "Business" | "First";
  bed: string;
  privacy: string;
  dining: string;
  aircraft: string;
  routes: string;
  fromPrice: number;
};

const suites: Suite[] = [
  {
    airline: "Qatar Airways",
    code: "QR",
    product: "Qsuite",
    cabin: "Business",
    bed: "79\" fully flat bed, centre pairs convert to a double bed",
    privacy: "Closing door, quad suite for groups of four",
    dining: "Dine-on-demand à la carte",
    aircraft: "A350-1000 · 777-300ER",
    routes: "US & Europe → Doha and onward to Asia",
    fromPrice: 2290,
  },
  {
    airline: "Emirates",
    code: "EK",
    product: "First Class Private Suite",
    cabin: "First",
    bed: "Fully enclosed suite with a real mattress and turndown",
    privacy: "Floor-to-ceiling closing door, virtual windows",
    dining: "Caviar service and on-demand fine dining",
    aircraft: "777-300ER · A380",
    routes: "New York, Los Angeles, London → Dubai",
    fromPrice: 6480,
  },
  {
    airline: "Singapore Airlines",
    code: "SQ",
    product: "Business Class 2013/2017 Suite",
    cabin: "Business",
    bed: "Wide flat bed, 1-2-1 direct aisle access",
    privacy: "High shell, forward-facing seat",
    dining: "Book the Cook pre-order menu",
    aircraft: "A350 · 777-300ER · A380",
    routes: "US West Coast & Europe → Singapore",
    fromPrice: 2980,
  },
  {
    airline: "ANA",
    code: "NH",
    product: "The Room",
    cabin: "Business",
    bed: "Widest business class bed flying today",
    privacy: "Sliding door, alternating forward/rear facing",
    dining: "Kaiseki Japanese or Western menu",
    aircraft: "777-300ER",
    routes: "New York, Los Angeles, London → Tokyo",
    fromPrice: 2740,
  },
  {
    airline: "Delta",
    code: "DL",
    product: "Delta One Suite",
    cabin: "Business",
    bed: "Full-flat bed with memory foam comfort kit",
    privacy: "Sliding privacy door on every suite",
    dining: "Chef-curated plated service",
    aircraft: "A350 · 767-400ER",
    routes: "US hubs → Europe, Asia and Middle East",
    fromPrice: 2160,
  },
  {
    airline: "Lufthansa",
    code: "LH",
    product: "Allegris Business Suite",
    cabin: "Business",
    bed: "Flat bed with extra-long throne options",
    privacy: "Front-row suites with a door, extra-space seats",
    dining: "Multi-course European service",
    aircraft: "A350 · 787-9",
    routes: "US & Asia → Frankfurt / Munich",
    fromPrice: 1980,
  },
];

const promises = [
  { icon: BedDouble, title: "Truly lie-flat", body: "We only sell seats that go fully flat — never angled recliners sold as business." },
  { icon: DoorClosed, title: "Direct aisle access", body: "1-2-1 layouts by default, so you never step over another traveller." },
  { icon: Utensils, title: "Dining that matters", body: "Dine-on-demand, pre-order menus and proper wine lists, cabin by cabin." },
  { icon: Wine, title: "Ground experience", body: "Flagship lounges, chauffeur transfers and fast-track where the fare includes it." },
];

function CabinSuitesPage() {
  const [routeTarget, setRouteTarget] = useState<CabinRouteTarget | null>(null);
  const [deskNote, setDeskNote] = useState<string | null>(null);

  return (
    <div className="min-h-[100dvh] bg-navy text-navy-foreground">
      <section className="px-4 pb-6 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-page">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
            Cabin suites
          </span>
          <h1 className="mt-3 max-w-3xl font-display text-2xl font-semibold leading-tight sm:text-4xl">
            Know exactly what you&apos;re <span className="text-gold">paying for</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-navy-foreground/70">
            Not all business class is the same seat or the same bed. These are the premium products
            our desk books most.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {promises.map((p) => (
              <span
                key={p.title}
                title={p.body}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-navy-soft/60 px-3 py-1.5 text-[11px] font-semibold text-navy-foreground/80"
              >
                <p.icon className="size-3.5 text-gold" />
                {p.title}
              </span>
            ))}
          </div>
        </div>
      </section>


      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-page gap-4 lg:grid-cols-2">
          {suites.map((s) => (
            <article
              key={`${s.airline}-${s.product}`}
              className="rounded-2xl border border-white/10 bg-navy-soft/60 p-5 transition hover:border-gold/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                    {s.cabin} class
                  </p>
                  <h2 className="mt-1 font-display text-xl font-semibold">
                    {s.airline} — {s.product}
                  </h2>
                  <p className="text-xs text-navy-foreground/55">{s.aircraft}</p>
                </div>
                <p className="shrink-0 text-right">
                  <span className="block font-display text-xl font-semibold text-gold">
                    ${s.fromPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-navy-foreground/50">
                    from
                  </span>
                </p>
              </div>

              <dl className="mt-4 space-y-2 text-xs">
                <Spec label="Bed" value={s.bed} />
                <Spec label="Privacy" value={s.privacy} />
                <Spec label="Dining" value={s.dining} />
                <Spec label="Best on" value={s.routes} />
              </dl>

              <div className="mt-5 flex flex-wrap gap-2">
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
                  className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-xs font-bold text-gold-foreground"
                >
                  Search this cabin <ArrowRight className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDeskNote(
                      `Interested in ${s.airline} ${s.product} (${s.cabin} class, ${s.aircraft}).`,
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-xs font-bold hover:border-gold hover:text-gold"
                >
                  <MessageSquare className="size-3.5" /> Ask the desk
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {routeTarget ? (
        <CabinRouteModal target={routeTarget} onClose={() => setRouteTarget(null)} />
      ) : null}
      {deskNote ? (
        <UnpublishedFaresModal prefillNote={deskNote} onClose={() => setDeskNote(null)} />
      ) : null}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-20 shrink-0 font-bold uppercase tracking-widest text-navy-foreground/45">
        {label}
      </dt>
      <dd className="min-w-0 text-navy-foreground/80">{value}</dd>
    </div>
  );
}
