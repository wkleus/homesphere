import { z } from "zod";

// Shared helpers
const positiveInt = z.coerce.number().int().positive();
const nonNegativeInt = z.coerce.number().int().nonnegative();

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().trim().email("Invalid email address").max(255),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
  property: z.string().trim().max(200).optional().default("HomeSphere"),
});

export const entrySchema = z.object({
  address: z.string().trim().min(5).max(300),
  // Must match categories used in frontend filters
  category: z.enum(["Apartment", "Chalet", "Residence", "Studio", "Townhouse"]),
  is_available: z.boolean(),
  energy_class: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-G][+]{0,2}$/, "Invalid energy class (e.g. A, B+, C++)")
    .max(5),
  rooms: positiveInt.max(50),
  square_meters: positiveInt.max(10000),
  year_built: z.coerce
    .number()
    .int()
    .min(1800)
    .max(new Date().getFullYear() + 2),
  buy: nonNegativeInt.nullable().optional(),
  rent: nonNegativeInt.nullable().optional(),
  photo: z.union([
    z.string().url().max(500),
    z.string().startsWith("/").max(500),
  ]),
});

// Schema for :id Params
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
