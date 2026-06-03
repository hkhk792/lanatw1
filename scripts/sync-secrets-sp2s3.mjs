import { spawnSync } from "child_process";
import { readFileSync } from "fs";

const scope = "mpm4hndtbr-4652s-projects";
const keys = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_SECRET",
];

const authPath = `${process.env.USERPROFILE}/AppData/Roaming/xdg.data/com.vercel.cli/auth.json`;
const { token } = JSON.parse(readFileSync(authPath, "utf8"));
const teamId = "team_3R2bvYPvVzkOMLR2aRFQcI2W";

const listRes = await fetch(
  `https://api.vercel.com/v9/projects/obsidian-vapor-zen/env?teamId=${teamId}`,
  { headers: { Authorization: `Bearer ${token}` } }
);
const { envs } = await listRes.json();

spawnSync("npx", ["--yes", "vercel@latest", "link", "--yes", "--project", "sp2s-3", "--scope", scope], {
  stdio: "inherit",
  shell: true,
});

for (const key of keys) {
  const env = envs.find((e) => e.key === key);
  if (!env?.id) {
    console.warn("skip missing", key);
    continue;
  }
  const detailRes = await fetch(
    `https://api.vercel.com/v9/projects/obsidian-vapor-zen/env/${env.id}?teamId=${teamId}&decrypt=true`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const detail = await detailRes.json();
  const value = detail.value ?? detail.env?.value ?? "";
  if (!value) {
    console.warn("skip empty decrypt", key);
    continue;
  }
  console.log("add", key, `len=${value.length}`);
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
