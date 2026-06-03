/**
 * Link team shared env vars to sp2s-3 (when vars exist in Shared store).
 * Run after promoting secrets to Shared in Vercel team settings.
 */
import { readFileSync } from "fs";
import { spawnSync } from "child_process";

const scope = "mpm4hndtbr-4652s-projects";
const teamId = "team_3R2bvYPvVzkOMLR2aRFQcI2W";
const projectId = "sp2s-3";
const keys = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_SECRET",
];

const { token } = JSON.parse(
  readFileSync(`${process.env.USERPROFILE}/AppData/Roaming/xdg.data/com.vercel.cli/auth.json`, "utf8")
);

const sharedRes = await fetch(`https://api.vercel.com/v1/env?teamId=${teamId}`, {
  headers: { Authorization: `Bearer ${token}` },
});
const sharedJson = await sharedRes.json();
const shared = sharedJson?.data ?? sharedJson?.envs ?? [];
console.log("shared count", shared.length);

for (const key of keys) {
  const item = shared.find((e) => e.key === key || e.name === key);
  if (!item?.id) {
    console.warn("no shared var", key);
    continue;
  }
  const linkRes = await fetch(
    `https://api.vercel.com/v10/projects/${projectId}/env/link?teamId=${teamId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: item.id, target: ["production", "preview"] }),
    }
  );
  const body = await linkRes.json();
  console.log(key, linkRes.status, body.error?.message ?? "ok");
}

spawnSync("npx", ["--yes", "vercel@latest", "deploy", "--prod", "--yes", "--scope", scope], {
  stdio: "inherit",
  shell: true,
});
