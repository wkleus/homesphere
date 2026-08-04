import "dotenv/config";
import { parseIntent } from "./parseIntent.js";
import { searchProperties } from "./searchProperties.js";

// → locationHints: null → should yield results if seeds match
const message = "3-room apartment, buy under 500000 euros";

const criteria = await parseIntent(message);
console.log("criteria:", criteria);

if (!criteria.needMoreInfo) {
  const rows = await searchProperties(criteria, 5);
  console.log("hits:", rows.length);
  console.log(rows);
} else {
  console.log("follow-up:", criteria.followUpQuestion);
}

process.exit(0);

// In /homesphere/server run with: npx tsx src/agent/_testParse.ts
// -> Example output (if matching seeds exist):
//
// criteria: {
//   dealType: 'buy',
//   minRooms: 3,
//   maxRooms: null,
//   minPrice: null,
//   maxPrice: 500000,
//   minSquareMeters: null,
//   maxSquareMeters: null,
//   categories: [ 'Apartment' ],
//   locationHints: null,
//   energyClass: null,
//   onlyAvailable: true,
//   needMoreInfo: false,
//   followUpQuestion: null
// }
// hits: 1
// [
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
