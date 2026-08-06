import { llm } from "./llm.ts";
import { criteriaSchema, type SearchCriteria } from "./criteriaSchema.ts";

export type ChatTurn = { role: "user" | "assistant"; content: string };

// Fixed rules for model
// NOTE: this string must stay byte-for-byte identical across requests and remain the very // first "system" turn  -> DeepSeek caches repeated prompt PREFIXES automatically
// and bills cache hits at a fraction of normal input price
const SYSTEM_PROMPT = `Extract real-estate search criteria as one JSON object matching the schema. No markdown.
 
Rules:
- null = not stated.
- categories: Apartment, Chalet, Residence, Studio, Townhouse only (never "All").
- locationHints: short country/city/region strings, e.g. "Berlin", "Italy".
- dealType: "buy"|"rent"|"any"|null.
- Prices: integers EUR.
- onlyAvailable: true unless user wants unavailable too.
- Too vague to search (no place/size/type/budget) -> needMoreInfo=true, followUpQuestion = one short question in user's language. Else needMoreInfo=false, followUpQuestion=null.
- Never invent addresses/IDs/facts.
- Follow-ups may reference earlier turns (e.g. "rent instead").
- Fields unchanged this turn -> null (server merges with previous values).
 
Example:
{"dealType":"buy","minRooms":3,"maxRooms":null,"minPrice":null,"maxPrice":500000,"minSquareMeters":null,"maxSquareMeters":null,"categories":["Apartment"],"locationHints":["Berlin"],"energyClass":null,"onlyAvailable":true,"needMoreInfo":false,"followUpQuestion":null}`;

/**
 * Turn natural-language request into SearchCriteria via DeepSeek
 */
export async function parseIntent(
  message: string,
  history: ChatTurn[] = [],
  previousCriteria: SearchCriteria | null = null,
): Promise<SearchCriteria> {
  // Wrap LLM in such way that response conforms to Zod schema -> invalid
  // formats are avoided or intercepted and LLM model must return matching JSON
  const structured = llm.withStructuredOutput(criteriaSchema, {
    method: "jsonMode", // NOTE: // DeepSeek supports only json_object, not json_schema → method: "jsonMode"
  });

  const turns: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  // Optional context: previous filters (merge still happens later in the graph)
  if (previousCriteria) {
    turns.push({
      role: "system",
      content:
        "Last known search criteria (JSON). For unchanged fields the model should return null so they can be merged:\n" +
        JSON.stringify(previousCriteria),
    });
  }

  for (const h of history) {
    turns.push({ role: h.role, content: h.content });
  }

  turns.push({ role: "user", content: message });

  const result = await structured.invoke(turns);

  return result;
}
