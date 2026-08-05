import "dotenv/config";
import { searchProperties } from "./searchProperties.ts";
import type { SearchCriteria } from "./criteriaSchema.ts";

const criteria: SearchCriteria = {
  dealType: "buy",
  minRooms: 3,
  maxRooms: null,
  minPrice: null,
  maxPrice: 600000,
  minSquareMeters: null,
  maxSquareMeters: null,
  categories: ["Apartment"],
  locationHints: null, // or e.g. ["Berlin"] if matching seeds
  energyClass: null,
  onlyAvailable: true,
  needMoreInfo: false,
  followUpQuestion: null,
};

const rows = await searchProperties(criteria, 5);
console.log("hits:", rows.length);
console.log(rows);
process.exit(0);

// In /homesphere/server run with: npx tsx src/agent/_testSearch.ts
//
// -> Example output (if matching seeds exist):
//
// hits: 1
//  [
//   {
//     id: 32,
//     address: 'Rua das Flores 10, Braga, Portugal',
//     is_available: true,
//     energy_class: 'C',
//     buy: 310000,
//     rent: null,
//     photo: '/photos/apartment_5.webp',
//     rooms: 3,
//     square_meters: 72,
//     category: 'Apartment',
//     year_built: 1996
//   }
// ]
