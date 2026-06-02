// const API_BASE = "http://localhost:3000/api";

// export const ENTRIES_URL = `${API_BASE}/entries`;
// export const ENTRY_URL = (id) => `${API_BASE}/entries/${id}`;

// Determine the API base URL based on the environment.
const API_BASE = import.meta.env.DEV
  ? "http://localhost:3000/api" // Local Development
  : "/api"; //Production on Vercel (same domain)

export const ENTRIES_URL = `${API_BASE}/entries`;
export const ENTRY_URL = (id) => `${API_BASE}/entries/${id}`;
