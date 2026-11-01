import { Link } from "@tanstack/react-router";
import { ArrowRight, Plane } from "lucide-react";
import { SCROLL_ITEM_CLS, ScrollRow } from "@/components/site/ScrollRow";
import { PHONE_TEL, PROMO_CODE } from "@/lib/brand";

type Offer = {
  eyebrow: string;
  headline: string;
  text: string;
  /** Unsplash photo id (free Unsplash License), shown on the right of the card. */
  photo: string;
  /** Card gradient plus the accent used on its chip. */
  bg: string;
  accent: string;
  /** Promo code chip; otherwise `cta` is shown as a pill. */
  code?: string;
  cta?: string;
} & ({ to: "/deals" | "/cabin-suites" | "/corporate" } | { tel: true });

const OFFERS: Offer[] = [
  {
    eyebrow: "Up to",
    headline: "$50 Off",
    text: "when you book by phone",
    photo: "1772466104938-d9e6b6197cdb",
    bg: "from-blue-600 to-indigo-900",
    accent: "bg-gold text-white",
    code: PROMO_CODE,
    tel: true,
  },
  {
    eyebrow: "Extra savings",
    headline: "Group Trips",
    text: "on multi-passenger bookings",
    photo: "1643645820511-356526dd3892",
    bg: "from-orange-500 to-amber-600",
    accent: "text-orange-600",
    cta: "Call the travel desk",
    tel: true,
  },
  {
    eyebrow: "Unpublished fares",
    headline: "Live Deals",
    text: "across 47+ partner airlines",
    photo: "1715262437769-d5a52db0d1dd",
    bg: "from-sky-500 to-cyan-700",
    accent: "text-sky-700",
    cta: "View deals",
    to: "/deals",
  },
  {
    eyebrow: "Lie-flat seats",
    headline: "Fly Business",
    text: "premium cabins at wholesale fares",
    photo: "1700811476854-52f99a9f2ec1",
    bg: "from-slate-800 to-indigo-950",
    accent: "text-indigo-900",
    cta: "Explore cabins",
    to: "/cabin-suites",
  },
  {
    eyebrow: "Corporate desk",
    headline: "Team Travel",
    text: "negotiated fares & one invoice",
    photo: "1773734893426-fc4dfb4a5518",
    bg: "from-violet-600 to-fuchsia-700",
    accent: "text-violet-700",
    cta: "Talk to us",
    to: "/corporate",
  },
];

const photoUrl = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces,entropy&w=${w}&h=${h}&q=70`;

function OfferCard({ offer }: { offer: Offer }) {
  const body = (
    <>
      {/* Photo on the right, fading into the card colour behind the text. */}
      <img
        src={photoUrl(offer.photo, 420, 380)}
        srcSet={`${photoUrl(offer.photo, 420, 380)} 1x, ${photoUrl(offer.photo, 840, 760)} 2x`}
        alt=""
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-y-0 right-0 h-full w-[62%] object-cover transition duration-500 [mask-image:linear-gradient(to_right,transparent,black_45%)] group-hover:scale-105"
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute -left-12 -top-14 size-40 rounded-full bg-white/10" />
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

      <span className="relative flex h-full max-w-[62%] flex-col justify-center [text-shadow:0_1px_8px_rgb(0_0_0/0.2)]">
        <span className="text-[13px] font-medium text-white/90">{offer.eyebrow}</span>
        <span className="whitespace-nowrap font-display text-2xl font-extrabold leading-tight">
          {offer.headline}
        </span>
        <span className="mt-0.5 text-[13px] leading-snug text-white/90">{offer.text}</span>
        <span className="mt-3 [text-shadow:none]">
          {offer.code ? (
            <span className="inline-flex overflow-hidden rounded-md bg-white text-[11px] font-semibold shadow-sm">
              <span className="px-2 py-1 text-slate-500">Code:</span>
              <span className={`px-2 py-1 font-bold tracking-wide ${offer.accent}`}>
                {offer.code}
              </span>
            </span>
          ) : (
            <span
              className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-white px-3 py-1 text-[11px] font-bold shadow-sm ${offer.accent}`}
            >
              {offer.cta} <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
            </span>
          )}
        </span>
      </span>
    </>
  );

  const cls = `group relative block aspect-[16/9] overflow-hidden rounded-2xl bg-linear-135 p-5 text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lux ${offer.bg} ${SCROLL_ITEM_CLS}`;

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
