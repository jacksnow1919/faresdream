// Unit tests for regional settings and currency conversion. Run: node --test scripts/regional.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { airports } from "../src/lib/airports.ts";
import { CURRENCIES } from "../src/lib/brand.ts";
import {
  convertAmount,
  COUNTRIES,
  countryByCode,
  currencyShort,
  DEFAULT_COUNTRY,
  formatAmount,
} from "../src/lib/regional.ts";

const rates = { USD: 1, EUR: 0.9, INR: 90, GBP: 0.75 };

test("converts from dollars, to dollars and between other currencies", () => {
  assert.equal(convertAmount(100, "USD", "EUR", rates), 90);
  assert.equal(convertAmount(90, "EUR", "USD", rates), 100);
  assert.equal(convertAmount(75, "GBP", "INR", rates), 9000);
});

test("the same currency needs no rate", () => {
  assert.equal(convertAmount(100, "USD", "USD", null), 100);
  assert.equal(convertAmount(100, "EUR", "EUR", undefined), 100);
});

test("a missing rate gives null instead of a wrong price", () => {
  assert.equal(convertAmount(100, "USD", "EUR", null), null);
  assert.equal(convertAmount(100, "USD", "JPY", rates), null);
  assert.equal(convertAmount(100, "JPY", "USD", rates), null);
  assert.equal(convertAmount(100, "USD", "EUR", { EUR: 0 }), null);
});

test("formats whole units with the right symbol and grouping", () => {
  assert.equal(formatAmount(538, "USD"), "$538");
  assert.equal(formatAmount(1234.6, "EUR"), "€1,235");
  assert.equal(formatAmount(123456, "INR"), "₹1,23,456");
  assert.equal(formatAmount(1900, "AED"), "AED 1,900");
  assert.equal(formatAmount(500, "XYZ"), "XYZ 500");
});

test("the header shows a currency's symbol and code without repeating itself", () => {
  assert.equal(currencyShort("USD"), "$ USD");
  assert.equal(currencyShort("INR"), "₹ INR");
  assert.equal(currencyShort("CAD"), "C$ CAD");
  assert.equal(currencyShort("AED"), "AED");
  assert.equal(currencyShort("XYZ"), "XYZ");
});

test("every country has a flag image", () => {
  for (const c of COUNTRIES) {
    const flag = readFileSync(`public/flags/${c.code.toLowerCase()}.png`);
    assert.equal(flag.subarray(1, 4).toString(), "PNG", c.name);
  }
});

test("every country has a real currency and an airport the hub list knows", () => {
  const currencies = new Set<string>(CURRENCIES.map((c) => c.code));
  const hubs = new Set(airports.map((a) => a.code));
  for (const c of COUNTRIES) {
    assert.ok(currencies.has(c.currency), `${c.name} uses ${c.currency}`);
    assert.ok(hubs.has(c.airport), `${c.name} starts from ${c.airport}`);
  }
});

test("countries are unique, listed by name and include the default", () => {
  assert.equal(new Set(COUNTRIES.map((c) => c.code)).size, COUNTRIES.length);
  const names = COUNTRIES.map((c) => c.name);
  assert.deepEqual(names, [...names].sort());
  assert.equal(countryByCode(DEFAULT_COUNTRY)?.currency, "USD");
});
