import pg from "pg";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const { Pool } = pg;

// PostgreSQL Connection Pool (for database operations)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Supabase Admin Client (for auth validation)
// Uses the SUPABASE_SECRET_KEY – server-side ONLY!
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export { pool, supabaseAdmin };
