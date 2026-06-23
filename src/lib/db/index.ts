import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Singleton: em desenvolvimento o Next.js recria módulos em hot reload
// então guardamos a instância no globalThis para evitar múltiplas conexões
const globalForDb = globalThis as unknown as { db: ReturnType<typeof createDb> };

function createDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não definida. Verifique o .env.local");
  }
  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql, { schema, logger: process.env.NODE_ENV === "development" });
}

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
