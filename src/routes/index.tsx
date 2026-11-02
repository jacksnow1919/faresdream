import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { FaqAccordion, type Faq } from "@/components/site/FaqAccordion";
import { FlightSearchBar } from "@/components/site/FlightSearchBar";
import { MovingSky } from "@/components/site/MovingSky";
import { NewsletterCard } from "@/components/site/NewsletterCard";
import { OfferCards } from "@/components/site/OfferCards";
import { WhyBookCards } from "@/components/site/WhyBookCards";
import { TrendingDestinations } from "@/components/site/TrendingDestinations";
import { PopularRoutes } from "@/components/site/PopularRoutes";
import { FeaturedDeals } from "@/components/site/FeaturedDeals";
import { RecentSearches } from "@/components/site/RecentSearches";
import { FLIGHT_SEARCH_ID, focusFlightSearch, showFlightsTo } from "@/lib/focus-search";
import { PHONE_DISPLAY, SUPPORT_EMAIL } from "@/lib/brand";

type HomeSearch = { from?: string | undefined; to?: string | undefined };

const iata = (v: unknown) =>
  typeof v === "string" && /^[A-Za-z]{3}$/.test(v) ? v.toUpperCase() : undefined;

export const Route = createFileRoute("/")({
  // ?to=LHR (and optional &from=JFK) pre-fills the search bar, for links into the home page.
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    const to = iata(search["to"]);
    const from = iata(search["from"]);
    return { ...(to ? { to } : {}), ...(to && from && from !== to ? { from } : {}) };
  },
  head: () => ({
    meta: [
      { title: "FaresDream — Compare Cheap Flights & Wholesale Airfare Deals" },
      {
        name: "description",
        content:
          "FaresDream compares flight ticket prices across the world's leading travel providers. Enter your origin, destination and dates for the best air ticket deals.",
      },
      { property: "og:title", content: "FaresDream — Compare Cheap Flights & Airfare Deals" },
      {
        property: "og:description",
        content: "Wholesale airfare deals, instant flight comparison and a 24/7 phone concierge.",
      },
    ],
  }),
  component: Home,
});

/** Refund and change answers follow /refund-policy and /terms; keep them in sync. */
const faqs: Faq[] = [
  {
    q: "What is the Best Time to Book Flights for Cheap Airfares?",
    a: "Fares are usually lowest outside school holidays and peak seasons. As a rule of thumb, book international trips around 60 days ahead and domestic trips around 30 days ahead. Flying mid-week and picking early-morning or late-night departures often lowers the price further.",
  },
  {
    q: "How Can I Find the Cheapest Flights?",
    a: `Search with FaresDream to compare published, wholesale and unpublished fares side by side, then sort the results by Cheapest. Being flexible helps: try nearby dates, other airports in the same city, and itineraries with a stop. For phone-only fares, call ${PHONE_DISPLAY} and mention code DIAL50 to save up to $50.`,
  },
  {
    q: "Can I Book Flights for Last-Minute Travel?",
    a: `Yes. You can search and book flights close to your departure date, subject to seat availability. Last-minute fares are sometimes cheaper on quieter routes when airlines release unsold seats, but popular routes usually get more expensive in the final two weeks. Need to fly urgently? Call ${PHONE_DISPLAY} for the fastest options.`,
  },
  {
    q: "Is It Possible to Get Refundable or Changeable Flight Tickets?",
    a: "Yes, depending on the fare. Every ticket follows the rules of the airline that issues it: some fares can be changed or refunded for a penalty, while discounted and unpublished fares are often non-refundable and non-changeable. Before you pay, our team confirms in writing whether your fare is refundable, partially refundable or fully restricted. Changes cost the airline penalty plus any fare difference and our USD 50 reissue fee per passenger.",
  },
  {
    q: "What Happens if I Need to Cancel My Flight Ticket?",
    a: (
      <>
        If your booking hasn&apos;t been ticketed yet, you can cancel free of charge. Once it&apos;s
        ticketed, any refund is the fare paid minus the airline&apos;s cancellation penalty,
        non-refundable taxes and our USD 75 service fee per passenger. Email {SUPPORT_EMAIL} or call{" "}
        {PHONE_DISPLAY} with your booking ID; approved refunds are filed with the airline within 3
        business days. Read our <Link to="/refund-policy">Refund &amp; Cancellation Policy</Link>{" "}
        for full details.
      </>
    ),
  },
  {
    q: "How Does FaresDream Find Cheaper Flight Tickets?",
    a: "We compare live published fares with wholesale and unpublished inventory from our travel provider network, then show you the cheapest combination for your dates.",
  },
  {
    q: "Can I Get an Extra Discount on Three or Four Tickets?",
    a: `Yes. Group and multi-passenger bookings often qualify for an extra saving. Call our travel desk at ${PHONE_DISPLAY} before you confirm so the discount can be applied.`,
  },
  {
    q: "Which Promo Code Is Currently Active?",
    a: "DIAL50. Mention it to an agent when you book by phone and save up to $50 on your reservation.",
  },
];

function Home() {
  const prefill = Route.useSearch();

  useEffect(() => {
    if (window.location.hash === `#${FLIGHT_SEARCH_ID}`) focusFlightSearch();
  }, []);

  return (
    <div className="bg-background pb-16">
      {/* HERO + SEARCH on a moving sky — kept above the fold on mobile and desktop */}
      <section className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="relative mx-auto max-w-page rounded-3xl px-4 pb-8 pt-6 sm:px-8 sm:pb-12 lg:min-h-[375px] lg:pb-10">
          <MovingSky />
          <div className="relative">
            <h1 className="mx-auto mb-4 max-w-[1116px] font-display text-xl font-bold leading-tight text-white [text-shadow:0_2px_12px_rgb(0_0_0/0.25)] sm:text-2xl">
              Compare Cheap Flights &amp; Wholesale Airfare Deals
            </h1>
            <FlightSearchBar prefill={prefill} />
          </div>
        </div>
      </section>

      {/* RECENT SEARCHES — only for returning visitors with saved searches */}
      <RecentSearches />

      {/* OFFERS & DISCOUNTS */}
      <section className="px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="mx-auto max-w-page">
          <SectionHeading
            title="Flight Booking Offers & Discounts"
            subtitle="Exclusive savings on domestic and international flights."
          />
          <div className="mt-8">
            <OfferCards />
          </div>
        </div>
      </section>

      {/* WHY BOOK WITH FARESDREAM */}
      <section className="px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="mx-auto max-w-page">
          <SectionHeading
            title="Why Book With FaresDream?"
            subtitle="Wholesale fares, secure booking and real people on call 24/7."
          />
          <div className="mt-8">
            <WhyBookCards />
          </div>
        </div>
      </section>

      {/* TRENDING DESTINATIONS */}
      <section className="px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="mx-auto max-w-page">
          <TrendingDestinations
            heading={
              <SectionHeading
                title="Trending Destinations"
                subtitle="Tap a destination to start your flight search."
              />
            }
          />
        </div>
      </section>

      {/* FEATURED DEALS */}
      <section className="px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="mx-auto max-w-page">
          <SectionHeading
            title="Featured Flight Deals"
            subtitle="Tap a deal to start your search."
          />
          <div className="mt-8">
            <FeaturedDeals onPick={(d) => showFlightsTo(d.to, d.from, d.trip)} />
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="mx-auto max-w-page">
          <NewsletterCard />
        </div>
      </section>

      {/* POPULAR ROUND TRIPS */}
      <section className="mt-12 bg-secondary px-4 py-12 sm:px-6 lg:mt-16 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-page">
          <SectionHeading
            title={
              <>
                Most Popular Round-trip Flights from <span className="text-gold">New York</span>
              </>
            }
            subtitle="Average round-trip price per person, taxes and fees included."
          />
          <div className="mt-8">
            <PopularRoutes
              onPick={(to, from) => showFlightsTo(to, from, "round")}
              onSearchOther={focusFlightSearch}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-display text-2xl font-bold text-foreground sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-8">
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ title, subtitle }: { title: ReactNode; subtitle?: string }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">{title}</h2>
      <span className="mt-3 block h-1 w-16 rounded-full bg-gold" />
      {subtitle ? (
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
      ) : null}
    </div>
  );
}
