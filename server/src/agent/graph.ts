import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { parseIntent } from "./parseIntent.js";
import { searchProperties, type PropertyRow } from "./searchProperties.js";
import type { SearchCriteria } from "./criteriaSchema.js";

/** Shared state that flows through every node in graph */
const AgentState = Annotation.Root({
  // Input from user
  message: Annotation<string>,

  // Filled by parse node
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
  const criteria = await parseIntent(state.message);

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

/**
 * Run full pipeline: parse intent, then search listings
 */
export async function runAgent(message: string) {
  const finalState = await agentGraph.invoke({
    message,
  });

  return {
    status: finalState.status,
    criteria: finalState.criteria,
    suggestions: finalState.results,
    followUpQuestion: finalState.followUpQuestion,
  };
}
