// Unit tests for merging, pausing and mcontent's fares. Run: node --test scripts/flight-providers.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  groupSearches,
  isPausedNow,
  mergeFares,
  providerErrorText,
  providerError,
  providerHealth,
  tripKey,
  withAirlineDetails,
  type ProviderSwitch,
  type SearchLogRow,
} from "../src/lib/flight-providers.ts";
import { mcontentDate, normaliseMcontentItem } from "../src/lib/mcontent-normalise.ts";
import type { PkfareNormalisedFare } from "../src/lib/pkfare-types.ts";

const fare = (over: Partial<PkfareNormalisedFare>): PkfareNormalisedFare => ({
  id: "a",
  airline: "DL",
  carrierCode: "DL",
  flightNo: "DL 3",
  origin: "JFK",
  destination: "LHR",
  departDate: "2026-12-14",
  departTime: "22:20",
  arriveTime: "10:15",
  duration: "6h 55m",
  durationMinutes: 415,
  departMinutes: 1340,
  arriveMinutes: 615,
  maxLayoverMinutes: 0,
  cabin: "Economy",
  currency: "USD",
  price: 500,
  refundable: false,
  stops: 0,
  ...over,
});

test("the same trip from two APIs shows once, at the cheaper price", () => {
  const { fares, duplicates } = mergeFares(
    [fare({ id: "p", provider: "pkfare", price: 520 })],
    [fare({ id: "m", provider: "mcontent", price: 505, flightNo: "VS 4030" })],
  );
  assert.equal(fares.length, 1);
  assert.equal(duplicates, 1);
  assert.equal(fares[0]!.id, "m");
});

test("on an equal price the API listed first stays", () => {
  const { fares } = mergeFares(
    [fare({ id: "p", provider: "pkfare" })],
    [fare({ id: "d", provider: "duffel" })],
  );
  assert.equal(fares[0]!.id, "p");
});

test("within one API an equal price keeps the lower flight number", () => {
  const { fares } = mergeFares([
    fare({ id: "high", provider: "duffel", flightNo: "VS 4030" }),
    fare({ id: "low", provider: "duffel", flightNo: "DL 3" }),
  ]);
  assert.equal(fares[0]!.id, "low");
});

test("different trips stay apart and sort cheapest first", () => {
  const { fares } = mergeFares(
    [fare({ id: "late", departTime: "23:00", price: 400 })],
    [fare({ id: "stop", stops: 1, price: 300 })],
    [fare({ id: "back", inbound: fare({}), price: 900 })],
    [fare({ id: "plain", price: 500 })],
  );
  assert.deepEqual(
    fares.map((f) => f.id),
    ["stop", "late", "plain", "back"],
  );
});

test("fares with no times are never merged", () => {
  const blank = { departTime: "", arriveTime: "" };
  assert.notEqual(tripKey(fare({ id: "x", ...blank })), tripKey(fare({ id: "y", ...blank })));
});

test("airline codes get their name and logo, and existing details are kept", () => {
  const airlines = { B6: { name: "JetBlue Airways", logo: "b6.svg" }, ZZ: { name: "Zed Air" } };
  const segment = {
    carrierCode: "B6",
    flightNo: "B6 823",
    origin: "JFK",
    destination: "LAX",
    departAt: "2026-12-08T21:35",
    arriveAt: "2026-12-09T00:57",
    durationMinutes: 0,
  };
  const coded = withAirlineDetails(
    fare({ airline: "B6", carrierCode: "B6", segments: [segment] }),
    airlines,
  );
  assert.equal(coded.airline, "JetBlue Airways");
  assert.equal(coded.logoUrl, "b6.svg");
  assert.equal(coded.segments?.[0]?.carrierName, "JetBlue Airways");
  assert.equal(coded.segments?.[0]?.logoUrl, "b6.svg");

  const named = withAirlineDetails(
    fare({ airline: "JetBlue", carrierCode: "B6", logoUrl: "own.svg" }),
    airlines,
  );
  assert.equal(named.airline, "JetBlue");
  assert.equal(named.logoUrl, "own.svg");

  const unknown = withAirlineDetails(fare({ airline: "QQ", carrierCode: "QQ" }), airlines);
  assert.equal(unknown.airline, "QQ");
  assert.equal(unknown.logoUrl, undefined);
});

const sw = (over: Partial<ProviderSwitch>): ProviderSwitch => ({
  paused: true,
  paused_until: null,
  paused_at: null,
  paused_by: null,
  reason: null,
  ...over,
});

test("a pause lasts until resumed, or until its end time", () => {
  const now = Date.parse("2026-11-04T12:00:00Z");
  assert.equal(isPausedNow(null, now), false);
  assert.equal(isPausedNow(sw({ paused: false }), now), false);
  assert.equal(isPausedNow(sw({}), now), true);
  assert.equal(isPausedNow(sw({ paused_until: "2026-11-04T13:00:00Z" }), now), true);
  assert.equal(isPausedNow(sw({ paused_until: "2026-11-04T11:00:00Z" }), now), false);
});

test("health says what an owner needs to act on", () => {
  const base = {
    configured: true,
    paused: false,
    lookups: 5,
    lastFaresAt: "2026-11-04T10:00:00Z",
    lastErrorAt: null,
  };
  assert.equal(providerHealth(base), "working");
  assert.equal(providerHealth({ ...base, configured: false, paused: true }), "no_key");
  assert.equal(providerHealth({ ...base, paused: true }), "paused");
  assert.equal(providerHealth({ ...base, lookups: 0 }), "idle");
  assert.equal(providerHealth({ ...base, lastErrorAt: "2026-11-04T11:00:00Z" }), "failing");
  assert.equal(providerHealth({ ...base, lastErrorAt: "2026-11-04T09:00:00Z" }), "working");
});

test("the admin panel gets the API's words, customers get the safe message", () => {
  const error = providerError("Please try again.", "Duffel 429: rate limited");
  assert.equal(error.message, "Please try again.");
  assert.equal(providerErrorText(error), "Duffel 429: rate limited");
  assert.equal(providerErrorText(new Error("plain")), "plain");
});

test("search log rows group into one row per search", () => {
  const row = (over: Partial<SearchLogRow>): SearchLogRow => ({
    created_at: "2026-11-04T10:00:00Z",
    search_id: "s1",
    provider: "pkfare",
    origin: "JFK",
    destination: "LAX",
    depart_date: "2026-12-01",
    return_date: null,
    cabin: "Economy",
    adults: 1,
    status: "ok",
    fares: 3,
    ms: 1200,
    message: null,
    ...over,
  });
  const groups = groupSearches([
    row({ search_id: "s2", created_at: "2026-11-04T11:00:00Z" }),
    row({ provider: "duffel", status: "error", fares: 0, message: "boom" }),
    row({ provider: "mcontent", status: "paused", created_at: "2026-11-04T09:59:00Z" }),
  ]);
  assert.deepEqual(
    groups.map((g) => g.id),
    ["s2", "s1"],
  );
  assert.equal(groups[1]!.at, "2026-11-04T09:59:00Z");
  assert.equal(groups[1]!.answers.duffel?.message, "boom");
  assert.equal(groups[1]!.answers.mcontent?.status, "paused");
});

const sector = (over: object) => ({
  DepAirportCode: "JFK",
  ArrAirportCode: "ORD",
  DepDateTime: "2026-12-14T08:15:00",
  ArrDateTime: "2026-12-14T09:50:00",
  MCarrier: "aa",
  FlightNo: "0142",
  ...over,
});

const item = {
  UniqueId: "u1",
  Carrier: "AA",
  Currency: "usd",
  OutBound: {
    TotalTime: "07:20",
    Sector: [
      sector({}),
      sector({
        DepAirportCode: "ORD",
        ArrAirportCode: "LAX",
        DepDateTime: "2026-12-14T11:05:00",
        ArrDateTime: "2026-12-14T13:35:00",
        FlightNo: "88",
      }),
    ],
  },
  AdultPrice: { Price: "249.60", BaseFare: "200.10", Tax: "49.50" },
};

test("mcontent dates are sent day first", () => {
  assert.equal(mcontentDate("2026-12-14"), "14-12-2026");
});

test("an mcontent itinerary becomes a site fare", () => {
  const f = normaliseMcontentItem(item, "Economy");
  assert.ok(f);
  assert.equal(f.id, "mcontent-u1");
  assert.equal(f.flightNo, "AA 142");
  assert.equal(f.carrierCode, "AA");
  assert.equal(f.origin, "JFK");
  assert.equal(f.destination, "LAX");
  assert.equal(f.departTime, "08:15");
  assert.equal(f.arriveTime, "13:35");
  assert.equal(f.stops, 1);
  assert.equal(f.maxLayoverMinutes, 75);
  assert.equal(f.durationMinutes, 440);
  assert.equal(f.duration, "7h 20m");
  assert.equal(f.price, 250);
  assert.equal(f.baseFare, 200);
  assert.equal(f.taxes, 50);
  assert.equal(f.currency, "USD");
  assert.equal(f.refundable, false);
  assert.equal(f.segments?.length, 2);
  assert.equal(f.inbound, undefined);
});

test("an mcontent round trip keeps its return", () => {
  const back = {
    TotalTime: "05:30",
    Sector: [
      sector({
        DepAirportCode: "LAX",
        ArrAirportCode: "JFK",
        DepDateTime: "2026-12-20T07:00:00",
        ArrDateTime: "2026-12-20T15:30:00",
      }),
    ],
  };
  const f = normaliseMcontentItem({ ...item, InBound: back }, "Economy");
  assert.equal(f?.inbound?.origin, "LAX");
  assert.equal(f?.inbound?.departDate, "2026-12-20");
  assert.equal(f?.inbound?.stops, 0);
});

test("mcontent itineraries with no price or flights are dropped", () => {
  assert.equal(normaliseMcontentItem({ ...item, AdultPrice: { Price: 0 } }, "Economy"), null);
  assert.equal(normaliseMcontentItem({ ...item, AdultPrice: {} }, "Economy"), null);
  assert.equal(normaliseMcontentItem({ ...item, OutBound: { Sector: [] } }, "Economy"), null);
  assert.equal(
    normaliseMcontentItem(
      { ...item, OutBound: { Sector: [sector({ DepDateTime: undefined })] } },
      "Economy",
    ),
    null,
  );
  assert.equal(
    normaliseMcontentItem(
      { ...item, InBound: { Sector: [sector({ ArrAirportCode: undefined })] } },
      "Economy",
    ),
    null,
  );
});
