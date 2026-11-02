/**
 * Business rules for the admin console, kept free of server and React imports so the
 * same checks run in the browser (instant feedback) and on the server (the real gate),
 * and can be unit-tested on their own (scripts/admin-logic.test.ts).
 */
import { z } from "zod";

export type BookingStatus = "pending" | "issued" | "cancelled" | "refunded";
export type RefundStatus = "requested" | "filed" | "paid" | "rejected";
export type StaffRole = "agent" | "manager" | "superadmin";

/* -------------------------------- permissions ------------------------------- */

const isManager = (role: StaffRole) => role === "manager" || role === "superadmin";
/** Deals change what customers see on the site. */
export const canManageDeals = isManager;
/** Marking a refund paid or rejected settles money with the customer. */
export const canSettleRefunds = isManager;
export const canViewActivity = isManager;

/* --------------------------------- money ---------------------------------- */

/** Rounds to cents, avoiding binary float noise (0.1 + 0.2 -> 0.3). */
export const toCents = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/** "USD 1,200" or "USD 719.50": cents only show when there are some. */
export function formatMoney(amount: number, currency: string) {
  const n = toCents(amount);
  const cents = Number.isInteger(n) ? 0 : 2;
  const text = n.toLocaleString("en-US", {
    minimumFractionDigits: cents,
    maximumFractionDigits: 2,
  });
  return `${currency} ${text}`;
}

/**
 * What the customer gets back, per the Refund & Cancellation Policy: fare paid, minus
 * the airline penalty, minus non-refundable taxes, minus our service fee. Never negative.
 */
export function refundAmount(parts: {
  farePaid: number;
  airlinePenalty: number;
  nonRefundableTaxes: number;
  serviceFee: number;
}) {
  const total = parts.farePaid - parts.airlinePenalty - parts.nonRefundableTaxes - parts.serviceFee;
  return Math.max(0, toCents(total));
}

/* ---------------------------------- dates ---------------------------------- */

/** The date `days` business days (Mon–Fri) after `from`; weekends are skipped. */
export function addBusinessDays(from: Date, days: number) {
  const d = new Date(from);
  let left = days;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) left -= 1;
  }
  return d;
}

/** Refund requests must be filed with the airline within 3 business days (policy s.7). */
export const REFUND_FILING_DAYS = 3;

export function refundFilingDeadline(requestedAt: string | Date) {
  return addBusinessDays(new Date(requestedAt), REFUND_FILING_DAYS);
}

/** Whole days from today until a yyyy-MM-dd date (negative when it has passed). */
export function daysUntil(ymd: string, today = new Date()) {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return Number.NaN;
  const target = Date.UTC(y, m - 1, d);
  const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((target - now) / 86_400_000);
}

/* ------------------------------ booking status ----------------------------- */

export type StatusContext = { ticketCount: number; hasPaidRefund: boolean };

/**
 * Which status changes are allowed. Returns a reason when a change is blocked, or null.
 * - Ticketed needs at least one e-ticket recorded.
 * - Refunded is set by marking a refund paid, not by hand.
 * - A refunded booking is closed.
 */
export function statusChangeError(
  from: BookingStatus,
  to: BookingStatus,
  ctx: StatusContext,
): string | null {
  if (from === to) return null;
  if (from === "refunded") return "This booking has been refunded and is closed.";
  if (to === "refunded") {
    return ctx.hasPaidRefund ? null : "Mark the refund as paid to set this booking to refunded.";
  }
  if (to === "issued" && ctx.ticketCount < 1) {
    return "Add at least one e-ticket number before marking this booking ticketed.";
  }
  return null;
}

/* ---------------------------------- tickets -------------------------------- */

/** E-ticket numbers are 13 digits: a 3-digit airline code and a 10-digit serial. */
export function normaliseTicketNumber(raw: string) {
  const digits = raw.replace(/[\s-]/g, "");
  return /^\d{13}$/.test(digits) ? `${digits.slice(0, 3)}-${digits.slice(3)}` : null;
}

/** Airline booking references are 6 letters or digits. */
export function normaliseAirlinePnr(raw: string) {
  const v = raw.trim().toUpperCase();
  return /^[A-Z0-9]{6}$/.test(v) ? v : null;
}

/* ----------------------------------- refunds -------------------------------- */

/** Allowed refund steps: requested -> filed -> paid, or rejected before it's paid. */
export function refundStepError(
  from: RefundStatus,
  to: RefundStatus,
  airlineReference: string | null | undefined,
): string | null {
  if (from === to) return null;
  if (from === "paid" || from === "rejected") return "This refund is closed.";
  if (to === "requested") return "A refund can't go back to requested.";
  if (to === "filed" && !airlineReference?.trim()) {
    return "Add the airline's refund reference to mark it filed.";
  }
  if (to === "paid" && from !== "filed") return "File the refund with the airline first.";
  return null;
}

/* -------------------------------- New York time ------------------------------ */

// Deal end dates are calendar days at the travel desk in New York.
const NY = "America/New_York";

function newYorkParts(at: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: NY,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(at);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { ymd: `${get("year")}-${get("month")}-${get("day")}`, hour: get("hour") };
}

/** yyyy-MM-dd of an instant in New York. */
export const newYorkYmd = (at: Date | string = new Date()) => newYorkParts(new Date(at)).ymd;

/** The last second (23:59:59) of a New York calendar day, as an ISO timestamp. */
export function endOfNewYorkDay(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  // New York is 4 hours behind UTC in summer and 5 in winter; keep the one that fits.
  for (const behind of [4, 5]) {
    const at = new Date(Date.UTC(y!, m! - 1, d!, 23 + behind, 59, 59));
    const p = newYorkParts(at);
    if (p.ymd === ymd && p.hour === "23") return at.toISOString();
  }
  throw new Error(`Invalid date: ${ymd}`);
}

/* ------------------------------------ inputs -------------------------------- */

const money = z.number({ invalid_type_error: "Enter an amount." }).finite().min(0).max(1_000_000);
const ymdField = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date.");
const airportCode = (label: string) =>
  z
    .string()
    .trim()
    .regex(/^[A-Za-z]{3}$/, `${label}: use a 3-letter airport code, like JFK.`)
    .transform((s) => s.toUpperCase());

/** The first problem in a failed parse, worded for a person. */
export const firstIssue = (error: z.ZodError) => error.issues[0]?.message ?? "Check the form.";

/* ------------------------------------ deals --------------------------------- */

export const DEAL_CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD"] as const;

export const dealSchema = z
  .object({
    id: z.string().uuid().optional(),
    origin: airportCode("From"),
    destination: airportCode("To"),
    airline: z.string().trim().min(2, "Enter the airline.").max(80),
    cabinClass: z.enum(["Economy", "Premium Economy", "Business", "First"]),
    price: z
      .number({ invalid_type_error: "Enter a price." })
      .positive("Enter a price above 0.")
      .max(100_000, "That price looks too high."),
    currency: z.enum(DEAL_CURRENCIES),
    /** Last day the deal shows (New York date), or null to keep it up until ended. */
    endsOn: ymdField.nullable(),
  })
  .refine((d) => d.origin !== d.destination, {
    message: "From and To can't be the same airport.",
    path: ["destination"],
  });

export type DealInput = z.input<typeof dealSchema>;

/** Extra check at save time: an end date can't already be over. */
export function dealEndError(endsOn: string | null, now = new Date()) {
  return endsOn && endsOn < newYorkYmd(now)
    ? "The end date has already passed. Pick today or later."
    : null;
}

/* ---------------------------------- tickets --------------------------------- */

export const ticketSchema = z.object({
  bookingId: z.string().uuid(),
  ticketNumber: z.string().transform((raw, ctx) => {
    const n = normaliseTicketNumber(raw);
    if (!n) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter the 13-digit e-ticket number, like 125-1234567890.",
      });
      return z.NEVER;
    }
    return n;
  }),
  airlinePnr: z.string().transform((raw, ctx) => {
    if (!raw.trim()) return null;
    const n = normaliseAirlinePnr(raw);
    if (!n) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The airline reference is 6 letters or numbers, like ABC123.",
      });
      return z.NEVER;
    }
    return n;
  }),
  supplier: z.string().trim().max(60),
  baseFare: money,
  commission: money,
});

export type TicketInput = z.input<typeof ticketSchema>;

/* ---------------------------------- refunds --------------------------------- */

export const refundRequestSchema = z.object({
  bookingId: z.string().uuid(),
  farePaid: money,
  airlinePenalty: money,
  nonRefundableTaxes: money,
  serviceFee: money,
  reason: z.string().trim().min(3, "Say why the customer wants a refund.").max(500),
});

export type RefundRequestInput = z.input<typeof refundRequestSchema>;

export const refundStepSchema = z.object({
  id: z.string().uuid(),
  to: z.enum(["filed", "paid", "rejected"]),
  airlineReference: z.string().trim().max(80).optional(),
  notes: z.string().trim().max(1000).optional(),
});

/* --------------------------------- deal state ------------------------------- */

export type DealState = "live" | "ending" | "expired";

/** Live, ending within 3 days, or expired (expired deals are hidden on the site). */
export function dealState(expiresAt: string | null, now = new Date()): DealState {
  if (!expiresAt) return "live";
  const ms = new Date(expiresAt).getTime() - now.getTime();
  if (ms <= 0) return "expired";
  return ms <= 3 * 86_400_000 ? "ending" : "live";
}

/* ---------------------------------- search ---------------------------------- */

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending ticketing",
  issued: "Ticketed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

/** Where a booking came from: a partner's utm_source, or DIRECT. */
export const bookingSource = (b: { source: string | null; utm_source: string | null }) =>
  (b.source || b.utm_source || "direct").toUpperCase();

export type BookingSearchRow = {
  pnr: string | null;
  lead_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  origin: string;
  destination: string;
  status: string;
  verification_status: string;
  created_at: string;
};

export type BookingFilter = {
  q: string;
  status: "all" | BookingStatus;
  verification: "all" | "pending" | "verified" | "rejected";
  /** yyyy-MM-dd, inclusive; empty for no limit. Compared with the booking date. */
  from: string;
  to: string;
};

export const emptyBookingFilter: BookingFilter = {
  q: "",
  status: "all",
  verification: "all",
  from: "",
  to: "",
};

const digitsOnly = (s: string) => s.replace(/\D/g, "");

/** Local yyyy-MM-dd of an ISO timestamp, so "booked on" matches the admin's calendar. */
export function localYmd(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Text search over reference, name, email, phone and route, plus status and date filters. */
export function matchesBooking(b: BookingSearchRow, f: BookingFilter) {
  if (f.status !== "all" && b.status !== f.status) return false;
  if (f.verification !== "all" && (b.verification_status || "pending") !== f.verification) {
    return false;
  }
  const day = localYmd(b.created_at);
  if (f.from && day < f.from) return false;
  if (f.to && day > f.to) return false;

  const q = f.q.trim().toLowerCase();
  if (!q) return true;
  const text = [b.pnr, b.lead_name, b.guest_email, b.origin, b.destination]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  if (text.includes(q) || `${b.origin}-${b.destination}`.toLowerCase() === q) return true;
  // Phone numbers match on digits alone, so "+1 (888) 596" finds "+18885967882".
  const qDigits = digitsOnly(q);
  return qDigits.length >= 4 && digitsOnly(b.guest_phone ?? "").includes(qDigits);
}

/* ------------------------------------ CSV ----------------------------------- */

/**
 * One CSV field. Quotes when needed, and defuses spreadsheet formulas: a value starting
 * with = + - @ (or a tab/CR) gets a leading apostrophe so Excel shows it as text.
 */
export function csvField(value: unknown) {
  if (value === null || value === undefined) return "";
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s) && !/^-?\d+(\.\d+)?$/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv<T>(rows: T[], columns: { header: string; value: (row: T) => unknown }[]) {
  const lines = [columns.map((c) => csvField(c.header)).join(",")];
  for (const row of rows) lines.push(columns.map((c) => csvField(c.value(row))).join(","));
  return lines.join("\r\n");
}
