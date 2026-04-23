// api/user.js — Vercel Serverless Function
// Syncs authenticated Supabase users into MongoDB.
//
// Environment variables required in Vercel dashboard:
//   MONGODB_URI          → your full MongoDB connection string
//   SUPABASE_JWT_SECRET  → found in Supabase > Settings > API > JWT Secret
//
// The MongoDB URI is NEVER sent to the client — it only lives here, on the server.

import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";

// ── MongoDB connection pool (reused across warm invocations) ──
let cachedClient = null;

async function getDb() {
  if (cachedClient) return cachedClient.db("prophetly");

  const client = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  await client.connect();
  cachedClient = client;
  return client.db("prophetly");
}

// ── JWT verification ──
function verifySupabaseToken(authHeader) {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  try {
    return jwt.verify(token, process.env.SUPABASE_JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch {
    return null;
  }
}

// ── Handler ──
export default async function handler(req, res) {
  // CORS headers (adjust origin in production)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Verify the caller is a valid Supabase user
  const payload = verifySupabaseToken(req.headers.authorization);
  if (!payload) return res.status(401).json({ error: "Unauthorized" });

  const { supabase_uid, email, last_login } = req.body;
  if (!supabase_uid || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const db = await getDb();
    const users = db.collection("users");

    // Upsert — create on first login, update last_login on subsequent ones
    await users.updateOne(
      { supabase_uid },
      {
        $set:         { email, last_login, updated_at: new Date() },
        $setOnInsert: { supabase_uid, created_at: new Date(), balance: 0, picks: [], streak: 0 }
      },
      { upsert: true }
    );

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("MongoDB error:", err);
    return res.status(500).json({ error: "Database error" });
  }
}
