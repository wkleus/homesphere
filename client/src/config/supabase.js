import { createClient } from "@supabase/supabase-js";

// Supabase configuration using environment variables
// VITE_ -> exposed to the client side
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create and export a Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
