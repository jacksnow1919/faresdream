// Unit tests for the admin console's business rules. Run: node --test scripts/admin-logic.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addBusinessDays,
  csvField,
  daysUntil,
  dealEndError,
  dealSchema,
  dealState,
  endOfNewYorkDay,
  firstIssue,
  formatMoney,
  newYorkYmd,
  refundRequestSchema,
  ticketSchema,
  matchesBooking,
  emptyBookingFilter,
  normaliseAirlinePnr,
  normaliseTicketNumber,
  refundAmount,
  refundFilingDeadline,
  refundStepError,
  statusChangeError,
  toCents,
  toCsv,
  type BookingSearchRow,
} from "../src/lib/admin-logic.ts";

test("refund amount follows the policy and never goes negative", () => {
  assert.equal(
    refundAmount({ farePaid: 1200, airlinePenalty: 250, nonRefundableTaxes: 80.5, serviceFee: 75 }),
    794.5,
  );
  assert.equal(
    refundAmount({ farePaid: 100, airlinePenalty: 250, nonRefundableTaxes: 0, serviceFee: 75 }),
    0,
  );
  assert.equal(
    refundAmount({ farePaid: 0.3, airlinePenalty: 0.1, nonRefundableTaxes: 0, serviceFee: 0 }),
    0.2,
  );
  assert.equal(toCents(0.1 + 0.2), 0.3);
});

test("business days skip weekends", () => {
  // Thu 5 Nov 2026 + 3 business days = Tue 10 Nov.
  assert.equal(addBusinessDays(new Date(2026, 10, 5, 12), 3).getDate(), 10);
  // Fri 6 Nov + 3 = Wed 11 Nov.
  assert.equal(addBusinessDays(new Date(2026, 10, 6, 12), 3).getDate(), 11);
  // Sat 7 Nov + 1 = Mon 9 Nov.
  assert.equal(addBusinessDays(new Date(2026, 10, 7, 12), 1).getDate(), 9);
  assert.equal(refundFilingDeadline(new Date(2026, 10, 2, 9)).getDate(), 5); // Mon -> Thu
});

test("days until a travel date", () => {
  const today = new Date(2026, 10, 1, 23, 30);
  assert.equal(daysUntil("2026-11-01", today), 0);
  assert.equal(daysUntil("2026-11-04", today), 3);
  assert.equal(daysUntil("2026-10-30", today), -2);
  assert.ok(Number.isNaN(daysUntil("", today)));
});

test("booking status rules", () => {
  const none = { ticketCount: 0, hasPaidRefund: false };
  assert.match(statusChangeError("pending", "issued", none) ?? "", /e-ticket/);
  assert.equal(statusChangeError("pending", "issued", { ...none, ticketCount: 1 }), null);
  assert.equal(statusChangeError("pending", "cancelled", none), null);
  assert.equal(statusChangeError("cancelled", "pending", none), null);
  assert.match(statusChangeError("issued", "refunded", none) ?? "", /refund as paid/);
  assert.equal(statusChangeError("issued", "refunded", { ...none, hasPaidRefund: true }), null);
  assert.match(statusChangeError("refunded", "pending", none) ?? "", /closed/);
  assert.equal(statusChangeError("issued", "issued", none), null);
});

test("ticket numbers and airline references", () => {
  assert.equal(normaliseTicketNumber("125 1234567890"), "125-1234567890");
  assert.equal(normaliseTicketNumber("125-1234567890"), "125-1234567890");
  assert.equal(normaliseTicketNumber("1251234567890"), "125-1234567890");
  assert.equal(normaliseTicketNumber("12512345678"), null);
  assert.equal(normaliseTicketNumber("125-12345678AB"), null);
  assert.equal(normaliseAirlinePnr(" ab12cd "), "AB12CD");
  assert.equal(normaliseAirlinePnr("AB12C"), null);
  assert.equal(normaliseAirlinePnr("AB-2CD"), null);
});

test("refund steps", () => {
  assert.match(refundStepError("requested", "filed", "") ?? "", /reference/);
  assert.equal(refundStepError("requested", "filed", "BA-RF-991"), null);
  assert.match(refundStepError("requested", "paid", "X") ?? "", /File the refund/);
  assert.equal(refundStepError("filed", "paid", "X"), null);
  assert.equal(refundStepError("requested", "rejected", null), null);
  assert.equal(refundStepError("filed", "rejected", "X"), null);
  assert.match(refundStepError("paid", "rejected", "X") ?? "", /closed/);
  assert.match(refundStepError("filed", "requested", "X") ?? "", /back/);
});

test("deal state", () => {
  const now = new Date("2026-11-01T12:00:00Z");
  assert.equal(dealState(null, now), "live");
  assert.equal(dealState("2026-11-01T11:59:00Z", now), "expired");
  assert.equal(dealState("2026-11-03T12:00:00Z", now), "ending");
  assert.equal(dealState("2026-11-10T12:00:00Z", now), "live");
});

test("booking search and filters", () => {
  const row: BookingSearchRow = {
    pnr: "FDRM-100042",
    lead_name: "Maria Lopez",
    guest_email: "maria@example.com",
    guest_phone: "+1 (305) 555-0142",
    origin: "JFK",
    destination: "LHR",
    status: "pending",
    verification_status: "pending",
    created_at: new Date(2026, 10, 1, 10).toISOString(),
  };
  const f = emptyBookingFilter;
  assert.ok(matchesBooking(row, f));
  assert.ok(matchesBooking(row, { ...f, q: "fdrm-100042" }));
  assert.ok(matchesBooking(row, { ...f, q: "lopez" }));
  assert.ok(matchesBooking(row, { ...f, q: "MARIA@" }));
  assert.ok(matchesBooking(row, { ...f, q: "305 555 0142" }));
  assert.ok(matchesBooking(row, { ...f, q: "jfk-lhr" }));
  assert.ok(!matchesBooking(row, { ...f, q: "555" }), "3 digits is too short for phone search");
  assert.ok(!matchesBooking(row, { ...f, q: "paris" }));
  assert.ok(!matchesBooking(row, { ...f, status: "issued" }));
  assert.ok(matchesBooking(row, { ...f, verification: "pending" }));
  assert.ok(!matchesBooking(row, { ...f, verification: "verified" }));
  assert.ok(matchesBooking(row, { ...f, from: "2026-11-01", to: "2026-11-01" }));
  assert.ok(!matchesBooking(row, { ...f, from: "2026-11-02" }));
  assert.ok(!matchesBooking(row, { ...f, to: "2026-10-31" }));
});

test("New York calendar days", () => {
  // 1 Nov 2026 is after the clocks go back (UTC-5); July is summer time (UTC-4).
  assert.equal(endOfNewYorkDay("2026-11-20"), "2026-11-21T04:59:59.000Z");
  assert.equal(endOfNewYorkDay("2026-07-04"), "2026-07-05T03:59:59.000Z");
  // 8 Mar 2026 is the day the clocks go forward; the day still ends at 23:59:59 EDT.
  assert.equal(endOfNewYorkDay("2026-03-08"), "2026-03-09T03:59:59.000Z");
  assert.equal(newYorkYmd("2026-11-02T03:00:00Z"), "2026-11-01");
  assert.equal(newYorkYmd("2026-11-02T06:00:00Z"), "2026-11-02");
  const now = new Date("2026-11-02T03:00:00Z"); // still 1 Nov in New York
  assert.equal(dealEndError("2026-11-01", now), null);
  assert.match(dealEndError("2026-10-31", now) ?? "", /passed/);
  assert.equal(dealEndError(null, now), null);
});

test("deal form rules", () => {
  const ok = {
    origin: "jfk",
    destination: "LHR",
    airline: "British Airways",
    cabinClass: "Economy" as const,
    price: 499,
    currency: "USD" as const,
    endsOn: null,
  };
  const parsed = dealSchema.parse(ok);
  assert.equal(parsed.origin, "JFK");
  const issue = (v: object) => {
    const r = dealSchema.safeParse({ ...ok, ...v });
    return r.success ? null : firstIssue(r.error);
  };
  assert.match(issue({ destination: "jfk" }) ?? "", /same airport/);
  assert.match(issue({ origin: "JF" }) ?? "", /3-letter/);
  assert.match(issue({ price: 0 }) ?? "", /above 0/);
  assert.match(issue({ price: Number.NaN }) ?? "", /price|number/i);
  assert.match(issue({ airline: " " }) ?? "", /airline/);
  assert.ok(issue({ currency: "INR" }));
  assert.ok(issue({ endsOn: "20/11/2026" }));
});

test("ticket and refund form rules", () => {
  const t = ticketSchema.parse({
    bookingId: "6f1d2c1e-8a8e-4d3a-9b2a-111111111111",
    ticketNumber: "125 1234567890",
    airlinePnr: "",
    supplier: " PKFARE ",
    baseFare: 400,
    commission: 12,
  });
  assert.equal(t.ticketNumber, "125-1234567890");
  assert.equal(t.airlinePnr, null);
  assert.equal(t.supplier, "PKFARE");
  const bad = ticketSchema.safeParse({ ...t, ticketNumber: "12345", airlinePnr: "" });
  assert.ok(!bad.success && /13-digit/.test(firstIssue(bad.error)));
  const badPnr = ticketSchema.safeParse({ ...t, ticketNumber: "1251234567890", airlinePnr: "AB" });
  assert.ok(!badPnr.success && /6 letters/.test(firstIssue(badPnr.error)));

  const r = refundRequestSchema.safeParse({
    bookingId: "6f1d2c1e-8a8e-4d3a-9b2a-111111111111",
    farePaid: 500,
    airlinePenalty: -1,
    nonRefundableTaxes: 0,
    serviceFee: 75,
    reason: "Change of plans",
  });
  assert.ok(!r.success, "negative penalty is rejected");
});

test("CSV escaping and formula defusing", () => {
  assert.equal(csvField(null), "");
  assert.equal(csvField(42), "42");
  assert.equal(csvField(-12.5), "-12.5");
  assert.equal(csvField('He said "hi", then left'), '"He said ""hi"", then left"');
  assert.equal(csvField("line1\nline2"), '"line1\nline2"');
  assert.equal(csvField("=HYPERLINK(1)"), "'=HYPERLINK(1)");
  assert.equal(csvField("+1 305"), "'+1 305");
  assert.equal(csvField("@cmd"), "'@cmd");
  const csv = toCsv(
    [{ a: "x,y", b: 1 }],
    [
      { header: "A", value: (r) => r.a },
      { header: "B", value: (r) => r.b },
    ],
  );
  assert.equal(csv, 'A,B\r\n"x,y",1');
});

test("money shows cents only when there are some", () => {
  assert.equal(formatMoney(1200, "USD"), "USD 1,200");
  assert.equal(formatMoney(719.5, "USD"), "USD 719.50");
  assert.equal(formatMoney(2500.5, "EUR"), "EUR 2,500.50");
  assert.equal(formatMoney(0.1 + 0.2, "USD"), "USD 0.30");
  assert.equal(formatMoney(0, "USD"), "USD 0");
});
