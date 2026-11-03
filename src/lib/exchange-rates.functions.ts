import { createServerFn } from "@tanstack/react-start";
import type { ExchangeRates } from "./regional";

/** European Central Bank rates, updated once each working day. No key needed. */
const RATES_URL = "https://api.frankfurter.dev/v1/latest?base=USD";
const REQUEST_TIMEOUT_MS = 8_000;
const MAX_AGE_MS = 6 * 60 * 60 * 1000;

/** Currencies fixed to the US dollar, which the rates feed doesn't carry. */
const USD_PEGS: ExchangeRates = { AED: 3.6725, SAR: 3.75, QAR: 3.64 };

let cached: { rates: ExchangeRates; at: number } | null = null;

/** Rates for showing estimated prices. Null when they can't be fetched, so prices stay as quoted. */
export const getExchangeRates = createServerFn({ method: "GET" }).handler(
  async (): Promise<ExchangeRates | null> => {
    if (cached && Date.now() - cached.at < MAX_AGE_MS) return cached.rates;
    try {
      const res = await fetch(RATES_URL, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`rates feed responded ${res.status}`);
      const body = (await res.json()) as { rates?: ExchangeRates };
      if (!body.rates?.["EUR"]) throw new Error("rates feed returned no rates");
      cached = { rates: { ...body.rates, ...USD_PEGS, USD: 1 }, at: Date.now() };
      return cached.rates;
    } catch (error) {
      console.error("[Rates] fetch failed", error);
      // Slightly old rates are still fine for an estimate.
      return cached?.rates ?? null;
    }
  },
);
