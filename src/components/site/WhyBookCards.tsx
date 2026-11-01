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

const REASONS: { title: string; text: string; icon: LucideIcon; bg: string; tint: string }[] = [
  {
    title: "Wholesale fares",
    text: "compared across providers",
    icon: BadgeDollarSign,
    bg: "from-amber-200 to-yellow-50",
    tint: "text-amber-600 bg-amber-100",
  },
  {
    title: "24/7 support",
    text: "real agents, day & night",
    icon: Headphones,
    bg: "from-rose-200 to-pink-50",
    tint: "text-rose-600 bg-rose-100",
  },
  {
    title: "Secure checkout",
    text: "256-bit encrypted payments",
    icon: ShieldCheck,
    bg: "from-violet-300 to-fuchsia-50",
    tint: "text-violet-700 bg-violet-100",
  },
  {
    title: "No hidden fees",
    text: "what you see is what you pay",
    icon: ReceiptText,
    bg: "from-cyan-200 to-sky-50",
    tint: "text-cyan-700 bg-cyan-100",
  },
  {
    title: "47+ airlines",
    text: "plus unpublished fares",
    icon: Plane,
    bg: "from-indigo-200 to-blue-50",
    tint: "text-indigo-600 bg-indigo-100",
  },
  {
    title: "Group savings",
    text: "extra discounts for groups",
    icon: Users,
    bg: "from-emerald-200 to-green-50",
    tint: "text-emerald-700 bg-emerald-100",
  },
];

export function WhyBookCards() {
  return (
    <ScrollRow label="reasons to book">
      {REASONS.map((r) => (
        <div
          key={r.title}
          className={`relative flex h-28 items-center gap-4 overflow-hidden rounded-2xl bg-linear-to-r p-3 pr-5 shadow-card ${r.bg} ${SCROLL_ITEM_CLS}`}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 -right-6 size-28 rounded-full bg-white/40"
          />
          <span className="relative grid size-[4.75rem] shrink-0 place-items-center rounded-full bg-white shadow-sm ring-4 ring-white/60">
            <span className={`grid size-14 place-items-center rounded-full ${r.tint}`}>
              <r.icon className="size-7" strokeWidth={1.75} />
            </span>
          </span>
          <p className="relative min-w-0">
            <span className="block font-display text-lg font-bold leading-tight text-foreground">
              {r.title}
            </span>
            <span className="mt-0.5 block text-sm leading-snug text-foreground/75">{r.text}</span>
          </p>
        </div>
      ))}
    </ScrollRow>
  );
}
