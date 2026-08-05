import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { type ChatTurn, parseIntent } from "./parseIntent.ts";
import { searchProperties, type PropertyRow } from "./searchProperties.ts";
import type { SearchCriteria } from "./criteriaSchema.ts";
import { mergeCriteria } from "./mergeCriteria.ts";

/** Shared state that flows through every node in graph */
const AgentState = Annotation.Root({
  // Input from user
  message: Annotation<string>,

  // Optional short chat history BEFORE current message
  history: Annotation<ChatTurn[]>({
    reducer: (_prev, next) => next,
    default: () => [],
  }),

  // Last criteria from previous turn (client sends this back)
  previousCriteria: Annotation<SearchCriteria | null>({
    reducer: (_prev, next) => next,
    default: () => null,
  }),

  // Filled by parse node (after merge)
  criteria: Annotation<SearchCriteria | null>({
    reducer: (_prev, next) => next,
    default: () => null,
  }),

  // Filled by search node
  results: Annotation<PropertyRow[]>({
    reducer: (_prev, next) => next,
    default: () => [],
  }),

  status: Annotation<"ok" | "need_more_info" | "no_match">({
    reducer: (_prev, next) => next,
    default: () => "ok",
  }),

  followUpQuestion: Annotation<string | null>({
    reducer: (_prev, next) => next,
    default: () => null,
  }),
});

/** Node 1: natural language → structured criteria */
async function parseNode(
  state: typeof AgentState.State,
): Promise<Partial<typeof AgentState.State>> {
  const raw = await parseIntent(
    state.message,
    state.history ?? [],
    state.previousCriteria ?? null,
  );

  const criteria = mergeCriteria(state.previousCriteria, raw);

  return {
    criteria,
    followUpQuestion: criteria.followUpQuestion,
    // status is finalized in searchNode
  };
}

/** Node 2: criteria → DB rows (or skip if needMoreInfo) */
async function searchNode(
  state: typeof AgentState.State,
): Promise<Partial<typeof AgentState.State>> {
  const criteria = state.criteria;

  if (!criteria || criteria.needMoreInfo) {
    return {
      results: [],
      status: "need_more_info", // Prevent unnecessary database queries
      followUpQuestion:
        criteria?.followUpQuestion ??
        "Could you share a city, budget, or number of rooms?",
    };
  }

  // Parameterized SQL search, max. 5 results
  const results = await searchProperties(criteria, 5);

  return {
    results,
    status: results.length > 0 ? "ok" : "no_match",
    followUpQuestion: null,
  };
}

// Build graph: graph using the state type above; 2 named steps: "parse" and "search";
// edges = sequence: START → parse → search → END
const workflow = new StateGraph(AgentState)
  .addNode("parse", parseNode)
  .addNode("search", searchNode)
  .addEdge(START, "parse")
  .addEdge("parse", "search")
  .addEdge("search", END);

/** Compiled graph -> result: executable object */
const agentGraph = workflow.compile();

export type RunAgentInput = {
  message: string;
  history?: ChatTurn[];
  previousCriteria?: SearchCriteria | null;
};

/**
 * Run full pipeline: parse intent, then search listings
 * Accepts plain string or { message, history, previousCriteria }
 */
export async function runAgent(input: string | RunAgentInput) {
  const payload =
    typeof input === "string"
      ? { message: input, history: [] as ChatTurn[], previousCriteria: null }
      : {
          message: input.message,
          history: input.history ?? [],
          previousCriteria: input.previousCriteria ?? null,
        };

  const finalState = await agentGraph.invoke(payload);

  return {
    status: finalState.status,
    criteria: finalState.criteria,
    suggestions: finalState.results,
    followUpQuestion: finalState.followUpQuestion,
  };
}
