import "dotenv/config";
import { runAgent } from "./graph.ts";

const out = await runAgent(
  //   "3-room apartment in Portugal, buy under 500000 euros",
  "something beautiful in Europe",
);
console.log(JSON.stringify(out, null, 2));
process.exit(0);

// In /homesphere/server run: npx tsx src/agent/_testGraph.ts
// -> Example output:
//
// 1. Example:
//
// {
//   "status": "ok",
//   "criteria": {
//     "dealType": "buy",
//     "minRooms": 3,
//     "maxRooms": null,
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
//   "suggestions": [
//     {
//       "id": 32,
//       "address": "Rua das Flores 10, Braga, Portugal",
//       "is_available": true,
//       "energy_class": "C",
//       "buy": 310000,
//       "rent": null,
//       "photo": "/photos/apartment_5.webp",
//       "rooms": 3,
//       "square_meters": 72,
//       "category": "Apartment",
//       "year_built": 1996
//     }
//   ],
//   "followUpQuestion": null
// }
//
// 2. Example:
//
// {
//   "status": "need_more_info",
//   "criteria": {
//     "dealType": null,
//     "minRooms": null,
//     "maxRooms": null,
//     "minPrice": null,
//     "maxPrice": null,
//     "minSquareMeters": null,
//     "maxSquareMeters": null,
//     "categories": null,
//     "locationHints": null,
//     "energyClass": null,
//     "onlyAvailable": true,
//     "needMoreInfo": true,
//     "followUpQuestion": "What location, property type, and budget do you have in mind?"
//   },
//   "suggestions": [],
//   "followUpQuestion": "What location, property type, and budget do you have in mind?"
// }
