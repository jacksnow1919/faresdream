/**
 * Mixpanel wrapper. Browser-only: every call no-ops during SSR so routes stay
 * isomorphic. The library is dynamically imported after hydration.
 */
import { recordVisitorEvent } from "./visitor-tracking";
import type { VisitorEventType } from "./visitor-events";

const TOKEN = "def37fc319d4408b68bf1d198a2ba53a";

/** The events that also appear on a visitor's journey. Props stay here: they can hold a PNR. */
const JOURNEY_EVENTS: Record<string, VisitorEventType> = {
  "Checkout Started": "booking_started",
  "Booking Completed": "booking_completed",
  "Desk Quote Requested": "quote_requested",
};

type Props = Record<string, unknown>;

let ready: Promise<typeof import("mixpanel-browser").default | null> | null = null;

const load = () => {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (!ready) {
    ready = import("mixpanel-browser")
      .then(({ default: mixpanel }) => {
        mixpanel.init(TOKEN, { track_pageview: true, persistence: "localStorage" });
        mixpanel.register({ site_domain: "faresdream.com" });
        return mixpanel;
      })
      .catch(() => null);
  }
  return ready;
};

/** Call once from the root layout, after hydration. */
export const initAnalytics = () => {
  void load().then((mp) => {
    if (!mp) return;
    const clickId = new URLSearchParams(window.location.search).get("click_id");
    if (clickId) mp.register({ click_id: clickId });
  });
};

export const track = (event: string, props?: Props) => {
  const journeyEvent = JOURNEY_EVENTS[event];
  if (journeyEvent) recordVisitorEvent(journeyEvent);
  void load().then((mp) => mp?.track(event, props));
};

export const registerSuperProps = (props: Props) => {
  void load().then((mp) => mp?.register(props));
};
