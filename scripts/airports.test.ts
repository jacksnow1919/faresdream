// Unit tests for the airport search. Run: node --test scripts/airports.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { airportByCode, cityOf, loadAllAirports, searchAirports } from "../src/lib/airports.ts";
import { AIRPORT_ROWS } from "../src/lib/airports-all.gen.ts";

const top = (query: string) => searchAirports(query)[0]?.code;
const codesFor = (query: string) => searchAirports(query).map((a) => a.code);

test("before the full list loads, hubs still work and the rest stay unknown", () => {
  assert.equal(top("JFK"), "JFK");
  assert.equal(airportByCode("OMA"), undefined);
  assert.equal(cityOf("OMA"), "OMA");
});

test("every airport Duffel knows is the first result for its own code", async () => {
  await loadAllAirports();
  const codes = AIRPORT_ROWS.split("\n").map((row) => row.split("|")[0] ?? "");
  assert.ok(codes.length > 9000, "the generated list is complete");
  for (const code of codes) {
    assert.equal(top(code.toLowerCase()), code);
    assert.equal(airportByCode(code)?.code, code);
  }
});

test("OMA finds Omaha ahead of Oman, Tacoma and Romania", async () => {
  await loadAllAirports();
  const [first] = searchAirports("oma");
  assert.equal(first?.code, "OMA");
  assert.equal(first?.city, "Omaha");
  assert.equal(first?.country, "United States");
  assert.equal(cityOf("OMA"), "Omaha");
  assert.equal(top("omaha"), "OMA");
  assert.equal(top("eppley"), "OMA");
});

test("hub airports stay ahead of small airfields in the same city or country", async () => {
  await loadAllAirports();
  assert.deepEqual(codesFor("new york").slice(0, 2), ["JFK", "EWR"]);
  assert.equal(top("london"), "LHR");
  assert.equal(top("paris"), "CDG");
  assert.equal(top("india"), "DEL");
});

test("city codes list that city's airports, with an exact airport code first", async () => {
  await loadAllAirports();
  assert.ok(codesFor("LON").includes("LHR") && codesFor("LON").includes("LCY"));
  assert.ok(codesFor("NYC").includes("LGA"));
  assert.equal(top("DFW"), "DFW");
  assert.ok(codesFor("DFW").includes("DAL"));
});

test("accents, punctuation and word order don't matter", async () => {
  await loadAllAirports();
  assert.ok(codesFor("sao paulo").includes("GRU"));
  assert.ok(codesFor("izmir").includes("ADB"));
  assert.ok(codesFor("seattle tacoma").includes("SEA"));
  assert.ok(codesFor("ohare").includes("ORD"));
  assert.equal(top("heathrow london"), "LHR");
});

test("airports with a replaced code are found by both codes", async () => {
  await loadAllAirports();
  assert.equal(top("KTI"), "KTI");
  assert.equal(top("PNH"), "KTI");
  assert.equal(top("SAI"), "SAI");
  assert.equal(top("REP"), "SAI");
});

test("nonsense finds nothing, and an empty box lists the hubs", async () => {
  await loadAllAirports();
  assert.deepEqual(searchAirports("zzzzzz"), []);
  assert.equal(searchAirports("").length, 10);
  assert.equal(top(""), "DEL");
});
