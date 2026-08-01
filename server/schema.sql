CREATE TABLE IF NOT EXISTS entries (
  id        SERIAL PRIMARY KEY,
  address   TEXT NOT NULL,
  is_available BOOLEAN NOT NULL,
  energy_class VARCHAR(5) NOT NULL,
  buy       INTEGER,
  rent      INTEGER,
  photo     TEXT NOT NULL,
  rooms     INTEGER NOT NULL,
  square_meters INTEGER NOT NULL,
  category  VARCHAR(50) NOT NULL,
  year_built INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS inquiries (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL, -- Form fields
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  property   TEXT,   -- e.g. address from form
  entry_id   INTEGER REFERENCES entries(id) ON DELETE SET NULL, -- Link to property if ID is sent along later; when property is deleted, request remains, entry_id just becomes NULL
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW() -- Timestamp (automatic)
);

-- Block direct client access via anon/authenticated keys
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
-- No policies = no access through Supabase client keys
-- Server still works via DATABASE_URL / service connection