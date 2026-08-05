import "dotenv/config";
import { parseIntent } from "./parseIntent.ts";

const criteria = await parseIntent(
  "lieber zur Miete",
  [
    { role: "user", content: "3 room apartment in Portugal, buy under 500000" },
    { role: "assistant", content: "I found a matching apartment in Braga." },
  ],
  {
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
  },
);

console.log(criteria);
process.exit(0);

// In /homesphere/server run with: npx tsx src/agent/_testParseHistory.ts
//
// Output:
//
// {
//   dealType: 'rent',
//   minRooms: null,
//   maxRooms: null,
//   minPrice: null,
//   maxPrice: null,
//   minSquareMeters: null,
//   maxSquareMeters: null,
//   categories: null,
//   locationHints: null,
//   energyClass: null,
//   onlyAvailable: null,
//   needMoreInfo: false,
//   followUpQuestion: null
// }
