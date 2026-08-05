import { llm } from "./llm.ts";
import { criteriaSchema, type SearchCriteria } from "./criteriaSchema.ts";

export type ChatTurn = { role: "user" | "assistant"; content: string };

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
- Follow-ups may refer to earlier messages (e.g. "rent instead", "lieber zur Miete").
- For fields the user did not change in this turn, return null so the server can keep previous values.

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
