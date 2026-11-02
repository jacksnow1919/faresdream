// Unit tests for the results page's filters and sorting. Run: node --test scripts/fare-filters.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applyFilters,
  computeBounds,
  emptyFilters,
  hasFilters,
  layoverAirportsOf,
  longestLayover,
  sortFares,
  tripMinutes,
  type Filters,
} from "../src/lib/fare-filters.ts";
import type { FareJourney, PkfareNormalisedFare } from "../src/lib/pkfare-types.ts";

const segment = (origin: string, destination: string) => ({
  carrierCode: "AA",
  flightNo: "AA 1",
  origin,
  destination,
  departAt: "2026-11-09T08:00",
  arriveAt: "2026-11-09T11:00",
  durationMinutes: 180,
});

/** A journey with one change per entry in `via`. */
function journey(
  origin: string,
  destination: string,
  o: { minutes: number; depart: number; arrive: number; via?: string[]; layover?: number },
): FareJourney {
  const stops = [origin, ...(o.via ?? []), destination];
  return {
    flightNo: "AA 1",
    origin,
    destination,
    departDate: "2026-11-09",
    departTime: "08:00",
    arriveTime: "11:00",
    duration: "",
    durationMinutes: o.minutes,
    departMinutes: o.depart,
    arriveMinutes: o.arrive,
    maxLayoverMinutes: o.layover ?? 0,
    stops: stops.length - 2,
    segments: stops.slice(1).map((to, i) => segment(stops[i]!, to)),
  };
}

function fare(
  id: string,
  price: number,
  out: FareJourney,
  back?: FareJourney,
  extra: Partial<PkfareNormalisedFare> = {},
): PkfareNormalisedFare {
  return {
    id,
    airline: "American Airlines",
    carrierCode: "AA",
    cabin: "Economy",
    currency: "USD",
    price,
    refundable: false,
    ...out,
    ...(back ? { inbound: back } : {}),
    ...extra,
  } as PkfareNormalisedFare;
}

const MORNING = 8 * 60;
const EVENING = 20 * 60;
const NOON_ISH = 13 * 60;

// Nonstop both ways, cheap.
const direct = fare(
  "direct",
  500,
  journey("JFK", "MIA", { minutes: 190, depart: MORNING, arrive: NOON_ISH }),
  journey("MIA", "JFK", { minutes: 185, depart: MORNING, arrive: NOON_ISH }),
);
// Nonstop out, but an overnight 1-stop back through ORD. Quick outbound, awful return.
const badReturn = fare(
  "badReturn",
  450,
  journey("JFK", "MIA", { minutes: 180, depart: EVENING, arrive: EVENING }),
  journey("MIA", "JFK", {
    minutes: 720,
    depart: EVENING,
    arrive: MORNING,
    via: ["ORD"],
    layover: 427,
  }),
);
// 1 stop out via CLT, nonstop back. Refundable, on another airline.
const viaClt = fare(
  "viaClt",
  700,
  journey("JFK", "MIA", {
    minutes: 375,
    depart: NOON_ISH,
    arrive: EVENING,
    via: ["CLT"],
    layover: 90,
  }),
  journey("MIA", "JFK", { minutes: 183, depart: EVENING, arrive: MORNING }),
  { refundable: true, carrierCode: "DL", airline: "Delta" },
);
const all = [direct, badReturn, viaClt];

const ids = (f: Partial<Filters>) =>
  applyFilters(all, { ...emptyFilters, ...f })
    .map((x) => x.id)
    .sort();

test("no filters keeps everything", () => {
  assert.deepEqual(ids({}), ["badReturn", "direct", "viaClt"]);
  assert.equal(hasFilters(emptyFilters), false);
});

test("departure and return stops filter their own direction", () => {
  assert.deepEqual(ids({ stops: ["Non Stop"] }), ["badReturn", "direct"]);
  assert.deepEqual(ids({ stops: ["1 Stop"] }), ["viaClt"]);
  assert.deepEqual(ids({ returnStops: ["Non Stop"] }), ["direct", "viaClt"]);
  assert.deepEqual(ids({ returnStops: ["1 Stop"] }), ["badReturn"]);
  assert.deepEqual(ids({ stops: ["Non Stop"], returnStops: ["Non Stop"] }), ["direct"]);
  assert.deepEqual(ids({ stops: ["1 Stop"], returnStops: ["1 Stop"] }), []);
  assert.deepEqual(ids({ returnStops: ["Non Stop", "1 Stop"] }), ["badReturn", "direct", "viaClt"]);
});

test("departure and return times filter their own direction", () => {
  assert.deepEqual(ids({ departBlocks: ["morning"] }), ["direct"]);
  assert.deepEqual(ids({ arriveBlocks: ["evening"] }), ["badReturn", "viaClt"]);
  assert.deepEqual(ids({ returnDepartBlocks: ["morning"] }), ["direct"]);
  assert.deepEqual(ids({ returnDepartBlocks: ["evening"] }), ["badReturn", "viaClt"]);
  assert.deepEqual(ids({ returnArriveBlocks: ["afternoon"] }), ["direct"]);
  assert.deepEqual(ids({ returnArriveBlocks: ["morning", "afternoon"] }), [
    "badReturn",
    "direct",
    "viaClt",
  ]);
});

test("layovers count both directions", () => {
  assert.equal(longestLayover(direct), 0);
  assert.equal(longestLayover(badReturn), 427, "the return's layover counts");
  assert.equal(longestLayover(viaClt), 90);
  assert.deepEqual(layoverAirportsOf(direct), []);
  assert.deepEqual(layoverAirportsOf(badReturn), ["ORD"]);
  assert.deepEqual(layoverAirportsOf(viaClt), ["CLT"]);

  assert.deepEqual(ids({ maxLayover: 120 }), ["direct", "viaClt"], "drops the 7h return layover");
  assert.deepEqual(ids({ maxLayover: 0 }), ["direct"]);
  assert.deepEqual(ids({ layoverAirports: ["ORD"] }), ["badReturn"]);
  assert.deepEqual(ids({ layoverAirports: ["CLT", "ORD"] }), ["badReturn", "viaClt"]);
});

test("price, fare rules and airlines", () => {
  assert.deepEqual(ids({ maxPrice: 500 }), ["badReturn", "direct"]);
  assert.deepEqual(ids({ fareRules: ["Refundable"] }), ["viaClt"]);
  assert.deepEqual(ids({ fareRules: ["Non-refundable"] }), ["badReturn", "direct"]);
  assert.deepEqual(ids({ airlines: ["DL"] }), ["viaClt"]);
  assert.deepEqual(ids({ airlines: ["AA"], maxPrice: 480 }), ["badReturn"], "filters combine");
});

test("hasFilters notices every kind of filter", () => {
  const cases: Partial<Filters>[] = [
    { stops: ["Non Stop"] },
    { returnStops: ["Non Stop"] },
    { maxPrice: 1 },
    { fareRules: ["Refundable"] },
    { departBlocks: ["early"] },
    { arriveBlocks: ["early"] },
    { returnDepartBlocks: ["early"] },
    { returnArriveBlocks: ["early"] },
    { airlines: ["AA"] },
    { maxLayover: 0 },
    { layoverAirports: ["ORD"] },
  ];
  for (const c of cases) {
    assert.equal(hasFilters({ ...emptyFilters, ...c }), true, JSON.stringify(c));
  }
});

test("options list both directions and carry the cheapest price", () => {
  const b = computeBounds(all, (code) => `City ${code}`);
  assert.deepEqual(
    b.stops.map((o) => [o.id, o.price]),
    [
      ["Non Stop", 450],
      ["1 Stop", 700],
    ],
  );
  assert.deepEqual(
    b.returnStops.map((o) => [o.id, o.price]),
    [
      ["Non Stop", 500],
      ["1 Stop", 450],
    ],
  );
  assert.deepEqual(b.layoverAirports.map((o) => o.id).sort(), ["CLT", "ORD"]);
  assert.equal(b.layoverAirports.find((o) => o.id === "ORD")?.label, "City ORD");
  assert.equal(b.airlines.length, 2);
  assert.equal(b.fareRules.length, 2);
});

test("the layover slider's far end keeps every fare", () => {
  const b = computeBounds(all, (c) => c);
  assert.equal(b.maxLayover, 435, "427 rounds up to the next 15-minute step");
  assert.equal(b.maxLayover % 15, 0);
  assert.equal(applyFilters(all, { ...emptyFilters, maxLayover: b.maxLayover }).length, 3);
});

test("one-way fares ignore the return filters", () => {
  const oneWay = fare(
    "oneWay",
    300,
    journey("JFK", "MIA", { minutes: 180, depart: 480, arrive: 660 }),
  );
  const b = computeBounds([oneWay], (c) => c);
  assert.deepEqual(b.returnStops, [], "so the Return sections stay hidden");
  assert.equal(b.maxLayover, 0);
  const kept = applyFilters([oneWay], {
    ...emptyFilters,
    returnStops: ["1 Stop"],
    returnDepartBlocks: ["evening"],
  });
  assert.equal(kept.length, 1);
});

test("sorting uses the whole trip", () => {
  const b = computeBounds(all, (c) => c);
  assert.equal(tripMinutes(direct), 375);
  assert.equal(tripMinutes(badReturn), 900);
  assert.equal(
    sortFares(all, "fastest", b)[0]?.id,
    "direct",
    "not badReturn, whose outbound alone is quickest",
  );
  assert.equal(sortFares(all, "cheapest", b)[0]?.id, "badReturn");
  assert.equal(sortFares(all, "best", b)[0]?.id, "direct");
});

test("ties break sensibly", () => {
  const a = fare("slow", 500, journey("JFK", "MIA", { minutes: 400, depart: 0, arrive: 0 }));
  const c = fare("quick", 500, journey("JFK", "MIA", { minutes: 200, depart: 0, arrive: 0 }));
  const d = fare("dear", 900, journey("JFK", "MIA", { minutes: 200, depart: 0, arrive: 0 }));
  const list = [a, c, d];
  const b = computeBounds(list, (x) => x);
  assert.equal(sortFares(list, "cheapest", b)[0]?.id, "quick", "same price: quickest first");
  assert.equal(sortFares(list, "fastest", b)[0]?.id, "quick", "same time: cheapest first");
});
