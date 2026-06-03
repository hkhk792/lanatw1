/**
 * Copy sensitive env from obsidian-vapor-zen to sp2s-3 via Vercel API + CLI.
 * Requires: vercel CLI logged in; values must be readable (owner decrypt in API often fails).
 * Fallback: run after manual `vercel env pull` from dashboard export.
 */
import { readFileSync, existsSync } from "fs";
import { spawnSync } from "child_process";

const scope = "mpm4hndtbr-4652s-projects";
const keys = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_SECRET",
];

const manual = ".env.secrets.manual";
if (!existsSync(manual)) {
  console.error(`Missing ${manual}. Create it with KEY=value lines from Vercel UI Copy.`);
  process.exit(1);
}

const map = new Map();
for (const line of readFileSync(manual, "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  if (m && m[2]) map.set(m[1], m[2].replace(/^"|"$/g, ""));
}

spawnSync("npx", ["--yes", "vercel@latest", "link", "--yes", "--project", "sp2s-3", "--scope", scope], {
  stdio: "inherit",
  shell: true,
});

for (const key of keys) {
  const value = map.get(key);
  if (!value) {
    console.warn("skip", key);
    continue;
  }
  console.log("add", key);
  spawnSync(
    "npx",
    ["--yes", "vercel@latest", "env", "add", key, "production", "--scope", scope, "--force"],
    { input: value + "\n", shell: true, stdio: ["pipe", "inherit", "inherit"] }
  );
}

spawnSync("npx", ["--yes", "vercel@latest", "deploy", "--prod", "--yes", "--scope", scope], {
  stdio: "inherit",
  shell: true,
});
