import { createFileRoute, redirect } from "@tanstack/react-router";
import { parseFlightSearch } from "@/lib/flight-search-params";

/**
 * Bookings finish on /flight/Confirm ("Booking received"); this old standalone page only
 * forwards visitors (with their flight details) there.
 */
export const Route = createFileRoute("/flight/confirmation")({
  validateSearch: parseFlightSearch,
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/flight/Confirm", search, replace: true });
  },
});
