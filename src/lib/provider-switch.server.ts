/**
 * Pause and resume for the flight APIs, saved in `provider_switches` so a change reaches
 * every server straight away with no deploy. Reading fails open: a database problem or a
 * missing table must never stop customers searching.
 */
import { isMissingTable } from "./admin-activity.server";
import { isPausedNow, type ProviderKey, type ProviderSwitch } from "./flight-providers";

async function db() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}

export async function readProviderSwitches(): Promise<{
  ready: boolean;
  switches: Partial<Record<ProviderKey, ProviderSwitch>>;
}> {
  const switches: Partial<Record<ProviderKey, ProviderSwitch>> = {};
  try {
    const { data, error } = await (
      await db()
    )
      .from("provider_switches")
      .select("provider, paused, paused_until, paused_at, paused_by, reason");
    if (error) {
      if (!isMissingTable(error)) console.error("[provider-switch] read failed", error);
      return { ready: false, switches };
    }
    for (const { provider, ...sw } of data ?? []) switches[provider as ProviderKey] = sw;
    return { ready: true, switches };
  } catch (err) {
    console.error("[provider-switch] read threw", err);
    return { ready: false, switches };
  }
}

export async function isProviderPaused(key: ProviderKey): Promise<boolean> {
  const { switches } = await readProviderSwitches();
  return isPausedNow(switches[key]);
}

/** Returns false when the table isn't there yet; throws on any other database failure. */
export async function writeProviderSwitch(key: ProviderKey, sw: ProviderSwitch): Promise<boolean> {
  const { error } = await (
    await db()
  )
    .from("provider_switches")
    .upsert({ provider: key, ...sw, updated_at: new Date().toISOString() });
  if (isMissingTable(error)) return false;
  if (error) throw error;
  return true;
}
