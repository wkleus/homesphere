import "dotenv/config";
import { runAgent } from "./graph.js";

const out = await runAgent({
  message: "lieber zur Miete",
  history: [
    {
      role: "user",
      content: "3 room apartment in Portugal, buy under 500000",
    },
    {
      role: "assistant",
      content: "I found a matching apartment in Braga.",
    },
  ],
  previousCriteria: {
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
});

console.log(JSON.stringify(out, null, 2));
process.exit(0);

// In /homesphere/server run with: npx tsx src/agent/_testGraphMemory.ts
//
// Example output (JSON):
//
// {
//   "status": "no_match",
//   "criteria": {
//     "dealType": "rent",
//     "minRooms": 3,
//     "maxRooms": 3,
//     "minPrice": null,
//     "maxPrice": 500000,
//     "minSquareMeters": null,
//     "maxSquareMeters": null,
//     "categories": [
//       "Apartment"
//     ],
//     "locationHints": [
//       "Portugal"
//     ],
//     "energyClass": null,
//     "onlyAvailable": true,
//     "needMoreInfo": false,
//     "followUpQuestion": null
//   },
//   "suggestions": [],
//   "followUpQuestion": null
// }
