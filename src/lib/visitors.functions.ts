import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { canViewVisitors } from "./admin-logic";
import {
  automatedReason,
  isVisitorId,
  VISITOR_EVENTS,
  type VisitorEventType,
} from "./visitor-events";

export type Failure = { ok: false; message: string };

export type VisitorRow = {
  visitor_id: string;
  visits: number;
  first_seen: string;
  last_seen: string;
  actions: number;
  searched: boolean;
  booked: boolean;
  landing: string | null;
  country: string | null;
};

export type VisitorPanel = {
  ok: true;
  /** False until the database update has run. */
  ready: boolean;
  summary: {
    visitors: number;
    returning: number;
    searched: number;
    booked: number;
    actions: number;
  };
  guard: {
    total: number;
    last_at: string | null;
    by_reason: { value: string; count: number }[];
    by_country: { value: string; count: number }[];
  };
  rows: VisitorRow[];
};

export type JourneyEvent = {
  occurred_at: string;
  visit_id: string;
  event_type: VisitorEventType;
  path: string | null;
  route: string | null;
  detail: Record<string, string | number | boolean> | null;
};

const ROW_LIMIT = 100;
const JOURNEY_LIMIT = 300;
const EMPTY_SUMMARY = { visitors: 0, returning: 0, searched: 0, booked: 0, actions: 0 };
const EMPTY_GUARD = { total: 0, last_at: null, by_reason: [], by_country: [] };

/* -------------------------------- recording --------------------------------- */

const eventSchema = z.object({
  visitorId: z.string().refine(isVisitorId),
  visitId: z.string().regex(/^[a-z0-9]{6,20}$/),
  type: z.enum(VISITOR_EVENTS),
  path: z.string().max(300).optional(),
  route: z.string().max(40).optional(),
  detail: z
    .record(z.string().max(30), z.union([z.string().max(80), z.number(), z.boolean()]))
    .refine((d) => Object.keys(d).length <= 8)
    .optional(),
});

/** Public by design: visitors have no login. Never throws, since tracking can't break a page. */
export const recordSiteEvent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => eventSchema.parse(data))
  .handler(async ({ data }) => {
    // Scripts and crawlers aren't visitors.
    if (automatedReason(getRequestHeader("user-agent"))) return { ok: true };
    try {
      const { requestCountry } = await import("./search-guard.server");
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("site_events").insert({
        visitor_id: data.visitorId,
        visit_id: data.visitId,
        event_type: data.type,
        path: data.path ?? null,
        route: data.route ?? null,
        detail: data.detail ?? null,
        country: requestCountry(),
      });
      const { isMissingTable } = await import("./admin-activity.server");
      if (error && !isMissingTable(error)) console.error("[recordSiteEvent] failed", error);
    } catch (error) {
      console.error("[recordSiteEvent] threw", error);
    }
    return { ok: true };
  });

/* ------------------------------- the admin panel ------------------------------ */

async function allowed(): Promise<Failure | null> {
  const { getAdminActor } = await import("./admin-session.server");
  const who = await getAdminActor();
  if (!who) return { ok: false, message: "Your session has expired. Sign in again." };
  if (!canViewVisitors(who.role)) return { ok: false, message: "Your role can't do this." };
  return null;
}

const missing = (error: { code?: string; message?: string } | null) =>
  !!error && (error.code === "PGRST202" || error.code === "PGRST205" || error.code === "42P01");

export const getVisitorPanel = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        since: z.string().datetime(),
        until: z.string().datetime(),
        search: z.string().trim().max(14).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<VisitorPanel | Failure> => {
    const failure = await allowed();
    if (failure) return failure;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const range = { p_since: data.since, p_until: data.until };
    const search = data.search?.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    const [summary, guard, rows] = await Promise.all([
      supabaseAdmin.rpc("visitor_summary", range),
      supabaseAdmin.rpc("search_guard_summary", range),
      supabaseAdmin.rpc("visitor_recent", {
        ...range,
        p_search: search || null,
        p_limit: ROW_LIMIT,
      }),
    ]);

    const error = summary.error ?? guard.error ?? rows.error;
    if (error && !missing(error)) {
      console.error("[getVisitorPanel] failed", error);
      return { ok: false, message: "Couldn't load visitors." };
    }
    return {
      ok: true,
      ready: !error,
      summary: (summary.data as VisitorPanel["summary"] | null) ?? EMPTY_SUMMARY,
      guard: (guard.data as VisitorPanel["guard"] | null) ?? EMPTY_GUARD,
      rows: (rows.data ?? []) as VisitorRow[],
    };
  });

export const getVisitorJourney = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ visitorId: z.string().refine(isVisitorId) }).parse(data),
  )
  .handler(async ({ data }): Promise<{ ok: true; events: JourneyEvent[] } | Failure> => {
    const failure = await allowed();
    if (failure) return failure;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: events, error } = await supabaseAdmin
      .from("site_events")
      .select("occurred_at, visit_id, event_type, path, route, detail")
      .eq("visitor_id", data.visitorId)
      .order("occurred_at", { ascending: false })
      .limit(JOURNEY_LIMIT);
    if (error) {
      console.error("[getVisitorJourney] failed", error);
      return { ok: false, message: "Couldn't load this visitor's journey." };
    }
    return { ok: true, events: ((events ?? []) as JourneyEvent[]).reverse() };
  });
