// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { Resend } from "resend";
// import pool from "./db.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;
// const resend = new Resend(process.env.RESEND_API_KEY);

// app.use(
//   cors({
//     origin: ["http://localhost:5000", "https://homesphere-web.vercel.app"],
//   }),
// );
// app.use(express.json());

// // Converts snake_case DB column names to camelCase for the frontend
// const toCamelCase = (str) =>
//   str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

// const transformKeys = (obj) => {
//   if (!obj || typeof obj !== "object") return obj;
//   const newObj = {};
//   for (let key in obj) {
//     newObj[toCamelCase(key)] = obj[key];
//   }
//   return newObj;
// };

// // GET /api/entries – returns all property listings
// app.get("/api/entries", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM entries ORDER BY id");
//     res.json(result.rows.map(transformKeys));
//   } catch (err) {
//     console.error("Database error:", err);
//     res.status(500).json({ error: "Database error" });
//   }
// });

// // GET /api/entries/:id – returns a single property by ID
// app.get("/api/entries/:id", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM entries WHERE id = $1", [
//       req.params.id,
//     ]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Entry not found" });
//     }
//     res.json(transformKeys(result.rows[0]));
//   } catch (err) {
//     console.error("Database error:", err);
//     res.status(500).json({ error: "Database error" });
//   }
// });

// // POST /api/contact – sends a contact email via Resend
// app.post("/api/contact", async (req, res) => {
//   const { name, email, message, property } = req.body;

//   // Basic validation – all fields required
//   if (!name || !email || !message) {
//     return res
//       .status(400)
//       .json({ error: "Name, email and message are required" });
//   }

//   try {
//     await resend.emails.send({
//       from: "HomeSphere <onboarding@resend.dev>",
//       to: process.env.CONTACT_EMAIL,
//       subject: `New enquiry: ${property || "HomeSphere"}`,
//       html: `
//         <h2>New Contact Request – HomeSphere</h2>
//         <p><strong>Property:</strong> ${property || "—"}</p>
//         <hr />
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Message:</strong></p>
//         <p>${message}</p>
//       `,
//     });

//     res.status(200).json({ message: "Email sent successfully" });
//   } catch (err) {
//     console.error("Email error:", err);
//     res.status(500).json({ error: "Failed to send email" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`HomeSphere API running at http://localhost:${PORT}`);
//   console.log(`  GET  http://localhost:${PORT}/api/entries`);
//   console.log(`  GET  http://localhost:${PORT}/api/entries/:id`);
//   console.log(`  POST http://localhost:${PORT}/api/contact`);
// });

// -----------------------------------

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";
import he from "he";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(
  cors({
    origin: ["http://localhost:5000", "https://homesphere-web.vercel.app"],
  }),
);
app.use(express.json());

// Converts snake_case DB column names to camelCase for the frontend
const toCamelCase = (str) =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const transformKeys = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  const newObj = {};
  for (let key in obj) {
    newObj[toCamelCase(key)] = obj[key];
  }
  return newObj;
};

// GET /api/entries – returns all property listings
app.get("/api/entries", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM entries ORDER BY id");
    res.json(result.rows.map(transformKeys));
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/entries/:id – returns a single property by ID
app.get("/api/entries/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM entries WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Entry not found" });
    }
    res.json(transformKeys(result.rows[0]));
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /api/contact – sends a contact email via Resend
app.post("/api/contact", async (req, res) => {
  const { name, email, message, property } = req.body;

  // Basic validation – all fields required
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Name, email and message are required" });
  }

  // Sanitize all user input before inserting into HTML to prevent XSS
  const safeName = he.escape(name);
  const safeEmail = he.escape(email);
  const safeMessage = he.escape(message);
  const safeProperty = he.escape(property || "HomeSphere");

  try {
    await resend.emails.send({
      from: "HomeSphere <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL,
      subject: `New enquiry: ${safeProperty}`,
      html: `
        <h2>New Contact Request – HomeSphere</h2>
        <p><strong>Property:</strong> ${safeProperty}</p>
        <hr />
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`HomeSphere API running at http://localhost:${PORT}`);
  console.log(`  GET  http://localhost:${PORT}/api/entries`);
  console.log(`  GET  http://localhost:${PORT}/api/entries/:id`);
  console.log(`  POST http://localhost:${PORT}/api/contact`);
});
