import { Phone, Search } from "lucide-react";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";
import { searchFlightsTo } from "@/lib/focus-search";

/**
 * End-of-page call to action. The search box itself sits at the top of the page;
 * this button scrolls back to it (already filled in) and opens the date picker.
 */
export function BottomSearchCta({
  title,
  text = "Search every airline at once, or talk to an agent about fares that aren't online.",
  to,
  from,
}: {
  title: string;
  text?: string;
  to?: string | undefined;
  from?: string | undefined;
}) {
  const goToSearch = () => {
    if (to && searchFlightsTo(to, from)) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <section className="overflow-hidden rounded-2xl bg-navy text-white shadow-card">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="font-display text-lg font-bold">{title}</p>
          <p className="mt-1 text-sm text-white/80">{text}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={goToSearch}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-gold-foreground transition hover:brightness-110"
          >
            <Search className="size-4" aria-hidden="true" /> Search flights
          </button>
          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
          >
            <Phone className="size-4" aria-hidden="true" /> {PHONE_DISPLAY}
          </a>
        </div>
      </div>
      <p className="bg-white/10 px-5 py-2 text-center text-xs text-white/80">24/7 travel agents</p>
    </section>
  );
}
