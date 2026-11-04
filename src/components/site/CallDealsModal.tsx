import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { BadgePercent, Check, Phone, X } from "lucide-react";
import { AgentAvatar } from "@/components/site/ui";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { PHONE_DISPLAY, PHONE_TEL, PROMO_CODE } from "@/lib/brand";

const SEEN_KEY = "fd-call-modal-seen";

const PERKS = [
  "Phone-only fares you won't see online",
  "Help with seats, bags and changes",
  "Real travel experts, day or night",
];

/**
 * Phone-deals popup: once per visit, 25 seconds in or when the pointer heads for the
 * browser's tabs (leaving). Never in the admin console.
 */
export function CallDealsModal() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const inAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (typeof window === "undefined" || inAdmin) return;
    if (window.sessionStorage.getItem(SEEN_KEY)) return;

    const show = () => {
      if (window.sessionStorage.getItem(SEEN_KEY)) return;
      window.sessionStorage.setItem(SEEN_KEY, "1");
      setOpen(true);
    };

    const timer = window.setTimeout(show, 25000);
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [inAdmin]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* The dialog's built-in close button is hidden; ours sits on the blue header. */}
      <DialogContent className="w-[calc(100%-2rem)] max-w-[25rem] gap-0 overflow-hidden rounded-3xl border-0 p-0 sm:rounded-3xl [&>button:last-child]:hidden">
        <div className="relative bg-linear-to-br from-primary to-sky-500 px-6 pb-9 pt-7 text-center text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.16)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
          />
          <DialogClose
            aria-label="Close"
            className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="size-4" />
          </DialogClose>

          <AgentAvatar
            className="mx-auto size-16 bg-white text-primary shadow-lux"
            iconClassName="size-8"
          />
          <p className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <span className="size-1.5 rounded-full bg-emerald-300" /> Travel experts available 24/7
          </p>
          <DialogTitle className="relative mt-3 text-balance font-display text-2xl font-bold leading-tight tracking-normal">
            Better fares are one call away
          </DialogTitle>
        </div>

        <div className="relative -mt-5 px-6 pb-6">
          {/* Coupon: the code to mention on the call. */}
          <div className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-gold/50 bg-gold-soft px-4 py-3 text-left shadow-card">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold text-gold-foreground">
              <BadgePercent className="size-5" />
            </span>
            <DialogDescription className="text-sm leading-snug text-navy">
              Say <span className="font-display text-base font-bold text-gold">{PROMO_CODE}</span>{" "}
              when you call and save up to <span className="font-bold">$50</span> on your booking.
            </DialogDescription>
          </div>

          <ul className="mt-4 space-y-2 text-left text-sm text-foreground">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-2.5">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <a
            href={`tel:${PHONE_TEL}`}
            className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-full bg-gold px-6 py-3.5 font-display text-base font-bold text-gold-foreground shadow-card transition hover:brightness-110"
          >
            <Phone className="size-5" /> Call {PHONE_DISPLAY}
          </a>
          <DialogClose className="mt-3 w-full text-sm font-semibold text-muted-foreground transition hover:text-navy">
            No thanks, keep browsing
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
