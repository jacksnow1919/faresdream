import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, Loader2, Plus, Trash2 } from "lucide-react";
import type { AdminBookingRow } from "@/lib/bookings.functions";
import {
  addTicket,
  advanceRefund,
  getBookingOps,
  removeTicket,
  requestRefund,
  type RefundRow,
  type TicketRow,
} from "@/lib/admin-ops.functions";
import {
  canSettleRefunds,
  firstIssue,
  formatMoney,
  refundAmount,
  refundFilingDeadline,
  refundRequestSchema,
  ticketSchema,
  toCents,
  type StaffRole,
} from "@/lib/admin-logic";
import { CANCEL_SERVICE_FEE_USD } from "@/lib/brand";

const inputCls =
  "mt-1 h-9 w-full rounded-xl border border-input bg-background px-3 text-sm text-navy outline-none focus:border-gold";
const primaryBtn =
  "inline-flex items-center gap-1.5 rounded-xl bg-navy px-3 py-2 text-xs font-bold text-navy-foreground disabled:opacity-50";
const secondaryBtn =
  "inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-bold text-navy disabled:opacity-50";

const fmt = formatMoney;

/** "" stays NaN so the schema reports a missing amount instead of reading it as 0. */
const num = (v: string) => (v.trim() === "" ? Number.NaN : Number(v));

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
      {label}
      {children}
    </label>
  );
}

function Problem({ text }: { text: string }) {
  return text ? (
    <p role="alert" className="mt-2 text-xs font-semibold text-destructive">
      {text}
    </p>
  ) : null;
}

/** E-tickets and refunds for one booking, shown in the booking details drawer. */
export function BookingOpsPanel({
  booking,
  role,
  onChange,
}: {
  booking: AdminBookingRow;
  role: StaffRole;
  onChange?: () => void;
}) {
  const fetchOps = useServerFn(getBookingOps);
  const queryClient = useQueryClient();
  const ops = useQuery({
    queryKey: ["booking-ops", booking.id],
    queryFn: () => fetchOps({ data: { bookingId: booking.id } }),
  });

  const refresh = () => {
    onChange?.();
    void queryClient.invalidateQueries({ queryKey: ["booking-ops", booking.id] });
    void queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-refunds"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
  };

  if (ops.isPending) {
    return (
      <p className="mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" /> Loading tickets and refunds…
      </p>
    );
  }
  if (ops.isError || !ops.data.ok) {
    return (
      <p className="mt-5 text-xs font-semibold text-destructive">
        {ops.data && !ops.data.ok ? ops.data.message : "Couldn't load tickets and refunds."}
      </p>
    );
  }

  const { tickets, refunds, refundsReady, passengerCount } = ops.data;
  return (
    <>
      <TicketsBlock booking={booking} tickets={tickets} onChange={refresh} />
      <RefundBlock
        booking={booking}
        role={role}
        refunds={refunds}
        ready={refundsReady}
        passengerCount={passengerCount}
        onChange={refresh}
      />
    </>
  );
}

/* ---------------------------------- tickets -------------------------------- */

const emptyTicket = {
  ticketNumber: "",
  airlinePnr: "",
  supplier: "",
  baseFare: "",
  commission: "0",
};

function TicketsBlock({
  booking,
  tickets,
  onChange,
}: {
  booking: AdminBookingRow;
  tickets: TicketRow[];
  onChange: () => void;
}) {
  const add = useServerFn(addTicket);
  const remove = useServerFn(removeTicket);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyTicket);
  const [problem, setProblem] = useState("");
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => {
    setProblem("");
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };
  const closed = booking.status === "refunded";

  const addMutation = useMutation({
    mutationFn: async () => {
      const parsed = ticketSchema.safeParse({
        bookingId: booking.id,
        ticketNumber: form.ticketNumber,
        airlinePnr: form.airlinePnr,
        supplier: form.supplier,
        baseFare: num(form.baseFare),
        commission: num(form.commission),
      });
      if (!parsed.success) return { ok: false as const, message: firstIssue(parsed.error) };
      return add({
        data: {
          bookingId: booking.id,
          ticketNumber: form.ticketNumber,
          airlinePnr: form.airlinePnr,
          supplier: form.supplier,
          baseFare: num(form.baseFare),
          commission: num(form.commission),
        },
      });
    },
    onSuccess: (res) => {
      if (!res.ok) return setProblem(res.message);
      setForm(emptyTicket);
      setOpen(false);
      onChange();
    },
    onError: () => setProblem("Couldn't save the ticket. Try again."),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: (res) => (res.ok ? onChange() : setProblem(res.message)),
    onError: () => setProblem("Couldn't remove the ticket. Try again."),
  });

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-sm font-semibold text-navy">E-tickets</h3>
        {!open && !closed ? (
          <button onClick={() => setOpen(true)} className={secondaryBtn}>
            <Plus className="size-3.5" /> Add e-ticket
          </button>
        ) : null}
      </div>

      {tickets.length === 0 ? (
        <p className="mt-1.5 text-xs text-muted-foreground">
          No e-tickets recorded. Add one before marking this booking ticketed.
        </p>
      ) : (
        <ul className="mt-1.5 divide-y divide-border rounded-xl border border-border">
          {tickets.map((t) => (
            <li key={t.id} className="flex items-start justify-between gap-3 px-3 py-2">
              <div className="min-w-0 text-xs">
                <p className="font-bold text-navy">{t.ticket_number ?? "—"}</p>
                <p className="text-muted-foreground">
                  {[
                    t.pnr_code ? `Airline ref ${t.pnr_code}` : "",
                    t.supplier ?? "",
                    `Base ${fmt(Number(t.base_fare), booking.currency)}`,
                    `Commission ${fmt(Number(t.commission), booking.currency)}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              {!closed ? (
                <button
                  aria-label={`Remove ticket ${t.ticket_number ?? ""}`}
                  disabled={removeMutation.isPending}
                  onClick={() => {
                    if (window.confirm(`Remove e-ticket ${t.ticket_number ?? ""}?`)) {
                      removeMutation.mutate(t.id);
                    }
                  }}
                  className="grid size-7 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {open ? (
        <form
          className="mt-2 grid grid-cols-2 gap-2 rounded-xl border border-border bg-secondary/40 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            addMutation.mutate();
          }}
        >
          <div className="col-span-2">
            <Field label="E-ticket number">
              <input
                value={form.ticketNumber}
                onChange={set("ticketNumber")}
                placeholder="125-1234567890"
                inputMode="numeric"
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="Airline ref (optional)">
            <input
              value={form.airlinePnr}
              onChange={set("airlinePnr")}
              placeholder="ABC123"
              className={`${inputCls} uppercase`}
            />
          </Field>
          <Field label="Supplier (optional)">
            <input
              value={form.supplier}
              onChange={set("supplier")}
              placeholder="PKFARE"
              className={inputCls}
            />
          </Field>
          <Field label={`Base fare (${booking.currency})`}>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.baseFare}
              onChange={set("baseFare")}
              className={inputCls}
            />
          </Field>
          <Field label={`Commission (${booking.currency})`}>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.commission}
              onChange={set("commission")}
              className={inputCls}
            />
          </Field>
          <div className="col-span-2 flex flex-wrap gap-2">
            <button type="submit" disabled={addMutation.isPending} className={primaryBtn}>
              {addMutation.isPending ? <Loader2 className="size-3.5 animate-spin" /> : null}
              Save e-ticket
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setForm(emptyTicket);
                setProblem("");
              }}
              className={secondaryBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}
      <Problem text={problem} />
    </section>
  );
}

/* ---------------------------------- refunds -------------------------------- */

const REFUND_LABELS: Record<RefundRow["status"], string> = {
  requested: "Requested",
  filed: "Filed with airline",
  paid: "Paid to customer",
  rejected: "Rejected",
};

function RefundBlock({
  booking,
  role,
  refunds,
  ready,
  passengerCount,
  onChange,
}: {
  booking: AdminBookingRow;
  role: StaffRole;
  refunds: RefundRow[];
  ready: boolean;
  passengerCount: number;
  onChange: () => void;
}) {
  const [starting, setStarting] = useState(false);
  const current = refunds.find((r) => r.status !== "rejected") ?? null;
  const past = refunds.filter((r) => r !== current);

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-sm font-semibold text-navy">Refund</h3>
        {ready && !current && !starting && booking.status !== "refunded" ? (
          <button onClick={() => setStarting(true)} className={secondaryBtn}>
            Start a refund
          </button>
        ) : null}
      </div>

      {!ready ? (
        <p className="mt-1.5 text-xs text-muted-foreground">
          Refunds need a one-time database update (the admin refunds migration) before they can be
          tracked here.
        </p>
      ) : current ? (
        <RefundCard refund={current} role={role} onChange={onChange} />
      ) : starting ? (
        <RefundForm
          booking={booking}
          passengerCount={passengerCount}
          onDone={() => {
            setStarting(false);
            onChange();
          }}
          onCancel={() => setStarting(false)}
        />
      ) : (
        <p className="mt-1.5 text-xs text-muted-foreground">No refund on this booking.</p>
      )}

      {past.length ? (
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          {past.map((r) => (
            <li key={r.id}>
              Rejected refund of {fmt(Number(r.refund_amount), r.currency)} ·{" "}
              {new Date(r.created_at).toLocaleDateString()}
              {r.notes ? ` · ${r.notes}` : ""}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function RefundForm({
  booking,
  passengerCount,
  onDone,
  onCancel,
}: {
  booking: AdminBookingRow;
  passengerCount: number;
  onDone: () => void;
  onCancel: () => void;
}) {
  const request = useServerFn(requestRefund);
  const ticketed = booking.status === "issued";
  // Before ticketing the policy refunds in full; after it, our fee is USD 75 per passenger.
  const defaultFee =
    ticketed && booking.currency === "USD"
      ? CANCEL_SERVICE_FEE_USD * Math.max(1, passengerCount)
      : 0;
  const [form, setForm] = useState({
    farePaid: String(Number(booking.total_price)),
    airlinePenalty: "0",
    nonRefundableTaxes: "0",
    serviceFee: String(defaultFee),
    reason: "",
  });
  const [problem, setProblem] = useState("");
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => {
    setProblem("");
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const values = {
    bookingId: booking.id,
    farePaid: num(form.farePaid),
    airlinePenalty: num(form.airlinePenalty),
    nonRefundableTaxes: num(form.nonRefundableTaxes),
    serviceFee: num(form.serviceFee),
    reason: form.reason,
  };
  const amounts = [
    values.farePaid,
    values.airlinePenalty,
    values.nonRefundableTaxes,
    values.serviceFee,
  ];
  const preview = amounts.every(Number.isFinite) ? refundAmount(values) : null;

  const mutation = useMutation({
    mutationFn: async () => {
      const parsed = refundRequestSchema.safeParse(values);
      if (!parsed.success) return { ok: false as const, message: firstIssue(parsed.error) };
      if (toCents(values.farePaid) > toCents(Number(booking.total_price))) {
        return {
          ok: false as const,
          message: "The fare paid can't be more than the booking total.",
        };
      }
      return request({ data: values });
    },
    onSuccess: (res) => (res.ok ? onDone() : setProblem(res.message)),
    onError: () => setProblem("Couldn't save the refund. Try again."),
  });

  return (
    <form
      className="mt-2 grid grid-cols-2 gap-2 rounded-xl border border-border bg-secondary/40 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      <p className="col-span-2 text-xs text-muted-foreground">
        {ticketed
          ? `Ticketed: refund = fare paid − airline penalty − non-refundable taxes − our fee (USD ${CANCEL_SERVICE_FEE_USD} per passenger).`
          : "Not ticketed yet: the policy refunds the full amount, with no penalty or fee."}
      </p>
      <Field label={`Fare paid (${booking.currency})`}>
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.farePaid}
          onChange={set("farePaid")}
          className={inputCls}
        />
      </Field>
      <Field label="Airline penalty">
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.airlinePenalty}
          onChange={set("airlinePenalty")}
          className={inputCls}
        />
      </Field>
      <Field label="Non-refundable taxes">
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.nonRefundableTaxes}
          onChange={set("nonRefundableTaxes")}
          className={inputCls}
        />
      </Field>
      <Field label="Our service fee">
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.serviceFee}
          onChange={set("serviceFee")}
          className={inputCls}
        />
      </Field>
      <div className="col-span-2">
        <Field label="Reason">
          <input
            value={form.reason}
            onChange={set("reason")}
            placeholder="Customer cancelled the trip"
            className={inputCls}
          />
        </Field>
      </div>
      <p className="col-span-2 rounded-lg bg-card px-3 py-2 text-sm text-navy">
        Customer gets back:{" "}
        <span className="font-bold">{preview === null ? "—" : fmt(preview, booking.currency)}</span>
      </p>
      <div className="col-span-2 flex flex-wrap gap-2">
        <button type="submit" disabled={mutation.isPending} className={primaryBtn}>
          {mutation.isPending ? <Loader2 className="size-3.5 animate-spin" /> : null}
          Open refund
        </button>
        <button type="button" onClick={onCancel} className={secondaryBtn}>
          Cancel
        </button>
      </div>
      <div className="col-span-2">
        <Problem text={problem} />
      </div>
    </form>
  );
}

function RefundCard({
  refund,
  role,
  onChange,
}: {
  refund: RefundRow;
  role: StaffRole;
  onChange: () => void;
}) {
  const advance = useServerFn(advanceRefund);
  const [reference, setReference] = useState(refund.airline_reference ?? "");
  const [note, setNote] = useState("");
  const [problem, setProblem] = useState("");
  const settle = canSettleRefunds(role);

  const deadline = refundFilingDeadline(refund.created_at);
  const overdue = refund.status === "requested" && Date.now() > deadline.getTime();

  const mutation = useMutation({
    mutationFn: (to: "filed" | "paid" | "rejected") =>
      advance({
        data: {
          id: refund.id,
          to,
          ...(reference.trim() ? { airlineReference: reference.trim() } : {}),
          ...(note.trim() ? { notes: note.trim() } : {}),
        },
      }),
    onSuccess: (res) => {
      if (!res.ok) return setProblem(res.message);
      setNote("");
      setProblem("");
      onChange();
    },
    onError: () => setProblem("Couldn't update the refund. Try again."),
  });

  const rows: [string, string][] = [
    ["Fare paid", fmt(Number(refund.fare_paid), refund.currency)],
    ["Airline penalty", `− ${fmt(Number(refund.airline_penalty), refund.currency)}`],
    ["Non-refundable taxes", `− ${fmt(Number(refund.non_refundable_taxes), refund.currency)}`],
    ["Our service fee", `− ${fmt(Number(refund.service_fee), refund.currency)}`],
  ];

  return (
    <div className="mt-2 rounded-xl border border-border p-3 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-sky-100 px-2.5 py-1 font-bold text-sky-800">
          {REFUND_LABELS[refund.status]}
        </span>
        <span className="font-display text-base font-bold text-navy">
          {fmt(Number(refund.refund_amount), refund.currency)}
        </span>
      </div>
      <dl className="mt-2 space-y-0.5 text-muted-foreground">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-muted-foreground">
        Requested {new Date(refund.created_at).toLocaleString()} by {refund.requested_by}
        {refund.reason ? ` · ${refund.reason}` : ""}
      </p>
      {refund.status === "requested" ? (
        <p
          className={`mt-1 inline-flex items-center gap-1 font-semibold ${overdue ? "text-destructive" : "text-navy"}`}
        >
          {overdue ? <AlertTriangle className="size-3.5" /> : null}
          File with the airline by {deadline.toLocaleDateString()}
          {overdue ? " (overdue)" : ""}
        </p>
      ) : null}
      {refund.filed_at ? (
        <p className="mt-1 text-muted-foreground">
          Filed {new Date(refund.filed_at).toLocaleString()} · airline ref{" "}
          {refund.airline_reference}
        </p>
      ) : null}
      {refund.paid_at ? (
        <p className="mt-1 text-muted-foreground">
          Paid {new Date(refund.paid_at).toLocaleString()} · closed by {refund.closed_by}
        </p>
      ) : null}
      {refund.notes ? (
        <p className="mt-1 whitespace-pre-line text-muted-foreground">{refund.notes}</p>
      ) : null}

      {refund.status === "requested" || refund.status === "filed" ? (
        <div className="mt-3 space-y-2">
          {refund.status === "requested" ? (
            <Field label="Airline refund reference">
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="From the airline or supplier"
                className={inputCls}
              />
            </Field>
          ) : null}
          <Field label="Note (optional)">
            <input value={note} onChange={(e) => setNote(e.target.value)} className={inputCls} />
          </Field>
          <div className="flex flex-wrap gap-2">
            {refund.status === "requested" ? (
              <button
                disabled={mutation.isPending}
                onClick={() => mutation.mutate("filed")}
                className={primaryBtn}
              >
                Mark filed with airline
              </button>
            ) : (
              <button
                disabled={mutation.isPending || !settle}
                onClick={() => {
                  if (
                    window.confirm(
                      `Mark ${fmt(Number(refund.refund_amount), refund.currency)} as paid to the customer? The booking will be set to refunded.`,
                    )
                  ) {
                    mutation.mutate("paid");
                  }
                }}
                className={primaryBtn}
              >
                Mark paid to customer
              </button>
            )}
            <button
              disabled={mutation.isPending || !settle}
              onClick={() => {
                if (window.confirm("Reject this refund?")) mutation.mutate("rejected");
              }}
              className={secondaryBtn}
            >
              Reject
            </button>
          </div>
          {!settle ? (
            <p className="text-muted-foreground">
              Only a manager can mark refunds paid or rejected.
            </p>
          ) : null}
        </div>
      ) : null}
      <Problem text={problem} />
    </div>
  );
}
