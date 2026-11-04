import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { canManageProviders } from "./admin-logic";
import {
  groupSearches,
  isPausedNow,
  PAUSE_OPTIONS,
  PROVIDER_KEYS,
  PROVIDERS,
  providerHealth,
  providerLabel,
  type ProviderHealth,
  type ProviderKey,
  type SearchLogRow,
  type SearchSummary,
} from "./flight-providers";

/* ---------------------------------- types --------------------------------- */

export type Failure = { ok: false; message: string };

export type ProviderPanelRow = {
  key: ProviderKey;
  label: string;
  health: ProviderHealth;
  /** Key names and whether each is set here. Values never leave the server. */
  keys: { name: string; set: boolean }[];
  /** Duffel only: a test token returns sample airline data, not real fares. */
  testMode: boolean;
  paused: boolean;
  pausedUntil: string | null;
  pausedAt: string | null;
  pausedBy: string | null;
  reason: string | null;
  lookups: number;
  withFares: number;
  failed: number;
  faresReturned: number;
  avgMs: number;
  lastFaresAt: string | null;
  lastErrorAt: string | null;
  lastError: string | null;
};

export type ProviderPanel = {
  ok: true;
  /** False until the database update has run; searching still works without it. */
  ready: boolean;
  days: 1 | 7 | 30;
  providers: ProviderPanelRow[];
  recent: SearchSummary[];
};

/* --------------------------------- helpers -------------------------------- */

const NOT_SIGNED_IN: Failure = { ok: false, message: "Your session has expired. Sign in again." };
const NOT_ALLOWED: Failure = { ok: false, message: "Your role can't do this." };

async function manager() {
  const { getAdminActor } = await import("./admin-session.server");
  const who = await getAdminActor();
  if (!who) return { who: null, failure: NOT_SIGNED_IN };
  if (!canManageProviders(who.role)) return { who: null, failure: NOT_ALLOWED };
  return { who, failure: null };
}

const missing = (error: { code?: string; message?: string } | null) =>
  !!error && (error.code === "PGRST202" || error.code === "PGRST205" || error.code === "42P01");

/* ---------------------------------- panel --------------------------------- */

export const getProviderPanel = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ days: z.union([z.literal(1), z.literal(7), z.literal(30)]) }).parse(data),
  )
  .handler(async ({ data }): Promise<ProviderPanel | Failure> => {
    const { failure } = await manager();
    if (failure) return failure;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { providerKeyStatus } = await import("./provider-search.server");
    const { readProviderSwitches } = await import("./provider-switch.server");

    const since = new Date(Date.now() - data.days * 86_400_000).toISOString();
    const [switches, stats, log] = await Promise.all([
      readProviderSwitches(),
      supabaseAdmin.rpc("provider_search_stats", { since }),
      supabaseAdmin
        .from("provider_searches")
        .select(
          "created_at, search_id, provider, origin, destination, depart_date, return_date, cabin, adults, status, fares, ms, message",
        )
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(150),
    ]);

    if ((stats.error && !missing(stats.error)) || (log.error && !missing(log.error))) {
      console.error("[getProviderPanel] failed", stats.error ?? log.error);
      return { ok: false, message: "Couldn't load the flight API figures." };
    }

    const providers = PROVIDER_KEYS.map((key): ProviderPanelRow => {
      const keys = providerKeyStatus(key);
      const sw = switches.switches[key];
      const paused = isPausedNow(sw);
      const row = (stats.data ?? []).find((s) => s.provider === key);
      const lastFaresAt = row?.last_fares_at ?? null;
      const lastErrorAt = row?.last_error_at ?? null;
      const lookups = Number(row?.lookups ?? 0);
      return {
        key,
        label: PROVIDERS[key].label,
        health: providerHealth({
          configured: keys.every((k) => k.set),
          paused,
          lookups,
          lastFaresAt,
          lastErrorAt,
        }),
        keys,
        testMode:
          key === "duffel" && !!process.env["DUFFEL_ACCESS_TOKEN"]?.startsWith("duffel_test_"),
        paused,
        pausedUntil: paused ? (sw?.paused_until ?? null) : null,
        pausedAt: paused ? (sw?.paused_at ?? null) : null,
        pausedBy: paused ? (sw?.paused_by ?? null) : null,
        reason: paused ? (sw?.reason ?? null) : null,
        lookups,
        withFares: Number(row?.with_fares ?? 0),
        failed: Number(row?.failed ?? 0),
        faresReturned: Number(row?.fares_returned ?? 0),
        avgMs: Number(row?.avg_ms ?? 0),
        lastFaresAt,
        lastErrorAt,
        lastError: row?.last_error ?? null,
      };
    });

    return {
      ok: true,
      ready: switches.ready && !stats.error && !log.error,
      days: data.days,
      providers,
      recent: groupSearches((log.data ?? []) as SearchLogRow[]),
    };
  });

/* ----------------------------- pause and resume ---------------------------- */

const pauseSchema = z.object({
  provider: z.enum(PROVIDER_KEYS),
  paused: z.boolean(),
  minutes: z
    .union([z.literal(60), z.literal(360), z.literal(1440)])
    .nullable()
    .optional(),
  reason: z.string().trim().max(200).optional(),
});

export const setProviderPause = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => pauseSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: true } | Failure> => {
    const { who, failure } = await manager();
    if (failure) return failure;

    const now = new Date();
    const until =
      data.paused && data.minutes ? new Date(now.getTime() + data.minutes * 60_000) : null;
    const reason = data.paused && data.reason ? data.reason : null;

    const { writeProviderSwitch } = await import("./provider-switch.server");
    try {
      const saved = await writeProviderSwitch(data.provider, {
        paused: data.paused,
        paused_until: until?.toISOString() ?? null,
        paused_at: data.paused ? now.toISOString() : null,
        paused_by: data.paused ? who.email || "admin" : null,
        reason,
      });
      if (!saved) {
        return { ok: false, message: "Pausing needs a one-time database update first." };
      }
    } catch (error) {
      console.error("[setProviderPause] failed", error);
      return { ok: false, message: "Couldn't save that. Try again." };
    }

    const { logActivity } = await import("./admin-activity.server");
    const label = providerLabel(data.provider);
    const option = PAUSE_OPTIONS.find((o) => o.minutes === data.minutes);
    const length = until ? ` for ${option?.label}` : " until resumed";
    await logActivity(who, {
      action: data.paused ? "provider_paused" : "provider_resumed",
      entity: "provider",
      summary: data.paused
        ? `Paused ${label}${length}${reason ? `: ${reason}` : ""}`
        : `Resumed ${label}`,
    });
    return { ok: true };
  });

/* ------------------------------- test a key -------------------------------- */

export type ProviderTestResult = { working: boolean; fares: number; ms: number; message: string };

export const testProvider = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ provider: z.enum(PROVIDER_KEYS) }).parse(data))
  .handler(async ({ data }): Promise<{ ok: true; result: ProviderTestResult } | Failure> => {
    const { failure } = await manager();
    if (failure) return failure;
    const { testProviderKey } = await import("./provider-search.server");
    return { ok: true, result: await testProviderKey(data.provider) };
  });
