import postgres from "postgres";

let sql = null;

export function getEnv(name, fallback = "") {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

/** @returns {import("postgres").Sql} */
export function getSql() {
  if (sql) return sql;
  const url = getEnv("DATABASE_URL");
  if (!url) {
    throw new Error("DATABASE_URL is not configured.");
  }
  sql = postgres(url, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });
  return sql;
}

export function hasDatabase() {
  return Boolean(getEnv("DATABASE_URL") || (getEnv("SUPABASE_URL") && getEnv("SUPABASE_SERVICE_ROLE_KEY")));
}

/** Prefer DATABASE_URL; fall back to Supabase REST only if still configured (local/legacy). */
export function prefersDirectPostgres() {
  return Boolean(getEnv("DATABASE_URL"));
}
