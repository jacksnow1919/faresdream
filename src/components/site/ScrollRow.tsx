import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Width of one card in a ScrollRow: ~1 on phones up to 4 per view on wide screens. */
export const SCROLL_ITEM_CLS =
  "w-[82%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)] xl:w-[calc((100%-3.75rem)/4)]";

/** Horizontal snap-scrolling row with round prev/next arrows (swipe on touch). */
export function ScrollRow({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setAtStart(el.scrollLeft <= 4);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const page = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth, behavior: "smooth" });

  const arrowCls =
    "absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-foreground shadow-lux transition hover:scale-105 md:grid";

  return (
    <div className="relative">
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="-my-2 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth py-2 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      {atStart ? null : (
        <button
          type="button"
          aria-label={`Previous ${label}`}
          onClick={() => page(-1)}
          className={`${arrowCls} left-0 -translate-x-1/2`}
        >
          <ChevronLeft className="size-5" />
        </button>
      )}
      {atEnd ? null : (
        <button
          type="button"
          aria-label={`Next ${label}`}
          onClick={() => page(1)}
          className={`${arrowCls} right-0 translate-x-1/2`}
        >
          <ChevronRight className="size-5" />
        </button>
      )}
    </div>
  );
}
