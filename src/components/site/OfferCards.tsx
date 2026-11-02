import { Link } from "@tanstack/react-router";
import { ArrowRight, Plane } from "lucide-react";
import { SCROLL_ITEM_CLS, ScrollRow } from "@/components/site/ScrollRow";
import { PHONE_TEL, PROMO_CODE } from "@/lib/brand";

type Offer = {
  eyebrow: string;
  headline: string;
  text: string;
  /** Unsplash photo id (free Unsplash License), filling the card behind the text. */
  photo: string;
  /** Promo code chip; otherwise `cta` is shown as a pill. */
  code?: string;
  cta?: string;
} & ({ to: "/deals" | "/cabin-suites" | "/corporate" } | { tel: true });

const OFFERS: Offer[] = [
  {
    eyebrow: "Up to",
    headline: "$50 Off",
    text: "when you book by phone",
    photo: "1564995495903-2fc9f522ad0e",
    code: PROMO_CODE,
    tel: true,
  },
  {
    eyebrow: "Extra savings",
    headline: "Group Trips",
    text: "on multi-passenger bookings",
    photo: "1778411602745-5db9ca798215",
    cta: "Call the travel desk",
    tel: true,
  },
  {
    eyebrow: "Unpublished fares",
    headline: "Live Deals",
    text: "across 47+ partner airlines",
    photo: "1647363377737-8d0ad7c2f494",
    cta: "View deals",
    to: "/deals",
  },
  {
    eyebrow: "Lie-flat seats",
    headline: "Fly Business",
    text: "premium cabins at wholesale fares",
    photo: "1706819399638-988193cfaaa6",
    cta: "Explore cabins",
    to: "/cabin-suites",
  },
  {
    eyebrow: "Corporate desk",
    headline: "Team Travel",
    text: "negotiated fares & one invoice",
    photo: "1716138100497-81987b4ba0d1",
    cta: "Talk to us",
    to: "/corporate",
  },
];

const photoUrl = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces,entropy&w=${w}&h=${h}&q=70`;

function OfferCard({ offer }: { offer: Offer }) {
  const body = (
    <>
      <img
        src={photoUrl(offer.photo, 480, 270)}
        srcSet={`${photoUrl(offer.photo, 480, 270)} 1x, ${photoUrl(offer.photo, 960, 540)} 2x`}
        alt=""
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
      />
      {/* The same dark fades as the Trending Destinations cards, here behind left-aligned text. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/60 via-black/25 to-transparent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/35 to-transparent"
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        <svg
          viewBox="0 0 120 50"
          className="absolute left-[38%] top-4 w-20 text-white/50"
          fill="none"
        >
          <path
            d="M2 46 C 35 6, 80 -2, 118 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </svg>
        <Plane className="absolute left-[calc(38%+4.6rem)] top-3 size-4 rotate-12 text-white drop-shadow" />
      </span>

      <span className="relative flex h-full max-w-[62%] flex-col justify-center [text-shadow:0_2px_10px_rgb(0_0_0/0.35)]">
        <span className="text-[13px] font-medium text-white/90">{offer.eyebrow}</span>
        <span className="whitespace-nowrap font-display text-2xl font-extrabold leading-tight">
          {offer.headline}
        </span>
        <span className="mt-0.5 text-[13px] leading-snug text-white/90">{offer.text}</span>
        <span className="mt-3 [text-shadow:none]">
          {offer.code ? (
            <span className="inline-flex overflow-hidden rounded-md bg-white text-[11px] font-semibold shadow-sm">
              <span className="px-2 py-1 text-slate-500">Code:</span>
              <span className="bg-navy px-2 py-1 font-bold tracking-wide text-navy-foreground">
                {offer.code}
              </span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-white px-3 py-1 text-[11px] font-bold text-navy shadow-sm">
              {offer.cta} <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
            </span>
          )}
        </span>
      </span>
    </>
  );

  const cls = `group relative block aspect-[16/9] overflow-hidden rounded-2xl bg-muted p-5 text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lux ${SCROLL_ITEM_CLS}`;

  return "tel" in offer ? (
    <a href={`tel:${PHONE_TEL}`} className={cls}>
      {body}
    </a>
  ) : (
    <Link to={offer.to} className={cls}>
      {body}
    </Link>
  );
}

export function OfferCards() {
  return (
    <ScrollRow label="flight offers">
      {OFFERS.map((o) => (
        <OfferCard key={o.headline} offer={o} />
      ))}
    </ScrollRow>
  );
}
