import { Phone } from "lucide-react";
import { AgentAvatar } from "@/components/site/ui";
import { PHONE_TEL, PROMO_CODE } from "@/lib/brand";

export function StickyCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 lg:hidden">
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-full border border-border bg-card px-3 py-2 shadow-lux">
        <AgentAvatar />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-navy">Better Deals, Just a Call Away</p>
          <p className="truncate text-[11px] text-muted-foreground">
            Call and say <span className="font-bold text-gold">{PROMO_CODE}</span> to save.
          </p>
        </div>
        <a
          href={`tel:${PHONE_TEL}`}
          aria-label="Call FaresDream"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-card"
        >
          <Phone className="size-5" />
        </a>
      </div>
    </div>
  );
}
