// Unit tests for route pages (/flights/$slug). Run: node --experimental-strip-types --test scripts/route-pages.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  clockChange,
  clockSentence,
  distanceMiles,
  relatedRoutes,
  routeFaqs,
  routeInsights,
  routePageBySlug,
  routePages,
} from "../src/lib/route-pages.ts";

test("every route page has 12 months of data and a unique slug", () => {
  assert.ok(routePages.length >= 10);
  const slugs = new Set(routePages.map((r) => r.slug));
  assert.equal(slugs.size, routePages.length);
  for (const r of routePages) {
    assert.equal(r.data.monthly.length, 12, r.slug);
    assert.match(r.slug, /^[a-z]{3}-to-[a-z]{3}$/);
    assert.ok(r.data.source.startsWith("https://www.kayak.com/flight-routes/"), r.slug);
    assert.ok(r.tips.length >= 1, r.slug);
  }
});

test("insights are computed from the data", () => {
  const p = routePageBySlug("jfk-to-mco")!;
  const x = routeInsights(p);
  assert.equal(x.cheapIdx, 0); // January in the Nov 18, 2026 data
  assert.equal(x.cheapPrice, Math.min(...p.data.monthly));
  assert.equal(x.peakPrice, Math.max(...p.data.monthly));
  assert.ok(x.book && x.book.weeks >= 1 && x.book.weeks <= 26);
  assert.ok(x.book!.price <= x.book!.lastMinute);
});

test("distance and time zones", () => {
  const jfk = { lat: 40.6413, lon: -73.7781 };
  const lax = { lat: 33.9416, lon: -118.4085 };
  const miles = distanceMiles(jfk, lax);
  assert.ok(miles > 2400 && miles < 2500, String(miles)); // ~2,475 mi
  assert.deepEqual(clockChange("America/Chicago", "America/New_York"), { winter: 1, summer: 1 });
  // Hawaii has no daylight saving time
  assert.deepEqual(clockChange("America/Los_Angeles", "Pacific/Honolulu"), { winter: -2, summer: -3 });
  assert.equal(clockSentence("Atlanta", "Orlando", { winter: 0, summer: 0 }), "Orlando is in the same time zone as Atlanta.");
  assert.equal(
    clockSentence("Los Angeles", "Honolulu", { winter: -2, summer: -3 }),
    "Honolulu is 2 hours behind Los Angeles in winter and 3 hours behind in summer.",
  );
});

test("FAQ answers carry route-specific numbers and related links exclude the page", () => {
  for (const p of routePages) {
    const faqs = routeFaqs(p, routeInsights(p));
    assert.ok(faqs.length >= 5, p.slug);
    assert.ok(faqs.every((f) => /\$|\d/.test(f.a)), p.slug);
    assert.ok(relatedRoutes(p).every((r) => r.slug !== p.slug));
  }
});
