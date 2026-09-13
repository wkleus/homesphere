# Architecture Notes: AI Property Matching Agent

This document covers the design decisions behind the AI agent (`server/src/agent/`).

## Overview

```
POST /api/agent/match
        │
        ▼
  LangGraph pipeline (graph.ts)
   ┌────┴────┐
   │  parse  │  natural language → structured SearchCriteria
   └────┬────┘
   ┌────┴────┐
   │ search  │  parameterized SQL query against `entries`
   └────┬────┘
        │
        ▼
  suggestions + status + follow-up question
```

Two LLM providers sit behind the `parse` step: **Free.ai** (tried first, solid
free daily token budget) and **DeepSeek** (fallback once Free.ai's budget is
exhausted).

## Why LangChain / LangGraph?

LangChain and LangGraph are worthwhile here for two specific reasons:

1. **Structured output extraction.** `ChatOpenAI.withStructuredOutput(schema)`
   handles JSON prompting, parsing, and validation for DeepSeek in a single call.
   Without this, manual prompting in JSON mode, `JSON.parse`, and Zod validation
   would be required — precisely what was ultimately implemented manually for
   Free.ai anyway; the benefit is therefore real, though not universal.
2. **A named, inspectable pipeline.** A workflow like `parse → search`
   structured as an explicit `StateGraph` is easier to understand and extend
   than a chain of `await` calls buried in a route handler—especially
   useful as the agent grows.

**What LangChain does _not_ provide out of the box: provider compatibility.**
`ChatOpenAI` uses the hard-coded standard path `/chat/completions`.
DeepSeek's API follows the standard, so it worked without adjustment. Free.ai does not; the service only exposes
`/v1/chat/`, not the OpenAI standard path. A `ChatOpenAI` call
targeting Free.ai fails with a generic 404 error before even reaching
Free.ai's actual API logic.

Instead of writing a custom `BaseChatModel` subclass for LangChain
just to keep using `.withStructuredOutput()`, Free.ai is called directly
via `fetch`. The response is manually parsed and validated against a
**tolerant** version of the same Zod schema (missing or invalid fields
are set to `null` instead of triggering an error—see `criteriaSchema.ts`). **Conclusion:** LangChain is useful for the provider whose workflow aligns with the framework's underlying assumptions (DeepSeek); for the other provider (Free.ai), using additional LangChain components would have merely increased complexity without enhancing reliability.

## Provider Fallback: Free.ai → DeepSeek

The core cost-control mechanism (`llm.ts`, `aiProviderCircuit.ts`):

- **402** (Free.ai budget exhausted) → Activates an in-memory circuit breaker for a
  configurable lockout period (default: 24 hours); subsequent requests are
  routed directly to DeepSeek instead of repeatedly failing at Free.ai.
- **429** (Rate limit – 10 requests/min on Free.ai's free tier) → Brief retry
  with Free.ai, as this indicates temporary throttling rather than an exhausted budget.
- **Other errors** (invalid response format, non-JSON output, schema
  mismatch) → Fallback to DeepSeek for the specific request, _without_
  triggering the circuit breaker; this ensures a single error does not
  result in Free.ai being disabled for an entire day.

The implementation differs from the documentation provided by Free.ai: the actual endpoint path varies, and
certain error conditions return an HTTP status of 200 with an `error` field in the
response body, rather than a proper 4xx status code. Both scenarios
are explicitly handled rather than simply ignored.

## Intentionally kept simple

The graph is currently a strictly linear chain:

```ts
.addEdge(START, "parse")
.addEdge("parse", "search")
.addEdge("search", END);
```

No conditional edges, no cycles, and no state persisted across requests (checkpointing). This is intentional: with exactly two steps and no branching logic, a `StateGraph` behaves identically to two simple `async` functions. Introducing conditional routing or persistence at this stage would add complexity without immediate benefit.

## Potential extensions as the agent grows

Should the agent need to support genuine multi-turn interactions (beyond simply resending `previousCriteria` for a retry), two changes would make sense:

1. **Conditional edges for a "clarify loop."** Routing from `parse` to a `clarify` node (instead of directly to `search`) when `needMoreInfo` is set—including a limit on retry attempts so the agent terminates gracefully after a few rounds rather than getting stuck in an infinite loop.
2. **Checkpointing** (using `@langchain/langgraph-checkpoint-postgres` and the existing Supabase Postgres instance). This would allow conversation state to be managed server-side via a `thread_id`; the client would no longer need to resend `history` or `previousCriteria` with every request, enabling continuity across devices or sessions.

Both approaches are provider-agnostic (relying on neither tool-calling nor specific Free.ai features). They have been omitted for now because the agent's current scope does not require them, but they could be implemented should the AI ​​agent's requirements change.
