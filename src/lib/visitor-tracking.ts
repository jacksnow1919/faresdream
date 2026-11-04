/**
 * Records what anonymous visitors do, for the admin Visitors section. Browser-only: every call
 * no-ops during SSR. The ID is a random code in the browser's storage, so it isn't tied to a
 * name or contact details, and nothing here can break a page.
 */
import { isLiveHost, newVisitorCode, trackablePath, type VisitorEventType } from "./visitor-events";
import { recordSiteEvent } from "./visitors.functions";

const VISITOR_KEY = "faresdream:visitor";
const VISIT_KEY = "faresdream:visit";
/** A new visit starts after this long with no activity. */
const VISIT_GAP_MS = 30 * 60_000;

function visitorId() {
  const saved = localStorage.getItem(VISITOR_KEY);
  if (saved) return saved;
  const id = `V-${newVisitorCode(crypto.getRandomValues(new Uint8Array(8)))}`;
  localStorage.setItem(VISITOR_KEY, id);
  return id;
}

function visitId() {
  const now = Date.now();
  const saved = JSON.parse(localStorage.getItem(VISIT_KEY) ?? "null") as {
    id: string;
    at: number;
  } | null;
  const id = saved && now - saved.at < VISIT_GAP_MS ? saved.id : now.toString(36) + "v";
  localStorage.setItem(VISIT_KEY, JSON.stringify({ id, at: now }));
  return id;
}

export function recordVisitorEvent(
  type: VisitorEventType,
  extra?: { route?: string; detail?: Record<string, string | number | boolean> },
) {
  if (typeof window === "undefined" || !isLiveHost(window.location.hostname)) return;
  try {
    const path = trackablePath(window.location.pathname);
    if (path === null) return;
    void recordSiteEvent({
      data: { visitorId: visitorId(), visitId: visitId(), type, path, ...extra },
    }).catch(() => undefined);
  } catch {
    /* storage unavailable: this visitor just isn't recorded */
  }
}

/** Counts clicks on any phone link on the site. Returns the cleanup for an effect. */
export function watchCallClicks() {
  const onClick = (e: MouseEvent) => {
    const link = (e.target as Element | null)?.closest?.('a[href^="tel:"]');
    if (link) recordVisitorEvent("call_clicked");
  };
  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}
