export const BRAND = "FaresDream";
export const BRAND_DOMAIN = "faresdream.com";

export const PHONE_DISPLAY = "+1-888-596-7882";
export const PHONE_TEL = "+18885967882";
export const SUPPORT_EMAIL = "support@faresdream.com";
export const OFFICE_ADDRESS = "Ground Floor, 13th Street. 47 W 13th St, New York, NY 10011, USA";
export const PROMO_CODE = "DIAL50";

/** The site logo (from faresdream.com, trimmed of its empty margins), served from /public. */
/** The simple mark: white for the dark header and footer, navy for light backgrounds. */
export const LOGO_ON_DARK = {
  src: "/brand/faresdream-mark-on-dark.svg",
  width: 919,
  height: 180,
} as const;
export const LOGO_ON_LIGHT = {
  src: "/brand/faresdream-mark-on-light.svg",
  width: 919,
  height: 180,
} as const;

/** Our own fees per passenger; keep in sync with /refund-policy and the home FAQ. */
export const CANCEL_SERVICE_FEE_USD = 75;
export const CHANGE_SERVICE_FEE_USD = 50;

export const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD ($)", name: "US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR (€)", name: "Euro" },
  { code: "GBP", symbol: "£", label: "GBP (£)", name: "British Pound" },
  { code: "CAD", symbol: "C$", label: "CAD (C$)", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", label: "AUD (A$)", name: "Australian Dollar" },
  { code: "INR", symbol: "₹", label: "INR (₹)", name: "Indian Rupee" },
  { code: "AED", symbol: "AED ", label: "AED", name: "UAE Dirham" },
  { code: "SAR", symbol: "SAR ", label: "SAR", name: "Saudi Riyal" },
  { code: "QAR", symbol: "QAR ", label: "QAR", name: "Qatari Riyal" },
  { code: "SGD", symbol: "S$", label: "SGD (S$)", name: "Singapore Dollar" },
  { code: "JPY", symbol: "¥", label: "JPY (¥)", name: "Japanese Yen" },
  { code: "NZD", symbol: "NZ$", label: "NZD (NZ$)", name: "New Zealand Dollar" },
  { code: "CHF", symbol: "CHF ", label: "CHF", name: "Swiss Franc" },
  { code: "HKD", symbol: "HK$", label: "HKD (HK$)", name: "Hong Kong Dollar" },
  { code: "CNY", symbol: "CN¥", label: "CNY (CN¥)", name: "Chinese Yuan" },
  { code: "MXN", symbol: "MX$", label: "MXN (MX$)", name: "Mexican Peso" },
  { code: "BRL", symbol: "R$", label: "BRL (R$)", name: "Brazilian Real" },
  { code: "ZAR", symbol: "R ", label: "ZAR (R)", name: "South African Rand" },
  { code: "THB", symbol: "฿", label: "THB (฿)", name: "Thai Baht" },
  { code: "MYR", symbol: "RM ", label: "MYR (RM)", name: "Malaysian Ringgit" },
  { code: "PHP", symbol: "₱", label: "PHP (₱)", name: "Philippine Peso" },
  { code: "IDR", symbol: "Rp ", label: "IDR (Rp)", name: "Indonesian Rupiah" },
  { code: "KRW", symbol: "₩", label: "KRW (₩)", name: "South Korean Won" },
  { code: "SEK", symbol: "SEK ", label: "SEK", name: "Swedish Krona" },
  { code: "NOK", symbol: "NOK ", label: "NOK", name: "Norwegian Krone" },
  { code: "DKK", symbol: "DKK ", label: "DKK", name: "Danish Krone" },
  { code: "PLN", symbol: "PLN ", label: "PLN", name: "Polish Zloty" },
  { code: "TRY", symbol: "₺", label: "TRY (₺)", name: "Turkish Lira" },
  { code: "ILS", symbol: "₪", label: "ILS (₪)", name: "Israeli Shekel" },
] as const;

export const DEFAULT_CURRENCY = "USD";
