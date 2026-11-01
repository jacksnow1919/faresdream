import { createFileRoute, redirect } from "@tanstack/react-router";
import { parseFlightSearch } from "@/lib/flight-search-params";

/**
 * Payment happens on the booking page's last step; this old standalone page only forwards
 * visitors (with their flight details) to it.
 */
export const Route = createFileRoute("/flight/payment")({
  validateSearch: parseFlightSearch,
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/flight/booking", search, replace: true });
  },
});
