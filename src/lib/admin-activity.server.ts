import type { AdminActor } from "./admin-session.server";

export type ActivityEntity =
  "booking" | "ticket" | "refund" | "deal" | "lead" | "staff" | "verification" | "provider";

/** True when Postgres/PostgREST says the table doesn't exist (migration not applied yet). */
export function isMissingTable(error: { code?: string; message?: string } | null | undefined) {
  if (!error) return false;
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    /could not find the table|does not exist/i.test(error.message ?? "")
  );
}

/**
 * Records an admin action in admin_activity. Never throws: a failed log line must not
 * undo or block the action itself, so errors are only reported to the server log.
 */
export async function logActivity(
  actor: AdminActor,
  entry: { action: string; entity: ActivityEntity; entityId?: string | null; summary: string },
) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("admin_activity").insert({
      staff_id: actor.staffId,
      staff_email: actor.email || "admin",
      staff_role: actor.role,
      action: entry.action,
      entity: entry.entity,
      entity_id: entry.entityId ?? null,
      summary: entry.summary.slice(0, 500),
    });
    if (error && !isMissingTable(error)) console.error("[logActivity] insert failed", error);
  } catch (err) {
    console.error("[logActivity] threw", err);
  }
}
