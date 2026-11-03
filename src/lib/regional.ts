import { CURRENCIES } from "./brand.ts";

/** Units of each currency per 1 US dollar. */
export type ExchangeRates = Record<string, number>;

export type Country = { code: string; name: string; currency: string; airport: string };

export const DEFAULT_COUNTRY = "US";

/** Each country's usual currency and main airport, used as defaults when a visitor picks it. */
export const COUNTRIES: Country[] = [
  { code: "AR", name: "Argentina", currency: "USD", airport: "EZE" },
  { code: "AU", name: "Australia", currency: "AUD", airport: "SYD" },
  { code: "AT", name: "Austria", currency: "EUR", airport: "VIE" },
  { code: "BD", name: "Bangladesh", currency: "USD", airport: "DAC" },
  { code: "BE", name: "Belgium", currency: "EUR", airport: "BRU" },
  { code: "BR", name: "Brazil", currency: "BRL", airport: "GRU" },
  { code: "CA", name: "Canada", currency: "CAD", airport: "YYZ" },
  { code: "CN", name: "China", currency: "CNY", airport: "PEK" },
  { code: "DK", name: "Denmark", currency: "DKK", airport: "CPH" },
  { code: "EG", name: "Egypt", currency: "USD", airport: "CAI" },
  { code: "FI", name: "Finland", currency: "EUR", airport: "HEL" },
  { code: "FR", name: "France", currency: "EUR", airport: "CDG" },
  { code: "DE", name: "Germany", currency: "EUR", airport: "FRA" },
  { code: "GR", name: "Greece", currency: "EUR", airport: "ATH" },
  { code: "HK", name: "Hong Kong", currency: "HKD", airport: "HKG" },
  { code: "IN", name: "India", currency: "INR", airport: "DEL" },
  { code: "ID", name: "Indonesia", currency: "IDR", airport: "CGK" },
  { code: "IE", name: "Ireland", currency: "EUR", airport: "DUB" },
  { code: "IL", name: "Israel", currency: "ILS", airport: "TLV" },
  { code: "IT", name: "Italy", currency: "EUR", airport: "FCO" },
  { code: "JP", name: "Japan", currency: "JPY", airport: "HND" },
  { code: "KE", name: "Kenya", currency: "USD", airport: "NBO" },
  { code: "KW", name: "Kuwait", currency: "USD", airport: "KWI" },
  { code: "MY", name: "Malaysia", currency: "MYR", airport: "KUL" },
  { code: "MX", name: "Mexico", currency: "MXN", airport: "MEX" },
  { code: "NP", name: "Nepal", currency: "USD", airport: "KTM" },
  { code: "NL", name: "Netherlands", currency: "EUR", airport: "AMS" },
  { code: "NZ", name: "New Zealand", currency: "NZD", airport: "AKL" },
  { code: "NG", name: "Nigeria", currency: "USD", airport: "LOS" },
  { code: "NO", name: "Norway", currency: "NOK", airport: "OSL" },
  { code: "OM", name: "Oman", currency: "USD", airport: "MCT" },
  { code: "PK", name: "Pakistan", currency: "USD", airport: "KHI" },
  { code: "PH", name: "Philippines", currency: "PHP", airport: "MNL" },
  { code: "PL", name: "Poland", currency: "PLN", airport: "WAW" },
  { code: "PT", name: "Portugal", currency: "EUR", airport: "LIS" },
  { code: "QA", name: "Qatar", currency: "QAR", airport: "DOH" },
  { code: "SA", name: "Saudi Arabia", currency: "SAR", airport: "RUH" },
  { code: "SG", name: "Singapore", currency: "SGD", airport: "SIN" },
  { code: "ZA", name: "South Africa", currency: "ZAR", airport: "JNB" },
  { code: "KR", name: "South Korea", currency: "KRW", airport: "ICN" },
  { code: "ES", name: "Spain", currency: "EUR", airport: "MAD" },
  { code: "LK", name: "Sri Lanka", currency: "USD", airport: "CMB" },
  { code: "SE", name: "Sweden", currency: "SEK", airport: "ARN" },
  { code: "CH", name: "Switzerland", currency: "CHF", airport: "ZRH" },
  { code: "TH", name: "Thailand", currency: "THB", airport: "BKK" },
  { code: "TR", name: "Turkey", currency: "TRY", airport: "IST" },
  { code: "AE", name: "United Arab Emirates", currency: "AED", airport: "DXB" },
  { code: "GB", name: "United Kingdom", currency: "GBP", airport: "LHR" },
  { code: "US", name: "United States", currency: "USD", airport: "JFK" },
  { code: "VN", name: "Vietnam", currency: "USD", airport: "SGN" },
];

export const countryByCode = (code: string) => COUNTRIES.find((c) => c.code === code);

export const currencyByCode = (code: string) => CURRENCIES.find((c) => c.code === code);

/** "₹ INR", or just "AED" where the symbol is the code itself. */
export function currencyShort(code: string): string {
  const symbol = currencyByCode(code)?.symbol.trim();
  return symbol && symbol !== code ? `${symbol} ${code}` : code;
}

/** The amount in another currency, or null when a rate is missing so callers never guess. */
export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: ExchangeRates | null | undefined,
): number | null {
  if (from === to) return amount;
  const fromRate = from === "USD" ? 1 : rates?.[from];
  const toRate = to === "USD" ? 1 : rates?.[to];
  if (!fromRate || !toRate) return null;
  return (amount / fromRate) * toRate;
}

/** "€480" or "₹1,23,456": whole units, because converted prices are estimates. */
export function formatAmount(amount: number, currency: string): string {
  const symbol = currencyByCode(currency)?.symbol ?? `${currency} `;
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return `${symbol}${Math.round(amount).toLocaleString(locale)}`;
}
