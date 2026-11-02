import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  canManageDeals,
  canSettleRefunds,
  canViewActivity,
  dealEndError,
  dealSchema,
  endOfNewYorkDay,
  formatMoney,
  refundAmount,
  refundRequestSchema,
  refundStepError,
  refundStepSchema,
  ticketSchema,
  toCents,
  type RefundStatus,
} from "./admin-logic";

/* ---------------------------------- types --------------------------------- */

export type Failure = { ok: false; message: string };

export type DealRow = {
  id: string;
  origin: string;
  destination: string;
  airline: string;
  cabin_class: string;
  price: number;
  currency: string;
  expires_at: string | null;
  created_at: string;
};

export type TicketRow = {
  id: string;
  ticket_number: string | null;
  pnr_code: string | null;
  supplier: string | null;
  base_fare: number;
  commission: number;
  created_at: string;
};

export type RefundRow = {
  id: string;
  booking_id: string;
  status: RefundStatus;
  currency: string;
  fare_paid: number;
  airline_penalty: number;
  non_refundable_taxes: number;
  service_fee: number;
  refund_amount: number;
  airline_reference: string | null;
  reason: string | null;
  notes: string | null;
  requested_by: string;
  created_at: string;
  filed_at: string | null;
  paid_at: string | null;
  closed_by: string | null;
};

/** A refund with its booking's reference and customer, for the refunds list. */
export type RefundListRow = RefundRow & { pnr: string | null; lead_name: string | null };

export type ActivityRow = {
  id: string;
  created_at: string;
  staff_email: string;
  staff_role: string;
  action: string;
  entity: string;
  entity_id: string | null;
  summary: string;
};

/* --------------------------------- helpers -------------------------------- */

const NOT_SIGNED_IN: Failure = { ok: false, message: "Your session has expired. Sign in again." };
const NOT_ALLOWED: Failure = { ok: false, message: "Your role can't do this." };
const MIGRATION_NEEDED: Failure = {
  ok: false,
  message: "Refunds need a database update first (admin refunds migration).",
};

async function actor() {
  const { getAdminActor } = await import("./admin-session.server");
  return getAdminActor();
}

async function db() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}

async function activity() {
  return import("./admin-activity.server");
}

const money = formatMoney;

async function bookingLabel(id: string) {
  const { data } = await (await db()).from("bookings").select("pnr").eq("id", id).maybeSingle();
  return data?.pnr ?? "a booking";
}

/* ----------------------------------- deals --------------------------------- */

export const listDeals = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ ok: true; rows: DealRow[] } | Failure> => {
    if (!(await actor())) return NOT_SIGNED_IN;
    const { data, error } = await (
      await db()
    )
      .from("deals")
      .select(
        "id, origin, destination, airline, cabin_class, price, currency, expires_at, created_at",
      )
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[listDeals] failed", error);
      return { ok: false, message: "Couldn't load deals." };
    }
    return { ok: true, rows: (data ?? []) as DealRow[] };
  },
);

export const saveDeal = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => dealSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: true; id: string } | Failure> => {
    const who = await actor();
    if (!who) return NOT_SIGNED_IN;
    if (!canManageDeals(who.role)) return NOT_ALLOWED;
    const endError = dealEndError(data.endsOn);
    if (endError) return { ok: false, message: endError };

    const row = {
      origin: data.origin,
      destination: data.destination,
      airline: data.airline,
      cabin_class: data.cabinClass,
      price: toCents(data.price),
      currency: data.currency,
      expires_at: data.endsOn ? endOfNewYorkDay(data.endsOn) : null,
    };
    const client = await db();
    const result = data.id
      ? await client.from("deals").update(row).eq("id", data.id).select("id").maybeSingle()
      : await client.from("deals").insert(row).select("id").single();
    if (result.error || !result.data) {
      console.error("[saveDeal] failed", result.error);
      return {
        ok: false,
        message: data.id ? "Couldn't find that deal." : "Couldn't save the deal.",
      };
    }

    const { logActivity } = await activity();
    await logActivity(who, {
      action: data.id ? "deal.updated" : "deal.created",
      entity: "deal",
      entityId: result.data.id,
      summary: `${data.id ? "Updated" : "Added"} deal ${row.origin}-${row.destination} ${row.airline} ${row.cabin_class} at ${money(row.price, row.currency)}${data.endsOn ? `, ends ${data.endsOn}` : ""}`,
    });
    return { ok: true, id: result.data.id };
  });

const dealIdSchema = z.object({ id: z.string().uuid() });

/** Ends a deal now: it disappears from the Deals page but stays in the admin list. */
export const endDeal = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => dealIdSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: true } | Failure> => {
    const who = await actor();
    if (!who) return NOT_SIGNED_IN;
    if (!canManageDeals(who.role)) return NOT_ALLOWED;
    const { data: row, error } = await (
      await db()
    )
      .from("deals")
      .update({ expires_at: new Date().toISOString() })
      .eq("id", data.id)
      .select("origin, destination, airline")
      .maybeSingle();
    if (error || !row) return { ok: false, message: "Couldn't end that deal." };
    const { logActivity } = await activity();
    await logActivity(who, {
      action: "deal.ended",
      entity: "deal",
      entityId: data.id,
      summary: `Ended deal ${row.origin}-${row.destination} ${row.airline}`,
    });
    return { ok: true };
  });

export const deleteDeal = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => dealIdSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: true } | Failure> => {
    const who = await actor();
    if (!who) return NOT_SIGNED_IN;
    if (!canManageDeals(who.role)) return NOT_ALLOWED;
    const { data: row, error } = await (
      await db()
    )
      .from("deals")
      .delete()
      .eq("id", data.id)
      .select("origin, destination, airline")
      .maybeSingle();
    if (error || !row) return { ok: false, message: "Couldn't delete that deal." };
    const { logActivity } = await activity();
    await logActivity(who, {
      action: "deal.deleted",
      entity: "deal",
      entityId: data.id,
      summary: `Deleted deal ${row.origin}-${row.destination} ${row.airline}`,
    });
    return { ok: true };
  });

/* ------------------------------ booking extras ------------------------------ */

export type BookingOps =
  | {
      ok: true;
      tickets: TicketRow[];
      refunds: RefundRow[];
      /** False until the refunds migration has been applied to this database. */
      refundsReady: boolean;
      passengerCount: number;
    }
  | Failure;

/** Tickets, refunds and passenger count for one booking (the details drawer). */
export const getBookingOps = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ bookingId: z.string().uuid() }).parse(data))
  .handler(async ({ data }): Promise<BookingOps> => {
    if (!(await actor())) return NOT_SIGNED_IN;
    const client = await db();
    const { isMissingTable } = await activity();
    const [tickets, refunds, passengers] = await Promise.all([
      client
        .from("tickets")
        .select("id, ticket_number, pnr_code, supplier, base_fare, commission, created_at")
        .eq("booking_id", data.bookingId)
        .order("created_at"),
      client
        .from("refunds")
        .select("*")
        .eq("booking_id", data.bookingId)
        .order("created_at", { ascending: false }),
      client
        .from("passengers")
        .select("id", { count: "exact", head: true })
        .eq("booking_id", data.bookingId),
    ]);
    if (tickets.error) {
      console.error("[getBookingOps] tickets", tickets.error);
      return { ok: false, message: "Couldn't load tickets." };
    }
    const refundsReady = !isMissingTable(refunds.error);
    if (refunds.error && refundsReady) console.error("[getBookingOps] refunds", refunds.error);
    return {
      ok: true,
      tickets: (tickets.data ?? []) as TicketRow[],
      refunds: (refunds.data ?? []) as RefundRow[],
      refundsReady,
      passengerCount: passengers.count ?? 0,
    };
  });

/* ---------------------------------- tickets -------------------------------- */

export const addTicket = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ticketSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: true } | Failure> => {
    const who = await actor();
    if (!who) return NOT_SIGNED_IN;
    const client = await db();

    const { data: booking } = await client
      .from("bookings")
      .select("pnr, status")
      .eq("id", data.bookingId)
      .maybeSingle();
    if (!booking) return { ok: false, message: "Booking not found." };
    if (booking.status === "refunded") {
      return { ok: false, message: "This booking has been refunded and is closed." };
    }

    // The same e-ticket can't be recorded twice, on this booking or another.
    const { data: dupe } = await client
      .from("tickets")
      .select("booking_id")
      .eq("ticket_number", data.ticketNumber)
      .limit(1)
      .maybeSingle();
    if (dupe) {
      const where =
        dupe.booking_id === data.bookingId ? "this booking" : await bookingLabel(dupe.booking_id);
      return { ok: false, message: `Ticket ${data.ticketNumber} is already recorded on ${where}.` };
    }

    const { error } = await client.from("tickets").insert({
      booking_id: data.bookingId,
      ticket_number: data.ticketNumber,
      pnr_code: data.airlinePnr,
      supplier: data.supplier || null,
      base_fare: toCents(data.baseFare),
      commission: toCents(data.commission),
    });
    if (error) {
      console.error("[addTicket] failed", error);
      return { ok: false, message: "Couldn't save the ticket." };
    }
    const { logActivity } = await activity();
    await logActivity(who, {
      action: "ticket.added",
      entity: "ticket",
      entityId: data.bookingId,
      summary: `Added e-ticket ${data.ticketNumber} to ${booking.pnr ?? "a booking"}`,
    });
    return { ok: true };
  });

export const removeTicket = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }): Promise<{ ok: true } | Failure> => {
    const who = await actor();
    if (!who) return NOT_SIGNED_IN;
    const client = await db();
    const { data: ticket } = await client
      .from("tickets")
      .select("booking_id, ticket_number")
      .eq("id", data.id)
      .maybeSingle();
    if (!ticket) return { ok: false, message: "Ticket not found." };

    const [{ data: booking }, { count }] = await Promise.all([
      client.from("bookings").select("pnr, status").eq("id", ticket.booking_id).maybeSingle(),
      client
        .from("tickets")
        .select("id", { count: "exact", head: true })
        .eq("booking_id", ticket.booking_id),
    ]);
    // A ticketed booking must keep at least one ticket on record.
    if (booking?.status === "issued" && (count ?? 0) <= 1) {
      return {
        ok: false,
        message:
          "This is the only ticket on a ticketed booking. Change the booking's status first.",
      };
    }

    const { error } = await client.from("tickets").delete().eq("id", data.id);
    if (error) {
      console.error("[removeTicket] failed", error);
      return { ok: false, message: "Couldn't remove the ticket." };
    }
    const { logActivity } = await activity();
    await logActivity(who, {
      action: "ticket.removed",
      entity: "ticket",
      entityId: ticket.booking_id,
      summary: `Removed e-ticket ${ticket.ticket_number ?? ""} from ${booking?.pnr ?? "a booking"}`,
    });
    return { ok: true };
  });

/* ---------------------------------- refunds -------------------------------- */

export const requestRefund = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => refundRequestSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: true } | Failure> => {
    const who = await actor();
    if (!who) return NOT_SIGNED_IN;
    const client = await db();
    const { isMissingTable, logActivity } = await activity();

    const { data: booking } = await client
      .from("bookings")
      .select("pnr, status, total_price, currency")
      .eq("id", data.bookingId)
      .maybeSingle();
    if (!booking) return { ok: false, message: "Booking not found." };
    if (booking.status === "refunded")
      return { ok: false, message: "This booking is already refunded." };
    if (toCents(data.farePaid) > toCents(Number(booking.total_price))) {
      return {
        ok: false,
        message: `The fare paid can't be more than the booking total (${money(Number(booking.total_price), booking.currency)}).`,
      };
    }

    const open = await client
      .from("refunds")
      .select("id")
      .eq("booking_id", data.bookingId)
      .in("status", ["requested", "filed", "paid"])
      .limit(1)
      .maybeSingle();
    if (isMissingTable(open.error)) return MIGRATION_NEEDED;
    if (open.data) return { ok: false, message: "This booking already has a refund in progress." };

    const amount = refundAmount(data);
    const { data: created, error } = await client
      .from("refunds")
      .insert({
        booking_id: data.bookingId,
        status: "requested",
        currency: booking.currency,
        fare_paid: toCents(data.farePaid),
        airline_penalty: toCents(data.airlinePenalty),
        non_refundable_taxes: toCents(data.nonRefundableTaxes),
        service_fee: toCents(data.serviceFee),
        refund_amount: amount,
        reason: data.reason,
        requested_by: who.email || "admin",
      })
      .select("id")
      .single();
    if (error || !created) {
      console.error("[requestRefund] failed", error);
      // 23505: another refund for this booking was opened at the same moment.
      return {
        ok: false,
        message:
          error?.code === "23505"
            ? "This booking already has a refund in progress."
            : "Couldn't save the refund.",
      };
    }
    await logActivity(who, {
      action: "refund.requested",
      entity: "refund",
      entityId: created.id,
      summary: `Opened a refund of ${money(amount, booking.currency)} for ${booking.pnr ?? "a booking"}`,
    });
    return { ok: true };
  });

/** Moves a refund on: filed with the airline, paid to the customer, or rejected. */
export const advanceRefund = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => refundStepSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: true } | Failure> => {
    const who = await actor();
    if (!who) return NOT_SIGNED_IN;
    if ((data.to === "paid" || data.to === "rejected") && !canSettleRefunds(who.role)) {
      return { ok: false, message: "Only a manager can mark a refund paid or rejected." };
    }
    const client = await db();
    const { isMissingTable, logActivity } = await activity();

    const current = await client
      .from("refunds")
      .select("status, booking_id, airline_reference, refund_amount, currency, notes")
      .eq("id", data.id)
      .maybeSingle();
    if (isMissingTable(current.error)) return MIGRATION_NEEDED;
    const refund = current.data;
    if (!refund) return { ok: false, message: "Refund not found." };

    // Already there (a double click, or someone just did it): change nothing, log nothing.
    if (refund.status === data.to) return { ok: true };

    const reference = data.airlineReference || refund.airline_reference;
    const stepError = refundStepError(refund.status as RefundStatus, data.to, reference);
    if (stepError) return { ok: false, message: stepError };

    const now = new Date().toISOString();
    const patch: {
      status: RefundStatus;
      airline_reference?: string | null;
      notes?: string | null;
      filed_at?: string;
      paid_at?: string;
      closed_by?: string;
    } = { status: data.to };
    if (data.airlineReference) patch.airline_reference = data.airlineReference;
    if (data.notes) patch.notes = refund.notes ? `${refund.notes}\n${data.notes}` : data.notes;
    if (data.to === "filed") patch.filed_at = now;
    if (data.to === "paid") patch.paid_at = now;
    if (data.to === "paid" || data.to === "rejected") patch.closed_by = who.email || "admin";

    // Only update from the status we checked, so two people can't both move it on.
    const { data: updated, error } = await client
      .from("refunds")
      .update(patch)
      .eq("id", data.id)
      .eq("status", refund.status)
      .select("id")
      .maybeSingle();
    if (error) {
      console.error("[advanceRefund] failed", error);
      return { ok: false, message: "Couldn't update the refund." };
    }
    if (!updated)
      return { ok: false, message: "Someone else just updated this refund. Reload and try again." };

    if (data.to === "paid") {
      const { error: bookingError } = await client
        .from("bookings")
        .update({ status: "refunded" })
        .eq("id", refund.booking_id);
      if (bookingError) console.error("[advanceRefund] booking status", bookingError);
    }

    const pnr = await bookingLabel(refund.booking_id);
    const verb = { filed: "Filed", paid: "Paid", rejected: "Rejected" }[data.to];
    await logActivity(who, {
      action: `refund.${data.to}`,
      entity: "refund",
      entityId: data.id,
      summary: `${verb} the ${money(Number(refund.refund_amount), refund.currency)} refund for ${pnr}${data.to === "filed" ? ` (airline ref ${reference})` : ""}`,
    });
    return { ok: true };
  });

/** Refunds still in progress, oldest first, for the refunds queue. */
export const listOpenRefunds = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ ok: true; ready: boolean; rows: RefundListRow[] } | Failure> => {
    if (!(await actor())) return NOT_SIGNED_IN;
    const client = await db();
    const { isMissingTable } = await activity();
    const { data, error } = await client
      .from("refunds")
      .select("*")
      .in("status", ["requested", "filed"])
      .order("created_at")
      .limit(200);
    if (isMissingTable(error)) return { ok: true, ready: false, rows: [] };
    if (error) {
      console.error("[listOpenRefunds] failed", error);
      return { ok: false, message: "Couldn't load refunds." };
    }
    const rows = (data ?? []) as RefundRow[];
    const ids = [...new Set(rows.map((r) => r.booking_id))];
    const { data: bookings } = ids.length
      ? await client.from("bookings").select("id, pnr, lead_name").in("id", ids)
      : { data: [] as { id: string; pnr: string | null; lead_name: string | null }[] };
    const byId = new Map((bookings ?? []).map((b) => [b.id, b]));
    return {
      ok: true,
      ready: true,
      rows: rows.map((r) => ({
        ...r,
        pnr: byId.get(r.booking_id)?.pnr ?? null,
        lead_name: byId.get(r.booking_id)?.lead_name ?? null,
      })),
    };
  },
);

/* --------------------------------- activity -------------------------------- */

export const listActivity = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ ok: true; ready: boolean; rows: ActivityRow[] } | Failure> => {
    const who = await actor();
    if (!who) return NOT_SIGNED_IN;
    if (!canViewActivity(who.role)) return NOT_ALLOWED;
    const { isMissingTable } = await activity();
    const { data, error } = await (
      await db()
    )
      .from("admin_activity")
      .select("id, created_at, staff_email, staff_role, action, entity, entity_id, summary")
      .order("created_at", { ascending: false })
      .limit(200);
    if (isMissingTable(error)) return { ok: true, ready: false, rows: [] };
    if (error) {
      console.error("[listActivity] failed", error);
      return { ok: false, message: "Couldn't load the activity log." };
    }
    return { ok: true, ready: true, rows: (data ?? []) as ActivityRow[] };
  },
);
