import { ChatOpenAI } from "@langchain/openai";

/**
 * Shared DeepSeek chat model for property agent
 * DeepSeek exposes OpenAI-compatible API -> use ChatOpenAI with custom baseURL; keys stay on server only
 */
export const llm = new ChatOpenAI({
  // From server/.env (and Render env) for security reasons (-> .gitignore)
  apiKey: process.env.AI_API_KEY,
  model: process.env.AI_MODEL ?? "deepseek-v4-flash",
  temperature: 0, // As deterministic as possible for structured extraction (criteria), less “creative” guessing
  configuration: {
    baseURL: "https://api.deepseek.com", // OpenAI-compatible DeepSeek endpoint / target host
  },
});
