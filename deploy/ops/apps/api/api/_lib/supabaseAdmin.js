/**
 * Shared helpers for API handlers.
 * Database access prefers DATABASE_URL (direct Postgres on ops server).
 * Legacy SUPABASE_* env is still recognized by hasDatabase() for local/Vercel fallbacks.
 */
export { getEnv, getSql, hasDatabase, prefersDirectPostgres } from "./db.js";
export { getSiteCode } from "./siteCode.js";
