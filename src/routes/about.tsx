import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeDollarSign,
  Clock,
  Globe2,
  Headphones,
  Mail,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import { CtaBand, ctaOutlineCls, ctaPrimaryCls, PageShell } from "@/components/site/ui";
import { PHONE_DISPLAY, PHONE_TEL, SUPPORT_EMAIL } from "@/lib/brand";
import { FLIGHT_SEARCH_ID } from "@/lib/focus-search";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About FaresDream — Flight Price Comparison & Wholesale Fares" },
      {
        name: "description",
        content:
          "FaresDream is a flight price comparison website offering wholesale airfare, a 24/7 phone concierge and secure checkout for travellers worldwide.",
      },
      { property: "og:title", content: "About FaresDream" },
      {
        property: "og:description",
        content:
          "Wholesale airfare, global reach and personalised service from real travel agents.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: BadgeDollarSign,
    title: "Wholesale Pricing",
    body: "We work with the world's leading travel providers to surface negotiated fares you won't find on public search engines.",
  },
  {
    icon: Globe2,
    title: "Global, Yet Local",
    body: "A one-stop global airline ticket booking solution, delivered with locally tailored customer experiences.",
  },
  {
    icon: Headphones,
    title: "Real People, 24/7",
    body: "Travel experts on the phone before, during and after your journey.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent & Secure",
    body: "Verified fare rules, encrypted payments and no surprise add-ons at checkout.",
  },
];

/** How a booking goes; keep in line with section 4 of /terms. */
const STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Search,
    title: "Search and compare",
    body: "See published, wholesale and unpublished fares side by side.",
  },
  {
    icon: Send,
    title: "Send your booking",
    body: "Pick a flight, add traveller details and submit your booking.",
  },
  {
    icon: Headphones,
    title: "We confirm with the airline",
    body: "Our travel desk checks availability and fare rules, then contacts you.",
  },
  {
    icon: Ticket,
    title: "Get your e-ticket",
    body: "Issued once the airline confirms and your payment goes through.",
  },
];

function AboutPage() {
  return (
    <PageShell
      crumb="About Us"
      title="About FaresDream"
      subtitle="Cheap flights at wholesale prices, with real travel experts on call 24/7."
    >
      <div className="space-y-10 sm:space-y-12">
        {/* Who we are + talk to us */}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-8">
            <Heading>Who we are</Heading>
            <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
              <p>
                FaresDream is a flight price comparison and booking website. Tell us where
                you&apos;re flying from, where you&apos;re going and when, and we compare fares from
                the world&apos;s leading travel providers, including wholesale and unpublished fares
                you won&apos;t usually find on public search engines.
              </p>
              <p>
                Behind the website is a team of travel experts. We pair a global, one-stop airline
                booking service with local, personal support, so you get the cheapest fares we can
                find and real people to help before, during and after your trip.
              </p>
            </div>
          </section>

          <aside className="flex flex-col rounded-2xl bg-navy p-5 text-white shadow-card sm:p-6">
            <span className="grid size-11 place-items-center rounded-full bg-white/15">
              <Headphones className="size-5" />
            </span>
            <p className="mt-4 font-display text-xl font-bold">Talk to a travel expert</p>
            <p className="mt-1 text-sm text-white/75">
              Need a different date, seats, special meals, extra bags or a stopover? We&apos;ll
              build the trip around you.
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a href={`tel:${PHONE_TEL}`} className="flex items-center gap-3 hover:underline">
                  <Phone className="size-4 text-gold" /> {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="flex items-center gap-3 hover:underline"
                >
                  <Mail className="size-4 text-gold" /> {SUPPORT_EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="size-4 text-gold" /> Open 24 hours, 7 days a week
              </li>
            </ul>
          </aside>
        </div>

        {/* Values */}
        <section>
          <Heading>What we value</Heading>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/30"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <v.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-navy">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How booking works */}
        <section>
          <Heading>How booking with us works</Heading>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className="relative rounded-2xl border border-border bg-card p-5 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold font-display text-sm font-bold text-gold-foreground">
                    {i + 1}
                  </span>
                  <s.icon className="size-5 text-primary" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-navy">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <CtaBand
          title="Ready to find your next flight?"
          text="Compare fares in seconds, or call for phone-only deals."
        >
          <Link to="/" hash={FLIGHT_SEARCH_ID} className={ctaPrimaryCls}>
            <Search className="size-4" /> Search flights
          </Link>
          <a href={`tel:${PHONE_TEL}`} className={ctaOutlineCls}>
            <Phone className="size-4" /> {PHONE_DISPLAY}
          </a>
        </CtaBand>
      </div>
    </PageShell>
  );
}

function Heading({ children }: { children: string }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-navy sm:text-2xl">{children}</h2>
      <span className="mt-2 block h-1 w-12 rounded-full bg-gold" />
    </div>
  );
}
