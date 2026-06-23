// Script para dropar e recriar o schema completo do banco
// Uso: node scripts/reset-db.mjs
import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Carrega .env.local
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

const sql = neon(process.env.DATABASE_URL);

async function reset() {
  console.log("Dropando todas as tabelas e tipos...");

  await sql`DROP SCHEMA public CASCADE`;
  await sql`CREATE SCHEMA public`;
  await sql`GRANT ALL ON SCHEMA public TO neondb_owner`;
  await sql`GRANT ALL ON SCHEMA public TO public`;

  console.log("Schema resetado. Aplicando migration...");

  const migrationPath = path.resolve(__dirname, "../drizzle/0000_famous_shinko_yamashiro.sql");
  const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

  // Drizzle usa '--> statement-breakpoint' para separar statements
  const statements = migrationSQL
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    try {
      await sql(statement, []);
    } catch (err) {
      console.error(`Erro ao executar:\n${statement}\n`, err.message);
      process.exit(1);
    }
  }

  console.log(`✓ ${statements.length} statements aplicados com sucesso.`);
}

reset().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
