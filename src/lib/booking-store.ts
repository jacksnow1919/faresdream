import { createBooking } from "./bookings.functions";
import { getAffiliateRoute } from "./click-id";
import type { FlightSearch } from "./flight-search-params";



export type BookingRecord = {
  bookingId: string;
  bookingDate: string;
  title: string;
  firstName: string;
  lastName: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  gender: string;
  passportNo: string;
  passportExpiry: string;
  nationality: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  postalCode: string;
  passengers: number;
  /** Card data is never collected or stored — Stripe Elements handles it. */

  flight: FlightSearch;
  total: number;
  utmSource: string;
  clickId: string;
  promoCode: string;
  promoDiscount: number;
};


const KEY = "bcd:last-booking";

/**
 * Placeholder only. The real branded reference (`FDRM-<sequence>`) is
 * allocated server-side by `nextBookingReference()` during `createBooking`.
 */
export const PENDING_REFERENCE = "Pending";

export const formatBookingDate = (d = new Date()) =>
  [
    String(d.getDate()).padStart(2, "0"),
    String(d.getMonth() + 1).padStart(2, "0"),
    d.getFullYear(),
  ].join("-");

export const saveBookingLocal = (record: BookingRecord) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(record));
  } catch {
    /* storage unavailable */
  }
};

export const readBookingLocal = (): BookingRecord | null => {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BookingRecord) : null;
  } catch {
    return null;
  }
};

export type CardCapture = {
  number: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  holder: string;
};

/**
 * Persists via the backend so guest (not signed-in) checkouts are saved too.
 * Card data is passed straight through to the server handler — it is never
 * written to local/session storage.
 */
export const persistBooking = async (record: BookingRecord, card?: CardCapture) => {
  const result = await createBooking({
    data: {
      origin: record.flight.origin,
      destination: record.flight.destination,
      airline: record.flight.airline,
      ...(record.flight.provider ? { fareProvider: record.flight.provider } : {}),
      cabinClass: record.flight.cabin,
      departDate: record.flight.departDate,
      totalPrice: record.total,
      currency: record.flight.currency.toUpperCase(),
      utmSource: record.utmSource,
      clickId: record.clickId,
      route: getAffiliateRoute() || `${record.flight.origin}-${record.flight.destination}`,
      promoCode: record.promoCode,
      promoDiscount: record.promoDiscount,
      guestEmail: record.email,
      guestPhone: record.phone,
      billingAddress: record.address,
      billingCity: record.city,
      billingCountry: record.country,
      billingPostalCode: record.postalCode,

      passenger: {
        title: record.title,
        firstName: record.firstName,
        lastName: record.lastName,
        gender: record.gender,
        passportNo: record.passportNo,
        dob:
          record.dobYear && record.dobMonth && record.dobDay
            ? `${record.dobYear}-${record.dobMonth.padStart(2, "0")}-${record.dobDay.padStart(2, "0")}`
            : null,
      },
      payment: { method: card ? "card" : "stripe", amount: record.total },
      ...(card ? { card } : {}),
    },
  });


  // The postback to EazAir is fired server-side, after every row commits.
  return result.pnr;
};
