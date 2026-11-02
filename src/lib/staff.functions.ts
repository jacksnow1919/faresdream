import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type StaffRole = "agent" | "manager" | "superadmin";

export type StaffRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: StaffRole;
  active: boolean;
  created_at: string;
  last_login_at: string | null;
};

export type StaffListResult =
  | { authorized: false; rows: [] }
  | { authorized: true; rows: StaffRow[] };

export type RevealAuditRow = {
  id: string;
  staff_email: string;
  staff_role: string;
  booking_id: string | null;
  remarks: string;
  created_at: string;
};

/* ------------------------------ staff CRUD -------------------------------- */

export const listStaff = createServerFn({ method: "GET" }).handler(
  async (): Promise<StaffListResult> => {
    const { getAdminActor } = await import("./admin-session.server");
    const actor = await getAdminActor();
    if (!actor || actor.role !== "superadmin") return { authorized: false, rows: [] };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("staff_users")
      .select("id, email, full_name, role, active, created_at, last_login_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[listStaff] failed", error);
      throw new Error("Could not load staff accounts.");
    }
    return { authorized: true, rows: (data ?? []) as StaffRow[] };
  },
);

export const createStaff = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        email: z.string().trim().email().max(160),
        fullName: z.string().trim().max(160).optional(),
        password: z.string().min(8).max(200),
        role: z.enum(["agent", "manager", "superadmin"]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { getAdminActor } = await import("./admin-session.server");
    const actor = await getAdminActor();
    if (!actor || actor.role !== "superadmin") return { ok: false as const, message: "Forbidden." };

    const { hashPassword } = await import("./staff-auth.server");
    const { hash, salt } = await hashPassword(data.password);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("staff_users").insert({
      email: data.email.toLowerCase(),
      full_name: data.fullName || null,
      password_hash: hash,
      password_salt: salt,
      role: data.role,
    });

    if (error) {
      console.error("[createStaff] failed", error.message);
      return {
        ok: false as const,
        message: error.code === "23505" ? "That email already has an account." : "Could not create the account.",
      };
    }
    const { logActivity } = await import("./admin-activity.server");
    await logActivity(actor, {
      action: "staff.created",
      entity: "staff",
      summary: `Created ${data.role} account for ${data.email.toLowerCase()}`,
    });
    return { ok: true as const, message: "" };
  });

export const updateStaff = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        role: z.enum(["agent", "manager", "superadmin"]).optional(),
        active: z.boolean().optional(),
        password: z.string().min(8).max(200).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { getAdminActor } = await import("./admin-session.server");
    const actor = await getAdminActor();
    if (!actor || actor.role !== "superadmin") return { ok: false as const };

    const patch: {
      role?: "agent" | "manager" | "superadmin";
      active?: boolean;
      password_hash?: string;
      password_salt?: string;
    } = {};
    if (data.role) patch.role = data.role;
    if (typeof data.active === "boolean") patch.active = data.active;
    if (data.password) {
      const { hashPassword } = await import("./staff-auth.server");
      const { hash, salt } = await hashPassword(data.password);
      patch.password_hash = hash;
      patch.password_salt = salt;
    }

    if (Object.keys(patch).length === 0) return { ok: true as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: updated, error } = await supabaseAdmin
      .from("staff_users")
      .update(patch)
      .eq("id", data.id)
      .select("email")
      .maybeSingle();
    if (error) {
      console.error("[updateStaff] failed", error);
      throw new Error("Could not update the staff account.");
    }
    const changes = [
      data.role ? `role to ${data.role}` : "",
      typeof data.active === "boolean" ? (data.active ? "reactivated" : "deactivated") : "",
      data.password ? "password reset" : "",
    ].filter(Boolean);
    const { logActivity } = await import("./admin-activity.server");
    await logActivity(actor, {
      action: "staff.updated",
      entity: "staff",
      entityId: data.id,
      summary: `Updated ${updated?.email ?? "a staff account"}: ${changes.join(", ")}`,
    });
    return { ok: true as const };
  });

/* --------------------------- verification gate ----------------------------- */

export const setBookingVerification = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "verified", "rejected"]),
        remarks: z.string().trim().min(3).max(2000),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { getAdminActor } = await import("./admin-session.server");
    const { canVerify } = await import("./staff-auth.server");
    const actor = await getAdminActor();
    if (!actor || !canVerify(actor.role)) {
      return { ok: false as const, message: "Your role cannot verify bookings." };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .update({
        verification_status: data.status,
        verification_remarks: data.remarks,
        verified_by: actor.email,
        verified_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .select("pnr")
      .maybeSingle();

    if (error) {
      console.error("[setBookingVerification] failed", error);
      throw new Error("Could not update the verification state.");
    }
    const { logActivity } = await import("./admin-activity.server");
    await logActivity(actor, {
      action: "booking.verification",
      entity: "booking",
      entityId: data.id,
      summary: `Marked ${booking?.pnr ?? "a booking"} ${data.status}: ${data.remarks}`,
    });
    return { ok: true as const, message: "" };
  });

export const captureFunds = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { getAdminActor } = await import("./admin-session.server");
    const { canCapture } = await import("./staff-auth.server");
    const actor = await getAdminActor();
    if (!actor || !canCapture(actor.role)) {
      return { ok: false as const, message: "Your role cannot capture funds." };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: booking } = await supabaseAdmin
      .from("bookings")
      .select("id, verification_status, captured_at")
      .eq("id", data.id)
      .maybeSingle();

    if (!booking) return { ok: false as const, message: "Booking not found." };
    if (booking.verification_status !== "verified") {
      return { ok: false as const, message: "This booking must be verified before capture." };
    }
    if (booking.captured_at) return { ok: false as const, message: "Funds already captured." };

    const now = new Date().toISOString();
    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ captured_at: now, captured_by: actor.email })
      .eq("id", data.id);
    if (error) {
      console.error("[captureFunds] failed", error);
      throw new Error("Could not capture the funds.");
    }

    await supabaseAdmin
      .from("payments")
      .update({ status: "captured" })
      .eq("booking_id", data.id);

    const { data: captured } = await supabaseAdmin
      .from("bookings")
      .select("pnr")
      .eq("id", data.id)
      .maybeSingle();
    const { logActivity } = await import("./admin-activity.server");
    await logActivity(actor, {
      action: "booking.captured",
      entity: "booking",
      entityId: data.id,
      summary: `Captured funds for ${captured?.pnr ?? "a booking"}`,
    });
    return { ok: true as const, message: "" };
  });

/* ---------------------- audited break-glass reveal ------------------------- */

export const revealBookingCard = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        bookingId: z.string().uuid(),
        remarks: z.string().trim().min(10).max(2000),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { getAdminActor } = await import("./admin-session.server");
    const { canReveal } = await import("./staff-auth.server");
    const actor = await getAdminActor();
    if (!actor || !canReveal(actor.role)) {
      return { ok: false as const, message: "Your role cannot reveal card details.", card: null };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("vaulted_cards")
      .select("id, cardholder_name, brand, last4, exp_month, exp_year, ciphertext, iv")
      .eq("booking_id", data.bookingId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!row) return { ok: false as const, message: "No vaulted card for this booking.", card: null };

    const { decryptSecret } = await import("./card-vault.server");
    const number = await decryptSecret(row.ciphertext, row.iv);

    await supabaseAdmin.from("card_reveal_audit").insert({
      staff_id: actor.staffId,
      staff_email: actor.email,
      staff_role: actor.role,
      booking_id: data.bookingId,
      vaulted_card_id: row.id,
      remarks: data.remarks,
    });
    const { logActivity } = await import("./admin-activity.server");
    await logActivity(actor, {
      action: "card.revealed",
      entity: "booking",
      entityId: data.bookingId,
      summary: `Revealed the full card number for a booking: ${data.remarks}`,
    });

    return {
      ok: true as const,
      message: "",
      card: {
        cardholderName: row.cardholder_name,
        brand: row.brand,
        last4: row.last4,
        expMonth: row.exp_month,
        expYear: row.exp_year,
        number,
      },
    };
  });

export const listRevealAudit = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminActor } = await import("./admin-session.server");
  const actor = await getAdminActor();
  if (!actor) return { authorized: false as const, rows: [] as RevealAuditRow[] };

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("card_reveal_audit")
    .select("id, staff_email, staff_role, booking_id, remarks, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return { authorized: true as const, rows: (data ?? []) as RevealAuditRow[] };
});
