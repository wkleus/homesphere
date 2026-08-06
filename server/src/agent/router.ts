import { Router } from "express";
import { z } from "zod";
import { runAgent } from "./graph.ts";
import type { PropertyRow } from "./searchProperties.ts";
import rateLimit from "express-rate-limit";
import { criteriaSchema } from "./criteriaSchema.ts";

const router = Router();

// Short window: stop bursts / rapid spam
const agentBurstLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: { error: "Too many AI requests, please try again later." },
});

// Long window: daily budget per IP (in-memory; resets on server restart)
const agentDailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10,
  message: {
    error: "Daily AI request limit reached. Please try again tomorrow.",
  },
});

const historyItemSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

// Body must contain non-empty message string; empty or extremely long text → 400
const matchBodySchema = z.object({
  message: z.string().trim().min(1).max(1000),
  locale: z.enum(["en", "de"]).optional(),
  // Last few turns BEFORE the current message (current text is `message` only)
  history: z.array(historyItemSchema).max(6).optional(),
  // Last criteria returned by the API (same shape as SearchCriteria)
  previousCriteria: criteriaSchema.nullable().optional(),
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
 *  Body: { message, history?, previousCriteria?, locale? }
 *  Runs parse → search and returns status + suggestions */
router.post(
  "/match",
  agentBurstLimiter,
  agentDailyLimiter,
  async (req, res) => {
    const parsed = matchBodySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: z.flattenError(parsed.error),
      });
    }

    const { message, history, previousCriteria } = parsed.data;

    try {
      // Pass short memory so follow-ups keep prior filters
      const result = await runAgent({
        message,
        history,
        previousCriteria,
      });

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
  },
);

export default router;

/* Enter in terminal - for test purposes:

 curl -X POST http://localhost:3000/api/agent/match \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"apartment in Portugal\"}"

  curl -X POST http://localhost:3000/api/agent/match \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"lieber zur Miete\",\"history\":[{\"role\":\"user\",\"content\":\"3 room apartment in Portugal buy\"},{\"role\":\"assistant\",\"content\":\"I found 1 listing\"}],\"previousCriteria\":{\"dealType\":\"buy\",\"minRooms\":3,\"maxRooms\":3,\"minPrice\":null,\"maxPrice\":500000,\"minSquareMeters\":null,\"maxSquareMeters\":null,\"categories\":[\"Apartment\"],\"locationHints\":[\"Portugal\"],\"energyClass\":null,\"onlyAvailable\":true,\"needMoreInfo\":false,\"followUpQuestion\":null}}"

 Output (example):

 {"status":"ok","criteria":{"dealType":null,"minRooms":null,"maxRooms":null,"minPrice":null,"maxPrice":null,"minSquareMeters":null,"maxSquareMeters":null,"categories":["Apartment"],"locationHints":["Portugal"],"energyClass":null,"onlyAvailable":true,"needMoreInfo":false,"followUpQuestion":null},"suggestions":[{"id":32,"address":"Rua das Flores 10, Braga, Portugal","isAvailable":true,"energyClass":"C","buy":310000,"rent":null,"photo":"/photos/apartment_5.webp","rooms":3,"squareMeters":72,"category":"Apartment","yearBuilt":1996}],"followUpQuestion":null}

 {"status":"no_match","criteria":{"dealType":"rent","minRooms":3,"maxRooms":3,"minPrice":null,"maxPrice":500000,"minSquareMeters":null,"maxSquareMeters":null,"categories":["Apartment"],"locationHints":["Portugal"],"energyClass":null,"onlyAvailable":true,"needMoreInfo":false,"followUpQuestion":null},"suggestions":[],"followUpQuestion":null}

*/
