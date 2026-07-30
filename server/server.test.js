/**
 * Integration tests for the HomeSphere Express API using Supertest
 * Tests run fully offline because the database pool and Resend are mocked
 */

import { describe, test, expect, vi } from "vitest";
import request from "supertest";

// vi.hoisted ensures the mock function is created before imports are processed
const mockQuery = vi.hoisted(() => vi.fn());

// Mock the database pool
vi.mock("../db.js", () => ({
  default: { query: mockQuery },
}));

// Mock the database pool and Supabase Admin Client
vi.mock("./db.js", () => ({
  pool: { query: mockQuery },
  supabaseAdmin: { auth: { getUser: vi.fn() } },
}));

// Mock Resend – no real emails sent
vi.mock("resend", () => {
  const mockSend = vi.fn().mockResolvedValue({ id: "mock-id" });
  function Resend() {
    this.emails = { send: mockSend };
  }
  return { Resend };
});

import app from "../server.js";

// Sample DB row in snake_case – as PostgreSQL returns it
const mockDbRow = {
  id: 1,
  address: "Bergstraße 14, Garmisch-Partenkirchen, Germany",
  is_available: true,
  energy_class: "B",
  buy: 520000,
  rent: null,
  photo: "/photos/residence_1.jpg",
  rooms: 7,
  square_meters: 160,
  category: "Residence",
  year_built: 1998,
};

// Expected camelCase output after transformKeys
const mockEntry = {
  id: 1,
  address: "Bergstraße 14, Garmisch-Partenkirchen, Germany",
  isAvailable: true,
  energyClass: "B",
  buy: 520000,
  rent: null,
  photo: "/photos/residence_1.jpg",
  rooms: 7,
  squareMeters: 160,
  category: "Residence",
  yearBuilt: 1998,
};

describe("GET /api/entries", () => {
  test("returns all entries as camelCase JSON with status 200", async () => {
    mockQuery.mockResolvedValue({ rows: [mockDbRow] });
    const res = await request(app).get("/api/entries");
    expect(res.status).toBe(200);
    expect(res.body[0]).toMatchObject(mockEntry);
  });
});

describe("GET /api/entries/:id", () => {
  test("returns 404 when the id does not exist", async () => {
    mockQuery.mockResolvedValue({ rows: [] });
    const res = await request(app).get("/api/entries/999");
    expect(res.status).toBe(404);
  });
});

describe("POST /api/contact", () => {
  test("returns 400 when required fields are missing", async () => {
    const res = await request(app).post("/api/contact").send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Name, email and message are required" });
  });
});
