import { Router } from "express";
import { z } from "zod";
import { runAgent } from "./graph.js";
import type { PropertyRow } from "./searchProperties.js";

const router = Router();

// Body must contain non-empty message string; empty or extremely long text → 400
const matchBodySchema = z.object({
  message: z.string().trim().min(1).max(1000),
  locale: z.enum(["en", "de"]).optional(),
});

/** Map DB snake_case row → camelCase for React client */
function toSuggestion(row: PropertyRow) {
  return {
    id: row.id,
    address: row.address,
    isAvailable: row.is_available,
    energyClass: row.energy_class,
    buy: row.buy,
    rent: row.rent,
    photo: row.photo,
    rooms: row.rooms,
    squareMeters: row.square_meters,
    category: row.category,
    yearBuilt: row.year_built,
  };
}

/** POST /match
 *  Body: { message: string, locale?: "en" | "de" }
 *  Runs parse → search and returns status + suggestions */
router.post("/match", async (req, res) => {
  const parsed = matchBodySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten(),
    });
  }

  const { message } = parsed.data;

  try {
    const result = await runAgent(message);

    return res.status(200).json({
      status: result.status,
      criteria: result.criteria,
      suggestions: (result.suggestions ?? []).map(toSuggestion),
      followUpQuestion: result.followUpQuestion,
    });
  } catch (err) {
    console.error("Agent error:", err);
    return res.status(500).json({
      error: "Agent failed to process the request",
    });
  }
});

export default router;

/* Enter in terminal - for test purposes:

 curl -X POST http://localhost:3000/api/agent/match   -H "Content-Type: application/json"   -d "{\"message\":\"3-room apartment buy under 500000\"}"

 Output (example):

 {"status":"ok","criteria":{"dealType":"buy","minRooms":3,"maxRooms":null,"minPrice":null,"maxPrice":500000,"minSquareMeters":null,"maxSquareMeters":null,"categories":["Apartment"],"locationHints":null,"energyClass":null,"onlyAvailable":true,"needMoreInfo":false,"followUpQuestion":null},"suggestions":[{"id":32,"address":"Rua das Flores 10, Braga, Portugal","isAvailable":true,"energyClass":"C","buy":310000,"rent":null,"photo":"/photos/apartment_5.webp","rooms":3,"squareMeters":72, "category":"Apartment","yearBuilt":1996}],"followUpQuestion":null} 
 */
