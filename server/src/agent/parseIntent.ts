import { llm } from "./llm.js";
import { criteriaSchema, type SearchCriteria } from "./criteriaSchema.js";

// Fixed rules for model
const SYSTEM_PROMPT = `You extract real-estate search criteria from the user message.
Return only a single valid JSON object matching the schema. Do not wrap it in markdown.

Rules:
- Use null for anything not clearly stated.
- categories: only Apartment, Chalet, Residence, Studio, Townhouse (never "All").
- locationHints: city or region names only, as short strings (e.g. "Berlin").
- dealType: "buy" for purchase, "rent" for rental, "any" if both/unclear, null if not mentioned.
- Prices are integers in EUR (e.g. 500000), no currency symbols.
- onlyAvailable: true unless the user wants unavailable listings too.
- If the request is too vague to search (no place, size, type, or budget at all), set needMoreInfo to true and set followUpQuestion to one short clarifying question in the same language as the user.
- If you can search with what was given, needMoreInfo must be false and followUpQuestion null.
- Never invent addresses, listing IDs, or facts not implied by the user message.

Example JSON shape:
{
  "dealType": "buy",
  "minRooms": 3,
  "maxRooms": null,
  "minPrice": null,
  "maxPrice": 500000,
  "minSquareMeters": null,
  "maxSquareMeters": null,
  "categories": ["Apartment"],
  "locationHints": ["Berlin"],
  "energyClass": null,
  "onlyAvailable": true,
  "needMoreInfo": false,
  "followUpQuestion": null
}`;

/**
 * Turn natural-language request into SearchCriteria via DeepSeek
 */
export async function parseIntent(message: string): Promise<SearchCriteria> {
  // Wrap LLM in such way that response conforms to Zod schema -> invalid
  // formats are avoided or intercepted and LLM model must return matching JSON
  const structured = llm.withStructuredOutput(criteriaSchema, {
    method: "jsonMode", // NOTE: // DeepSeek supports only json_object, not json_schema → method: "jsonMode"
  });

  const result = await structured.invoke([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: message },
  ]);

  return result;
}
