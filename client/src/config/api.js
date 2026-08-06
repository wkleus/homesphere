// Determine the API base URL based on the environment
const API_BASE = import.meta.env.DEV
  ? "http://localhost:3000/api" // Local Development
  : "https://homesphere-kifc.onrender.com/api"; // = my Render URL

export const ENTRIES_URL = `${API_BASE}/entries`;
export const ENTRY_URL = (id) => `${API_BASE}/entries/${id}`;
export const CONTACT_URL = `${API_BASE}/contact`;
export const UPLOAD_URL = `${API_BASE}/upload`;
export const INQUIRIES_URL = `${API_BASE}/inquiries`;
export const INQUIRY_URL = (id) => `${API_BASE}/inquiries/${id}`;

export const AGENT_MATCH_URL = `${API_BASE}/agent/match`; // AI property search
