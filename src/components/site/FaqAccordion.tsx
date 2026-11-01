import { useState, type ReactNode } from "react";
import { ChevronUp } from "lucide-react";

export type Faq = { q: string; a: ReactNode };

/**
 * One-open-at-a-time FAQ list: white cards, the open one turns into a blue card.
 * Shows `initialCount` questions with a Show More / Show Less toggle for the rest.
 */
export function FaqAccordion({ items, initialCount = 5 }: { items: Faq[]; initialCount?: number }) {
  const [open, setOpen] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, initialCount);

  return (
    <div>
      <div className="space-y-4">
        {visible.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              className={`overflow-hidden rounded-lg transition ${
                isOpen
                  ? "bg-linear-to-r from-primary to-sky-500 text-white shadow-lux"
                  : "bg-card text-foreground shadow-[0_2px_14px_rgb(15_23_42/0.07)] hover:shadow-[0_4px_18px_rgb(15_23_42/0.1)]"
              }`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span
                  className={`font-display text-base sm:text-lg ${isOpen ? "font-semibold" : "font-medium"}`}
                >
                  {f.q}
                </span>
                {isOpen ? <ChevronUp className="size-6 shrink-0" strokeWidth={1.5} /> : null}
              </button>
              {isOpen ? (
                <div className="-mt-1 px-5 pb-5 text-sm font-medium leading-relaxed text-white/95 sm:text-[15px] [&_a]:underline [&_a]:underline-offset-2">
                  {f.a}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {items.length > initialCount ? (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              if (showAll && open !== null && open >= initialCount) setOpen(null);
              setShowAll(!showAll);
            }}
            className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-navy-foreground transition hover:brightness-110 sm:text-base"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
