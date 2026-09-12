import { callFreeAiChat, deepseekLlm, invokeWithFallback } from "./llm.ts";
import {
  criteriaSchema,
  lenientCriteriaSchema,
  type SearchCriteria,
} from "./criteriaSchema.ts";

export type ChatTurn = { role: "user" | "assistant"; content: string };

// Fixed rules for the model - remain identical across different requests and
// constitute the initial "system" turn
// NOTE: DeepSeek caches recurring prompt prefixes and calculates cache hits at a fraction of the standard input price
const SYSTEM_PROMPT = `Extract real-estate search criteria as one JSON object matching the schema. No markdown. Answer in user's language.
 
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
  Converts a natural-language search query into search criteria using Free.ai (primary, low-cost/free) and falls back to DeepSeek if the Free.ai budget is exhausted
 */
export async function parseIntent(
  message: string,
  history: ChatTurn[] = [],
  previousCriteria: SearchCriteria | null = null,
): Promise<SearchCriteria> {
  // DeepSeek fallback stays fully structured via LangChain
  const deepseekStructured = deepseekLlm.withStructuredOutput(criteriaSchema, {
    method: "jsonMode", // NOTE: DeepSeek supports only json_object, not json_schema → method: "jsonMode"
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

  // Free.ai (Qwen) rejects multiple system messages – DeepSeek handles the two
  // separate system turns mentioned above; therefore, only Free.ai gets this version
  // with a single, merged system message, instead of using the `turns` unchanged
  const freeAiTurns = (() => {
    const systemParts = turns
      .filter((t) => t.role === "system")
      .map((t) => t.content);
    const rest = turns.filter((t) => t.role !== "system");
    return [
      { role: "system" as const, content: systemParts.join("\n\n") },
      ...rest,
    ];
  })();

  // Output from Free.ai must be parsed and validated against a lenient schema (see criteriaSchema.ts)
  // so that a missing or invalid field does not cause the entire extraction to fail;
  // should a parsing error occur nonetheless, invokeWithFallback falls back to DeepSeek—without
  // triggering the Free.ai circuit breaker, as this is not a budget-related issue (402)
  const callFreeAi = async (): Promise<SearchCriteria> => {
    const raw = await callFreeAiChat(freeAiTurns);
    const parsed = JSON.parse(raw); // throws on non-JSON output
    // If qwen7b omits fields or returns an invalid enum value, the affected fields are set to null,
    // instead of letting the entire extraction fail and wasting a DeepSeek call on it
    return lenientCriteriaSchema.parse(parsed);
  };

  const result = await invokeWithFallback(callFreeAi, () =>
    deepseekStructured.invoke(turns),
  );

  return result;
}
