import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/* ---------------------------------- types --------------------------------- */

export type CrmLeadRow = {
  id: string;
  kind: "quote" | "corporate";
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  route: string;
  cabin: string | null;
  notes: string | null;
  crm_status: string;
  admin_notes: string | null;
};

export type CrmLeadsResult =
  | { authorized: false; rows: [] }
  | { authorized: true; rows: CrmLeadRow[] };

export type VerificationRow = {
  id: string;
  booking_id: string | null;
  token: string;
  customer_name: string | null;
  customer_email: string | null;
  status: string;
  expires_at: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  created_at: string;
  id_front_path: string | null;
  id_back_path: string | null;
  selfie_path: string | null;
  has_card: boolean;
};

export type VerificationsResult =
  | { authorized: false; rows: [] }
  | { authorized: true; rows: VerificationRow[] };

/* ---------------------------------- leads --------------------------------- */

export const getAdminLeads = createServerFn({ method: "GET" }).handler(
  async (): Promise<CrmLeadsResult> => {
    const { isAdminRequest } = await import("./admin-session.server");
    if (!(await isAdminRequest())) return { authorized: false, rows: [] };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [fare, corporate] = await Promise.all([
      supabaseAdmin
        .from("fare_leads")
        .select(
          "id, created_at, full_name, company, email, phone, origin, destination, cabin, notes, crm_status, admin_notes",
        )
        .order("created_at", { ascending: false })
        .limit(300),
      supabaseAdmin
        .from("corporate_leads")
        .select(
          "id, created_at, contact_name, company, email, phone, routes, notes, crm_status, admin_notes",
        )
        .order("created_at", { ascending: false })
        .limit(300),
    ]);

    if (fare.error) console.error("[getAdminLeads] fare leads", fare.error);
    if (corporate.error) console.error("[getAdminLeads] corporate leads", corporate.error);

    const rows: CrmLeadRow[] = [
      ...(fare.data ?? []).map((l) => ({
        id: l.id,
        kind: "quote" as const,
        created_at: l.created_at,
        name: l.full_name ?? "",
        email: l.email,
        phone: l.phone,
        company: l.company,
        route: [l.origin, l.destination].filter(Boolean).join(" → "),
        cabin: l.cabin,
        notes: l.notes,
        crm_status: (l as { crm_status?: string }).crm_status ?? "new",
        admin_notes: (l as { admin_notes?: string | null }).admin_notes ?? null,
      })),
      ...(corporate.data ?? []).map((l) => ({
        id: l.id,
        kind: "corporate" as const,
        created_at: l.created_at,
        name: l.contact_name,
        email: l.email,
        phone: l.phone,
        company: l.company,
        route: l.routes ?? "",
        cabin: null,
        notes: l.notes,
        crm_status: (l as { crm_status?: string }).crm_status ?? "new",
        admin_notes: (l as { admin_notes?: string | null }).admin_notes ?? null,
      })),
    ].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

    return { authorized: true, rows };
  },
);

export const updateLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        kind: z.enum(["quote", "corporate"]),
        crm_status: z.enum(["new", "contacted", "converted", "closed"]),
        admin_notes: z.string().max(4000).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { getAdminActor } = await import("./admin-session.server");
    const actor = await getAdminActor();
    if (!actor) return { ok: false as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const table = data.kind === "quote" ? "fare_leads" : "corporate_leads";
    const { data: lead, error } = await supabaseAdmin
      .from(table)
      .update({ crm_status: data.crm_status, admin_notes: data.admin_notes ?? null })
      .eq("id", data.id)
      .select("email")
      .maybeSingle();

    if (error) {
      console.error("[updateLead] failed", error);
      throw new Error("Could not update the lead.");
    }
    const { logActivity } = await import("./admin-activity.server");
    await logActivity(actor, {
      action: "lead.updated",
      entity: "lead",
      entityId: data.id,
      summary: `Set lead ${lead?.email ?? ""} to ${data.crm_status}`,
    });
    return { ok: true as const };
  });

/* ----------------------------- verification ------------------------------- */

function makeToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export const createVerificationRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        bookingId: z.string().uuid().nullable().optional(),
        customerName: z.string().max(160).optional(),
        customerEmail: z.string().max(160).optional(),
        expiresInHours: z.number().int().min(1).max(336).default(72),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { getAdminActor } = await import("./admin-session.server");
    const actor = await getAdminActor();
    if (!actor) return { ok: false as const, token: "" };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const token = makeToken();
    const expires = new Date(Date.now() + data.expiresInHours * 3600_000).toISOString();

    const { error } = await supabaseAdmin.from("verification_requests").insert({
      booking_id: data.bookingId ?? null,
      token,
      customer_name: data.customerName ?? null,
      customer_email: data.customerEmail ?? null,
      status: "pending",
      expires_at: expires,
    });

    if (error) {
      console.error("[createVerificationRequest] failed", error);
      throw new Error("Could not create the verification link.");
    }
    const { logActivity } = await import("./admin-activity.server");
    await logActivity(actor, {
      action: "verification.created",
      entity: "verification",
      entityId: data.bookingId ?? null,
      summary: `Sent an ID verification link to ${data.customerEmail || data.customerName || "a customer"}`,
    });
    return { ok: true as const, token };
  });

export const getVerificationRequests = createServerFn({ method: "GET" }).handler(
  async (): Promise<VerificationsResult> => {
    const { isAdminRequest } = await import("./admin-session.server");
    if (!(await isAdminRequest())) return { authorized: false, rows: [] };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("verification_requests")
      .select(
        "id, booking_id, token, customer_name, customer_email, status, expires_at, submitted_at, reviewed_at, created_at, id_front_path, id_back_path, selfie_path",
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("[getVerificationRequests] failed", error);
      throw new Error("Could not load verification requests.");
    }

    const ids = (data ?? []).map((r) => r.id);
    const cards = ids.length
      ? await supabaseAdmin
          .from("vaulted_cards")
          .select("verification_request_id")
          .in("verification_request_id", ids)
      : { data: [] as { verification_request_id: string | null }[], error: null };

    const withCard = new Set((cards.data ?? []).map((c) => c.verification_request_id));

    return {
      authorized: true,
      rows: (data ?? []).map((r) => ({ ...r, has_card: withCard.has(r.id) })),
    };
  },
);

export const reviewVerification = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "submitted", "verified", "rejected"]),
        adminNotes: z.string().max(2000).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { getAdminActor } = await import("./admin-session.server");
    const actor = await getAdminActor();
    if (!actor) return { ok: false as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: request, error } = await supabaseAdmin
      .from("verification_requests")
      .update({
        status: data.status,
        admin_notes: data.adminNotes ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .select("customer_email, customer_name")
      .maybeSingle();

    if (error) {
      console.error("[reviewVerification] failed", error);
      throw new Error("Could not update the verification request.");
    }
    const { logActivity } = await import("./admin-activity.server");
    await logActivity(actor, {
      action: "verification.reviewed",
      entity: "verification",
      entityId: data.id,
      summary: `Marked ID verification for ${request?.customer_email || request?.customer_name || "a customer"} ${data.status}`,
    });
    return { ok: true as const };
  });

/** Short-lived signed URLs for the uploaded identity documents. */
export const getVerificationDocs = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { isAdminRequest } = await import("./admin-session.server");
    if (!(await isAdminRequest())) return { ok: false as const, urls: [] };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("verification_requests")
      .select("id_front_path, id_back_path, selfie_path")
      .eq("id", data.id)
      .maybeSingle();

    if (!row) return { ok: true as const, urls: [] };

    const entries: { label: string; path: string | null }[] = [
      { label: "ID front", path: row.id_front_path },
      { label: "ID back", path: row.id_back_path },
      { label: "Selfie with card", path: row.selfie_path },
    ];

    const urls: { label: string; url: string }[] = [];
    for (const e of entries) {
      if (!e.path) continue;
      const signed = await supabaseAdmin.storage
        .from("verification-docs")
        .createSignedUrl(e.path, 300);
      if (signed.data?.signedUrl) urls.push({ label: e.label, url: signed.data.signedUrl });
    }
    return { ok: true as const, urls };
  });

/** Decrypts a vaulted card for the admin console. Access is logged server-side. */
export const revealVaultedCard = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ verificationRequestId: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data }) => {
    const { getAdminActor } = await import("./admin-session.server");
    const actor = await getAdminActor();
    if (!actor) return { ok: false as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("vaulted_cards")
      .select("id, cardholder_name, brand, last4, exp_month, exp_year, ciphertext, iv")
      .eq("verification_request_id", data.verificationRequestId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!row) return { ok: true as const, card: null };

    const { decryptSecret } = await import("./card-vault.server");
    const number = await decryptSecret(row.ciphertext, row.iv);
    console.warn("[revealVaultedCard] admin decrypted vaulted card", row.id);
    const { logActivity } = await import("./admin-activity.server");
    await logActivity(actor, {
      action: "card.revealed",
      entity: "verification",
      entityId: data.verificationRequestId,
      summary: "Revealed the full card number on an ID verification",
    });

    return {
      ok: true as const,
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
