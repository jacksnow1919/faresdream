import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, ShieldCheck, Copy, Eye, CreditCard } from "lucide-react";
import {
  createVerificationRequest,
  getVerificationDocs,
  getVerificationRequests,
  reviewVerification,
  revealVaultedCard,
} from "@/lib/admin-crm.functions";

type Card = {
  cardholderName: string | null;
  brand: string | null;
  last4: string | null;
  expMonth: string | null;
  expYear: string | null;
  number: string;
};

export function VerificationSection() {
  const queryClient = useQueryClient();
  const listFn = useServerFn(getVerificationRequests);
  const createFn = useServerFn(createVerificationRequest);
  const reviewFn = useServerFn(reviewVerification);
  const docsFn = useServerFn(getVerificationDocs);
  const cardFn = useServerFn(revealVaultedCard);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [link, setLink] = useState("");
  const [docs, setDocs] = useState<{ label: string; url: string }[] | null>(null);
  const [card, setCard] = useState<Card | null>(null);
  const [error, setError] = useState("");

  const { data, isPending } = useQuery({
    queryKey: ["admin-verifications"],
    queryFn: () => listFn(),
    retry: false,
  });

  const create = useMutation({
    mutationFn: () =>
      createFn({
        data: {
          bookingId: bookingId.trim() ? bookingId.trim() : null,
          customerName: name.trim(),
          customerEmail: email.trim(),
          expiresInHours: 72,
        },
      }),
    onSuccess: (res) => {
      if (!res.ok) return;
      setLink(`${window.location.origin}/verify/${res.token}`);
      setName("");
      setEmail("");
      setBookingId("");
      void queryClient.invalidateQueries({ queryKey: ["admin-verifications"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
    },
    onError: () => setError("Could not generate the link. Please try again."),
  });

  const review = useMutation({
    mutationFn: (vars: { id: string; status: "verified" | "rejected" }) =>
      reviewFn({ data: vars }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-verifications"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
    },
  });

  const rows = data?.authorized ? data.rows : [];

  return (
    <section id="verification" className="mt-6 rounded-2xl border border-border bg-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-navy">
          <ShieldCheck className="size-4" /> Secure Verification Portal
        </h2>
        <span className="text-xs text-muted-foreground">{rows.length} requests</span>
      </div>

      <div className="grid gap-2 border-b border-border p-4 sm:grid-cols-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Customer name"
          className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Customer email"
          className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <input
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          placeholder="Booking ID (optional)"
          className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <button
          onClick={() => {
            setError("");
            create.mutate();
          }}
          disabled={create.isPending}
          className="rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-gold-foreground disabled:opacity-60"
        >
          {create.isPending ? "Generating…" : "Generate secure link"}
        </button>

        {link ? (
          <div className="sm:col-span-4 flex flex-wrap items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-xs">
            <span className="break-all font-semibold text-navy">{link}</span>
            <button
              onClick={() => void navigator.clipboard.writeText(link)}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 font-bold text-navy"
            >
              <Copy className="size-3" /> Copy
            </button>
            <span className="text-muted-foreground">Valid for 72 hours.</span>
          </div>
        ) : null}
        {error ? (
          <p className="sm:col-span-4 text-xs font-semibold text-destructive">{error}</p>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-secondary text-[11px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Created</th>
              <th className="px-4 py-2.5 font-semibold">Customer</th>
              <th className="px-4 py-2.5 font-semibold">Status</th>
              <th className="px-4 py-2.5 font-semibold">Documents</th>
              <th className="px-4 py-2.5 font-semibold">Vaulted card</th>
              <th className="px-4 py-2.5 font-semibold">Decision</th>
            </tr>
          </thead>
          <tbody>
            {isPending ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center">
                  <Loader2 className="mx-auto size-4 animate-spin" />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-xs text-muted-foreground">
                  No verification requests yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-navy">{r.customer_name ?? "—"}</span>
                    <span className="block text-xs text-muted-foreground">
                      {r.customer_email ?? ""}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold capitalize text-navy">{r.status}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={async () => {
                        const res = await docsFn({ data: { id: r.id } });
                        setDocs(res.ok ? res.urls : []);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-bold text-navy hover:border-gold"
                    >
                      <Eye className="size-3" /> View
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {r.has_card ? (
                      <button
                        onClick={async () => {
                          const res = await cardFn({ data: { verificationRequestId: r.id } });
                          if (res.ok && res.card) setCard(res.card);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-bold text-navy hover:border-gold"
                      >
                        <CreditCard className="size-3" /> Decrypt
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => review.mutate({ id: r.id, status: "verified" })}
                        className="rounded-lg bg-navy px-2.5 py-1 text-xs font-bold text-navy-foreground"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => review.mutate({ id: r.id, status: "rejected" })}
                        className="rounded-lg border border-border px-2.5 py-1 text-xs font-bold text-navy"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {docs ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-navy/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-lux">
            <h3 className="font-display text-lg font-semibold text-navy">Uploaded documents</h3>
            {docs.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Nothing uploaded yet.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {docs.map((d) => (
                  <li key={d.label}>
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-navy underline"
                    >
                      {d.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setDocs(null)}
              className="mt-4 w-full rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-gold-foreground"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      {card ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-navy/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-lux">
            <h3 className="font-display text-lg font-semibold text-navy">Vaulted card</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Decrypted for this session only. Do not copy outside the ticketing system.
            </p>
            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Cardholder</dt>
                <dd className="font-semibold">{card.cardholderName ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Brand</dt>
                <dd className="font-semibold">{card.brand ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Expiry</dt>
                <dd className="font-semibold">
                  {card.expMonth}/{card.expYear}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Number</dt>
                <dd className="font-mono font-semibold">
                  {JSON.parse(card.number).number as string}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">CVV</dt>
                <dd className="font-mono font-semibold">
                  {JSON.parse(card.number).cvv as string}
                </dd>
              </div>
            </dl>
            <button
              onClick={() => setCard(null)}
              className="mt-4 w-full rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-gold-foreground"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
