import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5000", "https://homesphere-web.vercel.app"],
  }),
);
app.use(express.json());

// Helper function: snake_case into camelCase
const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

const transformKeys = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  const newObj = {};
  for (let key in obj) {
    const camelKey = toCamelCase(key);
    newObj[camelKey] = obj[key];
  }
  return newObj;
};

// GET /api/entries – all entries
app.get("/api/entries", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM entries ORDER BY id");

    // transform every entry from snake_case into camelCase
    const transformedEntries = result.rows.map(transformKeys);

    res.json(transformedEntries);
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/entries/:id – single entry
app.get("/api/entries/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM entries WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Entry not found" });
    }

    const transformedEntry = transformKeys(result.rows[0]);
    res.json(transformedEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`🏠 HomeSphere API running at http://localhost:${PORT}`);
  console.log(`  GET http://localhost:${PORT}/api/entries`);
  console.log(`  GET http://localhost:${PORT}/api/entries/:id`);
});
