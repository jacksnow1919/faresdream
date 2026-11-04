import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PROVIDER_KEYS } from "./flight-providers";

const searchSchema = z.object({
  origin: z.string().min(3).max(4),
  destination: z.string().min(3).max(4),
  departDate: z.string().min(8).max(10),
  returnDate: z.string().min(8).max(10).optional(),
  adults: z.number().int().min(1).max(9).optional(),
  children: z.number().int().min(0).max(9).optional(),
  infants: z.number().int().min(0).max(9).optional(),
  cabinClass: z.enum(["Economy", "PremiumEconomy", "Business", "First"]).optional(),
  currency: z.string().min(3).max(3).optional(),
  solutions: z.number().int().min(1).max(50).optional(),
  airline: z.string().max(3).optional(),
  provider: z.enum(PROVIDER_KEYS),
  /** Random per search, made by the page; ties each API's log row together. */
  searchId: z
    .string()
    .regex(/^[a-z0-9-]{6,40}$/)
    .optional(),
});

/**
 * Asks one flight API for live fares on the server; credentials stay server-side. The page
 * calls this once per API so fares appear as soon as the fastest one answers.
 */
export const searchOneProvider = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => searchSchema.parse(input))
  .handler(async ({ data: { provider, searchId, ...query } }) => {
    const { admitSearch } = await import("./search-guard.server");
    if (!(await admitSearch(provider))) {
      return { provider, status: "error" as const, fares: [] };
    }
    const { searchProvider } = await import("./provider-search.server");
    return searchProvider(provider, query, searchId);
  });
