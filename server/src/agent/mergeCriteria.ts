import type { SearchCriteria } from "./criteriaSchema.js";

/**
 * Merge the most recently known criteria with the LLM extraction from this run
 * Specific input values ​​take precedence; "null" means "not mentioned" → retain the previous value
 */
export function mergeCriteria(
  previous: SearchCriteria | null | undefined,
  incoming: SearchCriteria,
): SearchCriteria {
  if (!previous) return incoming;

  const pick = <T>(next: T | null, prev: T | null): T | null =>
    next !== null && next !== undefined ? next : prev;

  const pickArray = <T>(next: T[] | null, prev: T[] | null): T[] | null => {
    if (next === null || next === undefined) return prev;
    if (next.length === 0) return prev;
    return next;
  };

  return {
    dealType: pick(incoming.dealType, previous.dealType),
    minRooms: pick(incoming.minRooms, previous.minRooms),
    maxRooms: pick(incoming.maxRooms, previous.maxRooms),
    minPrice: pick(incoming.minPrice, previous.minPrice),
    maxPrice: pick(incoming.maxPrice, previous.maxPrice),
    minSquareMeters: pick(incoming.minSquareMeters, previous.minSquareMeters),
    maxSquareMeters: pick(incoming.maxSquareMeters, previous.maxSquareMeters),
    categories: pickArray(incoming.categories, previous.categories),
    locationHints: pickArray(incoming.locationHints, previous.locationHints),
    energyClass: pick(incoming.energyClass, previous.energyClass),
    onlyAvailable: pick(incoming.onlyAvailable, previous.onlyAvailable),
    // Dialog control always from this turn
    needMoreInfo: incoming.needMoreInfo,
    followUpQuestion: incoming.followUpQuestion,
  };
}
