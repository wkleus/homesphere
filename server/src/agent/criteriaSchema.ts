import { z } from "zod";

// Must match the `category` values stored in the entries table
const categoryEnum = z.enum([
  "Apartment",
  "Chalet",
  "Residence",
  "Studio",
  "Townhouse",
]);

/**
 * Structured search criteria extracted from user's natural-language message
 * Only fields that map onto `entries` table columns
 * Null / empty = "not specified" → ignore that filter in SQL
 */
export const criteriaSchema = z.object({
  // "buy" → filter on buy; "rent" → filter on rent; "any"/null → either
  dealType: z.enum(["buy", "rent", "any"]).nullable(),

  minRooms: z.number().int().positive().nullable(),
  maxRooms: z.number().int().positive().nullable(),

  // EUR limits; applied to buy or rent depending on dealType
  minPrice: z.number().int().nonnegative().nullable(),
  maxPrice: z.number().int().nonnegative().nullable(),

  minSquareMeters: z.number().int().positive().nullable(),
  maxSquareMeters: z.number().int().positive().nullable(),

  categories: z.array(categoryEnum).nullable(),

  // e.g. ["Berlin"] → address ILIKE '%Berlin%' (city is part of address text)
  locationHints: z.array(z.string().min(1)).nullable(),

  energyClass: z.string().min(1).max(5).nullable(),

  // Prefer available listings unless user asks otherwise
  onlyAvailable: z.boolean().nullable(),

  // True when user request is too vague to search usefully
  needMoreInfo: z.boolean(),
  followUpQuestion: z.string().nullable(),
});

export type SearchCriteria = z.infer<typeof criteriaSchema>;
