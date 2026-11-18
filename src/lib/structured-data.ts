/**
 * Schema.org JSON-LD for Google. Each helper returns a `script` entry for a route's
 * `head().scripts`, so the data is in the server-rendered HTML.
 * Only describe what the page visibly shows (Google's structured data guidelines).
 */
import { LOGO, PHONE_DISPLAY, SUPPORT_EMAIL, BRAND } from "./brand";
import { SITE_URL } from "./seo";

type Json = Record<string, unknown>;

export function jsonLdScript(data: Json | Json[]) {
  return {
    type: "application/ld+json",
    // "<" is escaped so page text can never close the script tag early.
    children: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}

/** Who we are: on every page via the root route. Address must match OFFICE_ADDRESS in brand.ts. */
export function organizationLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}${LOGO.src}`,
    image: `${SITE_URL}${LOGO.src}`,
    telephone: PHONE_DISPLAY,
    email: SUPPORT_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: "47 W 13th St",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10011",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE_DISPLAY,
      contactType: "customer service",
      areaServed: "Worldwide",
      availableLanguage: ["English"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    },
  };
}

export function websiteLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BRAND,
    url: `${SITE_URL}/`,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** Breadcrumb trail; the last item is the current page. */
export function breadcrumbLd(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** Questions and answers that are visible on the page, as plain text. */
export function faqLd(faqs: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** A guide or article, with visible dates and the organization as author and publisher. */
export function articleLd(a: {
  headline: string;
  description: string;
  path: string;
  published: string;
  updated: string;
  author: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.headline,
    description: a.description,
    mainEntityOfPage: SITE_URL + a.path,
    datePublished: a.published,
    dateModified: a.updated,
    author: { "@type": "Organization", name: a.author, url: SITE_URL + "/about" },
    publisher: { "@type": "Organization", name: "FaresDream", url: SITE_URL },
  };
}
