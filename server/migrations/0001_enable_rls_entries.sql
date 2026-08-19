-- Fix: "rls_disabled_in_public" for table `entries`
-- Run in Supabase Dashboard -> SQL Editor (or via `supabase db` CLI)

ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Property listings are meant to be public read-only data (shown to all
-- website visitors), so allow SELECT for anyone using the anon/public key
CREATE POLICY "Public read access"
  ON entries
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- No INSERT/UPDATE/DELETE policy is created on purpose: writes must only
-- happen through backend (server/db.js, using DATABASE_URL), which
-- connects as `postgres` role and bypasses RLS; the public anon key
-- used by client (client/src/config/supabase.js) therefore stays
-- read-only and can never modify or delete listings directly