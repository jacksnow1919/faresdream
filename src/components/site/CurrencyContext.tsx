import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_CURRENCY } from "@/lib/brand";
import { getExchangeRates } from "@/lib/exchange-rates.functions";
import {
  convertAmount,
  countryByCode,
  currencyByCode,
  DEFAULT_COUNTRY,
  formatAmount,
} from "@/lib/regional";

const STORAGE_KEY = "faresdream:region";
const RATES_FRESH_MS = 6 * 60 * 60 * 1000;

type Region = { country: string; currency: string };

type Ctx = Region & {
  setRegion: (region: Region) => void;
  /** The currency `money` shows an amount in: the visitor's, or `from` when there's no rate. */
  displayCurrency: (from?: string) => string;
  /** An amount quoted in `from` (US dollars by default), in the visitor's currency. */
  money: (amount: number, from?: string) => string;
};

const CurrencyCtx = createContext<Ctx>({
  country: DEFAULT_COUNTRY,
  currency: DEFAULT_CURRENCY,
  setRegion: () => {},
  displayCurrency: (from = DEFAULT_CURRENCY) => from,
  money: (amount, from = DEFAULT_CURRENCY) => formatAmount(amount, from),
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // USD is the global default for search params, API payloads and display.
  const [region, setRegionState] = useState<Region>({
    country: DEFAULT_COUNTRY,
    currency: DEFAULT_CURRENCY,
  });

  // localStorage is only available after mount, which also keeps SSR markup stable.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Region | null;
      if (saved && countryByCode(saved.country) && currencyByCode(saved.currency)) {
        setRegionState({ country: saved.country, currency: saved.currency });
      }
    } catch {
      // Blocked or damaged storage just means the defaults.
    }
  }, []);

  const setRegion = useCallback((next: Region) => {
    setRegionState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // The choice still applies until the page reloads.
    }
  }, []);

  const { data: rates } = useQuery({
    queryKey: ["exchange-rates"],
    queryFn: () => getExchangeRates(),
    enabled: region.currency !== DEFAULT_CURRENCY,
    staleTime: RATES_FRESH_MS,
    retry: 1,
  });

  const value = useMemo<Ctx>(
    () => ({
      ...region,
      setRegion,
      displayCurrency: (from = DEFAULT_CURRENCY) =>
        convertAmount(1, from, region.currency, rates) === null ? from : region.currency,
      money: (amount, from = DEFAULT_CURRENCY) => {
        const converted = convertAmount(amount, from, region.currency, rates);
        return converted === null
          ? formatAmount(amount, from)
          : formatAmount(converted, region.currency);
      },
    }),
    [region, rates, setRegion],
  );

  return <CurrencyCtx.Provider value={value}>{children}</CurrencyCtx.Provider>;
}

export const useCurrency = () => useContext(CurrencyCtx);

/** A price quoted in US dollars, shown in the visitor's currency. */
export function Price({ amount }: { amount: number }) {
  const { money } = useCurrency();
  return <>{money(amount)}</>;
}
