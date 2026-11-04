// Unit tests for visitor IDs, recorded paths and the search guard's rules.
// Run: node --test scripts/visitors.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  automatedReason,
  isLiveHost,
  isVisitorId,
  newVisitorCode,
  parseBlockedCountries,
  trackablePath,
} from "../src/lib/visitor-events.ts";

test("a new visitor ID is valid", () => {
  const id = `V-${newVisitorCode(new Uint8Array([0, 31, 32, 200, 7, 90, 255, 13]))}`;
  assert.equal(id.length, 10);
  assert.equal(isVisitorId(id), true);
});

test("anything else isn't a visitor ID", () => {
  for (const bad of [
    "",
    "V-",
    "V-abc",
    "X-7K3M9QTA",
    "V-7K3M9QTA' or 1=1",
    "V-TOOLONGTOBEAVISITOR",
  ]) {
    assert.equal(isVisitorId(bad), false, bad);
  }
});

test("only the real site records visitors", () => {
  assert.equal(isLiveHost("www.faresdream.com"), true);
  assert.equal(isLiveHost("faresdream.com"), true);
  assert.equal(isLiveHost("localhost"), false);
  assert.equal(isLiveHost("faresdream.jacksnow1919.workers.dev"), false);
  assert.equal(isLiveHost("notfaresdream.com"), false);
});

test("query strings are dropped", () => {
  assert.equal(trackablePath("/flight/search?origin=JFK"), "/flight/search");
  assert.equal(trackablePath("/deals#top"), "/deals");
  assert.equal(trackablePath(""), "/");
});

test("staff pages stay out, and verification tokens are never stored", () => {
  assert.equal(trackablePath("/admin"), null);
  assert.equal(trackablePath("/admin/dashboard"), null);
  assert.equal(trackablePath("/verify/secret-token"), "/verify");
  assert.equal(trackablePath("/administrator-tips"), "/administrator-tips");
});

test("normal browsers pass the guard", () => {
  const browsers = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.5; rv:131.0) Gecko/20100101 Firefox/131.0",
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
  ];
  for (const ua of browsers) assert.equal(automatedReason(ua), null, ua);
});

test("scripts and crawlers don't", () => {
  assert.equal(automatedReason(null), "automation");
  assert.equal(automatedReason("  "), "automation");
  assert.equal(automatedReason("Mozilla/5.0 HeadlessChrome/130.0"), "automation");
  assert.equal(automatedReason("python-requests/2.32"), "automation");
  assert.equal(automatedReason("curl/8.4"), "automation");
  assert.equal(automatedReason("node"), "automation");
  assert.equal(automatedReason("Mozilla/5.0 (compatible; Googlebot/2.1)"), "crawler");
  assert.equal(automatedReason("Mozilla/5.0 (compatible; AhrefsBot/7.0)"), "crawler");
});

test("no country is blocked unless the setting names it", () => {
  assert.equal(parseBlockedCountries(undefined).size, 0);
  assert.equal(parseBlockedCountries("").size, 0);
  assert.deepEqual([...parseBlockedCountries(" cn, ru ,bad,X")], ["CN", "RU"]);
});
