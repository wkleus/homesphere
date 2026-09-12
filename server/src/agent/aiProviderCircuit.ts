/**
 Tracks whether the daily quota of free tokens from Free.ai has been exhausted 
 -> prevents repeated requests from continuing to be sent to Free.ai (and failing) 
 once the daily budget is used up – instead, it switches directly to the DeepSeek fallback.
 */

// Wait time before calling Free.ai again after error 402 ("out of tokens") is returned;
// the daily free quota for Free.ai resets every 24 hours, but the exact timing is not 100%
// certain—hence this value is configurable in case adjustments become necessary
const COOLDOWN_MS = Number(
  process.env.FREE_AI_COOLDOWN_MS ?? 24 * 60 * 60 * 1000,
);

let exhaustedAt: number | null = null;

// True if Free.ai is to be tried out; false if currently in the cooling-off period
export function isFreeAiAvailable(): boolean {
  if (exhaustedAt === null) return true;
  return Date.now() - exhaustedAt >= COOLDOWN_MS;
}

// Call this when Free.ai responds with 402 (budget exhausted)
export function markFreeAiExhausted(): void {
  exhaustedAt = Date.now();
  console.warn(
    `[ai-provider] Free.ai budget exhausted — routing to DeepSeek for the next ${Math.round(
      COOLDOWN_MS / 3_600_000,
    )}h.`,
  );
}

// Manual reset, e.g. for tests or an admin endpoint
export function resetFreeAiCircuit(): void {
  exhaustedAt = null;
}
