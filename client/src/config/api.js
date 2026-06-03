// Determine the API base URL based on the environment.
const API_BASE = import.meta.env.DEV
  ? "http://localhost:3000/api" // Local Development
  : "https://homesphere-kifc.onrender.com/api"; // ← My Render URL

export const ENTRIES_URL = `${API_BASE}/entries`;
export const ENTRY_URL = (id) => `${API_BASE}/entries/${id}`;
