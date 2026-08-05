import { pool } from "../db.js";
import type { SearchCriteria } from "./criteriaSchema.ts";

export type PropertyRow = {
  id: number;
  address: string;
  is_available: boolean;
  energy_class: string;
  buy: number | null;
  rent: number | null;
  photo: string;
  rooms: number;
  square_meters: number;
  category: string;
  year_built: number;
};

/**
 * Run parameterized SELECT against `entries` using extracted criteria
 * Not calling LLM - only maps criteria → SQL filters
 */
export async function searchProperties(
  criteria: SearchCriteria,
  limit = 5,
): Promise<PropertyRow[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];

  // Helper: push value and return its $1 / $2 / ... placeholder
  const add = (value: unknown): string => {
    params.push(value);
    return `$${params.length}`;
  };

  // Availability (default: only available listings)
  if (criteria.onlyAvailable !== false) {
    conditions.push(`is_available = ${add(true)}`);
  }

  // Rooms
  if (criteria.minRooms != null) {
    conditions.push(`rooms >= ${add(criteria.minRooms)}`);
  }
  if (criteria.maxRooms != null) {
    conditions.push(`rooms <= ${add(criteria.maxRooms)}`);
  }

  // Area
  if (criteria.minSquareMeters != null) {
    conditions.push(`square_meters >= ${add(criteria.minSquareMeters)}`);
  }
  if (criteria.maxSquareMeters != null) {
    conditions.push(`square_meters <= ${add(criteria.maxSquareMeters)}`);
  }

  // Category (DB values only — never "All")
  if (criteria.categories != null && criteria.categories.length > 0) {
    conditions.push(`category = ANY(${add(criteria.categories)})`);
  }

  // Energy class
  if (criteria.energyClass != null) {
    conditions.push(`energy_class = ${add(criteria.energyClass)}`);
  }

  // Location: city/region lives inside free-text `address` column
  if (criteria.locationHints != null && criteria.locationHints.length > 0) {
    const parts = criteria.locationHints.map(
      (hint) => `address ILIKE ${add(`%${hint}%`)}`,
    );
    // Match if ANY hint appears in address (e.g. Berlin OR Munich)
    conditions.push(`(${parts.join(" OR ")})`);
  }

  // Price + deal type (buy vs rent columns)
  const deal = criteria.dealType;
  if (deal === "buy") {
    conditions.push(`buy IS NOT NULL`);
    if (criteria.minPrice != null) {
      conditions.push(`buy >= ${add(criteria.minPrice)}`);
    }
    if (criteria.maxPrice != null) {
      conditions.push(`buy <= ${add(criteria.maxPrice)}`);
    }
  } else if (deal === "rent") {
    conditions.push(`rent IS NOT NULL`);
    if (criteria.minPrice != null) {
      conditions.push(`rent >= ${add(criteria.minPrice)}`);
    }
    if (criteria.maxPrice != null) {
      conditions.push(`rent <= ${add(criteria.maxPrice)}`);
    }
  } else if (criteria.minPrice != null || criteria.maxPrice != null) {
    // dealType any/null but user gave budget → match buy OR rent in range
    const priceParts: string[] = [];
    if (criteria.minPrice != null && criteria.maxPrice != null) {
      const minP = add(criteria.minPrice);
      const maxP = add(criteria.maxPrice);
      priceParts.push(
        `(buy IS NOT NULL AND buy >= ${minP} AND buy <= ${maxP})`,
      );
      priceParts.push(
        `(rent IS NOT NULL AND rent >= ${minP} AND rent <= ${maxP})`,
      );
    } else if (criteria.minPrice != null) {
      const minP = add(criteria.minPrice);
      priceParts.push(`(buy IS NOT NULL AND buy >= ${minP})`);
      priceParts.push(`(rent IS NOT NULL AND rent >= ${minP})`);
    } else if (criteria.maxPrice != null) {
      const maxP = add(criteria.maxPrice);
      priceParts.push(`(buy IS NOT NULL AND buy <= ${maxP})`);
      priceParts.push(`(rent IS NOT NULL AND rent <= ${maxP})`);
    }
    conditions.push(`(${priceParts.join(" OR ")})`);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const limitPlaceholder = add(limit);

  const sql = `
    SELECT
      id, address, is_available, energy_class, buy, rent,
      photo, rooms, square_meters, category, year_built
    FROM entries
    ${where}
    ORDER BY id ASC
    LIMIT ${limitPlaceholder}
  `;

  const result = await pool.query(sql, params);
  return result.rows as PropertyRow[];
}
