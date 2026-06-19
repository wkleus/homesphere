import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";
import he from "he";
import rateLimit from "express-rate-limit";
import { pool, supabaseAdmin } from "./db.js";

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(
  cors({
    origin: ["http://localhost:5000", "https://homesphere-web.vercel.app"],
  }),
);
app.use(express.json());

// Rate limiter for contact endpoint – max 3 requests per 10 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for admin endpoints
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Converts snake_case DB column names to camelCase for the frontend
const toCamelCase = (str) =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const transformKeys = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [toCamelCase(key), value]),
  );
};

// Supabase Auth Middleware
const authenticateSupabase = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized - No token provided",
    });
  }

  try {
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      console.error("Auth error:", error);
      return res.status(401).json({
        error: "Unauthorized - Invalid token",
      });
    }

    // Attach user to request for later use
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({
      error: "Internal server error during authentication",
    });
  }
};

// GET /api/entries – returns all property listings (PUBLIC)
app.get("/api/entries", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM entries ORDER BY id");
    res.json(result.rows.map(transformKeys));
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/entries/:id – returns a single property by ID (PUBLIC)
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

/* PUT /api/entries/:id
   Updates an existing property entry in the database.
   Protected endpoint – requires valid Supabase JWT token.
   Returns the updated entry in camelCase format */
app.put(
  "/api/entries/:id",
  authenticateSupabase, // Verify JWT token before allowing updates
  adminLimiter, // Rate limit: 100 requests per 15 minutes
  async (req, res) => {
    // Extract all fields from request body (snake_case matches DB columns)
    const {
      address,
      category,
      is_available,
      energy_class,
      rooms,
      square_meters,
      year_built,
      buy,
      rent,
      photo,
    } = req.body;

    try {
      /* Execute PostgreSQL UPDATE query with RETURNING clause.
        $1-$11 are parameterized placeholders to prevent SQL injection.
        RETURNING * returns the updated row for sending it back to the client. */
      const result = await pool.query(
        `UPDATE entries SET
          address = $1, 
          category = $2, 
          is_available = $3, 
          energy_class = $4,
          rooms = $5, 
          square_meters = $6, 
          year_built = $7, 
          buy = $8, 
          rent = $9, 
          photo = $10
        WHERE id = $11 
        RETURNING *`,
        [
          address, // $1
          category, // $2
          is_available, // $3
          energy_class, // $4
          rooms, // $5
          square_meters, // $6
          year_built, // $7
          buy, // $8
          rent, // $9
          photo, // $10
          req.params.id, // $11
        ],
      );

      // If no rows were updated, the entry doesn't exist
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Entry not found" });
      }

      // Transform the updated row from snake_case (DB) to camelCase (frontend)
      res.json(transformKeys(result.rows[0]));
    } catch (err) {
      // Log the error server-side for debugging
      console.error("Database error:", err);
      // Send generic error to client (don't expose internal details)
      res.status(500).json({ error: "Database error" });
    }
  },
);

/* DELETE /api/entries/:id
   Deletes a property entry from the database.
   Protected endpoint – requires valid Supabase JWT token */
app.delete(
  "/api/entries/:id",
  authenticateSupabase, // Verify JWT token before allowing deletion
  adminLimiter, // Rate limit: 100 requests per 15 minutes
  async (req, res) => {
    try {
      // Execute DELETE query with RETURNING clause to get the deleted row
      const result = await pool.query(
        "DELETE FROM entries WHERE id = $1 RETURNING *",
        [req.params.id],
      );

      // If no rows were deleted, the entry doesn't exist
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Entry not found" });
      }

      // Transform snake_case DB columns to camelCase for frontend
      res.json({
        message: "Entry deleted successfully",
        deleted: transformKeys(result.rows[0]),
      });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error" });
    }
  },
);

// POST /api/contact – sends a contact email via Resend (rate limited)
app.post("/api/contact", contactLimiter, async (req, res) => {
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

export default app;
