import express from "express";
import cors from "cors";
import entries from "./content/entries.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GET /api/entries – all entries
app.get("/api/entries", (req, res) => {
  res.json(entries);
});

// GET /api/entries/:id – single entry
app.get("/api/entries/:id", (req, res) => {
  const entry = entries.find((e) => e.id === req.params.id);

  if (!entry) {
    return res.status(404).json({ error: "Entry not found" });
  }

  res.json(entry);
});

// Start locally only, not on Vercel.
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`HomeSphere API running at http://localhost:${PORT}`);
    console.log(`  GET http://localhost:${PORT}/api/entries`);
    console.log(`  GET http://localhost:${PORT}/api/entries/:id`);
  });
}

// Exportiere für Vercel
export default app;
