import mergeCriteria from "./mergeCriteria.ts";
import type { SearchCriteria } from "./criteriaSchema.ts";

const previous: SearchCriteria = {
  dealType: "buy",
  minRooms: 3,
  maxRooms: 3,
  minPrice: null,
  maxPrice: 500000,
  minSquareMeters: null,
  maxSquareMeters: null,
  categories: ["Apartment"],
  locationHints: ["Portugal"],
  energyClass: null,
  onlyAvailable: true,
  needMoreInfo: false,
  followUpQuestion: null,
};

const incoming: SearchCriteria = {
  dealType: "rent",
  minRooms: null,
  maxRooms: null,
  minPrice: null,
  maxPrice: null,
  minSquareMeters: null,
  maxSquareMeters: null,
  categories: null,
  locationHints: null,
  energyClass: null,
  onlyAvailable: true,
  needMoreInfo: false,
  followUpQuestion: null,
};

console.log(mergeCriteria(previous, incoming));
// expect: dealType rent, minRooms 3, locationHints ["Portugal"], categories Apartment

// For test purposes in /homesphere/server run: npx tsx src/agent/_testMerge.ts
//
//Output:
//
// {
//   dealType: 'rent',
//   minRooms: 3,
//   maxRooms: 3,
//   minPrice: null,
//   maxPrice: 500000,
//   minSquareMeters: null,
//   maxSquareMeters: null,
//   categories: [ 'Apartment' ],
//   locationHints: [ 'Portugal' ],
//   energyClass: null,
//   onlyAvailable: true,
//   needMoreInfo: false,
//   followUpQuestion: null
// }
