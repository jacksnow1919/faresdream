import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, Copy, Loader2 } from "lucide-react";
import { revealBookingCard } from "@/lib/staff.functions";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-navy">{value || "—"}</p>
    </div>
  );
}

/** The booking's full card, for the roles allowed to ticket with it. Each view is logged. */
export function CardDetails({ bookingId, masked }: { bookingId: string; masked: string }) {
  const reveal = useServerFn(revealBookingCard);
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  const query = useQuery({
    queryKey: ["booking-card", bookingId],
    queryFn: async () => {
      const res = await reveal({ data: { bookingId } });
      void queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
      return res;
    },
    // The number stays out of the page's cache once the booking is closed.
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (query.isPending) {
    return (
      <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" /> Loading card…
      </p>
    );
  }

  const res = query.data;
  if (query.isError || !res?.ok) {
    return (
      <div className="mt-2">
        <p className="text-sm font-semibold text-navy">{masked}</p>
        <p className="mt-1 text-xs font-semibold text-destructive">
          {res?.message || "Couldn't load the card. Close this booking and try again."}
        </p>
      </div>
    );
  }

  const { card } = res;
  const copy = async () => {
    await navigator.clipboard.writeText(card.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-2 space-y-3 rounded-xl border border-border p-3">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Card number
          </p>
          <p className="mt-0.5 font-mono text-base font-bold tracking-wider text-navy">
            {card.number.replace(/(.{4})/g, "$1 ").trim()}
          </p>
        </div>
        <button
          onClick={() => void copy()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-navy transition hover:border-gold"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Detail label="Name on card" value={card.cardholderName ?? ""} />
        <Detail label="Type" value={card.brand ?? ""} />
        <Detail
          label="Expiry"
          value={card.expMonth && card.expYear ? `${card.expMonth}/${card.expYear}` : ""}
        />
      </div>
    </div>
  );
}
