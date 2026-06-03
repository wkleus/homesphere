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