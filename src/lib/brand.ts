export const BRAND = "FaresDream";
export const BRAND_DOMAIN = "faresdream.com";

export const PHONE_DISPLAY = "+1-888-596-7882";
export const PHONE_TEL = "+18885967882";
export const SUPPORT_EMAIL = "support@faresdream.com";
export const OFFICE_ADDRESS = "Ground Floor, 13th Street. 47 W 13th St, New York, NY 10011, USA";
export const PROMO_CODE = "DIAL50";

/** The site logo (from faresdream.com, trimmed of its empty margins), served from /public. */
export const LOGO = { src: "/brand/faresdream-logo.webp", width: 687, height: 128 } as const;

/** Our own fees per passenger; keep in sync with /refund-policy and the home FAQ. */
export const CANCEL_SERVICE_FEE_USD = 75;
export const CHANGE_SERVICE_FEE_USD = 50;

export const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "CAD", symbol: "C$", label: "CAD (C$)" },
  { code: "AUD", symbol: "A$", label: "AUD (A$)" },
] as const;

export const DEFAULT_CURRENCY = "USD";
