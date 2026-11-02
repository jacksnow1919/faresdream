import {
  BadgeDollarSign,
  Headphones,
  Plane,
  ReceiptText,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { SCROLL_ITEM_CLS, ScrollRow } from "@/components/site/ScrollRow";

/** Gradients echo the skies in Trending Destinations, dark enough for white text throughout. */
const REASONS: { title: string; text: string; icon: LucideIcon; bg: string }[] = [
  {
    title: "Wholesale fares",
    text: "compared across providers",
    icon: BadgeDollarSign,
    bg: "from-blue-950 to-blue-700",
  },
  {
    title: "24/7 support",
    text: "real agents, day & night",
    icon: Headphones,
    bg: "from-teal-950 to-teal-700",
  },
  {
    title: "Secure checkout",
    text: "256-bit encrypted payments",
    icon: ShieldCheck,
    bg: "from-slate-800 to-sky-800",
  },
  {
    title: "No hidden fees",
    text: "what you see is what you pay",
    icon: ReceiptText,
    bg: "from-sky-900 to-sky-700",
  },
  {
    title: "47+ airlines",
    text: "plus unpublished fares",
    icon: Plane,
    bg: "from-blue-950 to-sky-700",
  },
  {
    title: "Group savings",
    text: "extra discounts for groups",
    icon: Users,
    bg: "from-cyan-950 to-cyan-700",
  },
];

export function WhyBookCards() {
  return (
    <ScrollRow label="reasons to book">
      {REASONS.map((r) => (
        <div
          key={r.title}
          className={`relative flex h-28 items-center gap-4 overflow-hidden rounded-2xl bg-linear-to-r p-3 pr-5 text-white shadow-card ${r.bg} ${SCROLL_ITEM_CLS}`}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 -right-6 size-28 rounded-full bg-white/10"
          />
          <span className="relative grid size-[4.75rem] shrink-0 place-items-center rounded-full bg-white shadow-sm ring-4 ring-white/25">
            <span className="grid size-14 place-items-center rounded-full bg-sky-50 text-navy">
              <r.icon className="size-7" strokeWidth={1.75} />
            </span>
          </span>
          <p className="relative min-w-0">
            <span className="block font-display text-lg font-bold leading-tight">{r.title}</span>
            <span className="mt-0.5 block text-sm leading-snug text-white/90">{r.text}</span>
          </p>
        </div>
      ))}
    </ScrollRow>
  );
}
