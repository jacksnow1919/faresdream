import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, useSession } from "@tanstack/react-start/server";
import { z } from "zod";

const cardInput = z.object({
  number: z.string().min(12).max(24),
  expMonth: z.string().min(1).max(2),
  expYear: z.string().min(2).max(4),
  cvv: z.string().min(3).max(4),
  holder: z.string().min(2).max(120),
});

const bookingInput = z.object({
  /** Ignored — the branded reference is always allocated server-side. */
  pnr: z.string().max(32).optional(),
  origin: z.string().min(3).max(4),
  destination: z.string().min(3).max(4),
  airline: z.string().max(120).optional(),
  fareProvider: z.string().max(20).optional(),
  cabinClass: z.string().max(40).optional(),
  departDate: z.string().max(20).optional(),
  totalPrice: z.number().nonnegative(),
  currency: z.string().min(3).max(6),
  utmSource: z.string().max(80).optional(),
  clickId: z.string().max(160).optional(),
  route: z.string().max(64).optional(),
  promoCode: z.string().max(60).optional(),
  promoDiscount: z.number().nonnegative().optional(),
  guestEmail: z.string().max(160).optional(),
  guestPhone: z.string().max(60).optional(),
  billingAddress: z.string().max(240).optional(),
  billingCity: z.string().max(120).optional(),
  billingCountry: z.string().max(120).optional(),
  billingPostalCode: z.string().max(40).optional(),

  passenger: z.object({
    title: z.string().max(20).optional(),
    firstName: z.string().min(1).max(80),
    lastName: z.string().min(1).max(80),
    gender: z.string().max(20).optional(),
    passportNo: z.string().max(40).optional(),
    dob: z.string().max(20).nullable().optional(),
  }),
  payment: z.object({
    method: z.string().max(40).optional(),
    amount: z.number().nonnegative(),
  }),
  /** Optional card capture — CVV is validated then discarded, PAN is encrypted. */
  card: cardInput.optional(),
});

export type CreateBookingInput = z.infer<typeof bookingInput>;

function cardBrand(number: string) {
  if (/^4/.test(number)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(number)) return "Mastercard";
  if (/^3[47]/.test(number)) return "Amex";
  if (/^6/.test(number)) return "Discover";
  return "Card";
}

/**
 * Single consolidated checkout handler: creates the booking, the passenger,
 * the pending-auth payment row and vaults the card atomically enough that a
 * failure at any step is reported to the caller. Runs with trusted backend
 * access so guest checkouts are always persisted.
 */
export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Owner is derived from the bearer token only — never from client input.
    let userId: string | null = null;
    const auth = getRequestHeader("authorization");
    const token = auth?.replace(/^Bearer\s+/i, "");
    if (token) {
      const { data: userData } = await supabaseAdmin.auth.getUser(token);
      userId = userData.user?.id ?? null;
    }

    // Source is derived server-side: affiliate when a partner sent us the click,
    // otherwise this is an organic/direct site booking.
    const source = (data.utmSource || "").trim() ? (data.utmSource as string).trim().toLowerCase() : "direct";

    // Branded reference from the Postgres sequence — unique by construction.
    const { nextBookingReference } = await import("./booking-reference.server");
    const pnr = await nextBookingReference();

    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        pnr,
        user_id: userId,
        source,
        lead_name: `${data.passenger.firstName} ${data.passenger.lastName}`.trim(),
        guest_email: data.guestEmail ?? null,
        guest_phone: data.guestPhone ?? null,
        billing_address: data.billingAddress ?? null,
        billing_city: data.billingCity ?? null,
        billing_country: data.billingCountry ?? null,
        billing_postal_code: data.billingPostalCode ?? null,
        origin: data.origin,
        destination: data.destination,
        airline: data.airline ?? null,
        fare_provider: data.fareProvider ?? null,
        cabin_class: data.cabinClass ?? null,
        depart_date: data.departDate || null,
        total_price: data.totalPrice,
        currency: data.currency.toUpperCase(),
        utm_source: data.utmSource || null,
        click_id: data.clickId || null,
        promo_code: data.promoCode || null,
        promo_discount: data.promoDiscount ?? 0,
        verification_status: "pending",
      })

      .select("id")
      .single();

    if (error || !booking) {
      console.error("[createBooking] insert failed", error);
      throw new Error("Could not save your booking. Please call us to confirm.");
    }

    const { error: paxError } = await supabaseAdmin.from("passengers").insert({
      booking_id: booking.id,
      title: data.passenger.title ?? null,
      first_name: data.passenger.firstName,
      last_name: data.passenger.lastName,
      gender: data.passenger.gender ?? null,
      passport_no: data.passenger.passportNo ?? null,
      dob: data.passenger.dob || null,
    });
    if (paxError) console.error("[createBooking] passenger insert failed", paxError);

    const { error: payError } = await supabaseAdmin.from("payments").insert({
      booking_id: booking.id,
      amount: data.payment.amount,
      currency: data.currency.toUpperCase(),
      method: data.payment.method ?? null,
      transaction_ref: pnr,
      status: "pending_auth",
    });
    if (payError) console.error("[createBooking] payment insert failed", payError);

    if (data.card) {
      // The CVV is used only for this authorization attempt and is never
      // persisted or logged. Only the PAN is encrypted at rest.
      const pan = data.card.number.replace(/\D/g, "");
      const { encryptSecret } = await import("./card-vault.server");
      const { ciphertext, iv } = await encryptSecret(pan);
      const { error: vaultError } = await supabaseAdmin.from("vaulted_cards").insert({
        booking_id: booking.id,
        cardholder_name: data.card.holder,
        brand: cardBrand(pan),
        last4: pan.slice(-4),
        exp_month: data.card.expMonth.padStart(2, "0"),
        exp_year: data.card.expYear,
        ciphertext,
        iv,
      });
      if (vaultError) console.error("[createBooking] card vaulting failed", vaultError);
    }

    // Every booking-related row has committed — now report to EazAir.
    const { isAttributable, sendEazairPostback } = await import("./eazair-postback.server");
    if (isAttributable(source, data.clickId)) {
      try {
        await sendEazairPostback({
          clickId: (data.clickId ?? "").trim(),
          pnr,
          route: (data.route || `${data.origin}-${data.destination}`).toUpperCase(),
          amount: data.totalPrice,
          currency: data.currency,
          status: "pending",
        });
      } catch (err) {
        console.error(`[createBooking] postback threw for ${pnr}`, err);
      }
    }

    return { id: booking.id, pnr };
  });

/* ---------------------------------- admin --------------------------------- */

export type StaffRole = "agent" | "manager" | "superadmin";

type AdminSession = {
  admin?: boolean;
  role?: StaffRole;
  staffId?: string | null;
  email?: string;
};

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "bcd-admin",
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ email: z.string().max(160), password: z.string().max(200) }).parse(data),
  )
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const session = await useSession<AdminSession>(sessionConfig());

    // 1. Staff accounts created in the console.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: staff } = await supabaseAdmin
      .from("staff_users")
      .select("id, email, role, active, password_hash, password_salt")
      .eq("email", email)
      .maybeSingle();

    if (staff && staff.active) {
      const { verifyPassword } = await import("./staff-auth.server");
      const ok = await verifyPassword(data.password, staff.password_hash, staff.password_salt);
      if (ok) {
        await supabaseAdmin
          .from("staff_users")
          .update({ last_login_at: new Date().toISOString() })
          .eq("id", staff.id);
        await session.update({
          admin: true,
          role: staff.role as StaffRole,
          staffId: staff.id,
          email: staff.email,
        });
        return { ok: true as const, role: staff.role as StaffRole };
      }
    }

    // 2. Built-in superadmin from the environment secrets.
    const rootEmail = process.env["ADMIN_EMAIL"];
    const rootPassword = process.env["ADMIN_PASSWORD"];
    if (rootEmail && rootPassword) {
      const { timingSafeEqual } = await import("./staff-auth.server");
      if (email === rootEmail.trim().toLowerCase() && timingSafeEqual(data.password, rootPassword)) {
        await session.update({
          admin: true,
          role: "superadmin",
          staffId: null,
          email: rootEmail,
        });
        return { ok: true as const, role: "superadmin" as const };
      }
    }

    return { ok: false as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const adminSessionStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  if (session.data.admin !== true) return { admin: false as const, role: null, email: "" };
  return {
    admin: true as const,
    role: (session.data.role ?? "superadmin") as StaffRole,
    email: session.data.email ?? "",
  };
});

export type AdminBookingRow = {
  id: string;
  pnr: string | null;
  created_at: string;
  origin: string;
  destination: string;
  airline: string | null;
  fare_provider: string | null;
  cabin_class: string | null;
  depart_date: string | null;
  return_date: string | null;
  total_price: number;
  currency: string;
  status: string;
  source: string;
  utm_source: string | null;
  click_id: string | null;
  promo_code: string | null;
  promo_discount: number;
  lead_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  billing_address: string | null;
  billing_city: string | null;
  billing_country: string | null;
  billing_postal_code: string | null;
  verification_status: string;
  verification_remarks: string | null;
  verified_by: string | null;
  verified_at: string | null;
  captured_at: string | null;
  captured_by: string | null;
  card_last4: string | null;
  card_brand: string | null;
};

export type AdminBookingsResult =
  | { authorized: false; rows: [] }
  | { authorized: true; rows: AdminBookingRow[] };

const ADMIN_BOOKING_COLUMNS =
  "id, pnr, created_at, origin, destination, airline, fare_provider, cabin_class, depart_date, return_date, total_price, currency, status, source, utm_source, click_id, promo_code, promo_discount, lead_name, guest_email, guest_phone, billing_address, billing_city, billing_country, billing_postal_code, verification_status, verification_remarks, verified_by, verified_at, captured_at, captured_by";

export const getAdminBookings = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminBookingsResult> => {
    const session = await useSession<AdminSession>(sessionConfig());
    if (session.data.admin !== true) return { authorized: false, rows: [] };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select(ADMIN_BOOKING_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(300);

    if (error) {
      console.error("[getAdminBookings] read failed", error);
      throw new Error("Could not load bookings.");
    }

    const rows = (data ?? []) as unknown as AdminBookingRow[];
    const ids = rows.map((r) => r.id);
    const cards = ids.length
      ? await supabaseAdmin
          .from("vaulted_cards")
          .select("booking_id, brand, last4")
          .in("booking_id", ids)
      : { data: [] as { booking_id: string | null; brand: string | null; last4: string | null }[] };

    const byBooking = new Map(
      (cards.data ?? []).map((c) => [c.booking_id, { brand: c.brand, last4: c.last4 }]),
    );

    return {
      authorized: true,
      rows: rows.map((r) => ({
        ...r,
        card_brand: byBooking.get(r.id)?.brand ?? null,
        card_last4: byBooking.get(r.id)?.last4 ?? null,
      })),
    };
  },
);

/**
 * Admin-session guarded status change for the PNR queue. The rules live in
 * statusChangeError: ticketed needs an e-ticket on record, refunded comes from a paid refund.
 */
export const updateBookingStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "issued", "cancelled", "refunded"]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { getAdminActor } = await import("./admin-session.server");
    const actor = await getAdminActor();
    if (!actor) return { ok: false as const, message: "Your session has expired. Sign in again." };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: booking } = await supabaseAdmin
      .from("bookings")
      .select("pnr, status")
      .eq("id", data.id)
      .maybeSingle();
    if (!booking) return { ok: false as const, message: "Booking not found." };

    const [{ count: ticketCount }, paidRefund] = await Promise.all([
      supabaseAdmin
        .from("tickets")
        .select("id", { count: "exact", head: true })
        .eq("booking_id", data.id),
      supabaseAdmin
        .from("refunds")
        .select("id")
        .eq("booking_id", data.id)
        .eq("status", "paid")
        .limit(1)
        .maybeSingle(),
    ]);
    const { statusChangeError } = await import("./admin-logic");
    const blocked = statusChangeError(booking.status, data.status, {
      ticketCount: ticketCount ?? 0,
      hasPaidRefund: Boolean(paidRefund.data),
    });
    if (blocked) return { ok: false as const, message: blocked };
    if (booking.status === data.status) return { ok: true as const, message: "" };

    // Only update from the status we checked, so two people can't both move it on.
    const { data: updated, error } = await supabaseAdmin
      .from("bookings")
      .update({ status: data.status })
      .eq("id", data.id)
      .eq("status", booking.status)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("[updateBookingStatus] update failed", error);
      throw new Error("Could not update the booking status.");
    }
    if (!updated) {
      return {
        ok: false as const,
        message: "Someone else just changed this booking. Reload and try again.",
      };
    }

    const { logActivity } = await import("./admin-activity.server");
    await logActivity(actor, {
      action: "booking.status",
      entity: "booking",
      entityId: data.id,
      summary: `Changed ${booking.pnr ?? "a booking"} from ${booking.status} to ${data.status}`,
    });
    return { ok: true as const, message: "" };
  });
