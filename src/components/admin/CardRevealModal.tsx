import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Eye, Loader2, ShieldAlert, X } from "lucide-react";
import { revealBookingCard } from "@/lib/staff.functions";

type RevealedCard = {
  cardholderName: string | null;
  brand: string | null;
  last4: string | null;
  expMonth: string | null;
  expYear: string | null;
  number: string;
};

/** Audited break-glass reveal: remarks required, auto-hides after 60 seconds. */
export function CardRevealModal({
  bookingId,
  onClose,
}: {
  bookingId: string;
  onClose: () => void;
}) {
  const reveal = useServerFn(revealBookingCard);
  const [remarks, setRemarks] = useState("");
  const [card, setCard] = useState<RevealedCard | null>(null);
  const [message, setMessage] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(60);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => reveal({ data: { bookingId, remarks: remarks.trim() } }),
    onSuccess: (res) => {
      if (!res.ok) {
        setMessage(res.message);
        return;
      }
      setMessage("");
      setCard(res.card as RevealedCard);
      setSecondsLeft(60);
      void queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
    },
    onError: () => setMessage("The reveal failed. Please try again."),
  });

  useEffect(() => {
    if (!card) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setCard(null);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [card]);

  const block = (e: React.SyntheticEvent) => e.preventDefault();

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center px-4">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-navy/70" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-lux">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-5 text-destructive" />
            <h2 className="font-display text-lg font-semibold text-navy">Break-glass card reveal</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          This action is logged against your account with the remarks you enter. The card auto-hides
          after 60 seconds and cannot be copied.
        </p>

        {card ? (
          <div
            onCopy={block}
            onCut={block}
            onContextMenu={block}
            className="mt-4 select-none rounded-xl border border-destructive/40 bg-destructive/5 p-4"
          >
            <p className="font-mono text-lg font-bold tracking-widest text-navy">
              {card.number.replace(/(.{4})/g, "$1 ").trim()}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {card.cardholderName ?? "—"} · {card.brand ?? "Card"} · exp {card.expMonth}/{card.expYear}
            </p>
            <p className="mt-3 text-xs font-bold text-destructive">Hides in {secondsLeft}s</p>
          </div>
        ) : (
          <>
            <label className="mt-4 block">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Reason for reveal (required)
              </span>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                placeholder="e.g. Airline requires card presentation for ticket issue on PNR ABC123"
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
              />
            </label>
            {message ? (
              <p className="mt-2 text-xs font-semibold text-destructive">{message}</p>
            ) : null}
            <button
              onClick={() => mutation.mutate()}
              disabled={remarks.trim().length < 10 || mutation.isPending}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-destructive px-4 py-3 text-sm font-bold text-destructive-foreground disabled:opacity-50"
            >
              {mutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Eye className="size-4" />
              )}
              Reveal card number
            </button>
          </>
        )}
      </div>
    </div>
  );
}
