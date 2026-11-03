import { ArrowRight } from "lucide-react";

type Trip = "round" | "one";

export type FeaturedDealPick = { to: string; from: string; trip: Trip };

/** Photos are free Unsplash License images (photo ids). */
const DEALS: {
  from: { code: string; city: string };
  to: { code: string; city: string };
  trip: Trip;
  photo: string;
}[] = [
  {
    from: { code: "JFK", city: "New York" },
    to: { code: "LHR", city: "London" },
    trip: "round",
    photo: "1761777773044-f76c0fe5114d",
  },
  {
    from: { code: "LAX", city: "Los Angeles" },
    to: { code: "CDG", city: "Paris" },
    trip: "round",
    photo: "1431274172761-fca41d930114",
  },
  {
    from: { code: "MIA", city: "Miami" },
    to: { code: "CUN", city: "Cancun" },
    trip: "one",
    photo: "1602088113235-229c19758e9f",
  },
  {
    from: { code: "ORD", city: "Chicago" },
    to: { code: "FCO", city: "Rome" },
    trip: "round",
    photo: "1552832230-c0197dd311b5",
  },
  {
    from: { code: "JFK", city: "New York" },
    to: { code: "DXB", city: "Dubai" },
    trip: "round",
    photo: "1580674684081-7617fbf3d745",
  },
  {
    from: { code: "BOS", city: "Boston" },
    to: { code: "LIS", city: "Lisbon" },
    trip: "one",
    photo: "1776187007773-aa0f3e56ef4a",
  },
];

const photoUrl = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${Math.round((w * 10) / 16)}&q=70`;

/**
 * Photo "postcard" deal cards: a swipeable row on phones, a 2–3 column grid from
 * tablets up. `onPick` gets the route and trip type of the clicked deal.
 */
export function FeaturedDeals({ onPick }: { onPick?: (deal: FeaturedDealPick) => void }) {
  return (
    <div className="-my-2 flex snap-x snap-mandatory gap-4 overflow-x-auto py-2 [scrollbar-width:none] md:grid md:grid-cols-2 md:gap-5 md:overflow-visible lg:grid-cols-3 lg:gap-6 [&::-webkit-scrollbar]:hidden">
      {DEALS.map((d) => {
        const tripLabel = d.trip === "round" ? "Round trip" : "One way";
        return (
          <button
            key={`${d.from.code}-${d.to.code}`}
            type="button"
            onClick={() => onPick?.({ to: d.to.code, from: d.from.code, trip: d.trip })}
            aria-label={`${tripLabel} from ${d.from.city} to ${d.to.city}`}
            className="group relative block aspect-[16/10] w-[82%] shrink-0 snap-start overflow-hidden rounded-2xl bg-muted text-left shadow-card transition hover:-translate-y-1 hover:shadow-lux sm:w-[60%] md:w-auto"
          >
            <img
              src={photoUrl(d.photo, 480)}
              srcSet={`${photoUrl(d.photo, 480)} 1x, ${photoUrl(d.photo, 960)} 2x`}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-navy shadow-sm">
              {tripLabel}
            </span>
            <span className="absolute inset-x-5 bottom-5 text-white [text-shadow:0_1px_8px_rgb(0_0_0/0.35)]">
              <span className="block text-xs font-medium text-white/85">
                from {d.from.city} ({d.from.code})
              </span>
              <span className="mt-1.5 block font-display text-2xl font-bold leading-tight">
                {d.to.city} <span className="text-sm font-semibold text-white/80">{d.to.code}</span>
              </span>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">
                View deal <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
